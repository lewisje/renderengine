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
   constructor: function() {
   },

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
   dump: function() {
      var s = "";
      for (var x = 0; x < arguments.length; x++) {
         if (arguments[x].length) {
            for (var z = 0; z < arguments[x].length; z++) {
               s += arguments[x][z].toString() + "<br/>";
            }
         } else {
            s += arguments[x].toString() + "<br/>";
         }
      }
      return s;
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
      //this.out("<span class='debug'>" + this.dump(arguments) + "</span>");
   },

   info: function() {
      //this.debug(arguments);
   },

   /**
    * Write a warning message to the console
    * @param msg {String} The message to write
    */
   warn: function() {
      //this.out("<span class='warn'>" + this.dump(arguments) + "</span>");
   },

   /**
    * Write an error message to the console
    * @param msg {String} The message to write
    */
   error: function() {
      //this.out("<span class='error'>" + this.dump(arguments) + "</span>");
   }

});

/**
 * @class A debug console that will use a pre-defined element to display its output.  You must create
 *        an element with the class "debug-console" for this to function properly.  This object is created,
 *        as necessary, by the {@link Console} object.
 * @extends ConsoleRef
 */
var HTMLConsoleRef = ConsoleRef.extend(/** @DebugConsoleRef.prototype **/{

   constructor: function() {
      $("head", document).append(
            "<style> " +
            ".debug-console { font-family: 'Lucida Console',Courier; font-size: 8pt; color: black; } " +
            ".debug-console .console-debug { background: white; } " +
            ".debug-console .console-warn { font-style: italics; background: #00ffff; } " +
            ".debug-console .console-error { color: red; background: yellow; font-weight: bold; } " +
            "</style>"
      );
   },

   clean: function() {
      if ($(".debug-console > span").length > 150) {
         $(".debug-console > span:lt(150)").remove();
      }
   },

   scroll: function() {
      var w = $(".debug-console")[0];
      if (w.scrollTop <= w.scrollHeight - 50) {
         return;
      } else {
         $(".debug-console")[0].scrollTop = 10000;
      }
   },

   /**
    * Write a debug message to the console
    * @param msg {String} The message to write
    */
   info: function() {
      this.clean();
      $(".debug-console").append($("<span class='console-info'>" + this.dump(arguments) + "</span>"));
      this.scroll();
   },

   /**
    * Write a debug message to the console
    * @param msg {String} The message to write
    */
   debug: function() {
      this.clean();
      $(".debug-console").append($("<span class='console-debug'>" + this.dump(arguments) + "</span>"));
      this.scroll();
   },

   /**
    * Write a warning message to the console
    * @param msg {String} The message to write
    */
   warn: function() {
      this.clean();
      $(".debug-console").append($("<span class='console-warn'>" + this.dump(arguments) + "</span>"));
      this.scroll();
   },

   /**
    * Write an error message to the console
    * @param msg {String} The message to write
    */
   error: function() {
      this.clean();
      $(".debug-console").append($("<span class='console-error'>" + this.dump(arguments) + "</span>"));
      this.scroll();
   },

   /** @private **/
   init: function() {
   }
});

/**
 * @class A console reference to the Firebug console.  This will work with both Firebug and FirebugLite.
 * @extends ConsoleRef
 */
