# Introduction #

A game is comprised of objects which represent the game world for the player(s).  Within this game, you might have a player, enemies, projectiles, score elements, power-ups, and so on.  Each of these objects, while unique, share a common purpose:  They have to move about within, interact with, and render to their environment.

Enter host objects...  A host object "hosts" components which perform discrete tasks, such as positioning and rendering, so that the host doesn't have to perform all of the work.  Or, a host might interact with its components to collect and act upon information from the game's environment.

Some host objects don't even render to the screen.  They might only be there to provide game logic and input...  The possibilities are almost endless.

## Host Objects ##

Host objects are where the COM-like architecture comes into play.  To make game objects easier to work with, we use components to build up the functionality of an in-game object.  Instead of writing each object to understand keyboard or mouse interactions, how to draw themselves, how to check for collisions, or how to move, we can utilize the different engine components which specialize in those functions.

Components break down into one of five functional areas.  Those areas, in order of macro-level processing, are as follows:

  1. **TYPE\_INPUT** - Components that interact with an input device, such as the keyboard.
  1. **TYPE\_LOGIC** - A component which performs logic functions, such as score calculations, or what animation to run.
  1. **TYPE\_COLLIDER** - Components that can interact with a collision model and determine when a host object might collide with another game object.
  1. **TYPE\_TRANSFORM** - A component which updates the transformation of the host game object.
  1. **TYPE\_RENDERING** - Components that can update a render context with a visual representation.

Not every host object will use components of each type.  Some game objects may only have a logic and rendering component, while others may have just a collider component.  Plus, there isn't a limit on the number of components of _one type_ that can be used.  A host might have two input components and five rendering components.  The idea here is that each component is focused on doing only one thing.

Host objects call the [execute()](http://renderengine.googlecode.com/svn/api/BaseComponent.html#execute) method of each component added to it.  This gives the host a chance to update itself before the container it is in moves on to the next object.  Components can be prioritized within their macro type, so that you can assure that one rendering component is executed before another.  Thus, if you need to rotate a shoulder before an elbow, you can prioritize them as such.

## Quick and Dirty Components ##

Like I said, a component is a discrete part of a whole entity.  You can read more about components in the HostComponents section.  For the sake of this discussion, just know that they perform singular tasks to form the whole.

You might have a power-up which floats about the playfield bouncing off walls, and only collides with the player to grant them a super power.  This object would _host_ transformation, rendering, and collision components.  The host only needs to add each of those components and then tell them how to act.  Some components even have "smarts" which dictate how they operate with little input needed from the host.

From the `SpaceroidsBullet` object's `constructor()` method, you can see how it adds, and then initializes, a few components:
```
   constructor: function(player) {
      this.base("Bullet");

      // This is a hack!
      this.field = Spaceroids;

      // Track the player that created us
      this.player = player;
      this.rot = player.getRotation();

      // Add components to move and draw the bullet
      this.add(Mover2DComponent.create("move"));
      this.add(Vector2DComponent.create("draw"));
      this.add(ColliderComponent.create("collide", this.field.collisionModel));

      // Get the player's position and rotation,
      // then position this at the tip of the ship
      // moving away from it
      var p_mover = this.player.getComponent("move");
      var c_mover = this.getComponent("move");
      var c_draw = this.getComponent("draw");

      c_draw.setPoints(SpaceroidsBullet.shape);
      c_draw.setLineStyle("white");
      c_draw.setFillStyle("white");

      var r = p_mover.getRotation();
      var dir = Math2D.getDirectionVector(Point2D.ZERO, SpaceroidsBullet.tip, r);

      var p = Point2D.create(p_mover.getPosition());

      c_mover.setPosition(p.add(Point2D.create(dir).mul(10)));
      c_mover.setVelocity(dir.mul(3));
   }
```

## Host Execution ##

Each frame of execution, every host object is processed and all components are executed.  The host object, through its [update()](http://renderengine.googlecode.com/svn/api/HostObject.html#update) method, is given the opportunity to modify the operation of its components.  Typically, only transformation (movement) of the host will need to be modified, however, some components even make _that_ unnecessary.  The collision component will, typically, automatically notify the host when a collision occurs with something, giving the host an opportunity to respond.

Finally, the rendering component will be executed (yes, components are executed in a defined order) and the host will be drawn to the RenderContext.  If your power-up was using an animated sprite, there's no need to even update the frame being displayed as that is done automatically for you.

For example, the `update()` method of the `SpaceroidsBullet` object:
```
   /**
    * Update the host object to reflect the state of the bullet.
    *
    * @param renderContext {RenderContext} The rendering context
    * @param time {Number} The engine time in milliseconds
    */
   update: function(renderContext, time) {
      var c_mover = this.getComponent("move");

		// Particle trail
		if (Spaceroids.evolved) {
			this.field.pEngine.addParticle(TrailParticle.create(this.getPosition(), this.rot, 45, "#aaaaff", 250));
		}

      // Is this bullet in field any more?
      var p = c_mover.getPosition();
      var bBox = Rectangle2D.create(p.x, p.y, 2, 2);
      if (!this.field.inField(p, bBox))
      {
         this.player.removeBullet(this);
         this.destroy();
         return;
      }

      renderContext.pushTransform();

      // Finally, call the super class' method
      this.base(renderContext, time);
      renderContext.popTransform();
   }

```

## Chaining Hosts to Form Composites ##

In addition to the standard components, a special type of component (known as a host component) performs like a host object.  So, if you were building a ragdoll type object, you might create a torso, head, arm, and leg host object, and then to the ragdoll you would add each host object as a component of the ragdoll.  If you wanted a snake, you might add a few arms in succession to eachother.  The beauty of this is that you only needed to create the arm once -- but it will be affected by, and be able to inherit from, its parent object.

## Simplicity ##

As you can see, by using components effectivly, complex objects can be built with little coding necessary.  As the component library grows, more and more operations will be automated for usage in the engine.  Additionally, your game can extend components to add simple functionality which make your host object more interesting.