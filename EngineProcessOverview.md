# Engine Process Overview #

My goal in this document is to assist you in understanding the engine architecture.  It is by no means a simple concept to grasp, but once you understand it, it will be easier to work with and modify the engine -- and create games.  Overall, the engine is an object oriented structure, with a clear inheritance model, and some parts that work kinda like COM.

## Engine Flow ##

The `Engine` class contains a private method called `worldTimer()` which executes each frame.  When a frame is executed, `Engine` will call the [update()](http://renderengine.googlecode.com/svn/api/RenderContext.html#update) method of its default context (the document body).  Your rendering context(s) should have been added to the default context before your game started running.  Anything that is added to your context(s) will then be added to the chain of objects which must be processed.  So lets assume the following scenario:

  * Your context is called "gameContext"
  * You have 3 objects (extending from `HostObject`) which need to be updated when the frame is rendered, so you add them (A,B,C) to "gameContext"
  * Each of those objects has 3 components (extending from `BaseComponent`) which were added to the object (x,y,z)

The execution flow would be:

```
[START FRAME]

defaultContext ->
    gameContext -> 
        A -> Ax -> Ay -> Az 
        B -> Bx -> By -> Bz
        C -> Cx -> Cy -> Cz

[END FRAME]
```

Anything which extends from [BaseObject](http://renderengine.googlecode.com/svn/api/BaseObject.html) has the [update()](http://renderengine.googlecode.com/svn/api/BaseObject.html#update) method, whereas components have the [execute()](http://renderengine.googlecode.com/svn/api/BaseComponent.html#execute) method.  [RenderContext](http://renderengine.googlecode.com/svn/api/RenderContext.html) and [HostObject](http://renderengine.googlecode.com/svn/api/HostObject.html) each implement their own `update()` method which will call `update()` on each object contained within that container.  As you can surmise, this proceeds until all objects which are within a container linked back to the default context have been updated.  After which a new frame is generated.  This goes on until the engine is shut down.

## Engine Process ##

Each object in the engine is one of two object types: A single object that _is not_ a container, or an object that contains other objects.  When the engine processes a frame, it starts with a known object (the default render context) which is a container, and runs through each object within it.  For containers, the object's contained objects are iterated over (etc. on down the line) until all objects have been processed.

The [default engine context](http://renderengine.googlecode.com/svn/api/Engine.html#getDefaultContext) (a wrapper for the `HTMLDocument` object) contains objects, which must be updated, and each of those objects can contain their own objects, and so on.  It's basically a chain reaction of objects updating objects until everything has been given a chance to update itself.

Objects that are created, and need to be updated, have to be added to a parent object that is itself contained in an object which will be updated for each frame.  That is why most objects extend from the [Container](http://renderengine.googlecode.com/svn/api/Container.html) object.  For example, in the example game, you'll see the following in the `Spaceroids.setup()` method:
```
   this.renderContext = CanvasContext.create(this.fieldWidth, this.fieldHeight);
   this.renderContext.setWorldScale(this.areaScale);
   Engine.getDefaultContext().add(this.renderContext);
```
This creates a [CanvasContext](http://renderengine.googlecode.com/svn/api/CanvasContext.html) (itself, a container) and adds it to the engine's default context.  By doing so, anything added to the game's `renderContext` will be updated each time the engine's default context updates the `renderContext`.  You can see that as we create rocks in attract mode for the "Spaceroids" example game, they are added to the game's `renderContext`:
```
   // Add some asteroids
   for (var a = 0; a < 3; a++)
   {
      var rock = SpaceroidsRock.create(null, null, pWidth, pHeight);
      this.renderContext.add(rock);
      rock.setup();
      rock.killTimer = Engine.worldTime + 2000;
   }
```
The process becomes quite evident after you've explored it and used it a few times.  Container objects update the objects they contain, and so on...  Keep that phrase in your mind and you'll soon understand how simple the process really is.

_Hint:_ Another type of Container are the HostObjects.