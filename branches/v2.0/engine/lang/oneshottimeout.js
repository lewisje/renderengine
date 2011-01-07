/**
 * The Render Engine
 * OneShotTimeout
 *
 * @fileoverview A single interval timeout timer which self-destroys.
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

// The class this file defines and its required classes
R.Engine.define({
	"class": "R.lang.OneShotTimeout",
	"requires": [
		"R.lang.Timeout"
	]
});

/**
 * @class An extension of {@link Timeout} which is a one-shot timer that cannot 
 *        be restarted and will self-destroy after it completes its interval.  Within
 *        the callback, <tt>this</tt> refers to the <tt>Timer</tt> object itself.
 *
 * @param name {String} The name of the timer
 * @param interval {Number} The interval for the timer, in milliseconds
 * @param callback {Function} The function to call when the interval is reached
 * @constructor
 * @extends R.leng.Timeout
 * @description Create a one-shot timeout
 */
R.lang.OneShotTimeout = function(){
	return R.lang.Timeout.extend(/** @scope R.lang.OneShotTimeout.prototype */{
	
		/**
		 * @private
		 */
		constructor: function(name, interval, callback){
		
			var cb = function(){
				arguments.callee.cbFn.call(this);
				this.destroy();
			};
			cb.cbFn = callback;
			
			this.base(name, interval, cb);
		},
		
		/**
		 * This timer cannot be restarted.
		 * @private
		 */
		restart: function(){
			if (!this.paused && this.running) {
				return;
			}
			
			this.base();
		}
	}, /** @scope R.lang.OneShotTimeout.prototype */ {
	
		/**
		 * Get the class name of this object
		 * @return {String} "R.lang.OneShotTimeout"
		 */
		getClassName: function(){
			return "R.lang.OneShotTimeout";
		}
	});
	
}