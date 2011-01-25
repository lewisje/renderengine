/*!
 * The Render Engine is a Javascript game engine written from the ground
 * up to be easy to use and fully expandable.  It runs on a number of
 * browser platforms, including Gecko, Webkit, Chrome, and Opera.  Visit
 * http://www.renderengine.com for more information.
 *
 * author: Brett Fattori (brettf@renderengine.com)
 * version: @BUILD_VERSION
 * date: @BUILD_DATE
 *
 * Copyright (c) 2010 Brett Fattori
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
 * @namespace
 * The Render Engine namespace
 */
var R = R || {};

/**
 * List of namespaces declared in R
 * @private
 */
R._namespaces = {};

/**
 * The global namespace, typically the window object
 * @memberOf R
 * @type {Object}
 */
R.global = this;
	
/**
 * Declare a new namespace in R.
 * @param ns {String} The namespace to declare
 * @exception Throws an exception if the namespace is already declared
 * @memberOf R
 */
R.namespace = function(ns) {
	if (R._namespaces[ns]) {
		throw new Error("Namespace '" + ns + "' already defined!");
	}
	R._namespaces[ns] = 1;
	
	var path = ns.split("."), cur = R;
	for (var p; path.length && (p = path.shift());) {
		if (cur[p]) {
			cur = cur[p];
		} else {
			cur = cur[p] = {};
		}
	}
};

/**
 * Throw an "unsupported" exception for the given method in the class.
 * @param method {String} The method name
 * @param clazz {Class} The class object
 * @memberOf R
 * @exception Throws a "[method] is unsupported in [Class]" error
 */
R._unsupported = function(method, clazz) {
	throw new Error(method + " is unsupported in " + clazz.getClassName());	
};

/**
 * Check if the given object is undefined
 * @param obj {Object} The object to test
 * @return {Boolean}
 * @memberOf R
 */
R.isUndefined = function(obj) {
	return (typeof obj === "undefined");
};

/**
 * Test if the object is undefined, null, or a string and is empty
 * @param obj {Object} The object to test
 * @return {Boolean}
 * @memberOf R
 */
R.isEmpty = function(obj) {
	return R.isUndefined(obj) || obj === null || (typeof obj === "string" && $.trim(obj) === "");
};

/**
 * Make a simplified class object.
 * @param clazz {Object} Methods and fields to assign to the class prototype.  A special method, "<tt>constructor</tt>"
 *		will be used as the constructor function for the class, or an empty constructor will be assigned.
 * @param props {Object} Properties which are available on the object class.  The format is [getterFn, setterFn].  If
 *		either is null, the corresponding property accessor method will not be assigned.
 * @return {Function} A new
 * @memberOf R
 */
R.make = function(clazz, props) {
	// Get the constructor (if it exists)
	var c = clazz["constructor"] || function(){};
	if (clazz["constructor"]) {
		delete clazz["constructor"];
	}
	
	// Assign prototype fields and methods
	for (var fm in clazz) {
		c.prototype[fm] = clazz[fm];
	}
	
	// Set up properties
	if (props) {
		for (var p in props) {
			if (props[p][0]) {
				c.prototype.__defineGetter__(p, props[p][0]);
			}
			if (props[p][1]) {
				c.prototype.__defineSetter__(p, props[p][1]);
			}
		}
	}
	
	return c;
};

// Define the engine's default namespaces
R.namespace("debug");
R.namespace("lang");
R.namespace("struct");
R.namespace("math");
R.namespace("engine");
R.namespace("collision");
R.namespace("components");
R.namespace("objects");
R.namespace("particles");
R.namespace("physics");
R.namespace("physics.collision");
R.namespace("physics.collision.shapes");
R.namespace("physics.common");
R.namespace("physics.common.math");
R.namespace("physics.dynamics");
R.namespace("physics.dynamics.contacts");
R.namespace("physics.dynamics.joints");
R.namespace("rendercontexts");
R.namespace("resources");
R.namespace("resources.loaders");
R.namespace("resources.types");
R.namespace("sound");
R.namespace("spatial");
R.namespace("storage");
R.namespace("text");

/**
 * Return a new date object.
 * @return {Date}
 */
function now() {
	return new Date();
}

