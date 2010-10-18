/**
 * The Render Engine
 * DistanceJointComponent
 *
 * @fileoverview A distance joint which can be used in a {@link Simulation}.
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
Engine.include("/engine/engine.math2d.js");
Engine.include("/components/component.basejoint.js");
Engine.include("/physics/dynamics/joints/b2DistanceJointDef.js");

Engine.initObject("DistanceJointComponent", "BaseJointComponent", function() {

/**
 * @class A distance joint which maintains constant distance between two bodies
 * 		 in a {@link Simulation}.  
 *
 * @param name {String} Name of the component
 * @param body1 {BaseBodyComponent} The first body for the joint
 * @param body2 {BaseBodyComponent} The second body for the joint
 * @param anchor1 {Point2D} A point, in world coordinates relative to the first 
 * 	body, to use as the joint's first anchor point
 * @param anchor2 {Point2D} A point, in world coordinates relative to the second 
 * 	body, to use as the joint's second anchor point
 *
 * @extends BaseJointComponent
 * @constructor
 * @description Creates a distance joint between two physical bodies.
 */
var DistanceJointComponent = BaseJointComponent.extend(/** @scope DistanceJointComponent.prototype */{

   /**
    * @private
    */
	constructor: function(name, body1, body2, anchor1, anchor2) {
		var jointDef = new b2DistanceJointDef();

		var a1 = anchor1.get();
		var a2 = anchor2.get();

		jointDef.anchorPoint1.Set(a1.x, a1.y);
		jointDef.anchorPoint2.Set(a2.x, a2.y);

		this.base(name || "DistanceJoint", body1, body2, jointDef);	
	}
	
}, { /** @scope DistanceJointComponent.prototype */

   /**
    * Get the class name of this object
    *
    * @return {String} "DistanceJointComponent"
    */
   getClassName: function() {
      return "DistanceJointComponent";
   }   
});

return DistanceJointComponent;

});