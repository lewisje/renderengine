/**
 * The Render Engine
 * ColliderComponent
 *
 * @fileoverview The base collision component.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 *
 * @author: $Author$
 * @version: $Revision$
 *
 * Copyright (c) 2010 Brett Fattori (brettf@renderengine.com)
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

// Includes
Engine.include("/components/component.base.js");

Engine.initObject("ColliderComponent", "BaseComponent", function() {

/**
 * @class Creates a collider component which tests the collision model for
 *              potential collisions. Each frame, the component will update a potential
 *              collision list (PCL) for the host object, using its current position
 *              obtained from {@link Object2D#getPosition}. Each object which meets
 *              certain criteria will be passed to an <tt>onCollide()</tt> method which
 *              must be implemented by the host object.
 *              <p/>
 *              The event handler will be passed the time the collision was detected
 *              as its first argument, and the potential collision object as the second.
 *              The host must determine if the collision is valid for itself, and then
 *              return a value which indicates whether the component should contine to
 *              check for collisions, or if it should stop.
 *              <p/>
 *              If the <tt>onCollide()</tt> method is not implemented on the host, no 
 *              collision events will be passed.
 *
 * @param name {String} Name of the component
 * @param collisionModel {SpatialCollection} The collision model
 * @param priority {Number} Between 0.0 and 1.0, with 1.0 being highest
 *
 * @extends BaseComponent
 * @constructor
 * @description A collider component is responsible for handling potential collisions by 
 *        updating the associated collision model and checking for possible collisions.
 */
