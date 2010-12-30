
/**
 * The Render Engine
 * Engine initialization
 *
 * @fileoverview Initializes the console and engine
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

// Start the console so logging can take place immediately
Console.startup();

// Default engine options
Engine.defaultOptions = {
   skipFrames: true,													// Skip missed frames
   billboards: true,													// Use billboards to speed up rendering
   hardwareAccel: false,											// Hardware acceleration flag
   pointAsArc: true,													// Draw points as arcs or rectangles
	transientMathObject: false,									// Transient (non-pooled) MathObjects
	useDirtyRectangles: false										// Enable canvas dirty rectangles redraws
};


// Start the engine
Engine.options = $.extend({}, Engine.defaultOptions);
Engine.startup();

// Set up the engine using whatever query params were passed
Engine.setDebugMode(EngineSupport.checkBooleanParam("debug"));

if (Engine.getDebugMode())
{
   Console.setDebugLevel(EngineSupport.getNumericParam("debugLevel", Console.DEBUGLEVEL_DEBUG));
}

// Local mode keeps loaded script source available
Engine.localMode = EngineSupport.checkBooleanParam("local");
