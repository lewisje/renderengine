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
 * @class A stand-in class when other debugger output options are not
 *        available.  This object is created, as necessary, by the
 *        {@link Console}
 */
var ConsoleRef = Base.extend(/** @scope ConsoleRef.prototype */{
   constructor: null,

   dumpWindow: null,

   /** @private */
   out: function(msg) {
      if (this.dumpWindow == null)
      {
         this.dumpWindow = window.open("about:blank", "console", "width=640,height=480,resizeable=yes,toolbar=no,location=no,status=no");
         this.dumpWindow.document.body.innerHTML =
            "<style> " +
            "BODY { font-family: 'Lucida Console',Courier; font-size: 10pt; color: black; } " +
            ".debug { background: white; } " +
            ".warn { font-style: italics; background: #ffffdd; } " +
            ".error { color: white; background: red; font-weight: bold; } " +
            "</style>"
      }

      // Using jQuery to handle adding new messages
      $(this.dumpWindow.document.body).append(msg);

      // this.dumpWindow.document.body.innerHTML += this.dumpWindow.document.body.innerHTML + msg;
   },

   /** @private */
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

   /** @private */
   fix: function(msg) {
      return msg.replace(/\\n/g, "<br>").replace(/</g,"&lt;").replace(/>/g,"&gt;");
   },

   /**
    * Write a debug message to the console
    * @param msg {String} The message to write
    */
   debug: function(msg) {
      this.out("<span class='debug'>" + this.dump(msg) + "</span>");
   },

   info: function(msg) {
      this.debug(msg);
   },

   /**
    * Write a warning message to the console
    * @param msg {String} The message to write
    */
   warn: function(msg) {
      this.out("<span class='warn'>" + this.dump(msg) + "</span>");
   },

   /**
    * Write an error message to the console
    * @param msg {String} The message to write
    */
   error: function(msg) {
      this.out("<span class='error'>" + this.dump(msg) + "</span>");
   }

});

/**
 * @class An Opera specific implementation which redirects output to the <tt>postError()</tt>
 *        method of the <tt>opera</tt> object.  This object is created, as necessary, by the
 *        {@link Console}
 * @extends ConsoleRef
 */
var OperaConsoleRef = ConsoleRef.extend(/** @OperaConsole.prototype **/{
   constructor: null,

   /**
    * Write a debug message to the console
    * @param msg {String} The message to write
    */
   debug: function(msg) {
      if (window.opera)
         window.opera.postError("[ DEBUG ] " + msg);
   },

   /**
    * Write a warning message to the console
    * @param msg {String} The message to write
    */
   warn: function(msg) {
      if (window.opera)
         window.opera.postError("[ WARN ] " + msg);
   },

   /**
    * Write an error message to the console
    * @param msg {String} The message to write
    */
   error: function(msg) {
      if (window.opera)
         window.opera.postError("[!!! ERROR !!!] " + msg);
   }
});

/**
 * @class A class for logging messages to a console reference object.  There are
 *        currently three supported console references:
 *        <ul>
 *        <li>Firebug - logs to the Firebug/Firebug Lite error console</li>
 *        <li>OperaConsoleRef - logs to the Opera error console</li>
 *        <li>ConsoleRef - A simple popup window for logging messages</li>
 *        </ul>
 */
