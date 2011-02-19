/**
 * The Render Engine
 * Tile
 *
 * @fileoverview A class for working with sprites.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 * @author: $Author$
 * @version: $Revision$
 *
 * Copyright (c) 2011 Brett Fattori (brettf@renderengine.com)
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
	"class": "R.resources.types.Tile",
	"requires": [
		"R.resources.types.Sprite",
		"R.math.Rectangle2D",
		"R.util.RenderUtil"
	]
});

/**
 * @class Represents a 2d tile
 *
 * @constructor
 * @param name {String} The name of the tile within the resource
 * @param spriteObj {Object} Passed in by a {@link SpriteLoader}.  An array which defines the
 *                  sprite frame, and parameters.
 * @param tileResource {Object} The tile resource loaded by the {@link TileLoader}
 * @description A tile is a sprite with the addition of a solidity map, computed from the
 * 	pixels of the sprite.
 * @extends R.engine.PooledObject
 */
R.resources.types.Tile = function() {
	return R.engine.PooledObject.extend(/** @scope R.resources.types.Tile.prototype */{

	solidityMap: null,

   /** @private */
   constructor: function(name, tileObj, spriteResource, spriteLoader) {
      this.base(name, tileObj, spriteResource, 2, spriteLoader);
		this.solidityMap = R.resources.types.Tile.computeSolidityMap(this);
   },

	/**
	 * Destroy the sprite instance
	 */
	destroy: function() {
		this.base();
	},

   /**
    * Release the sprite back into the pool for reuse
    */
   release: function() {
      this.base();
   },


}, /** @scope R.resources.types.Tile.prototype */{
   /**
    * Gets the class name of this object.
    * @return {String} The string "R.resources.types.Tile"
    */
   getClassName: function() {
      return "R.resources.types.Tile";
   }   
});

}
