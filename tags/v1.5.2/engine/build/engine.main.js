
/**
 * The Render Engine
 * Engine Class
 *
 * @fileoverview The main engine class
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
 * frame must complete before another can be rendered.  By default, if frames are missed,
 * the engine will wait until the next logical frame can be rendered.  The engine can also
 * run where it doesn't skip frames, and instead runs a constant frame clock.  This
 * doesn't guarantee that the engine will run at a fixed frame rate.
 *
 * @static
 */
var Engine = Base.extend(/** @scope Engine.prototype */{
   version: "@ENGINE_VERSION",

   constructor: null,

   // Default configuration options
   defaultOptions: {
      skipFrames: true,		// Skip missed frames
      billboards: true,		// Use billboards to speed up rendering
      hardwareAccel: false,// Hardware acceleration is not available
      pointAsArc: true,		// Draw points are arcs
		transientMathObject: false		// MathObject is not transient (pooled)
   },

   // Global engine options
   options: {},

   /*
    * Engine objects
    */
   idRef: 0,                  // Object reference Id
   gameObjects: {},           // Live objects cache
   timerPool: {},             // Pool of running timers
   livingObjects: 0,          // Count of live objects

   /*
    * Engine info
    */
   fpsClock: 33,              // The clock rate (ms)
   frameTime: 0,              // Amount of time taken to render a frame
   engineLocation: null,      // URI of engine
   defaultContext: null,      // The default rendering context
   debugMode: false,          // Global debug flag
   localMode: false,          // Local run flag
   started: false,            // Engine started flag
   running: false,            // Engine running flag
   shuttingDown: false,       // Engine is shutting down
   upTime: 0,                 // The startup time
   downTime: 0,               // The shutdown time
   skipFrames: true,          // Skip missed frames

   /*
    * Sound engine info
    */
   soundsEnabled: false,      // Sound engine enabled flag

   /**
    * The current time of the world on the client.  This time is updated
    * for each frame generated by the Engine.
    * @type Number
    * @memberOf Engine
    */
   worldTime: 0,              // The world time

   /**
    * The number of milliseconds the engine has been running.  This time is updated
    * for each frame generated by the Engine.
    * @type Number
    * @memberOf Engine
    */
   liveTime: 0,               // The "alive" time (worldTime-upTime)
   
   shutdownCallbacks: [],		// Methods to call when the engine is shutting down

   // Issue #18 - Intrinsic loading dialog
   loadingCSS: "<style type='text/css'>div.loadbox {width:325px;height:30px;padding:10px;font:10px Arial;border:1px outset gray;-moz-border-radius:10px;-webkit-border-radius:10px} #engine-load-progress { position:relative;border:1px inset gray;width:300px;height:5px} #engine-load-progress .bar {background:silver;}</style>",

   //====================================================================================================
   //====================================================================================================
   //                                      ENGINE PROPERTIES
   //====================================================================================================
   //====================================================================================================

   /**
    * Set/override the engine options.
    * @param opts {Object} Configuration options for the engine
    */
   setOptions: function(opts) {
		// Check for a "defaults" key
		var configOpts;
		if (opts.defaults) {
			configOpts = opts.defaults;
		}
		
		// See if the OS has a key
		var osOpts, platformDefaults, versionDefaults, platformVersions;
		if (opts["platforms"] && opts["platforms"][EngineSupport.sysInfo().OS]) {
			// Yep, extract that one
			osOpts = opts["platforms"][EngineSupport.sysInfo().OS];
			
			// Check for platform defaults
			if (osOpts && osOpts["defaults"]) {
				platformDefaults = osOpts["defaults"];
			}
		}
		
		// Check for general version specific options
		if (opts["versions"]) {
			for (var v in opts["versions"]) {
				if (parseFloat(EngineSupport.sysInfo().version) >= parseFloat(v)) {
					// Add  the version options
					versionDefaults = opts["versions"][v];
				}
			}
		}
		
		// Finally, check the OS for version specific options
		if (osOpts && osOpts["versions"]) {
			for (var v in osOpts["versions"]) {
				if (parseFloat(EngineSupport.sysInfo().version) >= parseFloat(v)) {
					// Add  the version options
					platformVersions = osOpts["versions"][v];
				}
			}
		}
		
      $.extend(Engine.options, configOpts, platformDefaults, versionDefaults, platformVersions);
   },

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
    * Get the FPS (frames per second) the engine is set to run at.
    * @return {Number}
    * @memberOf Engine
    */
   getFPS: function() {
      return Math.floor((1 / this.fpsClock) * 1000)
   },
   
   /**
    * Get the actual FPS (frames per second) the engine is running at.
    * This value will vary as load increases or decreases due to the
    * number of objects being rendered.  A faster machine will be able
    * to handle a higher FPS setting.
    * @return {Number}
    * @memberOf Engine
    */
   getActualFPS: function() {
      return Math.floor((1 / Engine.frameTime) * 1000);
   },
   
   /**
    * Get the amount of time allocated to draw a single frame.
    * @return {Number} Milliseconds allocated to draw a frame
    * @memberOf Engine
    */
   getFrameTime: function() {
      return this.fpsClock;
   },
   
   /**
    * Get the amount of time it took to draw the last frame.  This value
    * varies per frame drawn, based on visible objects, number of operations
    * performed, and other factors.  The draw time can be used to optimize
    * your game for performance.
    * @return {Number} Milliseconds required to draw the frame
    * @memberOf Engine
    */
   getDrawTime: function() {
      return Engine.frameTime;
   },
   
   /**
    * Get the load the currently rendered frame is putting on the engine.  
    * The load represents the amount of
    * work the engine is doing to render a frame.  A value less
    * than one indicates the the engine can render a frame within
    * the amount of time available.  Higher than one indicates the
    * engine cannot render the frame in the time available.
    * <p/>
    * Faster machines will be able to handle more load.  You can use
    * this value to gauge how well your game is performing.
    * @return {Number}
    * @memberOf Engine
    */
   getEngineLoad: function () {
      return (Engine.frameTime / this.fpsClock);
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
            if (src != null && src.match(/(.*)\/engine\/(.*?)engine\.js/))
            {
               // Get the path
               this.engineLocation = src.match(/(.*)\/engine\/(.*?)engine\.js/)[1];
               break;
            }
         }
      }

      return this.engineLocation;
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
      if(this.shuttingDown === true) {
      	Console.warn("Engine shutting down, '" + obj + "' destroyed because it would create an orphaned reference");
      	obj.destroy();
      	return;
      };

      Assert((this.started === true), "Creating an object when the engine is stopped!", obj);

      this.idRef++;
      var objId = obj.getName() + this.idRef;
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
   	if (obj == null) {
   		Console.warn("NULL reference passed to Engine.destroy()!  Ignored.");
   		return;
   	}

      var objId = obj.getId();
      Console.log("DESTROYED Object ", objId, "[", obj, "]");
      this.livingObjects--;
   },
   
   /**
    * Add a timer to the pool so it can be cleaned up when
    * the engine is shutdown, or paused when the engine is
    * paused.
    * @param timerName {String} The timer name
    * @param timer {Timer} The timer to add
    */
   addTimer: function(timerName, timer) {
      Engine.timerPool[timerName] = timer;   
   },

   /**
    * Remove a timer from the pool when it is destroyed.
    * @param timerName {String} The timer name
    */
   removeTimer: function(timerName) {
      Engine.timerPool[timerName] = null;
      delete Engine.timerPool[timerName];
   },

   /**
    * Get an object by the Id that was assigned during the call to {@link #create}.
    *
    * @param id {String} The global Id of the object to locate
    * @return {PooledObject} The object
    * @memberOf Engine
    * @deprecated This method no longer returns an object
    */
   getObject: function(id) {
      return null;
   },

   //====================================================================================================
   //====================================================================================================
   //                                    ENGINE PROCESS CONTROL
   //====================================================================================================
   //====================================================================================================

   /**
    * Load the minimal scripts required for the engine to run.
    * @private
    * @memberOf Engine
    */
   loadEngineScripts: function() {
      // Engine stylesheet
      this.loadStylesheet("/css/engine.css");

      // The basics needed by the engine to get started
      this.loadNow("/engine/engine.game.js");
      this.loadNow("/engine/engine.rendercontext.js");
      this.loadNow("/engine/engine.pooledobject.js");
      this.loadNow("/rendercontexts/context.render2d.js");
      this.loadNow("/rendercontexts/context.htmlelement.js");
      this.loadNow("/rendercontexts/context.documentcontext.js");
   },

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

      // Check for supported browser
      if (!this.browserSupportCheck()) {
         return;
      };

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
      if (Engine.shuttingDown || Engine.running) {
         return;
      }
      
      // Restart all of the timers
      for (var tm in Engine.timerPool) {
         Engine.timerPool[tm].restart();
      }
      
      var mode = "[";
      mode += (this.debugMode ? "DEBUG" : "");
      mode += (this.localMode ? (mode.length > 0 ? " LOCAL" : "LOCAL") : "");
      mode += "]"
      Console.warn(">>> Engine started. " + (mode != "[]" ? mode : ""));
      this.running = true;
      this.shuttingDown = false;

      Console.debug(">>> sysinfo: ", EngineSupport.sysInfo());

      // Start world timer
      Engine.globalTimer = window.setTimeout(function() { Engine.engineTimer(); }, this.fpsClock);

   },

   /**
    * Pauses the engine.
    * @memberOf Engine
    */
   pause: function() {
      if (Engine.shuttingDown) {
         return;
      }

      // Pause all of the timers
      Console.debug("Pausing all timers");
      for (var tm in Engine.timerPool) {
         Engine.timerPool[tm].pause();
      }
      
      Console.warn(">>> Engine paused <<<");
      window.clearTimeout(Engine.globalTimer);
      this.running = false;
   },

	/**
	 * Add a method to be called when the engine is being shutdown.  Use this
	 * method to allow an object, which is not referenced to by the engine, to
	 * perform cleanup actions.
	 *
	 * @param fn {Function} The callback function
	 */
	onShutdown: function(fn) {
		if (Engine.shuttingDown === true) {
			return;
		}
		
		Engine.shutdownCallbacks.push(fn);
	},

   /**
    * Shutdown the engine.  Stops the global timer and cleans up (destroys) all
    * objects that have been created and added to the world.
    * @memberOf Engine
    */
   shutdown: function() {
      if (Engine.shuttingDown) {
         // Prevent another shutdown
         return;
      }
      
      Engine.shuttingDown = true;
      
      if (!this.running && this.started)
      {
         // If the engine is not currently running (i.e. paused) 
         // restart it and then re-perform the shutdown
         this.running = true;
         setTimeout(function() { Engine.shutdown(); }, (this.fpsClock * 2));
         return;
      }

      this.started = false;
      window.clearTimeout(Engine.dependencyProcessor);

      Console.warn(">>> Engine shutting down...");

      // Stop world timer
      window.clearTimeout(Engine.globalTimer);
      
      // Run through shutdown callbacks to allow objects not tracked by Engine
      // to clean up references, etc.
      while (Engine.shutdownCallbacks.length > 0) {
      	Engine.shutdownCallbacks.shift()();
      };

      if (this.metricDisplay)
      {
         this.metricDisplay.remove();
         this.metricDisplay = null;
      }

      // Cancel all of the timers
      Console.debug("Cancelling all timers");
      for (var tm in Engine.timerPool) {
         Engine.timerPool[tm].cancel();
      }
      Engine.timerPool = {};

      this.downTime = new Date().getTime();
      Console.warn(">>> Engine stopped.  Runtime: " + (this.downTime - this.upTime) + "ms");

      this.running = false;
      
      // Kill off the default context and anything
      // that's attached to it.  We'll alert the
      // developer if there's an issue with orphaned objects
      this.getDefaultContext().destroy();
      
      // Dump the object pool
      if (typeof PooledObject != "undefined") {
         PooledObject.objectPool = null;
      }

      AssertWarn((this.livingObjects == 0), "Object references not cleaned up!");
      
      this.loadedScripts = {};
      this.scriptLoadCount = 0;
      this.scriptsProcessed = 0;
      this.defaultContext = null;

      // Perform final cleanup
      if (!Engine.UNIT_TESTING /* Is this a hack? */) {
         this.cleanup();
      }
   },

   /**
    * After a successful shutdown, the Engine needs to clean up
    * all of the objects that were created on the window object by the engine.
    * @memberOf Engine
    * @private
    */
   cleanup: function() {
      // Protect the HTML console, if visible
      var hdc = $("#debug-console").remove();
   
      // Remove the body contents
      $(document.body).empty();

      if (hdc.length != 0) {
         $(document.body).append(hdc);
      }

      // Remove all scripts from the <head>
      $("head script", document).remove();
      
      // Final cleanup
      Linker.cleanup();
      
      // Shutdown complete
      Engine.shuttingDown = false;
   },


   /**
    * Initializes an object for use in the engine.  Calling this method is required to make sure
    * that all dependencies are resolved before actually instantiating an object of the specified
    * class.  This uses the {@link Linker} class to handle dependency processing and resolution.
    *
    * @param objectName {String} The name of the object class
    * @param primaryDependency {String} The name of the class for which the <tt>objectName</tt> class is
    *                                   dependent upon.  Specifying <tt>null</tt> will assume the <tt>Base</tt> class.
    * @param fn {Function} The function to run when the object can be initialized.
    */
   initObject: function(objectName, primaryDependency, fn) {
      Linker.initObject(objectName, primaryDependency, fn);
   },

   /**
    * Check the current browser to see if it is supported by the
    * engine.  If it isn't, there's no reason to load the remainder of
    * the engine.  This check can be disabled with the <tt>disableBrowserCheck</tt>
    * query parameter set to <tt>true</tt>.
    * <p/>
    * If the browser isn't supported, the engine is shutdown and a message is
    * displayed.
    */
   browserSupportCheck: function() {
      if (EngineSupport.checkBooleanParam("disableBrowserCheck")) {
         return true;
      }
      var sInfo = EngineSupport.sysInfo();
      var msg = "This browser is not currently supported by <i>The Render Engine</i>.<br/><br/>";
      msg += "Please see <a href='http://www.renderengine.com/browsers.php' target='_blank'>the list of ";
      msg += "supported browsers</a> for more information.";
      switch (sInfo.browser) {
         case "iPhone":
			case "android": 
         case "msie": Engine.options.billboards = false; 
                      return true;
         case "chrome":
         case "Wii":
         case "safari":
         case "mozilla":
         case "firefox":
         case "opera": return true;
         case "unknown": $(document).ready(function() {
                           Engine.shutdown();
                           $("body", document).append($("<div class='unsupported'>")
                              .html(msg));
                        });
      }
      return false;
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
      if (Engine.shuttingDown) {
         return;
      }

		/* pragma:DEBUG_START */
		try {
			Profiler.enter("Engine.engineTimer()");
		/* pragma:DEBUG_END */

			var nextFrame = Engine.fpsClock;

			// Update the world
			if (Engine.running && Engine.getDefaultContext() != null) {
				Engine.vObj = 0;

				// Render a frame
				Engine.worldTime = new Date().getTime();
				Engine.getDefaultContext().update(null, Engine.worldTime);
				Engine.frameTime = new Date().getTime() - Engine.worldTime;
				Engine.liveTime = Engine.worldTime - Engine.upTime;

				// Determine when the next frame should draw
				// If we've gone over the allotted time, wait until the next available frame
				var f = nextFrame - Engine.frameTime;
				nextFrame = (Engine.skipFrames ? (f > 0 ? f : nextFrame) : Engine.fpsClock);
				Engine.droppedFrames += (f <= 0 ? Math.round((f * -1) / Engine.fpsClock) : 0);

				// Update the metrics display
				Engine.doMetrics();
			}

			// When the process is done, start all over again
			Engine.globalTimer = setTimeout(function _engineTimer() { Engine.engineTimer(); }, nextFrame);

		/* pragma:DEBUG_START */
		} finally {
			Profiler.exit();
		}
		/* pragma:DEBUG_END */
   },
	
	// ======================================================
	// Declarations here only for documentation purposes
	// See engine.script.js
	// ======================================================
	
   /**
    * Status message when a script is not found
    * @type Boolean
    * @memberOf Engine
    * @field
    */
   SCRIPT_NOT_FOUND: false,
   
   /**
    * Status message when a script is successfully loaded
    * @type Boolean
    * @memberOf Engine
    * @field
    */
   SCRIPT_LOADED: true,

   /**
    * Include a script file.  This is the method used to load additional
    * script files, relative to the engine's location.
<pre>
	Engine.include("/rendercontexts/context.canvascontext.js");
</pre>
    *
    * @param scriptURL {String} The URL of the script file
    * @memberOf Engine
    * @function
    */
   include: null,

   /**
    * Queue a script to load from the server and append it to
    * the head element of the browser.  Script names are
    * cached so they will not be loaded again.  Each script in the
    * queue is processed synchronously.
    *
    * @param scriptPath {String} The URL of a script to load.
    * @memberOf Engine
    * @function
    */
   loadScript: null,

	/**
	 * Load text from the specified path.
	 *
	 * @param path {String} The url to load
	 * @param data {Object} Optional arguments to pass to server
	 * @param callback {Function} The callback method which is passed the
	 *		text and status code (a number) of the request.
	 * @memberOf Engine
    * @function
	 */	 
	loadText: null,
	
	/**
	 * Load text from the specified path and parse it as JSON.  We're doing
	 * a little pre-parsing of the returned data so that the JSON can include
	 * comments which is not spec.
	 *
	 * @param path {String} The url to load
	 * @param data {Object} Optional arguments to pass to server
	 * @param callback {Function} The callback method which is passed the
	 *		JSON object and status code (a number) of the request.
    * @memberOf Engine
    * @function
	 */	 
	loadJSON: null,

   /**
    * Insert a callback into the script load queue so that when a
    * certain number of files has been loaded, we can call
    * a method.  Allows for functionality to start with
    * incremental loading.
    *
    * @param cb {Function} A callback to execute
    * @memberOf Engine
    * @function
    */
   setQueueCallback: null,

   /**
    * You can pause the queue from a callback function, then
    * unpause it to continue processing queued scripts.  This will
    * allow you to wait for an event to occur before continuing to
    * to load scripts.
    *
    * @param state {Boolean} <tt>true</tt> to put the queue processor
    *                        in a paused state.
    * @memberOf Engine
    * @function
    */
   pauseQueue: null,

   /**
    * Loads a game's script.  This will wait until the specified
    * <tt>gameObjectName</tt> is available before running it.  Doing so will
    * ensure that all dependencies have been resolved before starting a game.
    * Also creates the default rendering context for the engine.
    * <p/>
    * All games should execute this method to start their processing, rather than
    * using the script loading mechanism for engine or game scripts.  This is used
    * for the main game script only.  Normally it would appear in the game's "index" file.
    * <pre>
    *  &lt;script type="text/javascript"&gt;
    *     // Load the game script
    *     Engine.loadGame('game.js','Spaceroids');
    *  &lt;/script&gt;
    * </pre>
    *
    * @param gameSource {String} The URL of the game script.
    * @param gameObjectName {String} The string name of the game object to execute.  When
    *                       the framework if ready, the <tt>startup()</tt> method of this
    *                       object will be called.
    * @param [gameDisplayName] {String} An optional string to display in the loading dialog
    * @memberOf Engine
    * @function
    */
   loadGame: null,

   /**
    * Load a script relative to the engine path.  A simple helper method which calls
    * {@link #loadScript} and prepends the engine path to the supplied script source.
    *
    * @param scriptSource {String} A URL to load that is relative to the engine path.
    * @memberOf Engine
    * @function
    */
   load: null,

   /**
    * Load a stylesheet and append it to the document.  Allows for
    * scripts to specify additional stylesheets that can be loaded
    * as needed.  Additionally, you can use thise method to inject
    * the engine path into the css being loaded.  Using the variable
    * <tt>$&lt;enginePath&gt;</tt>, you can load css relative to the
    * engine's path.  For example:
    * <pre>
    *    .foo {
    *       background: url('$&lt;enginePath&gt;/myGame/images/bar.png') no-repeat 50% 50%;
    *    }
    * </pre>
    *
    * @param stylesheetPath {String} Path to the stylesheet, relative to
    *                                the engine path.
    * @memberOf Engine
    * @function
    */
   loadStylesheet: null,

	// ======================================================
	// Declarations here only for documentation purposes
	// See engine.metrics.js
	// ======================================================

   /**
    * Toggle the display of the metrics window.  Any metrics
    * that are being tracked will be reported in this window.
    * @memberOf Engine
    * @function
    */
   toggleMetrics: null,

   /**
    * Show the metrics window.
    * @memberOf Engine
    * @function
    */
   showMetrics: null,
   
   /**
    * Show the engine performance graph.
    * @memberOf Engine
    * @function
    */
   showProfile: null,

   /**
    * Hide the metrics window.
    * @memberOf Engine
    * @function
    */
   hideMetrics: null,

   /**
    * Set the interval at which metrics are sampled by the system.
    * The default is for metrics to be calculated every 10 engine frames.
    *
    * @param sampleRate {Number} The number of ticks between samples
    * @memberOf Engine
    * @function
    */
   setMetricSampleRate: null,

   /**
    * Add a metric to the game engine that can be displayed
    * while it is running.  If smoothing is selected, a 3 point
    * running average will be used to smooth out jitters in the
    * value that is shown.  For the <tt>fmt</tt> argument,
    * you can provide a string which contains the pound sign "#"
    * that will be used to determine where the calculated value will
    * occur in the formatted string.
    *
    * @param metricName {String} The name of the metric to track
    * @param value {String/Number} The value of the metric.
    * @param smoothing {Boolean} <tt>true</tt> to use 3 point average smoothing
    * @param fmt {String} The way the value should be formatted in the display (e.g. "#ms")
    * @memberOf Engine
    * @function
    */
   addMetric: null,

   /**
    * Remove a metric from the display
    *
    * @param metricName {String} The name of the metric to remove
    * @memberOf Engine
    * @function
    */
   removeMetric: null

 }, { // Interface
   globalTimer: null
 });
