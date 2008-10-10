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
   fixArgs: function(a) {
      var x = [];
      for (var i=0; i < a.length; i++) {
         if (!a[i]) {
            x.push("null");
         } else if ((a[i].length && (a[i] instanceof Array)) || typeof a[i] == "object") {
            /* var s = "";
            var obj = a[i];
            for (var o in obj) {
               s += o + ": " + obj[o] + "\n";
            } */
            x.push(a[i]);
         } else {
            x.push(a[i]);
         }
      }
      return x.join(" ");
   },

   /**
    * Write a debug message to the console
    */
   debug: function() {
   },

   /**
    * Write an info message to the console
    */
   info: function() {
   },

   /**
    * Write a warning message to the console
    */
   warn: function() {
   },

   /**
    * Write an error message to the console
    */
   error: function() {
   },

   getClassName: function() {
      return "ConsoleRef";
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
            "#debug-console { position: absolute; width: 400px; right: 10px; bottom: 5px; height: 98%; border: 1px solid; overflow: auto; " +
            "font-family: 'Lucida Console',Courier; font-size: 8pt; color: black; } " +
            "#debug-console .console-debug, #debug-console .console-info { background: white; } " +
            "#debug-console .console-warn { font-style: italics; background: #00ffff; } " +
            "#debug-console .console-error { color: red; background: yellow; font-weight: bold; } " +
            "</style>"
      );
      $(document).ready(function() {
			$(document.body).append($("<div id='debug-console'><!-- --></div>"));
		});
   },

	/** @private */
   clean: function() {
      if ($("#debug-console > span").length > 150) {
         $("#debug-console > span:lt(150)").remove();
      }
   },

	/** @private */
   scroll: function() {
      var w = $("#debug-console")[0];
      if (w) {
			$("#debug-console")[0].scrollTop = w.scrollHeight + 1;
		}
   },

   /**
    * Write a debug message to the console
    * @param msg {String} The message to write
    */
   info: function() {
      this.clean();
      $("#debug-console").append($("<div class='console-info'>" + this.fixArgs(arguments) + "</div>"));
      this.scroll();
   },

   /**
    * Write a debug message to the console
    * @param msg {String} The message to write
    */
   debug: function() {
      this.clean();
      $("#debug-console").append($("<div class='console-debug'>" + this.fixArgs(arguments) + "</div>"));
      this.scroll();
   },

   /**
    * Write a warning message to the console
    * @param msg {String} The message to write
    */
   warn: function() {
      this.clean();
      $("#debug-console").append($("<div class='console-warn'>" + this.fixArgs(arguments) + "</div>"));
      this.scroll();
   },

   /**
    * Write an error message to the console
    * @param msg {String} The message to write
    */
   error: function() {
      this.clean();
      $("#debug-console").append($("<div class='console-error'>" + this.fixArgs(arguments) + "</div>"));
      this.scroll();
   },

   getClassName: function() {
      return "HTMLConsoleRef";
   }
});

/**
 * @class A debug console for Safari browsers.
 * @extends ConsoleRef
 */
var SafariConsoleRef = ConsoleRef.extend(/** @SafariConsoleRef.prototype **/{

   constructor: function() {
   },

   /**
    * Write a debug message to the console
    * @param msg {String} The message to write
    */
   info: function() {
      console.log(this.fixArgs(arguments));
   },

   /**
    * Write a debug message to the console
    * @param msg {String} The message to write
    */
   debug: function() {
      console.log(["[D]", this.fixArgs(arguments)]);
   },

   /**
    * Write a warning message to the console
    * @param msg {String} The message to write
    */
   warn: function() {
      console.log(["[W]", this.fixArgs(arguments)]);
   },

   /**
    * Write an error message to the console
    * @param msg {String} The message to write
    */
   error: function() {
      console.log(["[E!]", this.fixArgs(arguments)]);
   },

   getClassName: function() {
      return "SafariConsoleRef";
   }

});

/**
 * @class A debug console for Opera browsers.
 * @extends ConsoleRef
 */
