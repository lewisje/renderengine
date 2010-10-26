/**
 * The Render Engine
 *
 * PhysicsActor object
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 *
 * @author: $Author$
 * @version: $Revision$
 *
 * Copyright (c) 2008 Brett Fattori (brettf@renderengine.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

Engine.include("/components/component.circlebody.js");
Engine.include("/components/component.boxbody.js");
Engine.include("/components/component.distancejoint.js");
Engine.include("/components/component.revolutejoint.js");

Engine.include("/engine/engine.math2d.js");
Engine.include("/engine/engine.object2d.js");
Engine.include("/resourceloaders/loader.object.js");

Engine.initObject("PhysicsActor", "Object2D", function() {

	/**
	 * @class A <tt>PhysicsActor</tt> is an actor object within a game represented by
	 * 		 a collection of components which can include physical bodies and joints.
	 * 		 Unlike {@link Object2D}, a <code>PhysicsActor</code> can associate each physical
	 * 		 body with a {@link RenderComponent}.  When the physical body is updated, the
	 * 		 render component is updated with it.  That way, a physics actor can be comprised
	 * 		 of multiple bodies, each with their own renderer allowing for a complex object
	 * 		 such as a ragdoll with many parts and joints.  A physics actor is used within a
	 * 		 {@link Simulation}.
	 * 		 <p/>
	 * 		 A <code>PhysicsActor</code> can act just like an {@link Object2D}, but it is the
	 * 		 only object which can be added to a {@link Simulation}.  Without being added to a
	 * 		 {@link Simulation}, none of the physical bodies will be updated. 
	 * 
	 * @param name {String} The name of the actor object
	 * @extends Object2D
	 * @constructor
	 * @description Create a physics actor
	 */
	var PhysicsActor = Object2D.extend(/** @scope PhysicsActor.prototype */{

		simulation: null,

		/**
		 * @private
		 */
		constructor: function(name) {
			this.base(name || "PhysicsActor");
		},

	   /**
	    * Remove all of the bodies and joints from the simulation before
	    * destroying the object.
	    */
	   destroy: function() {
	      if (this.simulation) {
				// Remove bodies and joints from the simulation
	         
	      }
	      this.base();
	   },
		
		/**
		 * Set the <code>Simulation</code> this actor participates within.  When a <code>PhysicsActor</code> 
		 * is part of a running <code>Simulation</code>, you must set the simulation so the physics components
		 * can be properly added to the simulated world.
		 * 
		 * @param simulation {Simulation} The simulation this object is within
		 */
		setSimulation: function(simulation) {
			this.simulation = simulation;
		},
		
		/**
		 * Get the <code>Simulation</code> this object participates within.
		 * @return {Simulation}
		 */
		getSimulation: function() {
			return this.simulation;	
		},
		
	   /**
	    * Add a component to the physics actor.  The components will be
	    * sorted based on their type then their priority within that type.
	    * Components with a higher priority will be sorted before components
	    * with a lower priority.  The sorting order for type is:
	    * <ul>
	    * <li>Input</li>
	    * <li>Transform</li>
	    * <li>Logic</li>
	    * <li>Collision</li>
	    * <li>Rendering</li>
	    * </ul>
	    *
	    * @param component {BaseComponent} A component to add to the host.  If the component is a
	    * 	{@link BaseBodyComponent} then the render component must be specified.
	    * @param [renderComponent] {RenderComponent} The render component if the component is a
	    * 	{@link BaseBodyComponent}
	    */
		add: function(component, renderComponent) {
			if (BaseBodyComponent.isInstance(component)) {
				// Assure that there's a renderer for the body and then link the two
				Assert(renderComponent == null || RenderComponent.isInstance(renderComponent), "Adding non-render component to body component");
				
				// Link the two so that when the body (transform) occurs, the renderer does its thing
				component.setRenderComponent(renderComponent);
			}	

			// Add the component
			this.base(component);
		},
		
	   /**
	    * Update this object within the render context, at the specified timeslice.
	    *
	    * @param renderContext {RenderContext} The context the object will be rendered within.
	    * @param time {Number} The global time within the engine.
	    */
	   update: function(renderContext, time) {
	
	      // Run the components
	      var components = this.iterator();
	
	      while (components.hasNext()) {
				var nextComponent = components.next();
				nextComponent.execute(renderContext, time);
				if (BaseBodyComponent.isInstance(nextComponent) && 
						nextComponent.getRenderComponent() != null) {
					// Make sure to execute the render component immediately following
					// the body component.
					nextComponent.getRenderComponent().execute(renderContext, time);
				}
	      }
	
			components.destroy();
	
			// Special case so we can skip the super class (HostObject)
	      HashContainer.prototype.update.call(this, renderContext, time);
	   },
		
		resolved: function() {
			PhysicsActor.actorLoader = ObjectLoader.create("ActorLoader");
		}
	
	}, /** @scope PhysicsActor.prototype */{ // Static
	
	   /**
	    * Get the class name of this object
	    * @return The string <tt>PhysicsActor</tt>
	    * @type String
	    */
	   getClassName: function() {
	      return "PhysicsActor";
	   },
		
		/**
		 * Resource loader for physics actor objects
		 * @private
		 */
		actorLoader: null,
		
		/**
		 * Helper method to load a physics object file which describes the objects
		 * and joints which comprise the object.  The format consists of "parts"
		 * which define the types of physical object ("circle", "box") and other
		 * parameters required by each part.  Additionally, the format will load
		 * joints which are used to link the parts together.
		 * <p/>
		 * The actor object is loaded asynchronously which means it isn't immediately
		 * available.  You get a reference to the object by calling {@link PhysicsActor#get}.
		 * 
		 * @param name {String} The unique reference name of the actor object 
	    * @param url {String} The URL where the resource is located
		 */
		load: function(name, url) {
			PhysicsActor.actorLoader.load(name, url);
		},
		
		/**
		 * Determine the ready state of a physics actor loaded with {@link PhysicsActor#load}.
		 * 
		 * @param name {String} The unique reference name of the actor object
		 * @return {Boolean} <code>true</code> if the object is ready for use
		 */
		isReady: function(name) {
			return PhysicsActor.actorLoader.isReady(name);
		},
		
		/**
		 * Get a unique instance of the actor defined by the reference name provided.
		 * You can call the <code>get()</code> method multiple times to retrieve new instances
		 * of the object.
		 * 
		 * @param name {String} The unique reference name of the actor object
		 * @param [objName] {String} The name to assign to the instance when created
		 * @return {PhysicsActor} A new instance of the actor defined by "name"
		 */
		get: function(name, objName) {
			var toP2d = function(arr) {
				return Point2D.create(arr[0], arr[1]);
			};
			
			var def = PhysicsActor.actorLoader.get(name), 
				 actor = PhysicsActor.create(objName), jointParts = [];
			
			// Loop through the parts and build each component
			for (var p in def.parts) {
				var part = def.parts[p], bc;
				if (part.type == "circle") {
					bc = CircleBodyComponent.create(part.name, part.radius);
				} else {
					var ext = toP2d(part.extents);
					bc = BoxBodyComponent.create(part.name, ext);
					ext.destroy();
				}
				
				// Add the component to the actor.  We'll let the developer set the renderer
				// for each body component.
				actor.add(bc);
				
				// Position the parts relative to each other, in world coordinates.  The origin is
				// at the center of the world.
				var pt = toP2d(part.position);
				bc.setPosition(pt);
				pt.destroy();
				
				// Is there a joint defined?  Defer it until later when all the parts are loaded
				// This way we don't have to worry about invalid body references
				if (part.joint) {
					jointParts.push(part);
				}
			}
			
			// Now that all the parts are created and in position, link them together with
			// any joints that were deferred until now
			for (var j in jointParts) {
				var part = jointParts[j], jc,
					 fromPart = (part.joint.linkFrom ? part.joint.linkFrom : part.name),
					 toPart = (part.joint.linkTo ? part.joint.linkTo : part.name),
					 jointName = fromPart + "_" + toPart;
				
				if (part.joint.type == "distance") {
					var originFrom = actor.getComponent(fromPart).getPosition(),
						 originTo = actor.getComponent(toPart).getPosition();

					jc = DistanceJoint.create(jointName,
													  actor.getComponent(fromPart),
													  actor.getComponent(toPart),
													  originFrom,
													  originTo);
				} else {
					var offset = toP2d(part.joint.offset);
					offset.add(actor.getComponent(part.name).getPosition());
					
					jc = RevoluteJoint.create(jointName,
													  actor.getComponent(fromPart),
													  actor.getComponent(toPart),
													  offset);
												
					var upLim = part.joint.maxLim,
						 lowLim = part.joint.minLim;													  
					jc.setUpperLimitAngle(upLim ? upLim : 359);
					jc.setLowerLimitAngle(lowLim ? lowLim : 0);
					offset.destroy();
				}
				
				// Add the joint to the actor
				actor.add(jc);
			}
		
			// Done, give them their actor
			return actor;
		}
	});
	
	return PhysicsActor;

});