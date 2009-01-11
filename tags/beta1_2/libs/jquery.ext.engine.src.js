/**
 * The Render Engine
 * jQuery Extensions for The Render Engine
 *
 * @author: Brett Fattori (brettf@renderengine.com)
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

// Some new browser types we'd like to be able to detect
var userAgent = navigator.userAgent.toLowerCase();

$.extend(jQuery.browser, {
   chrome: /chrome/.test( userAgent ),
   Wii: /nintendo wii/.test( userAgent ),
   iPhone: /iphone/.test( userAgent) && /safari/.test( userAgent ),
	WiiMote: ((window.opera && window.opera.wiiremote) ? window.opera.wiiremote : null)
});

/* Addition of some selectors that jQuery doesn't provide:
 *
 * + ":in(X-Y)" - Select elements with an index between X and Y, inclusive.
 * + ":inx(X-Y)" - Select elements with an index between X and Y, exclusive.
 * + ":notin(X-Y)" - Select elements with an index outside X and Y, inclusive.
 * + ":notinx(X-Y)" - Select elements with an index outside X and Y, exclusive.
 */
jQuery.extend(jQuery.expr[':'],
{
	"in": function(a,i,m) {
				var l = parseInt(m[3].split("-")[0]);
				var h = parseInt(m[3].split("-")[1]);
				return (i >= l && i <= h);
			},
	"inx": function(a,i,m) {
				var l = parseInt(m[3].split("-")[0]);
				var h = parseInt(m[3].split("-")[1]);
				return (i > l && i < h);
			},
	"notin": function(a,i,m) {
				var l = parseInt(m[3].split("-")[0]);
				var h = parseInt(m[3].split("-")[1]);
				return (i <= l || i >= h);
			},
	"notinx": function(a,i,m) {
				var l = parseInt(m[3].split("-")[0]);
				var h = parseInt(m[3].split("-")[1]);
				return (i < l || i > h);
			},
	"siblings" : "jQuery(a).siblings(m[3]).length>0",
	"parents" : "jQuery(a).parents(m[3]).length>0"
});