
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
Engine.loadStylesheet("resources/color_select.css", true);

// Load game objects
Game.load("/layer.js");
Game.load("/grid.js");
Game.load("/color_select.js");

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

	mouseBtn: 0,

	drawMode: true,

	colorSelector: null,

   /**
    * Called to set up the game, download any resources, and initialize
    * the game to its running state.
    */
   setup: function() {
     $("#loading").remove();

      // Set the FPS of the game
      Engine.setFPS(5);

      // Create the 2D context
      this.editorContext = new CanvasContext("editor", this.editorSize, this.editorSize);
		this.editorContext.setWorldScale(1);
      Engine.getDefaultContext().add(this.editorContext);
      this.editorContext.setBackgroundColor("black");

		// Set some event handlers
		var self = this;
		this.editorContext.addEvent("mousedown", function(evt) {
			self.mouseBtn = true;
			if (self.drawMode) {
				self.setPixel(evt.pageX, evt.pageY);
			} else {
				self.clearPixel(evt.pageX, evt.pageY);
			}
		});

		this.editorContext.addEvent("mouseup", function(evt) {
			self.mouseBtn = false;
		});

		this.editorContext.addEvent("mousemove", function(evt) {
			if (self.mouseBtn) {
				if (self.drawMode) {
					self.setPixel(evt.pageX, evt.pageY);
				} else {
					self.clearPixel(evt.pageX, evt.pageY);
				}
			}
		});

		// Add the default layer
		this.currentLayer = SpriteLayer.create();
		this.editorContext.add(this.currentLayer);
		this.editorContext.add(SpriteGrid.create());

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

	clearPixel: function(x, y) {
		SpriteEditor.currentLayer.clearPixel(x, y);
	},

	setNewColor: function(hexColor) {
		$("#curColor").val(hexColor);
		SpriteEditor.currentColor = hexColor;
		$(".colorTable .selectedColor").css("background", hexColor);
	},

	addControls: function() {
		$("#curColor")
			.change(function() {
				SpriteEditor.currentColor = this.value;
				$(".colorTable .selectedColor").css("background", colr);
			})
			.dblclick(function() {
				SpriteEditor.colorSelector.show(520, 10);
			});
		
		$("#selBtn")
			.click(function() { 
				SpriteEditor.colorSelector.show(520, 10);
			});

		$("#grid8")
			.change(function() {
				SpriteEditor.pixSize = 8;
			});

		$("#grid16")
			.change(function() {
				SpriteEditor.pixSize = 16;
			});

		$("#grid32")
			.change(function() {
				SpriteEditor.pixSize = 32;
			});
		
		$("#grid64")
			.change(function() {
				SpriteEditor.pixSize = 64;
			});

		$("#paint")
			.change(function() {
				SpriteEditor.drawMode = true;
			});

		$("#erase")
			.change(function() {
				SpriteEditor.drawMode = false;
			});

		$(".preColor")
			.click(function() {
				
				function pad(n) {
					if (parseInt(n, 10) < 10) {
						return "0" + n;
					}
					return n;
				}
				
				var colr = $(this).css("background-color");
				colr.replace(/rgb\((\d+),\s*(\d+),\s*(\d+)/, function(str, r, g, b) {
					colr = "#";
					colr += pad(Number(r).toString(16));
					colr += pad(Number(g).toString(16));
					colr += pad(Number(b).toString(16));
				});
				$("#curColor").val(colr);
				$(".colorTable .selectedColor").css("background", colr);
				SpriteEditor.currentColor = colr;
			});

		SpriteEditor.colorSelector = new ColorSelector("cs", SpriteEditor.setNewColor, $("#curColor").val());
	}
});

return SpriteEditor;

});

