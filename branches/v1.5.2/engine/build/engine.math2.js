/**
 * The Render Engine
 * Math2 Class
 *
 * @fileoverview A math static class which provides a method for generating
 * 				  pseudo random numbers.
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

/**
 * @class A static class which provides methods for generating random integers
 * 		 and floats between 0 and 1.  The class also provides a way to seed the
 * 		 random number generator for repeatable results.
 * 
 * @static
 */
var Math2 = Base.extend(/** @scope Math2.prototype */{
	constructor: null,
	
	state: 1,
	m: 0x100000000, // 2**32;
	a: 1103515245,
	c: 12345,
	
	/**
	 * Seed the random number generator with a known number.  This
	 * ensures that random numbers occur in a known sequence.
	 * 
	 * @param seed {Number} An integer to seed the number generator with
	 */
	seed: function(seed) {
		// LCG using GCC's constants
		this.state = seed ? seed : Math.floor(Math.random() * (this.m-1));
	},
	
	/**
	 * Returns a random integer between 0 and 4,294,967,296.
	 * @return {Number} An integer between 0 and 2^32
	 */
	randomInt: function() {
		this.state = (this.a * this.state + this.c) % this.m;
		return this.state;
	},
	
	/**
	 * Returns a pseudo-random number between 0 (inclusive) and 1 (exclusive)
	 * @return {Number} A number between 0 and 1
	 */
	random: function() {
		// returns in range [0,1]
		return this.randomInt() / (this.m - 1);
	},
	
	/**
	 * Return a random value within the <tt>low</tt> to <tt>hight</tt> range,
	 * optionally as an integer value only.
	 *
	 * @param low {Number} The low part of the range
	 * @param high {Number} The high part of the range
	 * @param int {Boolean} Return whole values only
	 * @return {Number}
	 */
	randomRange: function(low, high, int) {
		var v = low + (this.random() * high);
		return (int ? Math.floor(v) : v;
	},
	
	/**
	 * Parse a binary string into a number.
	 * 
	 * @param bin {String} Binary string to parse
	 * @return {Number}
	 */
	parseBin: function(bin) {
		if (!isNaN(bin)) {
			return parseInt(bin, 2);
		}
	},
	
	/**
	 * Converts a number to a hexidecimal string, prefixed by "0x".
	 *
	 * @param num {Number} The number to convert
	 * @return {String}
	 */
	toHex: function(num) {
		if (!isNaN(num)) {
			return ("0x" + num.toString(16));
		}
	},
	
	/**
	 * Converts a number to a binary string.
	 *
	 * @param num {Number} The number to convert
	 * @return {String}
	 */
	toBinary: function(num) {
		if (!isNaN(num)) {
			return num.toString(2);
		}
	}
});

// Seed the random number generator initially
Math2.seed();
