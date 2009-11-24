// Load the components and engine objects
Engine.include("/components/component.keyboardinput.js");
Engine.include("/components/component.transform2d.js");
Engine.include("/components/component.image.js");
Engine.include("/engine/engine.object2d.js");

Engine.initObject("PianoKeys", "Object2D", function() {

   var PianoKeys = Object2D.extend({

		sounds: [],

      constructor: function() {
         this.base("PianoKeys");

         // Add the component which handles keyboard input
         this.add(KeyboardInputComponent.create("input"));
         this.add(Transform2DComponent.create("move"));
         this.add(ImageComponent.create("draw", Tutorial4.imageLoader, "keys"));

         // Position the object
         this.getComponent("move").setPosition(Point2D.create(20, 25));
			
			// Get the sounds into the array
			this.sounds.push(Tutorial4.soundLoader.get("c1"));
			this.sounds.push(Tutorial4.soundLoader.get("d1"));
			this.sounds.push(Tutorial4.soundLoader.get("e1"));
			this.sounds.push(Tutorial4.soundLoader.get("f1"));
			this.sounds.push(Tutorial4.soundLoader.get("g1"));
			this.sounds.push(Tutorial4.soundLoader.get("a1"));
			this.sounds.push(Tutorial4.soundLoader.get("b1"));
			this.sounds.push(Tutorial4.soundLoader.get("c2"));
      },
      
      /**
       * Update the object within the rendering context.  This calls the transform
       * components to position the object on the playfield.
       *
       * @param renderContext {RenderContext} The rendering context
       * @param time {Number} The engine time in milliseconds
       */
      update: function(renderContext, time) {
         renderContext.pushTransform();
         
         // The the "update" method of the super class
         this.base(renderContext, time);
         
         // Draw a dot on the key being pressed
         this.draw();

         renderContext.popTransform();
      },
      
      /**
       * Handle a "keypress" event from the <tt>KeyboardInputComponent</tt>.
       * @param keyCode {Number} The key which was pressed.
       */
      onKeyPress: function(charCode) {
         // These will trigger a sound to play
         switch (charCode) {
            case 49:    // 1 key
            	this.sounds[0].play();
               break;
            case 50:    // 2 key
            	this.sounds[1].play();
               break;
            case 51:    // 3 key
            	this.sounds[2].play();
               break;
            case 52:    // 4 key
            	this.sounds[3].play();
               break;
            case 53:    // 5 key
            	this.sounds[4].play();
               break;
            case 54:    // 6 key
            	this.sounds[5].play();
               break;
            case 55:    // 7 key
            	this.sounds[6].play();
               break;
            case 56:    // 8 key
            	this.sounds[7].play();
               break;
         }
         return false;
      },
      
      /**
       * Draw our game object onto the specified render context.
       * @param renderContext {RenderContext} The context to draw onto
       */
      draw: function(renderContext) {
         // At some point, we'll draw something where the key being
         // pressed is located to give some feedback...
         //renderContext.setFillStyle(this.color);
         //renderContext.drawFilledRectangle(this.shape);
      }

   }, { // Static

      /**
       * Get the class name of this object
       * @return {String} The string MyObject
       */
      getClassName: function() {
         return "PianoKeys";
      }
   });

return PianoKeys;

});