var FirebugConsoleRef = ConsoleRef.extend(/** @FirebugConsoleRef.prototype **/{

   constructor: function () {
   },

   /**
    * Write a debug message to the console
    * @param msg {String} The message to write
    */
   info: function() {
      if (typeof firebug != "undefined") {
         firebug.d.console.log.apply(firebug.d.console, arguments);
      } else {
         console.info.apply(console, arguments);
      }
   },

   /**
    * Write a debug message to the console
    * @param msg {String} The message to write
    */
   debug: function() {
      if (typeof firebug != "undefined") {
         firebug.d.console.log.apply(firebug.d.console, arguments);
      } else {
         console.debug.apply(console, arguments);
      }
   },

   /**
    * Write a warning message to the console
    * @param msg {String} The message to write
    */
   warn: function() {
      if (typeof firebug != "undefined") {
         firebug.d.console.log.apply(firebug.d.console, arguments);
      } else {
         console.warn.apply(console, arguments);
      }
   },

   /**
    * Write an error message to the console
    * @param msg {String} The message to write
    */
   error: function() {
      if (typeof firebug != "undefined") {
         firebug.d.console.log.apply(firebug.d.console, arguments);
      } else {
         console.error.apply(console, arguments);
      }
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
      if ($(".debug-console").length == 1) {
         this.consoleRef = new HTMLConsoleRef();
      }
      else if (typeof firebug != "undefined" || (typeof console != "undefined" && console.firebug)) {
         // Firebug or firebug lite
         this.consoleRef = new FirebugConsoleRef();
      }
      else
      {
         // Default (simple popup window)
         this.consoleRef = new ConsoleRef();
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
 * @class Engine support class.  Provides extra functions the engine or games
 *        can use.  Mainly contains functions that can manipulate arrays and
 *        generate/read JSON.
 */
var EngineSupport = Base.extend(/** @scope EngineSupport.prototype */{
   constructor: null,

   /**
    * Get the index of an element in the specified array.
    *
    * @param array {Array} The array to scan
    * @param obj {Object} The object to find
    * @param from {Number=0} The index to start at, defaults to zero.
    * @memberOf EngineSupport
    */
   indexOf: function(array, obj, from) {
      if (!array) {
         return -1;
      }

      if (Array.prototype.indexOf) {
         return array.indexOf(obj, from);
      }
      else
      {
         var len = array.length;
         var from = Number(from) || 0;
         from = (from < 0)
            ? Math.ceil(from)
            : Math.floor(from);
         if (from < 0)
            from += len;

         for (; from < len; from++)
         {
            if (from in array && array[from] === obj)
               return from;
         }
         return -1;
      }
   },

   /**
    * Remove an element from an array.
    *
    * @param array {Array} The array to modify
    * @param obj {Object} The object to remove
    * @memberOf EngineSupport
    */
   arrayRemove: function(array, obj) {
      if (!array) {
         return;
      }

      var idx = EngineSupport.indexOf(array, obj);
      if (idx != -1)
      {
         array.splice(idx, 1);
      }
   },

   /**
    * Calls a provided callback function once for each element in
    * an array, and constructs a new array of all the values for which
    * callback returns a <tt>true</tt> value. callback is invoked only
    * for indexes of the array which have assigned values; it is not invoked
    * for indexes which have been deleted or which have never been assigned
    * values. Array elements which do not pass the callback test are simply
    * skipped, and are not included in the new array.
    *
    * @param array {Array} The array to filter.
    * @param fn {Function} The callback to invoke.  It will be passed three
    *                      arguments: The element value, the index of the element,
    *                      and the array being traversed.
    * @param thisp {Object} Used as <tt>this</tt> for each invocation of the
    *                       callback.  Default: <tt>null</tt>
    * @memberOf EngineSupport
    */
   filter: function(array, fn, thisp) {
      if (!array) {
         return null;
      }

      if (Array.prototype.filter) {
         return array.filter(fn, thisp)
      }
      else
      {
         var len = array.length;
         if (typeof fn != "function")
            throw new TypeError();

         var res = new Array();
         for (var i = 0; i < len; i++)
         {
            if (i in array)
            {
               var val = array[i]; // in case fn mutates this
               if (fn.call(thisp, val, i, array))
                  res.push(val);
            }
         }

         return res;
      }
   },

   /**
    * Executes a callback for each element within an array.
    *
    * @param array {Array} The array to operate on
    * @param fn {Function} The function to apply to each element
    * @param [thisp] {Object} An optional "this" pointer to use in the callback
    * @memberOf EngineSupport
    */
   forEach: function(array, fn, thisp) {
      if (!array) {
         return;
      }

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
    * @memberOf EngineSupport
    */
   getPath: function(url) {
      var l = url.lastIndexOf("/");
      return url.substr(0, l);
   },

   /**
    * Get the query parameters from the window location object.  The
    * object returned will contain a key/value pair for each argument
    * found.
    *
    * @type Object
    * @return An <tt>Object</tt> with a key and value for each query argument.
    * @memberOf EngineSupport
    */
   getQueryParams: function() {
      if (!EngineSupport.parms) {
         EngineSupport.parms = {};
         var p = window.location.toString().split("?")[1];
         if (p)
         {
            p = p.split("&");
            for (var x = 0; x < p.length; x++)
            {
               var v = p[x].split("=");
               EngineSupport.parms[v[0]] = (v.length > 1 ? v[1] : "");
            }
         }
      }
      return EngineSupport.parms;
   },

   /**
    * Check for a query parameter and to see if it evaluates to one of the following:
    * <tt>true</tt>, <tt>1</tt>, <tt>yes</tt>, or <tt>y</tt>.  If so, returns <tt>true</tt>.
    *
    * @param paramName {String} The query parameter name
    * @return <tt>true</tt> if the query parameter exists and is one of the specified values.
    * @type Boolean
    */
   checkBooleanParam: function(paramName) {
      return (EngineSupport.getQueryParams()[paramName] &&
              (EngineSupport.getQueryParams()[paramName] == "true" ||
               EngineSupport.getQueryParams()[paramName] == "1" ||
               EngineSupport.getQueryParams()[paramName].toLowerCase() == "yes" ||
               EngineSupport.getQueryParams()[paramName].toLowerCase() == "y"));
   },

   /**
    * Check for a query parameter and to see if it evaluates to the specified value.
    * If so, returns <tt>true</tt>.
    *
    * @param paramName {String} The query parameter name
    * @param val {String} The value to check for
    * @return <tt>true</tt> if the query parameter exists and is the value specified
    * @type Boolean
    */
   checkStringParam: function(paramName, val) {
      return (EngineSupport.getQueryParams()[paramName] && EngineSupport.getQueryParams()[paramName] == val);
   },

   /**
    * Check for a query parameter and to see if it evaluates to the specified number.
    * If so, returns <tt>true</tt>.
    *
    * @param paramName {String} The query parameter name
    * @param val {Number} The number to check for
    * @return <tt>true</tt> if the query parameter exists and is the value specified
    * @type Boolean
    */
   checkNumericParam: function(paramName, val) {
      return (EngineSupport.getQueryParams()[paramName] && Number(EngineSupport.getQueryParams()[paramName]) == val);
   },

   /**
    * Returns specified object as a JavaScript Object Notation (JSON) string.
    *
    * Code to handle "undefined" type was delibrately not implemented, being that it is not part of JSON.
    * "undefined" type is casted to "null".
    *
    * @param object {Object} Must not be undefined or contain undefined types and variables.
    * @return String
    * @memberOf EngineSupport
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
                  a.push(EngineSupport.quoteString(i) + ":null");
               }
               else if(o[i].constructor != Function)
               {
                  a.push(EngineSupport.quoteString(i) + ':' + EngineSupport.toJSONString(o[i]));
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
    * @memberOf EngineSupport
    */
   parseJSON: function(jsonString)
   {
      var obj = eval('(function(){return ' + jsonString + ';})();');
      return obj;
   },

   /**
    * Return a string, enclosed in quotes.
    *
    * @param string
    * @type String
    * @memberOf EngineSupport
    */
   quoteString: function(o)
   {
      return '"'+o.replace(/[\\"\r\n]/g, function(s)
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

   /**
    * Gets an object that is a collation of a number of browser and
    * client settings.  You can use this information to tailor a game
    * to the environment it is running within.
    * @return An object with system information
    * @memberOf EngineSupport
    */
   sysInfo: function() {
      return {
         "browser" : $.browser.safari ? "safari" : ($.browser.mozilla ? "mozilla" : ($.browser.opera ? "opera" : ($.browser.msie ? "msie" : "unknown"))),
         "version" : $.browser.version,
         "agent": navigator.userAgent,
         "platform": navigator.platform,
         "cpu": navigator.cpuClass || navigator.oscpu,
         "language": navigator.language,
         "online": navigator.onLine,
         "cookies": navigator.cookieEnabled,
         "fullscreen": window.fullScreen || false,
         "width": window.innerWidth || document.body.parentNode.clientWidth,
         "height": window.innerHeight || document.body.parentNode.clientHeight
      };
   }
});

/**
 * @class The main engine class which is responsible for keeping the world up to date.
 * Additionally, the Engine will track and display metrics for optimizing a game. Finally,
 * the Engine is responsible for maintaining the local client's <tt>worldTime</tt>.
 * <p/>
 * The engine includes methods to load scripts and stylesheets in a serialized fashion
 * and report on the sound engine status.  Since objects are tracked by the engine, a list
 * of all game objects can be obtained from the engine.  The engine also contains the root
 * rendering context, or "default" context.  For anything to be rendered, or updated by the
 * engine, it will need to be added to a child of the default context.
 * <p/>
 * Other methods allow for starting or shutting down then engine, toggling metric display,
 * setting of the base "frames per second", toggling of the debug mode, and processing of
 * the script and function queue.
 * <p/>
 * Since JavaScript is a single-threaded environment, frames are generated serially.  One
 * frame must complete before another can be rendered.  Frames are not currently skipped
 * by the engine.  It is up to objects to determine if frames have been skipped and adjust
 * themselves appropriately.
 *
 * @static
 */
var Engine = Base.extend(/** @scope Engine.prototype */{
   constructor: null,

   version: "1.0.3 (alpha)",

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

   /**
    * The current time of the world on the client.  This time is updated
    * for each frame generated by the Engine.
    * @type Number
    * @memberOf Engine
    */
   worldTime: 0,

   soundsEnabled: false,

   queuePaused:false,

   pauseReps: 0,

   /**
    * Track an instance of an object managed by the Engine.  This is called
    * by any object that extends from {@link PooledObject}.
    *
    * @param obj {PooledObject} A managed object within the engine
    * @return {String} The global Id of the object
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
    * Removes an object instance managed by the Engine.
    *
    * @param obj {PooledObject} The object, managed by the engine, to destroy
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
    * Get an object by it's Id that was assigned during the call to {@link #create}.
    *
    * @param id {String} The global Id of the object to locate
    * @return {PooledObject} The object
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
    * @return {Boolean}
    * @memberOf Engine
    */
   getDebugMode: function() {
      return this.debugMode;
   },

   /**
    * Returns <tt>true</tt> if SoundManager2 is loaded and initialized
    * properly.  The resource loader and play manager will use this
    * value to execute properly.
    * @return {Boolean} <tt>true</tt> if the sound engine was loaded properly
    * @memberOf Engine
    */
   isSoundEnabled: function() {
      return this.soundsEnabled;
   },

   /**
    * Starts the engine and loads the engine scripts.  When all scripts required
    * by the engine have been loaded the {@link #run} method will be called.
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
    * Pauses the engine.
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

      // Dump the object pool
      PooledObject.objectPool = null;

      Assert((this.livingObjects == 0), "Object references not cleaned up!");

      // Perform final cleanup
      this.cleanup();
   },

   /**
    * After a successful shutdown, the Engine needs to clean up
    * all of the objects that were created on the window object by the engine.
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
    * Get the default rendering context for the Engine.  This
    * is the <tt>document.body</tt> element in the browser.
    *
    * @return {RenderContext} The default rendering context
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
    * @memberOf Engine
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

			this.doLoad(scriptPath);
      }
   },

	doLoad: function(scriptPath) {
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
			var fn = function() {
				if (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") {
					Console.debug("Loaded '" + scriptPath + "'");
					Engine.readyForNextScript = true;
				}
			}
			if ($.browser.msie) {
				n.defer = true;
				n.onreadystatechange = fn;
			} else {
				n.onload = fn;
			}

			var h = document.getElementsByTagName("head")[0];
			h.appendChild(n);
		}
	},

	loadNow: function(scriptPath) {
		this.doLoad(this.getEnginePath() + scriptPath);
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
            engine.defaultContext = DocumentContext.create();
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
    * @return {String} The path/URL where the engine is located
    * @memberOf Engine
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
    * Load the scripts required for the engine to run and
    * initializes the sound engine.
    * @private
    * @memberOf Engine
    */
   loadEngineScripts: function() {
      // Engine stylesheet
      this.loadStylesheet("/css/engine.css");

      // Engine platform
      this.loadNow("/platform/engine.math2d.js");
      this.loadNow("/platform/engine.game.js");
      this.loadNow("/platform/engine.pooledobject.js");
      this.loadNow("/platform/engine.baseobject.js");
      this.loadNow("/platform/engine.timers.js");
      this.loadNow("/platform/engine.container.js");
      this.loadNow("/platform/engine.hashcontainer.js");
      this.loadNow("/platform/engine.rendercontext.js");
      this.loadNow("/platform/engine.hostobject.js");
      this.loadNow("/platform/engine.object2d.js");
      this.loadNow("/platform/engine.resourceloader.js");
      this.loadNow("/platform/engine.events.js");
      this.loadNow("/platform/engine.spatialcontainer.js");
      this.loadNow("/platform/engine.particles.js");


      // Contexts
      this.load("/rendercontexts/context.render2d.js");
      this.load("/rendercontexts/context.htmlelement.js");
      this.load("/rendercontexts/context.documentcontext.js");

      if ($.browser.msie) {
         // This is the Google "ExplorerCanvas" object we need for IE
         this.load("/libs/excanvas.js");
      }

      // Object components
      this.load("/components/component.base.js");
      this.load("/components/component.host.js");

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
    * Set the FPS (frames per second) the engine runs at.  This value
    * is mainly a suggestion to the engine as to how fast you want to
    * redraw frames.  If frame execution time is long, frames may be
    * missed.  See the metrics to understand available time versus
    * render time.
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

         if (this.showMetricsWindow && !this.metricDisplay) {
            this.metricDisplay = jQuery("<div/>").addClass("metrics");
            this.metricDisplay.appendTo($("body"));
         }
         else if (!this.showMetricsWindow && this.metricDisplay) {
            this.metricDisplay.remove();
            this.metricDisplay = null;
         }

         if (this.showMetricsWindow && this.lastMetricSample-- == 0)
         {
            var d = new Date().getTime() - b;
            Engine.addMetric("FPS", Math.floor((1 / this.fpsClock) * 1000), false, "#");
            Engine.addMetric("aFPS", Math.floor((1 / d) * 1000), true, "#");
            Engine.addMetric("avail", this.fpsClock, false, "#ms");
            Engine.addMetric("frame", d, true, "#ms");
            Engine.addMetric("load", Math.floor((d / this.fpsClock) * 100), true, "#%");

            this.updateMetrics();
            this.lastMetricSample = this.metricSampleRate;
         }
      }

      // Another process interval
      Engine.globalTimer = setTimeout(function _engineTimer() { Engine.engineTimer(); }, this.fpsClock);
   },

   /**
    * Toggle the display of the metrics window.  Any metrics
    * that are being tracked will be reported in this window.
    * @memberOf Engine
    */
   toggleMetrics: function() {
      this.showMetricsWindow = !this.showMetricsWindow;
   },

   /**
    * Show the metrics window
    * @memberOf Engine
    */
   showMetrics: function() {
      this.showMetricsWindow = true;
   },

   /**
    * Hide the metrics window
    * @memberOf Engine
    */
   hideMetrics: function() {
      this.showMetricsWindow = false;
   },

   /**
    * Set the interval at which metrics are sampled by the system.
    * The default is for metrics to be calculated every 10 engine frames.
    *
    * @param sampleRate {Number} The number of ticks between samples
    * @memberOf Engine
    */
   setMetricSampleRate: function(sampleRate) {
      this.lastMetricSample = 1;
      this.metricSampleRate = sampleRate;
   },

   /**
    * Add a metric to the game engine that can be displayed
    * while it is running.  If smoothing is selected, a 3 point
    * running average will be used to smooth out jitters in the
    * value that is shown.  For the <tt>value</tt> argument,
    * you can provide a string which contains the pound sign "#"
    * that will be used to determine where the calculated value will
    * occur in the formatted string.
    *
    * @param metricName {String} The name of the metric to track
    * @param value {String/Number} The value of the metric.
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
   },

   //=====================================================================================
   // These methods handle object dependencies so that each object will be
   // initialized as soon as its dependencies become available.

	dependencyList: {},
	dependencyProcessor: null,

	/**
	 * @param objectName {String} The name of the object class
	 * @param dependencies {Array} An array of object names the object to initialize
	 *							  is dependent on.  When all objects have been created, the
	 *							  object will be initialized.
	 * @param fn {Function} The function to run when the object can be initialized.
	 */
	initObject: function(objectName, dependency, fn) {
		Console.debug("initObject", arguments);
		if (dependency === null) {
			// The object has no dependencies, create it...
			window[objectName] = fn();
			Console.debug("Initialized", objectName);
		} else {
			Engine.dependencyList[objectName] = {dep: dependency, objFn: fn};
		}

		if (!Engine.dependencyProcessor) {
			Engine.dependencyProcessor = window.setTimeout(Engine.processDependencies, 100);
		}
	},

	processDependencies: function() {
		var pDeps = [];
		var dCount = 0;
		for (var d in Engine.dependencyList) {
			dCount++;
			// Check to see if the dependency of an object is loaded
			if (window[Engine.dependencyList[d].dep] != null) {
				// We can load it
				window[d] = Engine.dependencyList[d].objFn();
				Console.debug("Initialized", d);
				pDeps.push(d);
			}
		}

		for (var i in pDeps) {
			delete Engine.dependencyList[pDeps[i]];
		}

		if (dCount != 0) {
			Engine.dependencyProcessor = window.setTimeout(Engine.processDependencies, 100);
		} else {
			window.clearTimeout(Engine.dependencyProcessor);
			Engine.dependencyProcessor = null;
		}
	}

 }, { // Interface
   globalTimer: null
 });

// Start the console so logging can take place immediately
Console.startup();

// Start the engine
Engine.startup();

// Read any engine-level query params
if (EngineSupport.checkBooleanParam("debug"))
{
   Engine.setDebugMode(true);
   Console.setDebugLevel(Console.DEBUGLEVEL_VERBOSE);
   if (!typeof console == "undefined" && console.open) {
      console.open();
   }
}

if (EngineSupport.checkBooleanParam("metrics"))
{
   Engine.showMetrics();
}
