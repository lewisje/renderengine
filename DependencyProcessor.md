# Introduction to the Dependency Processor #

Unlike compiled languages, that have a "linker" phase, which checks for dependencies, Javascript does not.  Traditionally, Javascript libraries have been monolithic.  Each of the dependencies is contained in the same file so that all of the objects will exist once the syntax has checked out and the file is parsed and compiled.

Due to this fact, The Render Engine uses a simple "dependency processor" which parses each loaded class to determine which objects the class depends upon.  When all of the classes are available, the object can be initialized since all dependencies have been effectively resolved.

## The Process ##

Except for `/engine/engine.js` which is loaded via a game's `index.html` page, the remainder of the classes are loaded as needed.  A simple method of including classes is provided so that only the classes needed to execute an object are loaded.  Before this dependency processor, all of the engine was loaded.  This caused examples to take _at least_ 30 seconds to start up.

Each object is declared in a very strict fashion.  First, includes are handled, then an object is passed to the dependency processor via the [Engine.initObject()](http://renderengine.googlecode.com/svn/api/Linker.html#initObject) method.  A simple example would be like the following:

```
Engine.include("/engine/engine.math2d.js");
Engine.include("/engine/engine.container.js");

Engine.initObject("MyObject", "Container", function() {

   var MyObject = Container.extend({
 
      processed: false,
      
      doSomething: function(point) {
         // Move objects in container to point specified
         for (var o in this.getObjects()) {
            var newPt = Point2D.create(Math.random() * 10, Math.random() * 10).add(point);
            this.getObjects()[o].setPosition(newPt);
         }
         MyObject.processed = true;
      }
   }, {
      getClassName: function() {
         return "MyObject";
      }
   });

   return MyObject;
});
```

`MyObject` is dependent on [Container](http://renderengine.googlecode.com/svn/api/Container.html), which we tell the dependency processor via the first two arguments to `Engine.initObject()`. The final argument to `Engine.initObject()` is an anonymous function which contains _a single object declaration_ as a variable which is returned as the only value of that anonymous function.

When the engine receives this call, it will examine the function's return object and grab each function within that object.  For each function, it looks for patterns which indicate potential object dependencies.  Such potential dependencies are:

  * Variable declarations
  * Objects created with the `new` operator
  * Objects created with the `.create()` method of [PooledObjects](ObjectPooling.md)
  * Method calls of objects

Dependencies which can be resolved by function arguments or by internal variables are discarded as "internal dependencies".  Method calls and new objects are what we're most interested in.  If a function contains internal anonymous functions, they are handled just like class functions and examined for possible dependencies.

`MyObject` has five dependencies: `this`, [Point2D](http://renderengine.googlecode.com/svn/api/Point2D.html), `Math`, `Container`, and `MyObject`.  Until these dependencies have been resolved (loaded and initialized), `MyObject` cannot be initialized.  Of these dependencies, we can immediately ignore a couple of them.  `this` either refers to the function, or to the `MyObject` instance.  We know this will exist, so we discard it.  Additionally, `MyObject` refers to itself, so we discard it as well.

This leaves us with three _actual dependencies_.  Of those dependencies, one is availble natively within each browser: `Math` so it could be discarded.  However, we'll leave it since it doesn't hurt to have it there.  Really, there are only the remaining two dependencies which need to be resolved.

`Point2D` and `Container` will have dependencies of their own, which will need to be resolved before `MyObject` can initialize.  Once `Point2D` and `Container` exist on the `window` object of the browser, `MyObject` will be added to the `window` object as well -- possibly satisfying a dependency for another object.

## Engine.initObject() ##

The `Engine.initObject()` method is as follows:

`Engine.initObject(objectName, primaryDependency, classDeclarationFunction)`

| **Argument** | **Type** | **Description** |
|:-------------|:---------|:----------------|
| `objectName` | String   | The name of the object contained in the `classDeclarationFunction`.  There is no way for Javascript to tell us these things, so it's easier for the developer to tell us. |
| `primaryDependency` | String   | The name of the object that `objectName` extends.  Again, easier for the developer to tell us rather than try to figure it out. |
| `classDeclarationFunction` | Function | A function whose only content is a class object being assigned to a variable, that returns that class object as its only value. |

The `Engine.initObject()` method should be preceded by any include calls.  The includes should only be the immediate objects that the class depends upon.  You don't need to include dependencies of dependent classes.  That should be handled automatically by each included class file.

## Object Resolution ##

After an object's dependencies have been resolved and the class can be constructed, it is considered "resolved".  At this point, if a class depended on other classes to initialize properly, it is safe to make calls to those objects.  If your class needs to perform such actions, it should implement the `resolved()` class method (not instance method) which will be called when the class has been resolved.  In this method, it is safe to call upon the dependent classes because they _will assuredly exist_.

## Circular References ##

Two types of circular references can be resolved for you:

  * A class that refers to itself
  * Two classes that have immediate references to each other

Secondary, tertiary, and so forth are not currently handled.  If you find a class isn't loading, it will be helpful to enable the debug mode of the engine and set the debug level to `DEBUGLEVEL_LOG`.  Since there is no way to really tell when all class files have been loaded, a game will appear to "hang" when loading.  You can see the dependencies by issuing a [Engine.dumpDependencies()](http://renderengine.googlecode.com/svn/api/Linker.html#dumpDependencies) call to the console.

## Coding Style ##

Please be sure to read the article on EngineCodingStyle to get a good feel for how the current engine is structured.  This method makes dependency processing much simpler.  Introducing new coding styles will only make dependency checking harder and should be avoided.