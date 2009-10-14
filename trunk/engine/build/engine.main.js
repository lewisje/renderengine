
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
 * Copyright (c) 2009 Brett Fattori (brettf@renderengine.com)
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
 * frame must complete before another can be rendered.  Frames are not currently skipped
 * by the engine.  It is up to objects to determine if frames have been skipped and adjust
 * themselves appropriately.
 *
 * @static
 */
var Engine = Base.extend(/** @scope Engine.prototype */{
   constructor: null,

   version: "@ENGINE_VERSION",

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
   
   droppedFrames: 0,

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
    * Get the amount of time allocated to draw a single frame
    * @return {Number}
    */
   getFrameTime: function() {
      return this.fpsClock;
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
		if (this.running) {
			return;
		}
		
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
		window.clearTimeout(Engine.globalTimer);
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
			// If the engine is not currently running (paused) restart it
			// and then re-perform the shutdown
         this.running = true;
         setTimeout(function() { Engine.shutdown(); }, 10);
			return;
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
      if (typeof PooledObject != "undefined") {
         PooledObject.objectPool = null;
      }

      Assert((this.livingObjects == 0), "Object references not cleaned up!");

      // Perform final cleanup (silly hack for unit testing)
      if (!Engine.UNIT_TESTING) {
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
   },

   //====================================================================================================
   //====================================================================================================
   //                                     SCRIPT PROCESSING
   //====================================================================================================
   //====================================================================================================

   /**
    * Status message when a script is not found
    */
   SCRIPT_NOT_FOUND: false,
   
   /**
    * Status message when a script is successfully loaded
    */
   SCRIPT_LOADED: true,

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

   /**
    * Internal method which runs the script queue to handle scripts and functions
    * which are queued to run sequentially.
    * @private
    */
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
         if (typeof scriptPath === "function") {
            Engine.handleScriptDone();
            scriptPath();
            Engine.readyForNextScript = true;
            return;
         }

         this.doLoad(scriptPath);
      }
   },

   /**
    * This method performs the actual script loading.
    * @private
    */
   doLoad: function(scriptPath, simplePath, cb) {
      if (!this.started) {
         return;
      }

      var s = scriptPath.replace(/[\/\.]/g,"_");
      if (this.loadedScripts[s] == null)
      {
         // Store the request in the cache
         this.loadedScripts[s] = scriptPath;

         if ($.browser.Wii) {

            $.get(scriptPath, function(data) {

               // Parse script code for syntax errors
               if (Engine.parseSyntax(data)) {
                  var n = document.createElement("script");
                  n.type = "text/javascript";
                  $(n).text(data);

                  var h = document.getElementsByTagName("head")[0];
                  h.appendChild(n);
                  Engine.readyForNextScript = true;

                  Console.debug("Loaded '" + scriptPath + "'");
               }
               
            }, "text");
         }  else {

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
                     cb(simplePath, Engine.SCRIPT_LOADED);
                  }
                  if (!Engine.localMode) {
                     // Delete the script node
                     $(n).remove(); 
                  }

               }
               Engine.readyForNextScript = true;
            };

            // When an error occurs
            var eFn = function(msg) {
               Console.error("File not found: ", scriptPath);
               if (cb) {
                  cb(simplePath, Engine.SCRIPT_NOT_FOUND);
               }
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
         }

      } else {
         // Already have this script
         Engine.readyForNextScript = true;
      }
   },

   /**
    * Perform an immediate load on the specified script.  Objects within
    * the script may not immediately initialize, unless their dependencies
    * have been resolved.
    * 
    * @param {String} scriptPath The path to the script to load
    * @param {Function} [cb] The function to call when the script is loaded.
    *                   the path of the script loaded and a status message
    *                   will be passed as the two parameters.
    */
   loadNow: function(scriptPath, cb) {
      Engine.scriptLoadCount++;
      Engine.updateProgress();
      this.doLoad(this.getEnginePath() + scriptPath, scriptPath, cb);
   },

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
                  if (typeof window[gameObjectName] != "undefined" &&
                      window[gameObjectName].setup) {
                     clearInterval(Engine.gameRunTimer);
                     Console.warn("Starting: " + gameObjectName);
                     window[gameObjectName].setup();
                  }
               }, 100);
            }
         }
      }, 100);
   },

   /**
    * Load a script relative to the engine path.  A simple helper method which calls
    * {@link #loadScript} and prepends the engine path to the supplied script source.
    *
    * @param scriptSource {String} A URL to load that is relative to the engine path.
    * @memberOf Engine
    */
   load: function(scriptSource) {
      this.loadScript(this.getEnginePath() + scriptSource);
   },

   /**
    * After a script has been loaded, updates the progress
    * @private
    */
   handleScriptDone: function() {
      Engine.scriptsProcessed++;
      Engine.scriptRatio = Engine.scriptsProcessed / Engine.scriptLoadCount;
      Engine.scriptRatio = Engine.scriptRatio > 1 ? 1 : Engine.scriptRatio;
      Engine.updateProgress();
   },

   /**
    * Updates the progress bar (if available)
    * @private
    */
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

   /**
    * Load the scripts required for the engine to run.
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
   
   /**
    * Include a script file.
    *
    * @param scriptURL {String} The URL of the script file
    */
   include: function(scriptURL) {
      Engine.loadNow(scriptURL);
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
   
   manMetrics: function() {
      if ($("div.metric-button.minimize").length > 0) {
         $("div.metric-button.minimize").removeClass("minimize").addClass("maximize").attr("title", "maximize");
         $("div.metrics").css("height", 17);
         $("div.metrics .items").hide();
      } else {
         $("div.metric-button.maximize").removeClass("maximize").addClass("minimize").attr("title", "minimize");
         $("div.metrics .items").show();
         $("div.metrics").css("height", "auto");
      }
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
         this.metricDisplay.append(this.metricButton("minimize", function() { Engine.manMetrics(); }));

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
         Engine.addMetric("FPS", Math.floor((1 / this.fpsClock) * 1000), false, "#");
         Engine.addMetric("aFPS", Math.floor((1 / Engine.frameTime) * 1000), true, "#");
         Engine.addMetric("avail", this.fpsClock, false, "#ms");
         Engine.addMetric("frame", Engine.frameTime, true, "#ms");
         Engine.addMetric("load", Math.floor((Engine.frameTime / this.fpsClock) * 100), true, "#%");
         Engine.addMetric("visObj", Engine.vObj, false, "#");
			Engine.addMetric("dropped", Engine.droppedFrames, false, "#");

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
         this.metrics[metricName] = { val: (fmt ? fmt.replace("#", v) : v), values: vals };
      } else {
         this.metrics[metricName] = { val: (fmt ? fmt.replace("#", value) : value) };
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

      // Update the world
      var nextFrame = Engine.fpsClock;
      if (Engine.getDefaultContext() != null)
      {
         Engine.vObj = 0;
         
         // Render a frame
         Engine.worldTime = new Date().getTime();
         Engine.getDefaultContext().update(null, Engine.worldTime);
         Engine.frameTime = new Date().getTime() - Engine.worldTime;
         
         // Determine when the next frame should draw
         // If we've gone over the allotted time, wait until the next available frame
         var f = nextFrame - Engine.frameTime;
         nextFrame = (f > 0 ? f : nextFrame);
         Engine.droppedFrames += (f <= 0 ? Math.round((f * -1) / Engine.fpsClock) : 0);
         
         // Output any metrics
         if (Engine.showMetricsWindow) {
            Engine.renderMetrics();
         }
     }

      // When the process is done, start all over again
      Engine.globalTimer = setTimeout(function _engineTimer() { Engine.engineTimer(); }, nextFrame);
   }

 }, { // Interface
   globalTimer: null
 });

