/**
 * The Render Engine
 * Library Loader
 *
 * Loads all basic scripts for the engine.  These scripts are the foundation
 * of The Render Engine game platform.  Additional components can be loaded,
 * as-needed, by the game engine when a game initializes.  This keeps the memory
 * requirements low.
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

// Engine platform
Engine.load("/platform/engine.math2d.js");
Engine.load("/platform/engine.game.js");
Engine.load("/platform/engine.baseobject.js");
Engine.load("/platform/engine.timers.js");
Engine.load("/platform/engine.container.js");
Engine.load("/platform/engine.rendercontext.js");
Engine.load("/platform/engine.hostobject.js");
Engine.load("/platform/engine.resourceloader.js");

// Contexts
Engine.load("/rendercontexts/context.render2d.js");
Engine.load("/rendercontexts/context.documentcontext.js");

// Object components
Engine.load("/components/component.base.js");
