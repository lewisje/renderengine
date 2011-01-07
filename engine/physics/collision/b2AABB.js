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

R.Engine.requires("/physics/common/math/b2Vec2.js");

R.Engine.initObject("b2AABB", null, function() {
   
   // A manifold for two touching convex shapes.
   var b2AABB = Base.extend({
   
      minVertex: null,
      maxVertex: null,
   
      constructor: function() {
         // initialize instance variables for references
         this.minVertex = new b2Vec2();
         this.maxVertex = new b2Vec2();
      },
      
      IsValid: function(){
         //var d = b2Math.SubtractVV(this.maxVertex, this.minVertex);
         var dX = this.maxVertex.x;
         var dY = this.maxVertex.y;
         dX = this.maxVertex.x;
         dY = this.maxVertex.y;
         dX -= this.minVertex.x;
         dY -= this.minVertex.y;
         var valid = dX >= 0.0 && dY >= 0.0;
         valid = valid && this.minVertex.IsValid() && this.maxVertex.IsValid();
         return valid;
      }
      
   });
   
   return b2AABB;
   
});
