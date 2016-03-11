# Introduction #

Javascript uses a garbage collector to keep the memory clean.  Much like Java, it will only clean up objects that no longer have a reference back to them.  With many Javascript engines, the garbage collector runs at regular intervals to perform this memory cleanup and return memory to a heap for later usage.  In Firefox 3, this is quite obvious in the example game when the engine pauses for a half second or more.  The garbage collector is looking for unreferenced objects and returning the memory to the heap.

This process can take a while if many objects were created and discarded.  The way the engine used to work was that objects were created, and then released when they were destroyed.  The engine would hold the final reference to all objects, so calling the [destroy()](http://renderengine.googlecode.com/svn/api/PooledObject.html#destroy) method would release this final hold, allowing the object to be collected.

## Pooled Objects ##

The new pooling mechanism will keep the references to an object instance beyond destruction, allowing it to be reused when needed.  Instead of creating new instances of objects, an object is destroyed and put into a pool with other objects of the same class name.  When an object is needed, if one is available in the pool, it is initialized from there.  Otherwise, a new instance is allocated and initialized.  No objects are released to be garbage collected until the engine is shut down.

## Intended Effect ##

My intent is to minimize the amount of work that has to be done by the garbage collector, thus minimizing the amount of time that is consumed when the garbage collector runs.  Currently, the collector is running at about 1/2 to 1 second.  I'd like this to be even shorter, but there's more work to be done.  As it stands, there are objects which are created and discarded quite often, and those are used a lot.  These objects are the points, vectors, and rectangles used in creating, positioning, and colliding of objects.

I would like to find an effective way to manage the "transient objects" (my term) which are created, used, and then discarded many times during an engine cycle.  Object instance reuse is the biggest part of this, but a mechanism to catch a discarded object and return it to the pool would be ideal.

# How Is It Used, or, What's Different? #

Glad you asked this...  Here is how objects are traditionally created:

```
   var host = new HostObject("myHost");
   host.add(new Transform2D("move"));
   host.add(new Vector2D("draw"));
```

The problem is that using `new` like this will create an object instance that we cannot track very well.  Most classes in the system now implement a [create()](http://renderengine.googlecode.com/svn/api/PooledObject.html#create) class method which should be used instead.  This method will intercept the call for a new object and see if one is available in the object pool.  If an object is available, that instance is pulled from the pool and the arguments normally passed to the constructor are passed to the constructor method, but a new instance isn't created.  If no object exists in the pool, a new instance is constructed and returned.

```
   var host = HostObject.create("myHost");
   host.add(Transform2D.create("move"));
   host.add(Vector2D.create("draw"));
```

You can see that it was a small change, but the effect is huge.  When the object instance's [destroy()](http://renderengine.googlecode.com/svn/api/PooledObject.html#destroy) method is called, we intercept this and can return the instance to a pool of similar objects.  To ensure that an object isn't left in some previous state, objects must now implement a [release()](http://renderengine.googlecode.com/svn/api/PooledObject.html#release) method if they extend from the `PooledObject` class.  This method is called to return instance fields to an "initialized" state.

Additionally, [getClassName()](http://renderengine.googlecode.com/svn/api/PooledObject.html#getClassName) is now a class method instead of an instance method.  This makes a lot of sense for object pooling to work.  However, it means that you cannot get the class name from an object instance.  You can, however, get it from the class constructor:
```
   var className = this.constructor.getClassName();
```

Here you can see `BaseObject` which has undergone some changes:

```
var BaseObject = PooledObject.extend(/** @scope BaseObject.prototype */{

   element: null,

   /**
    * Initialize the instance fields after it has been
    * returned to the pool.
    */
   release: function() {
      this.base();
      this.element = null;
   },

   /**
    * Set the element which will represent this object within
    * its rendering context.
    *
    * @type element {BaseObject}
    */
   setElement: function(element) {
      this.element = element;
   },

   /**
    * Get the element which represents this object within its rendering context.
    *
    * @return The element
    * @type HTMLElement
    */
   getElement: function() {
      return this.element;
   },

   /**
    * Abstract update method which updates 
    * the state of the object.
    */
   update: function(renderContext, time) {
   }

}, /** @scope BaseObject */{

   /**
    * Get the class name of this object
    *
    * @type String
    */
   getClassName: function() {
      return "BaseObject";
   }
});
```

## Areas Needing Improvement ##

There are objects that are still created and discarded on the fly.  Many times, objects are created within a method (either using pooling or not) and are left to die when a method ends.  This is where the garbage collector does its most work.  These objects consume memory and are lost when the method completes.  For example:

```
   checkMotion: function() {
      // Get our position
      var curPos = this.getComponent("move").getPosition();
      
      var motion = Vector2D.create(curPos).sub(this.lastPos);
      if (lastPos.len() > 0) {
         // We're moving, update the velocity display
         // ...
      }
   }
```

In this case, `motion ` is created and then left to die when `checkMotion` exits.  It isn't used anywhere else but in this method.  Ideally we would call the `release()` method of `motion` before exiting the method, but that would become rather inefficient, what with all of the places where this type of situation occurs.  If this happens each frame, we're creating an unfortunately large number of objects which need to be collected.