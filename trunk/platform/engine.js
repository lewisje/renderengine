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
   combiner: function() {
      var out = "";
      for (var a in arguments) {
         out += arguments[a].toString();
      }
      return out;
   },

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
   debug: function() {
      this.out("<span class='debug'>" + this.dump(arguments) + "</span>");
   },

   info: function() {
      this.debug(arguments);
   },

   /**
    * Write a warning message to the console
    * @param msg {String} The message to write
    */
   warn: function() {
      this.out("<span class='warn'>" + this.dump(arguments) + "</span>");
   },

   /**
    * Write an error message to the console
    * @param msg {String} The message to write
    */
   error: function() {
      this.out("<span class='error'>" + this.dump(arguments) + "</span>");
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
   info: function() {
      if (window.opera)
         window.opera.postError("[ INFO ] " + this.dump(arguments));
   },

   /**
    * Write a debug message to the console
    * @param msg {String} The message to write
    */
   debug: function() {
      if (window.opera)
         window.opera.postError("[ DEBUG ] " + this.dump(arguments));
   },

   /**
    * Write a warning message to the console
    * @param msg {String} The message to write
    */
   warn: function() {
      if (window.opera)
         window.opera.postError("[ WARN ] " + this.dump(arguments));
   },

   /**
    * Write an error message to the console
    * @param msg {String} The message to write
    */
   error: function() {
      if (window.opera)
         window.opera.postError("[!!! ERROR !!!] " + this.dump(arguments));
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
   log: function() {
      if (Engine.debugMode && this.verbosity == this.DEBUGLEVEL_VERBOSE)
         this.consoleRef.debug.apply(this.consoleRef, arguments);
   },

   /**
    * Outputs a debug message.  These messages will only show when DEBUGLEVEL_DEBUG is the level.
    *
    * @param msg {String} The message to output
    */
   debug: function() {
      if (Engine.debugMode && this.verbosity >= this.DEBUGLEVEL_DEBUG)
         this.consoleRef.info.apply(this.consoleRef, arguments);
   },

   /**
    * Outputs a warning message.  These messages will only show when DEBUGLEVEL_WARNINGS is the level.
    *
    * @param msg {String} The message to output
    */
   warn: function() {
      if (Engine.debugMode && this.verbosity >= this.DEBUGLEVEL_WARNINGS)
         this.consoleRef.warn.apply(this.consoleRef, arguments);
   },

   /**
    * Output an error message.  These messages will only show when DEBUGLEVEL_ERRORS is the level.
    *
    * @param msg {String} The message to output
    */
   error: function() {
      if (this.verbosity >= this.DEBUGLEVEL_ERRORS)
         this.consoleRef.error.apply(this.consoleRef, arguments);
   }
});


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
 * @class Engine support class.  Provides extra functions the engine, or games,
 *        can use.
 */
