
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
Engine.loadStylesheet("resources/editor.css", true);

// Load game objects
Game.load("/layer.js");
Game.load("/grid.js");
Game.load("/preview.js");
Game.load("/color_select.js");

Engine.initObject("SpriteEditor", "Game", function() {

/**
 * @class The game.
 */
var SpriteEditor = Game.extend({

   constructor: null,

   editorContext: null,

   pixSize: 16,

	editorSize: 512,

	currentColor: "white",

	currentLayer: null,

	mouseBtn: 0,

	drawMode: 0,

	colorSelector: null,

	brushSize: [0,0],

	grid: null,

	previewImage: null,

	editColor: 0,

   /**
    * Called to set up the game, download any resources, and initialize
    * the game to its running state.
    */
   setup: function() {
     $("#loading").remove();

      // Set the FPS of the game
      Engine.setFPS(5);

      // Create the 2D context
      this.editorContext = CanvasContext.create("editor", this.editorSize, this.editorSize);
		this.editorContext.setWorldScale(1);
      Engine.getDefaultContext().add(this.editorContext);
      this.editorContext.setBackgroundColor("black");

		// The place where previews will be generated
		this.previewContext = SpritePreview.create();
		this.previewContext.setWorldScale(1);
		Engine.getDefaultContext().add(this.previewContext);

		// Set some event handlers
		var self = this;
		this.editorContext.addEvent("mousedown", function(evt) {
			self.mouseBtn = true;
			switch (self.drawMode) {
				case SpriteEditor.PAINT : self.setPixel(evt.pageX, evt.pageY);
											break;
				case SpriteEditor.ERASE : self.clearPixel(evt.pageX, evt.pageY);
											break;
				case SpriteEditor.SELECT : self.getPixel(evt.pageX, evt.pageY);
											break;
			}
		});

		this.editorContext.addEvent("mouseup", function(evt) {
			self.mouseBtn = false;
		});

		this.editorContext.addEvent("mousemove", function(evt) {
			if (self.mouseBtn) {
				switch (self.drawMode) {
					case SpriteEditor.PAINT : self.setPixel(evt.pageX, evt.pageY);
												break;
					case SpriteEditor.ERASE : self.clearPixel(evt.pageX, evt.pageY);
												break;
					case SpriteEditor.SELECT : self.getPixel(evt.pageX, evt.pageY);
												break;
				}
			}
		});

		// Add the default layer
		this.currentLayer = SpriteLayer.create();
		this.grid = SpriteGrid.create();
		this.editorContext.add(this.currentLayer);
		this.editorContext.add(this.grid);

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
		for (var xB = 0; xB < SpriteEditor.brushSize[0] + 1; xB++) {
		  	for (var yB = 0; yB < SpriteEditor.brushSize[1] + 1; yB++) {
		  		SpriteEditor.currentLayer.addPixel(x + (xB * SpriteEditor.pixSize), y + (yB * SpriteEditor.pixSize));
		  	}
		}
	},

	clearPixel: function(x, y) {
		for (var xB = 0; xB < SpriteEditor.brushSize[0] + 1; xB++) {
		  	for (var yB = 0; yB < SpriteEditor.brushSize[1] + 1; yB++) {
		  		SpriteEditor.currentLayer.clearPixel(x + (xB * SpriteEditor.pixSize), y + (yB * SpriteEditor.pixSize));
		  	}
		}
	},

	getPixel: function(x, y) {
		var colr = SpriteEditor.currentLayer.getPixel(x, y);
		if (colr) {
			$("#curColor").val(colr);
			SpriteEditor.currentColor = colr;
			$(".colorTable .selectedColor").css("background", colr);
		}
	},

	setNewColor: function(hexColor) {
		if (SpriteEditor.editColor == SpriteEditor.COLOR_FOREGROUND) {
			$("#curColor").val(hexColor);
			SpriteEditor.currentColor = hexColor;
			$(".colorTable .selectedColor").css("background", hexColor);
		} else {
			$(".colorTable .backgroundColor").css("background", hexColor);
			$(SpriteEditor.editorContext.getSurface()).css("background", hexColor);
			SpriteEditor.grid.setGridColor(SpriteEditor.getContrast(hexColor));
		}
	},

	addControls: function() {
		$("#curColor")
			.change(function() {
				SpriteEditor.currentColor = this.value;
				$(".colorTable .selectedColor").css("background", colr);
			})
			.dblclick(function() {
				SpriteEditor.colorSelector.show(520, 10, SpriteEditor.currentColor);
			});

		$(".colorTable .selectedColor")
			.click(function() {
				SpriteEditor.editColor = SpriteEditor.COLOR_FOREGROUND;
				SpriteEditor.colorSelector.show(520, 10, SpriteEditor.currentColor);
			});

		$(".colorTable .backgroundColor")
			.click(function() {
				SpriteEditor.editColor = SpriteEditor.COLOR_BACKGROUND;
				var colr = SpriteEditor.fixupColor($(this).css("background-color"));
				SpriteEditor.colorSelector.show(520, 10, colr);
			});


		$("#gridVis").change(function() {
			SpriteEditor.grid.setVisible(this.checked);
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
				SpriteEditor.drawMode = SpriteEditor.PAINT;
			});

		$("#erase")
			.change(function() {
				SpriteEditor.drawMode = SpriteEditor.ERASE;
			});

		$("#dropper")
			.change(function() {
				SpriteEditor.drawMode = SpriteEditor.SELECT;
			});

		$(".preColor")
			.click(function() {
				var colr = SpriteEditor.fixupColor($(this).css("background-color"));
				$("#curColor").val(colr.toUpperCase());
				$(".colorTable .selectedColor").css("background", colr);
				SpriteEditor.currentColor = colr;
			});

		$(".brushPix").click(function() {
			var idx = $(".brushPix").index(this);
			$(".brushPix").removeClass("enabled");
			SpriteEditor.brushSize = [Math.floor(idx % 3), Math.floor(idx / 3)];
			for (var x = 0; x < 3; x++) {
				for (var y = 0; y < 3; y++) {
					if (x <= SpriteEditor.brushSize[0] &&
						 y <= SpriteEditor.brushSize[1]) {
						 	$(".brushPix:eq(" + ((y * 3) + x) + ")").addClass("enabled");
						 }
				}
			}
		});

		$(".button").hover(function() {
			$(this).addClass("mouseover");
		}, function() {
			$(this).removeClass("mouseover");
		});

		SpriteEditor.colorSelector = new ColorSelector("cs", SpriteEditor.setNewColor, $("#curColor").val());

		SpriteEditor.previewImage = $(".preview img");
	},

	fixupColor: function(colr) {

		function pad(n) {
			if (parseInt(n, 10) < 10) {
				return "0" + n;
			}
			return n;
		}

		colr.replace(/rgb\((\d+),\s*(\d+),\s*(\d+)/, function(str, r, g, b) {
			colr = "#";
			colr += pad(Number(r).toString(16));
			colr += pad(Number(g).toString(16));
			colr += pad(Number(b).toString(16));
		});
		// For browsers that use the named 16 colors
		colr.replace(/(.*)/,function(str) {
			var newColr = SpriteEditor.colorTable[str.toLowerCase()];
			colr = newColr || colr;
		});

		return colr;
	},

	getContrast: function(colr) {
		colr = colr.substring(1);
		var cont = colr.replace(/(\w{2})(\w{2})(\w{2})/, function(str, r, g, b) {
			return Math.max(Math.max(parseInt(r, 16), parseInt(g, 16)), parseInt(b, 16));
		});
		var n = (255 - cont).toString(16);
		return "#" + n + n + n;
	},

	colorTable: {
		"white":"#FFFFFF",
		"yellow":"#FFFF00",
		"fuchsia":"#FF00FF",
		"red":"#FF0000",
		"silver":"#C0C0C0",
		"gray":"#808080",
		"olive":"#808000",
		"purple":"#800080",
		"maroon":"#800000",
		"aqua":"#00FFFF",
		"lime":"#00FF00",
		"teal":"#008080",
		"green":"#008000",
		"blue":"#0000FF",
		"navy":"#000080",
		"black":"#000000"
	},

	PAINT: 0,
	ERASE: 1,
	SELECT: 2,
	COLOR_FOREGROUND: 0,
	COLOR_BACKGROUND: 1
});

return SpriteEditor;

});

