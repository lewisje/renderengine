
/**
 * The Render Engine
 * A beachball toy
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 *
 * @author: $Author: bfattori $
 * @version: $Revision: 642 $
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

// Load engine objects
Engine.include("/components/component.circlebody.js");

Engine.initObject("BeachBall", "Toy", function() {

   /**
    * @class The block object.  Represents a block which is dropped from
    *        the top of the playfield and is used to build a hand.  Each
    *        block is one of 6 designs.  Each block is comprised of tiles
    *        which are cards that make up a hand, including wild cards.
    */
   var BeachBall = Toy.extend({

		size: 30,

		constructor: function() {
			this.base("beachball", "ball", "over");
		},

		/**
		 * Create the physical body component and assign it to the
		 * toy.
		 *
		 * @param componentName {String} The name to assign to the component.
		 * @param scale {Number} A scalar scaling value for the toy
		 */
		createPhysicalBody: function(componentName, scale) {
			this.size = 30;
			this.size *= scale;
			this.add(CircleBodyComponent.create(componentName, this.size));
			
			// Set the friction and bounciness of the crate
			this.getComponent(componentName).setFriction(0.08);
			this.getComponent(componentName).setRestitution(0.8);
		}

   }, { // Static

      /**
       * Get the class name of this object
       * @return {String} The string <tt>BeachBall</tt>
       */
      getClassName: function() {
         return "BeachBall";
      }
   });

return BeachBall;

});