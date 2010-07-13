
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

   /*
    * Engine objects
    */
   idRef: 0,                  // Object reference Id
   gameObjects: {},           // Live objects cache
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
   shuttingDown: false,       // Engine is in shutdown phase
   upTime: 0,                 // The startup time
   downTime: 0,               // The shutdown time
   skipFrames: true,          // Skip missed frames

   /*
    * Metrics tracking/display
    */
   metrics: {},               // Tracked metrics
   metricDisplay: null,       // The metric display object
   metricSampleRate: 10,      // Frames between samples
   lastMetricSample: 10,      // Last sample frame
   showMetricsWindow: false,  // Metrics display flag
   vObj: 0,                   // Visible objects
   droppedFrames: 0,          // Non-rendered frames/frames dropped

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
      Assert((this.started == true), "Creating an object when the engine is stopped!");
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
      Assert((obj != null), "Trying to destroy non-existent object!", obj);
      var objId = obj.getId();
      Assert((this.gameObjects[objId] != null), "Re-destroying object!", obj);
      Console.log("DESTROYED Object ", objId, "[", obj, "]");
      this.gameObjects[objId] = null;
      delete this.gameObjects[objId];
      this.livingObjects--;
   },

   /**
    * Get an object by the Id that was assigned during the call to {@link #create}.
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

      // Output support
      Console.debug("System info: ", EngineSupport.sysInfo());
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
      if (this.shuttingDown) {
         // Can't re-shutdown the engine
         return;
      }
      
      if (!this.running && this.started)
      {
         // If the engine is not currently running (i.e. paused) 
         // restart it and then re-perform the shutdown
         this.running = true;
         setTimeout(function() { Engine.shutdown(); }, (this.fpsClock * 2));
         return;
      }

      this.shuttingDown = true;
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
      this.shuttingDown = false;
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
         Engine.addMetric("FPS", this.getFPS(), false, "#");
         Engine.addMetric("aFPS", this.getActualFPS(), true, "#");
         Engine.addMetric("avail", this.fpsClock, false, "#ms");
         Engine.addMetric("frame", Engine.frameTime, true, "#ms");
         Engine.addMetric("load", Math.floor(this.getEngineLoad() * 100), true, "#%");
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
         case "chrome":
         case "Wii":
         case "iPhone":
         case "safari":
         case "mozilla":
         case "opera": return true;
         case "msie":
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

   afterFrameCBs: [],
   
   /**
    * Things to do after a frame has been rendered.  Primarily used
    * by containers to clean up their object references after they've
    * been safely destroyed.
    */
   afterFrame: function(fn) {
      Engine.afterFrameCBs.push(fn);
   },

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

         // Output any metrics
         if (Engine.showMetricsWindow) {
            Engine.renderMetrics();
         }
         
         // Clean up any objects which need to be safely destroyed
         PooledObject.destroySafely();
         
         // Perform any after frame functions
         while (Engine.afterFrameCBs.length > 0) {
            Engine.afterFrameCBs.shift()();
         }
      }

      // When the process is done, start all over again
      Engine.globalTimer = setTimeout(function _engineTimer() { Engine.engineTimer(); }, nextFrame);
   }

 }, { // Interface
   globalTimer: null
 });

