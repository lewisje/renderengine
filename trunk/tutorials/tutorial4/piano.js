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
         if (charCode >= 49 && charCode <= 56) {
            this.sounds[charCode - 49].play();
         }
         return false;
      },

      /**
       * Handle a "keypress" event from the <tt>KeyboardInputComponent</tt>.
       * @param keyCode {Number} The key which was pressed.
       */
      onKeyDown: function(charCode) {
         // These will trigger a dot on the key being played
         if (charCode >= 49 && charCode <= 56) {
            this.dots[charCode - 49] = true;
         }
         return false;
      },
      
      /**
       * Handle a "keypress" event from the <tt>KeyboardInputComponent</tt>.
       * @param keyCode {Number} The key which was pressed.
       */
      onKeyUp: function(charCode) {
         // These will remove the dot on the key being played
         if (charCode >= 49 && charCode <= 56) {
            this.dots[charCode - 49] = false;
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
         var keyColor;
         for (var key = 0; key < 8; key++) {
            keyColor = this.dots[49 + key] ? "#ff0000" : "#ffffff";
            renderContext.setFillStyle(keyColor);
            var dotShape = Rectangle2D.create(15 + (26 * key), 180, 10, 10); 
            renderContext.drawFilledRectangle(dotShape);
         }
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