var Console = Base.extend(/** @scope Console.prototype */{
   constructor: null,

   consoleRef: null,

   DEBUGLEVEL_ERRORS:      0,
   DEBUGLEVEL_WARNINGS:    1,
   DEBUGLEVEL_DEBUG:       2,
   DEBUGLEVEL_VERBOSE:     3,
   DEBUGLEVEL_NONE:       -1,

   verbosity: this.DEBUGLEVEL_NONE,

   /**
    * Start up the console.
    */
   startup: function() {
      if (window.console) {
         // Firebug
         this.consoleRef = window.console;
      }
      else if (window.opera && window.opera.postError)
      {
         // Opera console
         this.consoleRef = OperaConsoleRef;
      }
      else
      {
         // Default (simple popup window)
         this.consoleRef = ConsoleRef;
      }
   },

   /**
    * Set the debug output level of the console.  The available levels are:
    * <ul>
    * <li>Console.DEBUGLEVEL_ERRORS = 0</li>
    * <li>Console.DEBUGLEVEL_WARNINGS = 1</li>
    * <li>Console.DEBUGLEVEL_DEBUG = 2</li>
    * <li>Console.DEBUGLEVEL_VERBOSE = 3</li>
    * <li>Console.DEBUGLEVEL_NONE = -1</li>
    * </ul>
    * Messages of the same (or lower) level as the specified level will be logged.
    * For instance, if you set the level to DEBUGLEVEL_DEBUG, errors and warnings
    * will also be logged.  The engine must also be in debug mode for warnings,
    * debug, and log messages to be output.
    *
    * @param level {Number} One of the debug levels.  Defaults to DEBUGLEVEL_NONE.
    */
   setDebugLevel: function(level) {
      this.verbosity = level;
   },

   /**
    * Outputs a log message.  These messages will only show when DEBUGLEVEL_VERBOSE is the level.
    *
    * @param msg {String} The message to output
    */
   log: function(msg) {
      if (Engine.debugMode && this.verbosity == this.DEBUGLEVEL_VERBOSE)
         this.consoleRef.debug("    " + msg);
   },

   /**
    * Outputs a debug message.  These messages will only show when DEBUGLEVEL_DEBUG is the level.
    *
    * @param msg {String} The message to output
    */
   debug: function(msg) {
      if (Engine.debugMode && this.verbosity >= this.DEBUGLEVEL_DEBUG)
         this.consoleRef.info(msg);
   },

   /**
    * Outputs a warning message.  These messages will only show when DEBUGLEVEL_WARNINGS is the level.
    *
    * @param msg {String} The message to output
    */
   warn: function(msg) {
      if (Engine.debugMode && this.verbosity >= this.DEBUGLEVEL_WARNINGS)
         this.consoleRef.warn(msg);
   },

   /**
    * Output an error message.  These messages will only show when DEBUGLEVEL_ERRORS is the level.
    *
    * @param msg {String} The message to output
    */
   error: function(msg) {
      if (this.verbosity >= this.DEBUGLEVEL_ERRORS)
         this.consoleRef.error(msg);
   }
});

// Start the console so logging can take place immediately
Console.startup();


/**
 * Halts the engine if the test fails, throwing the error as a result.
 *
 * @param test {Boolean} A simple test that should evaluate to <tt>true</tt>
 * @param error {String} The error message to throw if the test fails
 */
