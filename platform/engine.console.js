/**
 * The Render Engine
 * Console
 * 
 * A class for logging messages.  If the FireBug, or FireBug Lite, extension
 * is installed, it will be used as an alternative to the console display.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 * @version: 0.1
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

var ConsoleRef = Base.extend({
   constructor: null,
   
   fix: function(msg) {
      return msg.replace(/\\n/g, "<br>").replace(/</g,"&lt;").replace(/>/g,"&gt;");
   },
   
   debug: function(msg) {
      Console.out("<span class='debug'>" + this.fix(Console.dump(msg)) + "</span>");
   },
   
   warn: function(msg) {
      Console.out("<span class='warn'>" + this.fix(Console.dump(msg)) + "</span>");
   },
   
   error: function(msg) {
      Console.out("<span class='error'>" + this.fix(Console.dump(msg)) + "</span>");
   }

});
 
var Console = Base.extend({
   constructor: null,

   consoleRef: null,
   
   DEBUGLEVEL_ERRORS:      0,
   DEBUGLEVEL_WARNINGS:    1,
   DEBUGLEVEL_DEBUG:       2,
   DEBUGLEVEL_VERBOSE:     3,
   DEBUGLEVEL_NONE:       -1,
      
   verbosity: this.DEBUGLEVEL_NONE,
   
   dumpWindow: null,

   startup: function() {
      if (window.console) {
         this.consoleRef = window.console;
      }
      else
      {
         this.consoleRef = ConsoleRef;
      }
   },
   
   out: function(msg) {
      if (this.dumpWindow === null)
      {
         this.dumpWindow = window.open("console", "width=640,height=480,resizeable=yes,toolbar=no,location=no,status=no");
         this.dumpWindow.document.body.innerHTML =
            "<style> " +
            "BODY { font-family: 'Lucida Console',Courier; font-size: 10pt; color: black; } " +
            ".debug { background: white; } " +
            ".warn { font-style: italics; background: #ffffdd; } " +
            ".error { color: white; background: red; font-weight: bold; } " +
            "</style>"
      }
      
      this.dumpWindow.document.body.innerHTML += this.dumpWindow.document.body.innerHTML + msg;
   },
   
   setDebugLevel: function(level) {
      this.verbosity = level; 
   },
   
   log: function(msg) {
      if (Engine.debugMode && this.verbosity <= this.DEBUGLEVEL_VERBOSE)
         this.consoleRef.debug(msg);
   },

   debug: function(msg) {
      if (Engine.debugMode && this.verbosity <= this.DEBUGLEVEL_DEBUG)
         this.consoleRef.debug(msg);
   },

   warn: function(msg) {
      if (Engine.debugMode && this.verbosity <= this.DEBUGLEVEL_WARNINGS)
         this.consoleRef.warn(msg);
   },

   error: function(msg) {
      if (Engine.debugMode && this.verbosity <= this.DEBUGLEVEL_ERRORS)
         this.consoleRef.error(msg);
   },
   
   dump: function(msg) {
      if (msg instanceof Array) 
      {
         var a = "[";
         for (var o in msg) {
            a += (a.length > 1 ? ", " : "") + Console.dump(msg[o]);
         }
         return a + "]";
      }
      else if (typeof msg === "function")
      {
         return "func[ " + msg.toString().substring(0,30) + "... ]";
      }
      else if (typeof msg === "object")
      {
         var a = "Object {\n";
         for (var o in msg)
         {
            a += o + ": " + Console.dump(msg[o]) + "\n";
         }
         return a + "\n}";
      }
      else
      {
         return msg;   
      }
   }
});

var Assert = function(test, error) {
   if (!test)
   {
      Engine.shutdown();
      throw new Error(error);
   }
};

var AssertWarn = function(test, warning) {
   if (!test)
   {
      Console.warn(warning);
   }
};

