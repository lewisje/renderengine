/**
 * The Render Engine
 *
 * The startup library is a collection of methods which will
 * simplify the creation of other class files.  It is the starting
 * point of all libraries in the engine itself.
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

/**
 * @class ConsoleRef
 *
 * A stand-in class when Firebug or Firebug Lite are not installed.
 */
var ConsoleRef = Base.extend({
   constructor: null,

   dumpWindow: null,

   out: function(msg) {
      if (this.dumpWindow == null)
      {
         this.dumpWindow = window.open("", "console", "width=640,height=480,resizeable=yes,toolbar=no,location=no,status=no");
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

   dump: function(msg) {
      if (msg instanceof Array)
      {
         var a = "[";
         for (var o in msg) {
            a += (a.length > 1 ? ", " : "") + this.dump(msg[o]);
         }
         return a + "]";
      }
      else if (typeof msg === "function")
      {
         return "func[ " + this.fix(msg.toString().substring(0,30)) + "... ]";
      }
      else if (typeof msg === "object")
      {
         var a = "Object {\n";
         for (var o in msg)
         {
            a += o + ": " + this.dump(msg[o]) + "\n";
         }
         return a + "\n}";
      }
      else
      {
         return this.fix(msg);
      }
   },

   fix: function(msg) {
      return msg.replace(/\\n/g, "<br>").replace(/</g,"&lt;").replace(/>/g,"&gt;");
   },

   debug: function(msg) {
      this.out("<span class='debug'>" + this.dump(msg) + "</span>");
   },

   warn: function(msg) {
      this.out("<span class='warn'>" + this.dump(msg) + "</span>");
   },

   error: function(msg) {
      this.out("<span class='error'>" + this.dump(msg) + "</span>");
   }

});

/**
 * @class Console
 *
 * A class for logging messages.  If the FireBug, or FireBug Lite, extension
 * is installed, it will be used as an alternative to the console display.
 */
var Console = Base.extend({
   constructor: null,

   consoleRef: null,

   DEBUGLEVEL_ERRORS:      0,
   DEBUGLEVEL_WARNINGS:    1,
   DEBUGLEVEL_DEBUG:       2,
   DEBUGLEVEL_VERBOSE:     3,
   DEBUGLEVEL_NONE:       -1,

   verbosity: this.DEBUGLEVEL_NONE,

   startup: function() {
      if (window.console) {
         this.consoleRef = window.console;
      }
      else
      {
         this.consoleRef = ConsoleRef;
      }
   },

   setDebugLevel: function(level) {
      this.verbosity = level;
   },

   log: function(msg) {
      if (Engine.debugMode && this.verbosity == this.DEBUGLEVEL_VERBOSE)
         this.consoleRef.debug("    " + msg);
   },

   debug: function(msg) {
      if (Engine.debugMode && this.verbosity >= this.DEBUGLEVEL_DEBUG)
         this.consoleRef.debug(msg);
   },

   warn: function(msg) {
      if (Engine.debugMode && this.verbosity >= this.DEBUGLEVEL_WARNINGS)
         this.consoleRef.warn(msg);
   },

   error: function(msg) {
      if (this.verbosity >= this.DEBUGLEVEL_ERRORS)
         this.consoleRef.error(msg);
   }
});

// Start the console so logging can take place immediately
Console.startup();


/**
 * Halts if the test fails, throwing the error as a result.
 *
 * @param test {Boolean} A simple test that should evaluate to <tt>true</tt>
 * @param error {String} The error to throw if the test fails
 */
var Assert = function(test, error) {
   if (!test)
   {
      Engine.shutdown();
      throw new Error(error);
   }
};

/**
 * Reports a warning if the test fails.
 *
 * @param test {Boolean} A simple test that should evaluate to <tt>true</tt>
 * @param error {String} The warning to display if the test fails
 */
var AssertWarn = function(test, warning) {
   if (!test)
   {
      Console.warn(warning);
   }
};


/**
 * @class Engine
 *
 * The main engine class.
 */
var Engine = Base.extend({
   constructor: null,
   
   version: "1.0.0 (alpha)",

   idRef: 0,

   fpsClock: 33,

   livingObjects: 0,

   gameObjects: {},

   debugMode: false,

   defaultContext: null,

   running: false,

   loadedScripts: {},

   engineLocation: null,

   metrics: {},

   metricDisplay: null,

   showMetricsWindow: false,

   /**
    * Create an instance of an object, managed by the Engine.
    *
    * @param obj {BaseObject} A managed object within the engine
    * @return The global Id of the object
    * @type String
    */
   create: function(obj) {
      Assert((this.running == true), "Cannot create objects when the engine is not running!");
      this.idRef++;
      var objId = obj.getName() + this.idRef;
      this.gameObjects[objId] = obj;
      Console.log("Object " + objId + " created");
      this.livingObjects++;

      return objId;
   },

   /**
    * Destroys an object instance managed by the Engine.
    *
    * @param obj {BaseObject} The object, managed by the engine, to destroy
    */
   destroy: function(obj) {
      var objId = obj.getId();
      Console.log("Object " + objId + " destroyed");
      this.gameObjects[objId] = null;
      delete this.gameObjects[objId];
      this.livingObjects--;
   },

   /**
    * Get an object by it's Id that is managed by the Engine.
    *
    * @param id {String} The global Id of the object to locate
    * @return The object
    * @type BaseObject
    */
   getObject: function(id) {
      return this.gameObjects[id];
   },

   setDebugMode: function(mode) {
      this.debugMode = mode;
   },

   /**
    * Start the engine.  Creates a default context (the HTML document) and
    * initializes a timer to update the world managed by the engine.
    *
    * @param debugMode {Boolean} <tt>true</tt> to set the engine into debug mode
    *                            which allows the output of messages to the console.
    */
   startup: function(debugMode) {
      Assert((this.running == false), "An attempt was made to restart the engine!");

      this.upTime = new Date().getTime();
      this.debugMode = debugMode ? true : false;

      // Load the required scripts
      this.loadEngineScripts();

      this.running = true;

      Console.debug(">>> Engine started. " + (this.debugMode ? "[DEBUG]" : ""));

      // Start world timer
      Engine.globalTimer = window.setTimeout(function() { Engine.engineTimer(); }, this.fpsClock);
   },

   /**
    * Shutdown the engine.  Stops the global timer and cleans up (destroys) all
    * objects created and added to the world.
    */
   shutdown: function() {
      if (!this.running)
      {
         return;
      }

      Console.debug(">>> Engine shutting down...");

      // Stop world timer
      window.clearTimeout(Engine.globalTimer);

      if (this.metricDisplay)
      {
         this.metricDisplay.remove();
         this.metricDisplay = null;
      }

      this.downTime = new Date().getTime();
      Console.debug(">>> Engine stopped.  Runtime: " + (this.downTime - this.upTime) + "ms");

      this.running = false;
      for (var o in this.gameObjects)
      {
         this.gameObjects[o].destroy();
      }
      this.gameObjects = null;

      Assert((this.livingObjects == 0), "Object references not cleaned up!");
   },

   /**
    * Get the default rendering context for the Engine.
    *
    * @return The default rendering context
    * @type RenderContext
    */
   getDefaultContext: function() {
      return this.defaultContext;
   },

   /**
    * Load a script from the server and append it to
    * the head element of the browser.
    */
   loadScript: function(scriptPath) {
      Console.log("Loading script: " + scriptPath);

      var head = document.getElementsByTagName("head")[0];
      var n = document.createElement("script");

      n.src = scriptPath;
      n.type = "text/javascript";
      head.appendChild(n);
   },

   /**
    * Load a game script
    */
   loadGame: function(gameSource) {
      // Create the default context (the document)
      this.defaultContext = new DocumentContext();
      this.loadScript(gameSource);
   },

   /**
    * Load an engine script.
    */
   load: function(scriptSource) {
      if (this.engineLocation == null)
      {
         // Determine the path of the "engine.js" file
         var head = document.getElementsByTagName("head")[0];
         var scripts = head.getElementsByTagName("script");
         for (var x = 0; x < scripts.length; x++)
         {
            var src = scripts[x].src;
            if (src != null && src.indexOf("/platform/engine.js") != -1)
            {
               // Get the path
               this.engineLocation = src.match(/(.*)\/platform\/engine\.js/)[1];
               break;
            }
         }
      }

      var s = scriptSource.replace(/[\/\.]/g,"_");
      if (this.loadedScripts[s] == null)
      {
         this.loadedScripts[s] = scriptSource;
         this.loadScript(this.engineLocation + scriptSource);
      }
   },
   
   /**
    * Load scripts required by the engine to run.
    * @private
    */
   loadEngineScripts: function() {
      
      // Engine platform
      this.load("/platform/engine.math2d.js");
      this.load("/platform/engine.game.js");
      this.load("/platform/engine.baseobject.js");
      this.load("/platform/engine.timers.js");
      this.load("/platform/engine.container.js");
      this.load("/platform/engine.rendercontext.js");
      this.load("/platform/engine.hostobject.js");
      this.load("/platform/engine.resourceloader.js");
      this.load("/platform/engine.events.js");

      // Contexts
      this.load("/rendercontexts/context.render2d.js");
      this.load("/rendercontexts/context.documentcontext.js");

      // Object components
      this.load("/components/component.base.js");
   },

   /**
    * Dump the list of scripts loaded by the Engine.
    */
   dumpScripts: function() {
      for (var f in this.loadedScripts)
      {
         Console.debug(this.loadedScripts[f]);
      }
   },

   /**
    * Set the FPS the engine runs at
    *
    * @param fps {Number} The number of frames per second to refresh
    *                     Engine objects.
    */
   setFPS: function(fps) {
      Assert((fps != 0), "You cannot have a framerate of zero!");
      this.fpsClock = Math.floor(1000 / fps);
   },

   /**
    * The global engine timer which updates the world.
    */
   engineTimer: function() {
      var b = new Date().getTime();

      // Update the world
      if (Engine.getDefaultContext() != null)
      {
         Engine.getDefaultContext().update(null, new Date().getTime());

         if (this.showMetricsWindow)
         {
            var d = new Date().getTime() - b;
            Engine.addMetric("FPS", Math.floor((1 / this.fpsClock) * 1000));
            Engine.addMetric("rTime", d + "ms");
            Engine.addMetric("load", Math.floor((d / this.fpsClock) * 100) + "%");

            this.updateMetrics();
         }
      }

      // Another process interval
      Engine.globalTimer = window.setTimeout(function() { Engine.engineTimer(); }, this.fpsClock);
   },

   /**
    * Add a metric to the game engine that can be displayed
    * while it is running.
    *
    * @param metricName {String} The name of the metric to track
    * @param value {String/Number} The value of the metric
    */
   addMetric: function(metricName, value) {
      this.metrics[metricName] = value;
   },

   /**
    * Remove a metric from the display
    *
    * @param metricName {String} The name of the metric to remove
    */
   removeMetric: function(metricName) {
      this.metrics[metricName] = null;
      delete this.metrics[metricName];
   },

   toggleMetrics: function() {
      this.showMetricsWindow = !this.showMetricsWindow;

      if (this.showMetricsWindow && !this.metricDisplay)
      {
         this.metricDisplay = jQuery("<div/>").addClass("metrics");
         this.metricDisplay.appendTo($("body"));
      }


      if (!this.showMetricsWindow && this.metricDisplay)
      {
         this.metricDisplay.remove();
         this.metricDisplay = null;
      }
   },

   updateMetrics: function() {
      var h = "";
      for (var m in this.metrics)
      {
         h += m + ": " + this.metrics[m] + "<br/>";
      }
      this.metricDisplay.html(h);
   },
   
   /**
    * Prints the version of the engine
    */
   toString: function() {
      return "The Render Engine " + this.version;
   }

 }, { // Interface
   globalTimer: null

 });
 
// Start the engine
Engine.startup();

