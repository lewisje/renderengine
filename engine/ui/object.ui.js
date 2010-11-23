/**
 * The Render Engine
 * UI
 *
 * @fileoverview An extension of the <tt>HostObject</tt> which is specifically geared
 *               towards 2d game development.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 * @author: $Author$
 * @version: $Revision$
 *
 * Copyright (c) 2010 Brett Fattori (brettf@renderengine.com)
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

// Includes
Engine.include("/rendercontexts/context.htmldivcontext.js");

Engine.initObject("UI", "HTMLDivContext", function() {

/**
 * @class A user interface object.  Draws a user interface which a user
 * 		 can interact with.  The user interface is simply an HTML file which
 * 		 is lazy loaded via AHAH.
 * 
 * @param name {String} The name of the user interface
 * @constructor
 * @extends HTMLDivContext
 * @description Create a user interface
 */
var UI = HTMLDivContext.extend(/** @scope UI.prototype */{

	visible: null,
	loaded: false,
	url: null,

   /**
    * @private
    */
   constructor: function(name, url, width, height) {
		width = width || EngineSupport.sysInfo().viewWidth;
		height = height || EngineSupport.sysInfo().viewHeight;
		this.base(name, width, height);
		this.url = url;
		this.visible = false;
		this.getSurface().css("display", "none");
   },
	
	isVisible: function() {
		return this.visible;
	},
	
	show: function(fn) {
		if (!this.loaded) {
			var self = this;
			this.getSurface().load(url, function() {
				self.loaded = true;
				self._show(fn);
			})			
		} else {
			this._show(fn);
		}
	},

	_show: function(fn) {
		this.getSurface().css("display", "block");
		this.visible = true;
		if (fn) {
			fn.call(this.getElement());
		}
	},	

	
	hide: function(fn) {
		this.visible = false;
		this.getSurface().css("display", "none");	
		if (fn) {
			fn.call(this.getElement());
		}
	}

}, /** @scope UI.prototype */{
   /**
    * Get the class name of this object
    *
    * @return {String} "UI"
    */
   getClassName: function() {
      return "UI";
   }
	
});

return UIObject;

});