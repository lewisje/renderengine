/*
* Copyright (c) 2006-2007 Erin Catto http:
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked, and must not be
* misrepresented the original software.
* 3. This notice may not be removed or altered from any source distribution.
*
* Converted for The Render Engine v2.0
* Aug. 4, 2010 Brett Fattori
*/

R.Engine.requires("R.physics.common.math.b2Vec2");

R.Engine.requires("R.physics.collision.shapes.b2Shape");
R.Engine.requires("R.physics.collision.shapes.b2ShapeDef");

var b2CircleDef = b2ShapeDef.extend({

   radius: null,

   constructor: function() {
      // The constructor for b2ShapeDef
      this.type = R.physics.collision.shapes.b2Shape.e_unknownShape;
      this.userData = null;
      this.localPosition = new R.physics.common.math.b2Vec2(0.0, 0.0);
      this.localRotation = 0.0;
      this.friction = 0.2;
      this.restitution = 0.0;
      this.density = 0.0;
      this.categoryBits = 0x0001;
      this.maskBits = 0xFFFF;
      this.groupIndex = 0; 
      //

      this.type = R.physics.collision.shapes.b2Shape.e_circleShape;
      this.radius = 1.0;
   }

});