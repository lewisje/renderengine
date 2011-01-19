/**
 * The Render Engine
 *
 * Collision box editing object
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

// The class this file defines and its required classes
R.Engine.define({
	"class": "R.objects.CollisionBox",
	"requires": [
		"R.components.Transform2D",
		"R.components.Render",
		"R.engine.Object2D",
		"R.math.Point2D",
		"R.math.Rectangle2D"
	]
});

/**
 * @class A collision box which can be used to impede movement or trigger an action.
 */
R.objects.CollisionBox = function(){
	return R.engine.Object2D.extend({
	
		editing: false,
		boxRect: null,
		type: null,
		action: null,
		
		constructor: function(){
			this.base("CollisionBlock");
			
			this.editing = false;
			
			this.add(R.components.Transform2D.create("move"));
			this.add(R.components.Render.create("draw"));
			
			this.setPosition(R.math.Point2D.create(100, 100));
			this.boxRect = R.math.Rectangle2D.create(0, 0, 80, 80);
			this.setBoundingBox(this.boxRect);
			this.type = R.objects.CollisionBox.TYPE_COLLIDER;
			this.action = "";
		},
		
		getProperties: function(){
			var self = this;
			var prop = this.base(self);
			return $.extend(prop, {
				"Width": [function(){
					return self.boxRect.get().w;
				}, function(i){
					self.setWidth(i);
				}, true],
				"Height": [function(){
					return self.boxRect.get().h;
				}, function(i){
					self.setHeight(i);
				}, true],
				"Type": [function() {
					return self.type == R.objects.CollisionBox.TYPE_COLLIDER ? "TYPE_COLLIDER" : "TYPE_TRIGGER"; 
				}, function(i) {
					self.setType(i == "TYPE_COLLIDER" ? R.objects.CollisionBox.TYPE_COLLIDER : R.objects.CollisionBox.TYPE_TRIGGER);
				}, false],
				"Action": [function() {
									return self.action.substring(0,25);
							  }, !R.isUndefined(LevelEditor) && self.type == R.objects.CollisionBox.TYPE_TRIGGER ?
							  { "editor": function() { LevelEditor.showScriptDialog(this, "Action", self.action); }, "fn": function(i) { self.setAction(i); } } : null, 
							  (!R.isUndefined(LevelEditor) && self.type == R.objects.CollisionBox.TYPE_TRIGGER)]
			});
		},
		
		/**
		 * Update the player within the rendering context.  This draws
		 * the shape to the context, after updating the transform of the
		 * object.  If the player is thrusting, draw the thrust flame
		 * under the ship.
		 *
		 * @param renderContext {RenderContext} The rendering context
		 * @param time {Number} The engine time in milliseconds
		 */
		update: function(renderContext, time){
			renderContext.pushTransform();
			this.base(renderContext, time);
			var color = "255,255,0";
			
			if (this.type == R.objects.CollisionBox.TYPE_TRIGGER) {
				color = "255,0,0";	
			}
			
			if (this.editing) {
				renderContext.setFillStyle("rgba(" + color + ",0.85)");
			} else {
				renderContext.setFillStyle("rgba(" + color + ",0.4)");
			}
			
			renderContext.drawFilledRectangle(this.boxRect);

			if (this.editing) {
				renderContext.setLineStyle("white");
				renderContext.setLineWidth(2);
				renderContext.drawRectangle(this.boxRect);
			}

			renderContext.popTransform();
		},
		
		/**
		 * Get the type of collision box object being represented.
		 * @return {Number}
		 */
		getType: function() {
			return this.type;
		},
		
		/**
		 * Set the type of collision box this will be.
		 * @param type {Number} One of either: {@link #TYPE_COLLIDER} or {@link #TYPE_TRIGGER}.
		 */
		setType: function(type) {
			this.type = type;
			if (type == R.objects.CollisionBox.TYPE_TRIGGER) {
				this.setName("TriggerBlock");
			} else {
				this.setName("CollisionBlock");
			}
		},
		
		/**
		 * Sets the script which will be called when the block is triggered.
		 * @param action {String} The action script
		 */
		setAction: function(action) {
			this.action = action;
		},
		
		/**
		 * Get the position of the ship from the mover component.
		 * @return {Point2D}
		 */
		getPosition: function(){
			return this.getComponent("move").getPosition();
		},
		
		getRenderPosition: function(){
			return this.getComponent("move").getRenderPosition();
		},
		
		setBoxSize: function(width, height){
			this.boxRect.setDims(R.math.Point2D.create(width, height));
			this.setBoundingBox(this.boxRect);
		},
		
		setWidth: function(width){
			this.boxRect.setWidth(width);
			this.setBoundingBox(this.boxRect);
		},
		
		setHeight: function(height){
			this.boxRect.setHeight(height);
			this.setBoundingBox(this.boxRect);
		},
		
		/**
		 * Set, or initialize, the position of the mover component
		 *
		 * @param point {Point2D} The position to draw the ship in the playfield
		 */
		setPosition: function(point){
			this.base(point);
			this.getComponent("move").setPosition(point);
		},
		
		setEditing: function(state){
			this.editing = state;
		},
		
		isEditable: function(){
			return true;
		}
		
	}, { // Static
		/**
		 * Get the class name of this object
		 * @return The string <tt>R.objects.CollisionBox</tt>
		 * @type String
		 */
		getClassName: function(){
			return "R.objects.CollisionBox";
		},
		
		/**
		 * This type of box impedes movement through it
		 */
		TYPE_COLLIDER: 1,
		
		/**
		 * This type of box triggers an action
		 */
		TYPE_TRIGGER: 2
	});
	
}