var Assert = function(test, error) {
   if (!test)
   {
      Engine.shutdown();
      if (this.caller) {
         var funcName = "";
         if (this.caller.name)
         {
            funcName = this.caller.name;
         }
         else
         {
            // Try to determine the function name that called this Assert
            var fRE = /((function\s+([\$_\.\w]+))|(var\s+([\$_\.\w]+)\s+=\s+function)|(function\(.*?\)))/;
            var m = fRE.exec(this.caller.toString());
            if (m)
            {
               funcName = (m[3] || m[5] || "anonymous");
            }
         }
         error += "\nin function " + funcName;
      }
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
var Engine = Base.extend(/** @scope Engine.prototype */{
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
    * @memberOf Engine
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
    * @memberOf Engine
    */
   destroy: function(obj) {
      Assert((obj != null), "Trying to destroy non-existent object!");
      var objId = obj.getId();
      Assert((this.gameObjects[objId] != null), "Attempt to destroy missing object!");
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
    * @memberOf Engine
    */
   getObject: function(id) {
      return this.gameObjects[id];
   },

   /**
    * Set the debug mode of the engine.  Affects message ouput and
    * can be queried for additional debugging operations.
    *
    * @param mode {Boolean} <tt>true</tt> to debug the engine
    * @memberOf Engine
    */
   setDebugMode: function(mode) {
      this.debugMode = mode;
   },

   /**
    * Query the debugging mode of the engine.
    *
    * @type Boolean
    * @memberOf Engine
    */
   getDebugMode: function() {
      return this.debugMode;
   },

   /**
    * Starts the engine and initializes the timer to update the
    * world managed by the engine.
    *
    * @param debugMode {Boolean} <tt>true</tt> to set the engine into debug mode
    *                            which allows the output of messages to the console.
    * @memberOf Engine
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
    * objects that have been created and added to the world.
    * @memberOf Engine
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
    * @memberOf Engine
    */
   getDefaultContext: function() {
      return this.defaultContext;
   },

   /**
    * Load a script from the server and append it to
    * the head element of the browser.  Script names are
    * cached so they will not be loaded again.
    *
    * @param scriptPath {String} The URL of a script to load.
    * @memberOf Engine
    */
   loadScript: function(scriptPath) {
      Console.log("Loading script: " + scriptPath);

      var s = scriptPath.replace(/[\/\.]/g,"_");
      if (this.loadedScripts[s] == null)
      {
         // A hack to allow us to do filesystem testing
         if (!window.localDebugMode)
         {
            jQuery.getScript(scriptPath);
         }
         else
         {
            // If we're running locally, don't use jQuery.  This
            // allows us to see the loaded scripts.
            var head = document.getElementsByTagName("head")[0];
            var n = document.createElement("script");
            n.src = scriptPath;
            n.type = "text/javascript";
            head.appendChild(n);
         }

         // Store the request in the cache
         this.loadedScripts[s] = scriptPath;
      }
   },

   /**
    * Load a game script.  Creates the default rendering context
    * also.
    *
    * @param gameSource {String} The URL of the game script.
    * @memberOf Engine
    */
   loadGame: function(gameSource) {
      // Create the default context (the document)
      this.defaultContext = new DocumentContext();
      this.loadScript(gameSource);
   },

   /**
    * Load a script relative to the engine path.
    *
    * @param scriptSource {String} A URL to load that is relative to the engine path.
    * @memberOf Engine
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

      this.loadScript(this.engineLocation + scriptSource);
   },

   /**
    * Get the path to the engine.
    * @type String
    */
   getEnginePath: function() {
      return this.engineLocation;
   },

   /**
    * Load the scripts required for the engine to run.
    * @private
    * @memberOf Engine
    */
   loadEngineScripts: function() {

      // Engine platform
      this.load("/platform/engine.support.js");
      this.load("/platform/engine.math2d.js");
      this.load("/platform/engine.game.js");
      this.load("/platform/engine.baseobject.js");
      this.load("/platform/engine.timers.js");
      this.load("/platform/engine.container.js");
      this.load("/platform/engine.hashcontainer.js");
      this.load("/platform/engine.rendercontext.js");
      this.load("/platform/engine.hostobject.js");
      this.load("/platform/engine.object2d.js");
      this.load("/platform/engine.resourceloader.js");
      this.load("/platform/engine.events.js");
      this.load("/platform/engine.spatialcontainer.js");
      this.load("/platform/engine.particles.js");

      // Contexts
      this.load("/rendercontexts/context.render2d.js");
      this.load("/rendercontexts/context.documentcontext.js");

      // Object components
      this.load("/components/component.base.js");

      // Resource loaders
      this.load("/resourceloaders/loader.image.js");
      this.load("/resourceloaders/loader.bitmapfont.js");

      // Text rendering
      this.load("/textrender/text.renderer.js");
      this.load("/textrender/text.abstractrender.js");
   },

   /**
    * Output the list of scripts loaded by the Engine to the console.
    * @memberOf Engine
    */
   dumpScripts: function() {
      for (var f in this.loadedScripts)
      {
         Console.debug(this.loadedScripts[f]);
      }
   },

   /**
    * Clears the script name cache.  Allows scripts to be loaded
    * again.  Use this method with caution, as it is not recommended
    * to load a script if the object is in use.  May cause unexpected
    * results.
    * @memberOf Engine
    */
   clearScriptCache: function() {
      this.loadedScripts = {};
   },

   /**
    * Set the FPS the engine runs at
    *
    * @param fps {Number} The number of frames per second to refresh
    *                     Engine objects.
    * @memberOf Engine
    */
   setFPS: function(fps) {
      Assert((fps != 0), "You cannot have a framerate of zero!");
      this.fpsClock = Math.floor(1000 / fps);
   },

   /**
    * The global engine timer which updates the world.
    * @private
    * @memberOf Engine
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
    * @memberOf Engine
    */
   addMetric: function(metricName, value) {
      this.metrics[metricName] = value;
   },

   /**
    * Remove a metric from the display
    *
    * @param metricName {String} The name of the metric to remove
    * @memberOf Engine
    */
   removeMetric: function(metricName) {
      this.metrics[metricName] = null;
      delete this.metrics[metricName];
   },

   /**
    * Toggle the display of the metrics window.  Any metrics
    * that are being tracked will be reported in this window.
    * @memberOf Engine
    */
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

   /**
    * Updates the display of the metrics window.
    * @private
    * @memberOf Engine
    */
   updateMetrics: function() {
      var h = "";
      for (var m in this.metrics)
      {
         h += m + ": " + this.metrics[m] + "<br/>";
      }
      this.metricDisplay.html(h);
   },

   /**
    * Prints the version of the engine.
    * @memberOf Engine
    */
   toString: function() {
      return "The Render Engine " + this.version;
   }

 }, { // Interface
   globalTimer: null

 });

// Start the engine
Engine.startup();

