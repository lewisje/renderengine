
/**
 * The Render Engine
 * FontEditor
 *
 * A tool for marking glyph boundaries in bitmapped fonts.
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
Engine.include("/resourceloaders/loader.image.js");
Engine.include("/engine/engine.timers.js");

Game.load("fontrender.js");

Engine.initObject("FontEditor", "Game", function() {

/**
 * @class The game.
 */
var FontEditor = Game.extend({

   constructor: null,
   editorContext: null,
	testContext: null,
	fontDef: null,
	
	editorWidth: 1789,
	editorHeight: 80,
	
	testWidth: 800,
	testHeight: 80,
	
	testString: "The quick brown fox jumps over the lazy dog. !@#$%^&*()",
	imageLoader: null,

   /**
    * Called to set up the game, download any resources, and initialize
    * the game to its running state.
    */
   setup: function() {
     $("#loading").remove();

      // Set the FPS of the game
      Engine.setFPS(5);

		// The font file can be specified as a command parameter
		var fontFile = EngineSupport.getStringParam("fontFile");
		
		// Check to see if a JS file exists for the font
		//var fontJS = Game.loadEngineScript("fonts/" + fontFile + ".js");

      // Create the editor's 2D context
      this.editorContext = CanvasContext.create("editor", this.editorWidth, this.editorHeight);
		this.editorContext.setWorldScale(1);
		
		// The editor context is static.  We'll update it as needed
		this.editorContext.setStatic(true);
      Engine.getDefaultContext().add(this.editorContext);
      this.editorContext.setBackgroundColor("black");

		// Create the test context where the font will be rendered to
		this.testContext = CanvasContext.create("testing", this.testWidth, this.testHeight);
		this.testContext.setWorldScale(1);
		Engine.getDefaultContext().add(this.testContext);
		this.testContext.setBackgroundColor("black");
		
		this.imageLoader = ImageLoader.create();

		// Set some event handlers
		var self = this;
		this.editorContext.addEvent(this, "mousedown", function(evt) {
			self.mouseBtn = true;
		});

		this.editorContext.addEvent(this, "mouseup", function(evt) {
			self.mouseBtn = false;
		});

		this.editorContext.addEvent(this, "mousemove", function(evt) {
			if (self.mouseBtn) {
				// This allows manual adjustment of automatic glyph dividers
			}
		});
		
		// Default font definition
		this.fontDef = {
		   "name": "",
		   "width": 0,
		   "height": 0,
		   "kerning": 0.88,
		   "space": 20,
		   "upperCaseOnly": false,
		   "bitmapImage": "",
		   "letters": []
		};
		
		this.linkEditors();
   },

   /**
    * Called when a game is being shut down to allow it to clean up
    * any objects, remove event handlers, destroy the rendering context, etc.
    */
   teardown: function() {
		this.editorContext.removeEvent("mousedown");
		this.editorContext.removeEvent("mouseup");
		this.editorContext.removeEvent("mousemove");
      this.editorContext.destroy();
		this.testContext.destroy();
   },

	//===============================================================================================
	// Editor Functions

	getImageLoader: function() {
		return this.imageLoader;
	},

	linkEditors: function() {
		var self = this;
		$("#loadFile").click(function() {
			var url=$("#fontURL").val();
			self.imageLoader.load("font", url, $("#fontWidth").val(), $("#fontHeight").val());
			self.imageTimeout = Timeout.create("foo", 100, function() {
				self.waitForResources();
			});
		});
	},

	waitForResources: function() {
		if (this.imageLoader.isReady()) {
			this.imageTimeout.destroy();
			this.run();
		} else {
			this.imageTimeout.restart();
		}
	},
	
	run: function() {
		this.editorContext.add(FontRender.create("font"));
		this.editorContext.render(Engine.worldTime);
		this.analyze();	
	},

	/**
	 * Automatically analyze a font image, looking for breaks between character
	 * glyphs.  If there are multiple rows with zero filled pixels, find the
	 * median between them.  If there aren't any rows containing zero pixels, find
	 * the one with the least number of overlapped pixels.
	 */
	analyze: function() {
		var rowNum = 1, letArr = [], lidx = 0;
		var w = parseInt($("#fontWidth").val());
		var h = parseInt($("#fontHeight").val());
		do {
			var d = this.getPixelDensity(rowNum);
			//console.debug("Density: ", d);
			rowNum++;
			if (d == 0) {
				// Possible letter boundary, check the density of the next rows
				// until we find one that is higher than zero
				var nextRow = rowNum + 1;
				if (this.getPixelDensity(nextRow) != 0) {
					this.editorContext.setLineStyle("orange");
					this.editorContext.drawLine(Point2D.create(rowNum,0), Point2D.create(rowNum, h));
					rowNum++;
				} else {
					while (nextRow < w && this.getPixelDensity(nextRow) < 1) {
						nextRow++;
					};
					nextRow--; 
					// If nextrow and rownum are not the same, find the median
					var med = 0;
					if (rowNum != nextRow) {
						med = (nextRow - rowNum) / 2;
					}
					rowNum += med;
					//letArr.push(med);
					this.editorContext.setLineStyle("yellow");
					this.editorContext.drawLine(Point2D.create(rowNum,0), Point2D.create(rowNum, h));
					rowNum = nextRow + 1;
				}
			} else {
				// For now, we'll just assume another charater is being processed.
				// We'll need to do some sort of box analysis to find potential boundaries
				// at this point.  Maybe look up character recognition.
				rowNum++;
			}
		} while (rowNum < w);
	},
	
	/**
	 * Get the row of pixels at the specified row.
	 * @param rowNum {Number} The row to analyze
	 * @return {Array} The array of pixels in the row
	 */
	getPixelRow: function(rowNum) {
		var h = parseInt($("#fontHeight").val());
		var rect = Rectangle2D.create(rowNum, 0, 1, h);
		return this.editorContext.getImage(rect);
	},
	
	/**
	 * Count the pixels in the given row.
	 * @param inRow {Array} The row from {@link #getPixelRow}
	 */
	getPixelDensity: function(rowNum) {
		var h = parseInt($("#fontHeight").val());
		var d = 0;
		var r = this.getPixelRow(rowNum);
		for (var y = 4; y < 4*h; y+=4) {
			d += (r.data[y] > 0 ? 1 : 0);
		}
		return d;	
	}
	
});

return FontEditor;

});