var OperaConsoleRef = ConsoleRef.extend(/** @OperaConsoleRef.prototype **/{

   constructor: function() {
   },

   /**
    * Write a debug message to the console
    * @param msg {String} The message to write
    */
   info: function() {
      window.opera.postError(this.fixArgs(arguments));
   },

   /**
    * Write a debug message to the console
    * @param msg {String} The message to write
    */
   debug: function() {
      window.opera.postError(["[D]", this.fixArgs(arguments)]);
   },

   /**
    * Write a warning message to the console
    * @param msg {String} The message to write
    */
   warn: function() {
      window.opera.postError(["[W]", this.fixArgs(arguments)]);
   },

   /**
    * Write an error message to the console
    * @param msg {String} The message to write
    */
   error: function() {
      window.opera.postError(["[E!]", this.fixArgs(arguments)]);
   },

   getClassName: function() {
      return "OperaConsoleRef";
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
   },

   getClassName: function() {
      return "FirebugConsoleRef";
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

   DEBUGLEVEL_ERRORS:      4,
   DEBUGLEVEL_WARNINGS:    3,
   DEBUGLEVEL_DEBUG:       2,
	DEBUGLEVEL_INFO:			1,
   DEBUGLEVEL_VERBOSE:     0,
   DEBUGLEVEL_NONE:       -1,

   verbosity: this.DEBUGLEVEL_NONE,

   /**
    * Start up the console.
    */
   startup: function() {
		if (EngineSupport.checkBooleanParam("simWii") || jQuery.browser.Wii) {
			this.consoleRef = new HTMLConsoleRef();
		}
      else if (typeof firebug != "undefined" || (typeof console != "undefined" && console.firebug)) {
         // Firebug or firebug lite
         this.consoleRef = new FirebugConsoleRef();
      }
      else if (jQuery.browser.safari) {
         this.consoleRef = new SafariConsoleRef();
      }
      else if (jQuery.browser.opera) {
         this.consoleRef = new OperaConsoleRef();
      }
      else {
         this.consoleRef = new ConsoleRef(); // (null console)
      }
   },

   /**
    * Set the console reference object to a new type of console which isn't
    * natively supported.
    *
    * @param refObj {ConsoleRef} A descendent of <tt>ConsoleRef</tt>
    */
   setConsoleRef: function(refObj) {
		if (refObj instanceof ConsoleRef) {
			this.consoleRef = refObj;
		}
	},

   /**
    * Set the debug output level of the console.  The available levels are:
    * <ul>
    * <li>Console.DEBUGLEVEL_ERRORS = 4</li>
    * <li>Console.DEBUGLEVEL_WARNINGS = 3</li>
    * <li>Console.DEBUGLEVEL_DEBUG = 2</li>
    * <li>Console.DEBUGLEVEL_INFO = 1</li>
    * <li>Console.DEBUGLEVEL_VERBOSE = 0</li>
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

   checkVerbosity: function(debugLevel) {
      return (this.verbosity != this.DEBUGLEVEL_NONE &&
              this.verbosity == this.DEBUGLEVEL_VERBOSE ||
              (debugLevel != this.DEBUGLEVEL_VERBOSE && debugLevel >= this.verbosity));
   },

   /**
    * Outputs a log message.  These messages will only show when DEBUGLEVEL_VERBOSE is the level.
    *
    * @param msg {String} The message to output
    */
   log: function() {
      if (Engine.debugMode && this.checkVerbosity(this.DEBUGLEVEL_VERBOSE))
         this.consoleRef.debug.apply(this.consoleRef, arguments);
   },

	/**
	 * Outputs an info message. These messages will only show when DEBUGLEVEL_INFO is the level.
	 */
	info: function() {
		if (Engine.debugMode && this.checkVerbosity(this.DEBUGLEVEL_INFO))
			this.consoleRef.debug.apply(this.consoleRef, arguments);
	},

   /**
    * Outputs a debug message.  These messages will only show when DEBUGLEVEL_DEBUG is the level.
    *
    * @param msg {String} The message to output
    */
   debug: function() {
      if (Engine.debugMode && this.checkVerbosity(this.DEBUGLEVEL_DEBUG))
         this.consoleRef.info.apply(this.consoleRef, arguments);
   },

   /**
    * Outputs a warning message.  These messages will only show when DEBUGLEVEL_WARNINGS is the level.
    *
    * @param msg {String} The message to output
    */
   warn: function() {
      if (Engine.debugMode && this.checkVerbosity(this.DEBUGLEVEL_WARNINGS))
         this.consoleRef.warn.apply(this.consoleRef, arguments);
   },

   /**
    * Output an error message.  These messages will only show when DEBUGLEVEL_ERRORS is the level.
    *
    * @param msg {String} The message to output
    */
   error: function() {
      if (Engine.debugMode && this.checkVerbosity(this.DEBUGLEVEL_ERRORS))
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
      // This will provide a stacktrace for browsers that support it
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
	 * Fill the specified array of <tt>size</tt> the
	 * <tt>value</tt> at each index.
	 * @param {Array} arr The array to fill
	 * @param {Number} size The size of the array to fill
	 * @param {Object} value The value to put at each index
	 */
	fillArray: function(arr, size, value) {
		for (var i = 0; i < size; i++) {
			arr[i] = value;
		}
	},

   /**
    * Get the path from a fully qualified URL.
    *
    * @param url {String} The URL
    * @return {String} The path
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
    * @return {Object} An <tt>Object</tt> with a key and value for each query argument.
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
    * @return {Boolean} <tt>true</tt> if the query parameter exists and is one of the specified values.
    * @memberOf EngineSupport
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
    * @return {Boolean} <tt>true</tt> if the query parameter exists and is the value specified
    * @memberOf EngineSupport
    */
   checkStringParam: function(paramName, val) {
      return (EngineSupport.getStringParam(paramName, null) == val);
   },

   /**
    * Check for a query parameter and to see if it evaluates to the specified number.
    * If so, returns <tt>true</tt>.
    *
    * @param paramName {String} The query parameter name
    * @param val {Number} The number to check for
    * @return {Boolean} <tt>true</tt> if the query parameter exists and is the value specified
    * @memberOf EngineSupport
    */
   checkNumericParam: function(paramName, val) {
      return (EngineSupport.getStringParam(paramName, null) == val)
   },

   /**
    * Get a numeric query parameter, or the default specified if the parameter
    * doesn't exist.
    *
    * @param paramName {String} The name of the parameter
    * @param defaultVal {Number} The number to return if the parameter doesn't exist
    * @return {Number} The value
    * @memberOf EngineSupport
    */
   getNumericParam: function(paramName, defaultVal) {
      return Number(EngineSupport.getStringParam(paramName, defaultVal));
   },

   /**
    * Get a string query parameter, or the default specified if the parameter
    * doesn't exist.
    *
    * @param paramName {String} The name of the parameter
    * @param defaultVal {String} The string to return if the parameter doesn't exist
    * @return {String} The value
    * @memberOf EngineSupport
    */
   getStringParam: function(paramName, defaultVal) {
      return (EngineSupport.getQueryParams()[paramName] || defaultVal);
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

   localMode: false,

   defaultContext: null,

   started: false,
   running: false,

   loadedScripts: {},

   engineLocation: null,

   metrics: {},

   metricDisplay: null,

   metricSampleRate: 10,

   lastMetricSample: 10,

   showMetricsWindow: false,

   vObj: 0,

   localMode: false,

   /*
    * Used to calculate a ratio of scripts to load, to those loaded.
    */
   scriptLoadCount: 0,
   scriptsProcessed: 0,
   scriptRatio: 0,

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

   //====================================================================================================
   //====================================================================================================
   //                                      ENGINE PROPERTIES
   //====================================================================================================
   //====================================================================================================

   /**
    * Set the debug mode of the engine.  Affects message ouput and
    * can be queried for additional debugging operations.
    *
    * @param mode {Boolean} <tt>true</tt> to set debugging mode
    * @memberOf Engine
    */
   setDebugMode: function(mode) {
      this.debugMode = mode;
   },

   /**
    * Query the debugging mode of the engine.
    *
    * @return {Boolean} <tt>true</tt> if the engine is in debug mode
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
    * Set the FPS (frames per second) the engine runs at.  This value
    * is mainly a suggestion to the engine as to how fast you want to
    * redraw frames.  If frame execution time is long, frames will be
    * processed as time is available. See the metrics to understand
    * available time versus render time.
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
    * Get the default rendering context for the Engine.  This
    * is the <tt>document.body</tt> element in the browser.
    *
    * @return {RenderContext} The default rendering context
    * @memberOf Engine
    */
   getDefaultContext: function() {
      if (this.defaultContext == null) {
         this.defaultContext = DocumentContext.create();
      }

      return this.defaultContext;
   },

   //====================================================================================================
   //====================================================================================================
   //                                  GLOBAL OBJECT MANAGEMENT
   //====================================================================================================
   //====================================================================================================

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

   //====================================================================================================
   //====================================================================================================
   //                                    ENGINE PROCESS CONTROL
   //====================================================================================================
   //====================================================================================================

   /**
    * Starts the engine and loads the basic engine scripts.  When all scripts required
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
      this.started = true;

      // Load the required scripts
      this.loadEngineScripts();
   },

   /**
    * Runs the engine.  This will be called after all scripts have been loaded.
    * You will also need to call this if you pause the engine.
    * @memberOf Engine
    */
   run: function() {
      var mode = "[";
      mode += (this.debugMode ? "DEBUG" : "");
      mode += (this.localMode ? (mode.length > 0 ? " LOCAL" : "LOCAL") : "");
      mode += "]"
      Console.warn(">>> Engine started. " + (mode != "[]" ? mode : ""));
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
      if (!this.running && this.started)
      {
         this.running = true;
         setTimeout(function() { Engine.shutdown(); }, 10);
      }

      this.started = false;
      window.clearTimeout(Engine.dependencyProcessor);

      Console.warn(">>> Engine shutting down...");

      // Stop world timer
      window.clearTimeout(Engine.globalTimer);

      if (this.metricDisplay)
      {
         this.metricDisplay.remove();
         this.metricDisplay = null;
      }

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

   //====================================================================================================
   //====================================================================================================
   //                                     SCRIPT PROCESSING
   //====================================================================================================
   //====================================================================================================

   /**
    * Load a stylesheet and append it to the document.  Allows for
    * scripts to specify additional stylesheets that can be loaded
    * as needed.
    *
    * @param stylesheetPath {String} Path to the stylesheet, relative to
    *                                the engine path.
    * @memberOf Engine
    */
   loadStylesheet: function(stylesheetPath, relative) {
      stylesheetPath = (relative ? "" : this.getEnginePath()) + stylesheetPath;
      var f = function() {
         $.get(stylesheetPath, function(data) {
            // process the data to replace the "enginePath" variable
            var epRE = /(\$<enginePath>)/g;
            data = data.replace(epRE, Engine.getEnginePath());
            $("head", document).append($("<style type='text/css'/>").text(data));
            Console.debug("Stylesheet loaded '" + stylesheetPath + "'");
            Engine.readyForNextScript = true;
         }, "text");
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
      if (!Engine.scriptQueue) {
         // Create the queue
         Engine.scriptQueue = [];
      }

      // Track what we need to load
      Engine.scriptLoadCount++;
      Engine.updateProgress();

      // Put script into load queue
      Engine.scriptQueue.push(scriptPath);
      Engine.runScriptQueue();
   },

   runScriptQueue: function() {
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
      Engine.scriptLoadCount++;
      Engine.updateProgress();
      Engine.scriptQueue.push(cb);
      Engine.runScriptQueue();
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
            Engine.handleScriptDone();
            scriptPath();
            Engine.readyForNextScript = true;
            return;
         }

         this.doLoad(scriptPath);
      }
   },

   doLoad: function(scriptPath, simplePath, cb) {
      if (!this.started) {
         return;
      }

      var s = scriptPath.replace(/[\/\.]/g,"_");
      if (this.loadedScripts[s] == null)
      {
         // Store the request in the cache
         this.loadedScripts[s] = scriptPath;

         // We'll use our own script loader so we can detect errors (i.e. missing files).
         var n = document.createElement("script");
         n.src = scriptPath;
         n.type = "text/javascript";

         // When the file is loaded
         var fn = function() {
            if (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") {
               Console.debug("Loaded '" + scriptPath + "'");
               Engine.handleScriptDone();
               if (cb) {
                  cb(simplePath);
               }
		         if (!Engine.localMode) {
						// Delete the script node
						$(n).remove();
					}

            }
            Engine.readyForNextScript = true;
         };

         // When an error occurs
         var eFn = function() {
            Console.error("File not found: ", scriptPath);
            Engine.readyForNextScript = true;
         };

         if ($.browser.msie) {
            n.defer = true;
            n.onreadystatechange = fn;
            n.onerror = eFn;
         } else {
            n.onload = fn;
            n.onerror = eFn;
         }

         var h = document.getElementsByTagName("head")[0];
         h.appendChild(n);
      } else {
         // Already have this script
         Engine.readyForNextScript = true;
      }
   },

   loadNow: function(scriptPath, cb) {
      Engine.scriptLoadCount++;
      Engine.updateProgress();
      if ($.browser.safari) {
         Engine.load(scriptPath);
         if (cb) {
            Engine.setQueueCallback(function() {
               cb(scriptPath);
            });
         }
      } else {
         this.doLoad(this.getEnginePath() + scriptPath, scriptPath, cb);
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
         if (window["DocumentContext"] != null) {

            // Start the engine
            Engine.run();

            // Stop the timer
            clearInterval(Engine.gameLoadTimer);
            Engine.gameLoadTimer = null;

            // Create the default context (the document)
            Console.debug("Loading '" + gameSource + "'");
            engine.loadScript(gameSource);

            // Start the game when it's ready
            if (gameObjectName) {
               Engine.gameRunTimer = setInterval(function() {
                  if (typeof window[gameObjectName] != "undefined") {
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

   handleScriptDone: function() {
      Engine.scriptsProcessed++;
      Engine.scriptRatio = Engine.scriptsProcessed / Engine.scriptLoadCount;
      Engine.scriptRatio = Engine.scriptRatio > 1 ? 1 : Engine.scriptRatio;
      Engine.updateProgress();
   },

   updateProgress: function() {
      var pBar = jQuery("#engine-load-progress");
      if (pBar.length > 0) {
         // Update their progress bar
         if (pBar.css("position") != "relative" || pBar.css("position") != "absolute") {
            pBar.css("position", "relative");
         }
         var pW = pBar.width();
         var fill = Math.floor(pW * Engine.scriptRatio);
         var fBar = jQuery("#engine-load-progress .bar");
         if (fBar.length == 0) {
            fBar = jQuery("<div class='bar' style='position: absolute; top: 0px; left: 0px; height: 100%;'></div>");
            pBar.append(fBar);
         }
         fBar.width(fill);
      }
   },

   /**
    * Get the path to the engine.  Uses the location of the <tt>engine.js</tt>
    * file that was loaded.
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
            if (src != null && src.indexOf("/engine/engine.js") != -1)
            {
               // Get the path
               this.engineLocation = src.match(/(.*)\/engine\/engine\.js/)[1];
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

      // The basics needed by the engine to get started
      this.loadNow("/engine/engine.game.js");
      this.loadNow("/engine/engine.rendercontext.js");
      this.loadNow("/rendercontexts/context.render2d.js");
      this.loadNow("/rendercontexts/context.htmlelement.js");
      this.loadNow("/rendercontexts/context.documentcontext.js");
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

   //====================================================================================================
   //====================================================================================================
   //                                     METRICS MANAGEMENT
   //====================================================================================================
   //====================================================================================================

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
    * Creates a button for the metrics window
    * @private
    */
   metricButton: function(cssClass, fn) {
      return $("<div class='metric-button " + cssClass + "' title='" + cssClass + "'><!-- --></div>").click(fn);
   },

   /**
    * Render the metrics window
    * @private
    */
   renderMetrics: function() {

      if (this.showMetricsWindow && !this.metricDisplay) {
         this.metricDisplay = $("<div/>").addClass("metrics");
         this.metricDisplay.append(this.metricButton("run", function() { Engine.run(); }));
         this.metricDisplay.append(this.metricButton("pause", function() { Engine.pause(); }));
         this.metricDisplay.append(this.metricButton("shutdown", function() { Engine.shutdown(); }));

         this.metricDisplay.append($("<div class='items'/>"));
         this.metricDisplay.appendTo($("body"));
      }
      else if (!this.showMetricsWindow && this.metricDisplay) {
         this.metricDisplay.remove();
         this.metricDisplay = null;
      }

      if (this.showMetricsWindow && this.lastMetricSample-- == 0)
      {
         // Add some metrics to assist the developer
         var d = new Date().getTime() - Engine.worldTime;
         Engine.addMetric("FPS", Math.floor((1 / this.fpsClock) * 1000), false, "#");
         Engine.addMetric("aFPS", Math.floor((1 / d) * 1000), true, "#");
         Engine.addMetric("avail", this.fpsClock, false, "#ms");
         Engine.addMetric("frame", d, true, "#ms");
         Engine.addMetric("load", Math.floor((d / this.fpsClock) * 100), true, "#%");
         Engine.addMetric("visObj", Engine.vObj, false, "#");

         this.updateMetrics();
         this.lastMetricSample = this.metricSampleRate;
      }
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
      $(".items", this.metricDisplay).html(h);
   },

   /**
    * Prints the version of the engine.
    * @memberOf Engine
    */
   toString: function() {
      return "The Render Engine " + this.version;
   },

   //====================================================================================================
   //====================================================================================================
   //                                   DEPENDENCY PROCESSOR
   //
   // These methods handle object dependencies so that each object will be
   // initialized as soon as its dependencies become available.  Using this method
   // scripts can be loaded immediately, using the browsers threading model, and
   // executed when dependencies are fulfilled.
   //====================================================================================================
   //====================================================================================================

   dependencyList: {},
   dependencyCount: 0,
   dependencyProcessor: null,

   /**
    * Include a script file.
    *
    * @param scriptURL {String} The URL of the script file
    */
   include: function(scriptURL) {
      Engine.loadNow(scriptURL);
   },

   /**
    * @param objectName {String} The name of the object class
    * @param dependencies {Array} An array of object names the object to initialize
    *                     is dependent on.  When all objects have been created, the
    *                     object will be initialized.
    * @param fn {Function} The function to run when the object can be initialized.
    */
   initObject: function(objectName, dependency, fn) {
      var objDeps = Engine.findAllDependencies(objectName, fn);

      // Add the known dependency to the list of object
      // dependencies we discovered
      objDeps.push(dependency);
      var newDeps = [];

      // Check for nulls and circular references
      for (var d in objDeps) {
         if (objDeps[d] != null) {
            if (objDeps[d].split(".")[0] != objectName) {
               newDeps.push(objDeps[d]);
            } else {
               Console.warn("Object references itself: ", objectName);
            }
         }
      }

      Engine.dependencyList[objectName] = {deps: newDeps, objFn: fn};
      Engine.dependencyCount++;
      Console.info(objectName + " depends on: " + newDeps);

      // Check for 1st level circular references
      this.checkCircularRefs(objectName);

      if (!Engine.dependencyProcessor) {
         Engine.dependencyProcessor = window.setTimeout(Engine.processDependencies, 100);
      }
   },

   /**
    * Check the object to make sure the namespace(s) are defined.
    * @param objName {String} A dot-notation class name
    * @private
    */
   checkNSDeps: function(objName) {
      var objHr = objName.split(".");

      if (objHr.length == 0) {
         return true;
      }

      var o = window;
      for (var i = 0; i < objHr.length - 1; i++) {
         o = o[objHr[i]];
         if (!o) {
            return false;
         }
      }
      return true;
   },

   /**
    * Get the parent class of the object specified by classname string.
    * @param classname {String} A dot-notation class name
    * @private
    */
   getParentClass: function(classname) {
      var objHr = classname.split(".");
      var o = window;
      for (var i = 0; i < objHr.length - 1; i++) {
         o = o[objHr[i]];
         if (!o) {
            return null;
         }
      }
      return o;
   },

   /**
    * Dependency processor.
    * @private
    */
   processDependencies: function() {
      var pDeps = [];
      var dCount = 0;
      for (var d in Engine.dependencyList) {
         // Check to see if the dependencies of an object are loaded
         // We also need to make sure that it's namespace(s) are initialized
         dCount++;

         var deps = Engine.dependencyList[d].deps;
         var resolved = [];
         var miss = false;
         for (var dep in deps) {
            if (deps[dep] != null && window[deps[dep]] == null) {
               miss = true;
            } else {
               resolved.push(deps[dep]);
            }
         }

         for (var x in resolved) {
            EngineSupport.arrayRemove(Engine.dependencyList[d].deps, resolved[x]);
         }

         if (!miss && Engine.checkNSDeps(d)) {
            // We can initialize it
            var parentObj = Engine.getParentClass(d);
            parentObj[d] = Engine.dependencyList[d].objFn();
            Console.info("Initializing", d);

            // Remember what we processed so we don't process them again
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
   },

   /*
    * The following set of functions breaks apart a function into its
    * components.  It is used to determine the dependencies of classes.
    */

   /**
    * Find variables defined in a function
    * @private
    */
   findVars: function(objectName, obj) {
      // Find all variables explicitly defined
      var def = obj.toString();
      var vTable = [];
      var nR = "([\\$_\\w\\.]*)";
      var vR = new RegExp("(var\\s*" + nR + "\\s*=?)","g");
      var m;
      while ((m = vR.exec(def)) != null) {
         vTable.push(m[2]);
      }
      return vTable;

   },

   /**
    * Find object dependencies in variables, arguments, and method usage.
    * @private
    */
   findDependencies: function(objectName, obj) {
      // Find all dependent objects
      var def = obj.toString();
      var dTable = [];
      var nR = "([\\$_\\w\\.]*)";
      var nwR = new RegExp("(new\\s+" + nR + ")","g");
      var ctR = new RegExp("(" + nR + "\\.create\\()","g");
      var fcR = new RegExp("(" + nR + "\\()", "g");
      var inR = new RegExp("(intanceof\\s+"+ nR + ")", "g");
      var m;

      // "new"-ing objects
      while ((m = nwR.exec(def)) != null) {
         if (EngineSupport.indexOf(dTable, m[2]) == -1) {
            dTable.push(m[2]);
         }
      }

      // "create"-ing objects
      while ((m = ctR.exec(def)) != null) {
         if (EngineSupport.indexOf(dTable, m[2]) == -1) {
            dTable.push(m[2]);
         }
      }

      // method dependencies
      while ((m = fcR.exec(def)) != null) {
         if (m[2].indexOf(".") != -1) {
            var k = m[2].split(".")[0];
            if (EngineSupport.indexOf(dTable, k) == -1) {
               dTable.push(k);
            }
         }
      }

      // "instanceof" checks
      while ((m = inR.exec(def)) != null) {
         if (EngineSupport.indexOf(dTable, m[2]) == -1) {
            dTable.push(m[2]);
         }
      }

      return dTable;
   },

   /**
    * Process anonymous functions
    * @private
    */
   findAnonDeps: function(objectName, str) {
      var fTable = {};
      var strR = /(["|']).*?\1/g;

      var aFnRE = new RegExp("function\\s*\\(([\\$\\w_, ]*?)\\)\\s*\\{((.|\\r|\\n)*?)\\};?","g");
      var a = 0;
      while ((m = aFnRE.exec(str)) != null) {
         var f = "_" + (a++);
         var fdef = m[2].replace(strR, "");

         // Process each function
         fTable[f] = { vars: Engine.findVars(objectName, fdef),
                       deps: Engine.findDependencies(objectName, fdef) };
         fTable[f].deps = EngineSupport.filter(fTable[f].deps, function(e) {
            return (e != "" && e != "this" && e != "arguments");
         });

         var args = m[1].split(",");
         var vs = fTable[f].vars;
         for (var a in args) {
            if (EngineSupport.indexOf(vs, args[a]) == -1) {
               vs.push(args[a].replace(" ",""));
            }
         }
      }

      return Engine.procDeps(objectName, fTable);
   },

   /**
    * Finds all of the dependencies within an object class.
    * @private
    */
   findAllDependencies: function(objectName, obj) {
      var defs;
      var fTable = {};

      try {
         var k = obj();
      } catch (ex) {
         // The class probably extends a non-existent class. Replace the parent
         // class with a known class and evaluate as a dummy class
         var extRE = new RegExp("(var\\s*)?([\\$_\\w\\.]*?)\\s*=\\s*([\\$_\\w\\.]*?)\\.extend\\(");
         var classDef = obj.toString();
         var nm = null;
         classDef = classDef.replace(extRE, function(str, varDef, classname, parent, offs, s) {
            nm = classname;
            return "return Base.extend(";
         });
         try {
            k = eval("(" + classDef.replace("return " + nm + ";", "") + ")();");
         } catch (inEx) {
            Console.error("Cannot parse class '" + nm + "'");
         }
      }

      if ($.isFunction(k)) {
         // If the class is an instance, get it's class object
         k = k.prototype;
      }

      // Find the internal functions
      for (var f in k) {
         if ($.isFunction(k[f]) && k.hasOwnProperty(f)) {
            var def = k[f].toString();

            var fR = new RegExp("function\\s*\\(([\\$\\w_, ]*?)\\)\\s*\\{((.|\\s)*)","g");
            var m = fR.exec(def);
            if (m) {
               // Remove strings, then comments
               var fdef = m[2].replace(/(["|']).*?\1/g, "");
               fdef = fdef.replace(/\/\/.*\r\n/g, "");
               fdef = fdef.replace("\/\*(.|\s)*?\*\/", "");

               // Process, then remove anonymous functions
               var anonDeps = Engine.findAnonDeps(objectName, fdef);
               var aFnRE = new RegExp("function\\s*\\(([\\$\\w_, ]*?)\\)\\s*\\{((.|\\r|\\n)*?)\\};?","g");
               fdef = fdef.replace(aFnRE, "");

               // Process each function
               fTable[f] = { vars: Engine.findVars(objectName, fdef),
                             deps: Engine.findDependencies(objectName, fdef) };
               fTable[f].deps = EngineSupport.filter(fTable[f].deps, function(e) {
                  return (e != "" && e != "this" && e != "arguments");
               });

               var args = m[1].split(",");
               var vs = fTable[f].vars;
               for (var a in args) {
                  if (EngineSupport.indexOf(vs, args[a]) == -1) {
                     vs.push(args[a].replace(" ",""));
                  }
               }

               // Combine in the anonymous dependencies
               for (var a in anonDeps) {
                  fTable[f].deps.push(anonDeps[a]);
               }
            }
         }
      }

      // This is useful for debugging dependency problems...
      //Console.log("DepTable: ", objectName, fTable);

      return Engine.procDeps(objectName, fTable);
   },

   procDeps: function(objectName, fTable) {
      // Remove dependencies resolved by local variables and arguments
      var r = [];
      var allDeps = [];
      for (var f in fTable) {
         var deps = fTable[f].deps;
         var vars = fTable[f].vars;

         for (var d in deps) {
            var dp = deps[d].split(".")[0];
            if (EngineSupport.indexOf(vars, dp) != -1 && EngineSupport.indexOf(r, deps[d]) == -1) {
               r.push(deps[d]);
            }
         }

         fTable[f].deps = EngineSupport.filter(deps, function(e) {
            return (EngineSupport.indexOf(r, e) == -1);
         });

         for (var d in fTable[f].deps) {
            if (EngineSupport.indexOf(allDeps, fTable[f].deps[d]) == -1) {
               allDeps.push(fTable[f].deps[d]);
            }
         }
      }

      return allDeps;
   },

   /**
    * Perform a quick resolution on first-level circular references.
    * @private
    */
   checkCircularRefs: function(objectName) {
      var deps = Engine.dependencyList[objectName].deps;
      var r = [];
      for (var dep in deps) {
         if (Engine.dependencyList[deps[dep]] && EngineSupport.indexOf(Engine.dependencyList[deps[dep]].deps, objectName) != -1) {
            // Try removing the circular reference
            EngineSupport.arrayRemove(Engine.dependencyList[objectName].deps, deps[dep]);
         }
      }
   },

   /**
    * Dump out any unresolved class dependencies.
    * @return {Object} A list of all classes that haven't been loaded due to resolution conflicts.
    */
   dumpDependencies: function() {
      Console.debug(Engine.dependencyList);
   },

   //====================================================================================================
   //====================================================================================================
   //                                        THE WORLD TIMER
   //====================================================================================================
   //====================================================================================================

   /**
    * This is the process which updates the world.  It starts with the default
    * context, telling it to update itself.  Since each context is a container,
    * all of the objects in the container will be called to update, and then
    * render themselves.
    *
    * @private
    * @memberOf Engine
    */
   engineTimer: function() {

      if (!this.running) {
         return;
      }

      Engine.worldTime = new Date().getTime();

      // Update the world
      if (Engine.getDefaultContext() != null)
      {
         Engine.vObj = 0;
         Engine.getDefaultContext().update(null, Engine.worldTime);
         Engine.renderMetrics();
     }

      // When the process is done, start all over again
      Engine.globalTimer = setTimeout(function _engineTimer() { Engine.engineTimer(); }, this.fpsClock);
   }

 }, { // Interface
   globalTimer: null
 });

//=================================================================================================
//=================================================================================================
//                                      INITIALIZATION
//=================================================================================================
//=================================================================================================

// Start the console so logging can take place immediately
Console.startup();

// Start the engine
Engine.startup();

// Set up the engine using whatever query params were passed
Engine.setDebugMode(EngineSupport.checkBooleanParam("debug"));

if (Engine.getDebugMode())
{
   Console.setDebugLevel(EngineSupport.getNumericParam("debugLevel", Console.DEBUGLEVEL_DEBUG));
}

if (EngineSupport.checkBooleanParam("metrics"))
{
   Engine.showMetrics();
}

// Local mode keeps loaded script source available
Engine.localMode = EngineSupport.checkBooleanParam("local");
