/**
 * The Render Engine
 * Ragdoll object
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

// Load engine objects
Engine.include("/components/component.circlebody.js");
Engine.include("/components/component.boxbody.js");
Engine.include("/components/component.distancejoint.js");
Engine.include("/components/component.revolutejoint.js");

Engine.include("/components/component.sprite.js");
Engine.include("/components/component.collider.js");
Engine.include("/objects/object.physicsactor.js");

Engine.initObject("Ragdoll", "PhysicsActor", function() {

	var Ragdoll = PhysicsActor.extend(/** @scope Ragdoll.prototype */{

	constructor: function() {
		this.base("Ragdoll");
		
		// First, get all of the sprites into one place
		var sprites = {
			head: PhysicsDemo2.spriteLoader.getSprite("head"),
			pelvis: PhysicsDemo2.spriteLoader.getSprite("pelvis"),
			torso: PhysicsDemo2.spriteLoader.getSprite("torso"),

			// Left arm
			laHand: PhysicsDemo2.spriteLoader.getSprite("l_hand"),
			laFore: PhysicsDemo2.spriteLoader.getSprite("l_lowerarm"),
			laUpper: PhysicsDemo2.spriteLoader.getSprite("l_upperarm"),

			// Right arm
			raHand: PhysicsDemo2.spriteLoader.getSprite("r_hand"),
			raFore: PhysicsDemo2.spriteLoader.getSprite("r_lowerarm"),
			raUpper: PhysicsDemo2.spriteLoader.getSprite("r_upperarm"),

			// Left leg
			llFoot: PhysicsDemo2.spriteLoader.getSprite("l_foot"),
			llCalf: PhysicsDemo2.spriteLoader.getSprite("l_lowerleg"),
			llThigh: PhysicsDemo2.spriteLoader.getSprite("l_upperleg"),

			// Right leg
			rlFoot: PhysicsDemo2.spriteLoader.getSprite("r_foot"),
			rlCalf: PhysicsDemo2.spriteLoader.getSprite("r_lowerleg"),
			rlThigh: PhysicsDemo2.spriteLoader.getSprite("r_upperleg")
		};
		
		// Next, layout the body parts...
		this.add(BoxBodyComponent.create("head"), SpriteComponent("hdsp", sprites.head));
		this.add(BoxBodyComponent.create("torso"), SpriteComponent("trsp", sprites.torso));
		this.add(BoxBodyComponent.create("pelvis"), SpriteComponent("pvsp", sprites.pelvis));
		this.add(BoxBodyComponent.create("lefthand"), SpriteComponent("lhsp", sprites.laHand));
		this.add(BoxBodyComponent.create("leftfore"), SpriteComponent("lfsp", sprites.laFore));
		this.add(BoxBodyComponent.create("leftupper"), SpriteComponent("lusp", sprites.laUpper));
		this.add(BoxBodyComponent.create("righthand"), SpriteComponent("rhsp", sprites.raHand));
		this.add(BoxBodyComponent.create("rightfore"), SpriteComponent("rfsp", sprites.raFore));
		this.add(BoxBodyComponent.create("leftfoot"), SpriteComponent("lftsp", sprites.llFoot));
		this.add(BoxBodyComponent.create("leftcalf"), SpriteComponent("lcsp", sprites.llCalf));
		this.add(BoxBodyComponent.create("leftthigh"), SpriteComponent("ltsp", sprites.llThigh));
		this.add(BoxBodyComponent.create("rightfoot"), SpriteComponent("rftsp", sprites.rlFoot));
		this.add(BoxBodyComponent.create("rightcalf"), SpriteComponent("rcsp", sprites.rlCalf));
		this.add(BoxBodyComponent.create("rightthigh"), SpriteComponent("rtsp", sprites.rlThigh));
				
		// Finally, link the body parts with joints...
		
	}


   }, /** @scope Ragdoll.prototype */{ // Static

      /**
       * Get the class name of this object
       * @return {String} The string <tt>Ragdoll</tt>
       */
      getClassName: function() {
         return "Ragdoll";
      }
	});
	
	return Ragdoll;	
});
	