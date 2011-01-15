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
 */
R.global = this;
	
/**
 * Declare a new namespace in R.
 * @param ns {String} The namespace to declare
 * @exception Throws and exception if the namespace is already declared
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

R._unsupported = function(method, clazz) {
	throw new Error(method + " is unsupported in " + clazz.getClassName());	
};

R.isUndefined = function(obj) {
	return (typeof obj === "undefined");
};

R.isEmpty = function(val) {
	return R.isUndefined(obj) || obj === null || (typeof obj === "string" && /\s*/g.test(obj) === "");
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