var ColliderComponent = BaseComponent.extend(/** @scope ColliderComponent.prototype */{

   collisionModel: null,
	collideSelf: false,

   /**
    * @private
    */
   constructor: function(name, collisionModel, priority) {
      this.base(name, BaseComponent.TYPE_COLLIDER, priority || 1.0);
      this.collisionModel = collisionModel;
		this.collideSelf = false;
   },

	/**
    * Establishes the link between this component and its host object.
    * When you assign components to a host object, it will call this method
    * so that each component can refer to its host object, the same way
    * a host object can refer to a component with {@link HostObject#getComponent}.
    *
    * @param hostObject {HostObject} The object which hosts this component
	 */
	setHostObject: function(hostObj) {
		this.base(hostObj);
		this.setCollisionMask(0x7FFFFFFF);
	},

   /**
    * Releases the component back into the pool for reuse.  See {@link PooledObject#release}
    * for more information.
    */
   release: function() {
      this.base();
      this.collisionModel = null;
		this.setCollisionMask(0);
		this.collideSelf = false;
   },

   /**
    * Get the collision model being used by this component.
    * @return {SpatialContainer} The collision model
    */
   getCollisionModel: function() {
      return this.collisionModel;
   },
	
	/**
	 * Set whether or not an object can collide with itself.  By default,
	 * this is <tt>false</tt>.
	 * @param state {Boolean} <tt>true</tt> if an object can collide with itself
	 */
	setCollideSelf: function(state) {
		this.collideSelf = state;
	},
	
	/**
	 * Returns <tt>true</tt> if an object can collide with itself.  Default: <tt>false</tt>
	 * @return {Boolean}
	 */
	getCollideSelf: function() {
		return this.collideSelf;
	},
	
	/**
	 * Returns a set of flags which can result in a collision between two objects.
	 * The flags are bits within a 31-bit Integer that correspond to possible collisions.
	 * @return {Number}
	 */
	getCollisionMask: function() {
		return this.collisionModel.getObjectSpatialData(this.getHostObject(), "collisionMask");	
	},
   
   /**
    * Get the object type that this collider component will respond to.  If
    * the value is <tt>null</tt>, all objects are potential collision objects.
    * @return {BaseObject} The only object type to collide with, or <tt>null</tt> for any object
    * @deprecated see {@link #getCollisionFlags}
    */
   getObjectType: function() {
      return null;
   },
   
	/**
	 * Collision masks allow objects to be considered colliding or not depending on ANDing
	 * the results.  The flags occupy the lowest 31 bits, so there can be a number of 
	 * combinations which result in a collision.
	 * 
	 * @param collisionMask {Number} A 31-bit integer
	 */
	setCollisionMask: function(collisionMask) {
		this.collisionModel.setObjectSpatialData(this.getHostObject(), "collisionMask", collisionMask);
	},
	
   /**
    * Set the object type that this component will respond to.  Setting this to <tt>null</tt>
    * will trigger a potential collision when <i>any object</i> comes into possible contact 
    * with the component's host based on the collision model.  If the object isn't of this type,
    * no collision tests will be performed.  This allows the developer to fine tune which
    * object the collision component is responsible for.  As such, multiple collision components
    * could be used to handle different types of collisions.
    *
    * @param objType {BaseObject} The object type to check for
    * @deprecated see {@link #setCollisionFlags}
    */
   setObjectType: function(objType) {
   },

   /**
    * Update the collision model that this component was initialized with.
    * As objects move about the world, the objects will move to different
    * areas (or nodes) within the collision model.  It is necessary to
    * update this model frequently so collisions can be determined.
    */
   updateModel: function() {
      var obj = this.getHostObject();
		this.getCollisionModel().addObject(obj, obj.getPosition());
   },

	/**
	 * Get the collision node the host object is within, or <tt>null</tt> if it
	 * is not within a node.
	 * @return {SpatialNode}
	 */
   getSpatialNode: function() {
		return this.collisionModel.getObjectSpatialData(this.getHostObject(), "lastNode");
   },

   /**
    * Updates the object within the collision model and determines if
    * the host object should to be alerted whenever a potential collision
    * has occurred.  If a potential collision occurs, an array (referred to
    * as a Potential Collision List, or PCL) will be created which
    * contains objects that might be colliding with the host object.  It
    * is up to the host object to make the final determination that a
    * collision has occurred.  If no collisions have occurred, that will be reported
    * as well.
    * <p/>
    * The list of objects within the PCL will be passed to the <tt>onCollide()</tt>
    * method (if declared) on the host object.  If a collision occurred and was
    * handled, the <tt>onCollide()</tt> method should return {@link CollisionComponent#STOP},
    * otherwise, it should return {@link CollisionComponent#CONTINUE} to continue
    * checking objects from the PCL against the host object.
    *
    * @param renderContext {RenderContext} The render context for the component
    * @param time {Number} The current engine time in milliseconds
    */
   execute: function(renderContext, time) {

      var host = this.getHostObject();

      // Update the collision model
      this.updateModel();

      // If the host object needs to know about collisions...
      if (host.onCollide)
      {
         // Get the PCL and check for collisions
         var pcl = this.getCollisionModel().getPCL(host.getPosition());
         var status = ColliderComponent.CONTINUE;
			pcl.forEach(function(obj) {
				var hostMask = this.collisionModel.getObjectSpatialData(host, "collisionMask");
				var targetMask = this.collisionModel.getObjectSpatialData(obj, "collisionMask");
            if ((hostMask & targetMask) <= hostMask && 
					  status == ColliderComponent.CONTINUE) {

               status = this.testCollision(time, obj, hostMask, targetMask); 
            }
         }, this);
      }
   },
   
   /**
    * Call the host object's <tt>onCollide()</tt> method, passing the time of the collision,
    * the potential collision object, and the collision object's flags.  The return value should 
    * indicate if the collision tests should continue or stop.
    * <p/>
    * If the host object implements <tt>onCollideEnd()</tt> and the we're not colliding with
    * ourself or anything else, the method is triggered on the host.
    * <p/>
    * For <tt>ColliderComponent</tt> the collision test is up to the host object to determine.
    *
    * @param time {Number} The engine time (in milliseconds) when the potential collision occurred
    * @param collisionObj {HostObject} The host object with which the collision potentially occurs
    * @param hostMask {Number} The collision mask for the host object
    * @param targetMask {Number} The collision mask for <tt>collisionObj</tt>
    * @return {Number} A status indicating whether to continue checking, or to stop
    */
   testCollision: function(time, collisionObj, hostMask, targetMask) {
		if (this.collideSelf || hostMask != targetMask) {
      	return this.getHostObject().onCollide(collisionObj, time, targetMask);
		} else if (this.getHostObject().onCollideEnd) {
			return this.getHostObject().onCollideEnd(time);
		}
   }

}, /** @scope ColliderComponent.prototype */{ // Statics

   /**
    * Get the class name of this object
    *
    * @return {String} "ColliderComponent"
    */
   getClassName: function() {
      return "ColliderComponent";
   },

   /**
    * When <tt>onCollide()</tt> is called on the host object, it should
    * return this value if it hasn't handled the collision, or if it wishes to be 
    * notified about other potential collisions.
    * @type {Number}
    */
   CONTINUE: 0,

   /**
    * When <tt>onCollide()</tt> is called on the host object, it should
    * return this if no more collisions should be reported.
    * @type {Number}
    */
   STOP: 1

});

return ColliderComponent;

});