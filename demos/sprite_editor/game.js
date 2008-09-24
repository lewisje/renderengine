
/**
 * The Render Engine
 * SpriteEditor
 *
 * Demonstration of using The Render Engine.
 *
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

// Load all required engine components
Engine.include("/rendercontexts/context.canvascontext.js");

// Load game objects
Game.load("/layer.js");
//Game.load("/grid.js");

Engine.initObject("SpriteEditor", "Game", function() {

/**
 * @class The game.
 */
var SpriteEditor = Game.extend({

   constructor: null,

   editorContext: null,

   pixSize: 32,
	
	editorSize: 512,

	currentColor: "white",
	
	currentLayer: null,

   /**
    * Called to set up the game, download any resources, and initialize
    * the game to its running state.
    */
   setup: function() {
     $("#loading").remove();

      // Set the FPS of the game
      Engine.setFPS(10);

      // Create the 2D context
      this.editorContext = new CanvasContext("editor", this.editorSize, this.editorSize);
		this.editorContext.setWorldScale(1);
      Engine.getDefaultContext().add(this.editorContext);
      this.editorContext.setBackgroundColor("black");

		// Set some event handlers
		var self = this;
		this.editorContext.addEvent("mousedown", function(evt) { self.setPixel(evt.pageX, evt.pageY); });
		
		// Add the default layer
		this.currentLayer = SpriteLayer.create();
		this.editorContext.add(this.currentLayer);
		
		this.addControls();
   },

   /**
    * Called when a game is being shut down to allow it to clean up
    * any objects, remove event handlers, destroy the rendering context, etc.
    */
   teardown: function() {
		this.editorContext.removeEvent("mousedown");
      this.editorContext.destroy();
   },

	//===============================================================================================
	// Editor Functions

	setPixel: function(x, y) {
		SpriteEditor.currentLayer.addPixel(x, y);
	},
	
	addControls: function() {
		var ctx = $(Engine.getDefaultContext().getSurface());
		var cPanel = $("<div id='controls'/>");
		ctx.append(cPanel);
		cPanel.append($("<span class='tool'>Color: </span>"));
		cPanel.append($("<input id='color' type='text' size='8' value='#ffffff'/>")
			.change(function() {
				SpriteEditor.currentColor = this.value;
			}));
	}
});

return SpriteEditor;

});