var EngineSupport = Base.extend(/** @scope EngineSupport.prototype */{
   constructor: null,

   /**
    * Remove an element from an array.
    *
    * @param array {Array} The array to modify
    * @param obj {Object} The object to remove
    */
   arrayRemove: function(array, obj) {
      var idx = -1;
      if (Array.prototype.indexOf) {
         idx = array.indexOf(obj);
      }
      else
      {
         for (var o in array) {
            if (array[o] == obj) {
               idx = o;
               break;
            }
         }
      }

      if (idx != -1)
      {
         array.splice(idx, 1);
      }
   },

   /**
    * Executes a callback for each element within an array.
    *
    * @param array {Array} The array to operate on
    * @param fn {Function} The function to apply to each element
    * @param [thisp] {Object} An optional "this" pointer to use in the callback
    */
   forEach: function(array, fn, thisp) {

      if (Array.prototype.forEach) {
         array.forEach(fn, thisp);
      }
      else
      {
         var len = array.length;
         if (typeof fn != "function")
            throw new TypeError();

         for (var i = 0; i < len; i++)
         {
            if (i in array)
               fn.call(thisp, array[i], i, array);
         }
      }
   },

   /**
    * Get the path from a fully qualified URL.
    *
    * @param url {String} The URL
    * @type String
    */
   getPath: function(url) {
      var l = url.lastIndexOf("/");
      return url.substr(0, l);
   },

   /**
    * Get the query parameters from the window location object.
    *
    * @type Object
    */
   getQueryParams: function() {
      var parms = {};
      var p = window.location.toString().split("?")[1];
      if (p)
      {
         p = p.split("&");
         for (var x = 0; x < p.length; x++)
         {
            var v = p[x].split("=");
            parms[v[0]] = (v.length > 1 ? v[1] : "");
         }
      }
      return parms;
   },

   /**
    * Returns specified object as a JavaScript Object Notation (JSON) string.
    *
    * Code to handle "undefined" type was delibrately not implemented, being that it is not part of JSON.
    * "undefined" type is casted to "null".
    *
    * @param object {Object} Must not be undefined or contain undefined types and variables.
    * @return String
    */
   toJSONString: function(o)
   {
      if(o == null)
      {
         return "null";
      }

      switch(o.constructor)
      {
         case Array:
            var a = [], i;
            for(i = 0; i < o.length; i++)
            {
               a[i] = EngineSupport.toJSONString(o[i]);
            }
            return "[" + a.join() + "]";
         case String:
            return EngineSupport.quoteString(o);
         case Boolean:
         case Number:
            return o.toString();
         default:
            var a = [], i;
            for(i in o)
            {
               if(o[i] == null)
               {
                  a.push(i.quote() + ":null");
               }
               else if(o[i].constructor != Function)
               {
                  a.push(i.quote() + ':' + EngineSupport.toJSONString(o[i]));
               }
            }
            return '{' + a.join() + '}';
      }
   },

   /**
    * Parses specified JavaScript Object Notation (JSON) string back into its corresponding object.
    *
    * @param jsonString
    * @return Object
    * @see http://www.json.org
    */
   parseJSONString: function(jsonString)
   {
      var obj = null;
      eval.call(arguments.callee, 'obj = (function(){return ' + jsonString + ';})();');
      return obj;
   },

   /**
    * Return a string, enclosed in quotes.
    *
    * @param string
    * @type String
    */
   quoteString: function(o)
   {
      return '"'+this.replace(/[\\"\r\n]/g, function(s)
         {
            switch(s)
            {
               case "\\":return "\\\\";
               case "\r":return "\\r";
               case "\n":return "\\n";
               case '"':return '\\"';
            }
         }
      )+'"';
   },
});

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

   metricSampleRate: 10,

   lastMetricSample: 10,

   showMetricsWindow: false,

   worldTime: 0,

   soundsEnabled: false,

   queuePaused:false,

   pauseReps: 0,

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
      Console.log("CREATED Object ", objId, "[", obj, "]");
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
      Console.log("DESTROYED Object ", objId, "[", obj, "]");
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
    * Returns <tt>true</tt> if SoundManager2 is loaded and initialized
    * properly.  The resource loader and play manager will use this
    * value to execute properly.
    * @return <tt>true</tt> if the sound engine was loaded properly
    * @memberOf Engine
    */
   isSoundEnabled: function() {
      return this.soundsEnabled;
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
   },

   /**
    * Runs the engine.  This will be called after all scripts have been loaded.
    * You will also need to call this if you pause the engine.
    * @memberOf Engine
    */
   run: function() {
      Console.warn(">>> Engine started. " + (this.debugMode ? "[DEBUG]" : ""));
      this.running = true;

      // Start world timer
      Engine.globalTimer = window.setTimeout(function() { Engine.engineTimer(); }, this.fpsClock);

   },

   /**
    * Pause the engine.
    * @memberOf Engine
    */
   pause: function() {
      Console.warn(">>> Engine paused <<<");
      this.running = false;
   },

   /**
    * Shutdown the engine.  Stops the global timer and cleans up (destroys) all
    * objects that have been created and added to the world.
    * @memberOf Engine
    */
   shutdown: function() {
      if (!this.running)
      {
         this.running = true;
         setTimeout(function() { Engine.shutdown(); }, 10);
      }

      Console.warn(">>> Engine shutting down...");

      // Stop world timer
      window.clearTimeout(Engine.globalTimer);

      if (this.metricDisplay)
      {
         this.metricDisplay.remove();
         this.metricDisplay = null;
      }

      // Stop the sound manager
      Engine.soundManager.destruct();

      this.downTime = new Date().getTime();
      Console.warn(">>> Engine stopped.  Runtime: " + (this.downTime - this.upTime) + "ms");

      this.running = false;
      for (var o in this.gameObjects)
      {
         this.gameObjects[o].destroy();
      }
      this.gameObjects = null;

      Assert((this.livingObjects == 0), "Object references not cleaned up!");

      // Perform final cleanup
      this.cleanup();
   },

   /**
    * After a successful shutdown, we need to clean up all of the objects
    * that were created on the window object by the engine.
    * @memberOf Engine
    * @private
    */
   cleanup: function() {
      // Remove the body contents
      $(document.body).empty();

      // Remove all scripts from the <head>
      $("head script", document).remove();
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
    * Load a stylesheet and append it to the document.  Allows for
    * scripts to specify additional stylesheets that can be loaded
    * as needed.
    *
    * @param stylesheetPath {String} Path to the stylesheet, relative to
    *                                the engine path.
    */
   loadStylesheet: function(stylesheetPath) {
      stylesheetPath = this.getEnginePath() + stylesheetPath;
      var f = function() {
         var n = document.createElement("link");
         n.rel = "stylesheet";
         n.href = stylesheetPath;
         n.type = "text/css";
         $(n).load(function() {
            Console.debug("Stylesheet loaded '" + stylesheetPath + "'");
            Engine.readyForNextScript = true;
         });
         var h = document.getElementsByTagName("head")[0];
         h.appendChild(n);
      };

      this.setQueueCallback(f);
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
      var s = scriptPath.replace(/[\/\.]/g,"_");
      if (this.loadedScripts[s] == null)
      {
         // Store the request in the cache
         this.loadedScripts[s] = scriptPath;

         if (!Engine.scriptQueue) {
            // Create the queue
            Engine.scriptQueue = [];
         }

         // Put script into load queue
         Engine.scriptQueue.push(scriptPath);

         if (!Engine.scriptQueueTimer) {
            // Process any waiting scripts
            Engine.scriptQueueTimer = setInterval(function() {
               if (Engine.queuePaused) {
                  if (Engine.pauseReps++ > 500) {
                     // If after ~5 seconds the queue is still paused, unpause it and
                     // warn the user that the situation occurred
                     Console.error("Script queue was paused for 5 seconds and not resumed -- restarting...");
                     Engine.pauseReps = 0;
                     Engine.pauseQueue(false);
                  }
                  return;
               }

               Engine.pauseReps = 0;

               if (Engine.scriptQueue.length > 0) {
                  Engine.processScriptQueue();
               } else {
                  // Stop the queue timer if there are no scripts
                  clearInterval(Engine.scriptQueueTimer);
                  Engine.scriptQueueTimer = null;
               }
            }, 10);

            Engine.readyForNextScript = true;
         }
      }
   },

   /**
    * Put a callback into the script queue so that when a
    * certain number of files has been loaded, we can call
    * a method.  Allows for functionality to start with
    * incremental loading.
    *
    * @param cb {Function} A callback to execute
    * @memberOf Engine
    */
   setQueueCallback: function(cb) {
      if (!Engine.scriptQueue) {
         // Create the queue
         Engine.scriptQueue = [];
      }

      // Put callback into load queue
      Engine.scriptQueue.push(cb);
   },

   /**
    * You can pause the queue from a callback function, then
    * unpause it to continue processing queued scripts.  This will
    * allow you to wait for an event to occur before continuing to
    * to load scripts.
    *
    * @param state {Boolean} <tt>true</tt> to put the queue processor
    *                        in a paused state.
    */
   pauseQueue: function(state) {
      Engine.queuePaused = state;
   },

   /**
    * Process any scripts that are waiting to be loaded.
    * @private
    * @memberOf Engine
    */
   processScriptQueue: function() {
      if (Engine.scriptQueue.length > 0 && Engine.readyForNextScript) {

         // Hold the queue until the script is loaded
         Engine.readyForNextScript = false;

         // Get next script...
         var scriptPath = Engine.scriptQueue.shift();

         // If the queue element is a function, execute it and return
         if (typeof scriptPath == "function") {
            scriptPath();
            Engine.readyForNextScript = true;
            return;
         }

         // A hack to allow us to do filesystem testing
         if (!window.localDebugMode)
         {
            jQuery.getScript(scriptPath, function() {
               Console.debug("Loaded '" + scriptPath + "'");
               Engine.readyForNextScript = true;
            });
         }
         else
         {
            // If we're running locally, don't use jQuery to get the script.
            // This allows us to see and debug the loaded scripts.
            var n = document.createElement("script");
            n.src = scriptPath;
            n.type = "text/javascript";
            $(n).load(function() {
               Console.debug("Loaded '" + scriptPath + "'");
               Engine.readyForNextScript = true;
            });
            var h = document.getElementsByTagName("head")[0];
            h.appendChild(n);
         }
      }
   },

   /**
    * Load a game script.  Creates the default rendering context
    * also.
    *
    * @param gameSource {String} The URL of the game script.
    * @memberOf Engine
    */
   loadGame: function(gameSource, gameObjectName) {
      // We'll wait for the Engine to be ready before we load the game
      var engine = this;
      Engine.gameLoadTimer = setInterval(function() {
         if (engine.running) {
            // Stop the timer
            clearInterval(Engine.gameLoadTimer);
            Engine.gameLoadTimer = null;

            // Create the default context (the document)
            Console.debug("Loading '" + gameSource + "'");
            engine.defaultContext = new DocumentContext();
            engine.loadScript(gameSource);

            // Start the game when it's ready
            if (gameObjectName) {
	            Engine.gameRunTimer = setInterval(function() {
						if (window[gameObjectName]) {
							clearInterval(Engine.gameRunTimer);
							window[gameObjectName].setup();
						}
					}, 100);
				}
         }
      }, 100);
   },

   /**
    * Load a script relative to the engine path.
    *
    * @param scriptSource {String} A URL to load that is relative to the engine path.
    * @memberOf Engine
    */
   load: function(scriptSource) {
      this.loadScript(this.getEnginePath() + scriptSource);
   },

   /**
    * Get the path to the engine.
    * @type String
    */
   getEnginePath: function() {
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

      return this.engineLocation;
   },

   /**
    * Load the scripts required for the engine to run.
    * @private
    * @memberOf Engine
    */
   loadEngineScripts: function() {
      // Engine stylesheet
      this.loadStylesheet("/css/engine.css");

      // Engine platform
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

      // Text rendering
      this.load("/textrender/text.renderer.js");
      this.load("/textrender/text.abstractrender.js");

      // Sound manager
      this.load("/libs/soundmanager2.js");

      // Initialize the sounds engine
      this.setQueueCallback(function() {
         Engine.pauseQueue(true);

         window.soundManager = new SoundManager();

         // Create a link to the object
         Engine.soundManager = window.soundManager;

         // directory where SM2 .SWFs live
         Engine.soundManager.url = Engine.getEnginePath() + '/libs/';

         // Debugging enabled?
         var p = EngineSupport.getQueryParams();
         if (p["debugSound"] != null && p["debugSound"] == "true") {
            Engine.soundManager.debugMode = true;
         } else {
            Engine.soundManager.debugMode = false;
         }

         Engine.soundManager.onload = function() {
            Engine.soundsEnabled = true;
            Console.warn("SoundManager loaded successfully");
            Engine.pauseQueue(false);
         };

         Engine.soundManager.onerror = function() {
            Engine.soundsEnabled = false;
            Console.warn("SoundManager not loaded - sound disabled");
            Engine.pauseQueue(false);
         };

         if (Engine.getEnginePath().indexOf("file:") == 0) {
            Engine.soundManager.sandbox.type = "localWithFile";
         }

         Engine.soundManager.go();
      });

      // Start the engine after all these files load
      this.setQueueCallback(function() {
         Engine.run();
      });
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

      if (!this.running) {
         return;
      }

      var b = new Date().getTime();
      Engine.worldTime = b;

      // Update the world
      if (Engine.getDefaultContext() != null)
      {
         Engine.getDefaultContext().update(null, new Date().getTime());

         if (this.showMetricsWindow && this.lastMetricSample-- == 0)
         {
            var d = new Date().getTime() - b;
            Engine.addMetric("FPS", Math.floor((1 / this.fpsClock) * 1000), false, "#");
            Engine.addMetric("avail", this.fpsClock, false, "#ms");
            Engine.addMetric("frame", d, true, "#ms");
            Engine.addMetric("load", Math.floor((d / this.fpsClock) * 100), true, "#%");

            this.updateMetrics();
            this.lastMetricSample = this.metricSampleRate;
         }
      }

      // Another process interval
      Engine.globalTimer = window.setTimeout(function() { Engine.engineTimer(); }, this.fpsClock);
   },

   /**
    * Set the interval at which metrics are sampled by the system.
    * The default is calculated every 10 engine ticks.
    *
    * @param sampleRate {Number} The number of ticks between samples
    */
   setMetricSampleRate: function(sampleRate) {
      this.lastMetricSample = 1;
      this.metricSampleRate = sampleRate;
   },

   /**
    * Add a metric to the game engine that can be displayed
    * while it is running.  If smoothing is selected, a 3 point
    * running average will be used to smooth out jitters in the
    * value that is shown.
    *
    * @param metricName {String} The name of the metric to track
    * @param value {String/Number} The value of the metric
    * @param smoothing {Boolean} <tt>true</tt> to use 3 point average smoothing
    * @memberOf Engine
    */
   addMetric: function(metricName, value, smoothing, fmt) {
      if (smoothing) {
         var vals = this.metrics[metricName] ? this.metrics[metricName].values : [];
         if (vals.length == 0) {
            // Init
            vals.push(value);
            vals.push(value);
            vals.push(value);
         }
         vals.shift();
         vals.push(value);
         var v = Math.floor((vals[0] + vals[1] + vals[2]) * 0.33);
         this.metrics[metricName] = { val: fmt.replace("#", v), values: vals };
      } else {
         this.metrics[metricName] = { val: fmt.replace("#", value) };
      }
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
         h += m + ": " + this.metrics[m].val + "<br/>";
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

// Start the console so logging can take place immediately
Console.startup();

// Start the engine
Engine.startup();

// Read any engine-level query params
var p = EngineSupport.getQueryParams();
if (p["debug"] != null && p["debug"] == "true")
{
   Engine.setDebugMode(true);
   Console.setDebugLevel(Console.DEBUGLEVEL_VERBOSE);
}
