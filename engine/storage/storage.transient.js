/**
 * The Render Engine
 * TransientStorage
 *
 * @fileoverview A storage object where data only exists during the browser session.
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
Engine.include("/storage/storage.browser.js");

Engine.initObject("TransientStorage", "BrowserStorage", function() {

/**
 * @class <tt>TransientStorage</tt> is used to hold data that is used only
 * 	while the game is active.  Transient data is an alternative to using
 * 	a lot of local variables or object structures to store the data.
 * 	<p/>
 * 	Data is stored and retrieved using a SQL-like syntax.  For information
 * 	about the SQL syntax, see http://code.google.com/p/trimpath/wiki/TrimQuery
 * 
 * @param name {String} The name of the object
 * @extends BrowserStorage
 * @constructor
 * @description This class of storage is used to hold data during the current 
 * 	browser session only.
 */
var TransientStorage = BrowserStorage.extend(/** @scope TransientStorage.prototype */{

   enabled: null,

   /**
    * @private
    */
   constructor: function(name) {
      this.enabled = EngineSupport.sysInfo().support.storage.session;
      AssertWarn(this.enabled, "TransientStorage is not supported by browser - DISABLED");
      this.base(name);
   },

   /**
    * Release the object back into the object pool.
    */
   release: function() {
      this.base();
      this.enabled = null;
   },

	/**
	 * Initialize the storage object to the localStorage browser object
	 * @return {Object} The <tt>sessionStorage</tt> object
	 */
	initStorageObject: function() {
		return window.sessionStorage;
	}
	   
 }, /** @scope TransientStorage.prototype */{

   /**
    * Get the class name of this object
    *
    * @return {String} "TransientStorage"
    */
   getClassName: function() {
      return "TransientStorage";
   }
   
});

return TransientStorage;

});
