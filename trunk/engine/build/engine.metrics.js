/**
 * The Render Engine
 * 
 * An extension to the engine for metrics processing and display.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 *
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

//====================================================================================================
//====================================================================================================
//                                     METRICS MANAGEMENT
//====================================================================================================
//====================================================================================================
var Engine = Engine.extend({
   /** @lends Engine */
   constructor: null,

   /*
    * Metrics tracking/display
    */
   metrics: {},               // Tracked metrics
   metricDisplay: null,       // The metric display object
   profileDisplay: null,      // The profile display object
   metricSampleRate: 10,      // Frames between samples
   lastMetricSample: 10,      // Last sample frame
   showMetricsWindow: false,  // Metrics display flag
   showMetricsProfile: false, // Metrics profile graph display flag
   vObj: 0,                   // Visible objects
   droppedFrames: 0,          // Non-rendered frames/frames dropped
   profilePos: 0,
   profiles: {},
   

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
    * Show a graph of the engine profile
    * @memberOf Engine
    */
   showProfile: function() {
      this.showMetricsProfile = true;
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

         this.metricDisplay.append(this.metricButton("close", function() { Engine.hideMetrics(); }));
         this.metricDisplay.append(this.metricButton("minimize", function() { Engine.manMetrics(); }));

         this.metricDisplay.append($("<div class='items'/>"));
         this.metricDisplay.appendTo($("body"));
      }
      
      if ((this.showMetricsWindow || this.showMetricsProfile) && this.lastMetricSample-- == 0)
      {
         // Add some metrics to assist the developer
         Engine.addMetric("FPS", this.getFPS(), false, "#");
         Engine.addMetric("aFPS", this.getActualFPS(), true, "#");
         Engine.addMetric("availTime", this.fpsClock, false, "#ms");
         Engine.addMetric("frameGenTime", Engine.frameTime, true, "#ms");
         Engine.addMetric("engineLoad", Math.floor(this.getEngineLoad() * 100), true, "#%");
         Engine.addMetric("visibleObj", Engine.vObj, false, "#");
         Engine.addMetric("droppedFrames", Engine.droppedFrames, false, "#");
         Engine.addMetric("upTime", Math.floor((Engine.worldTime - Engine.upTime)/1000), false, "# sec");

         this.updateMetrics();
         this.lastMetricSample = this.metricSampleRate;
      }
      
      if (this.showMetricsProfile && EngineSupport.sysInfo().browser == "msie") {
         // Profiler not supported in IE
         this.showMetricsProfile = false;
      }
      
      if (this.showMetricsProfile && !this.profileDisplay) {
         this.profileDisplay = $("<canvas width='150' height='100'/>").addClass("engine-profile");
         this.profileDisplay.appendTo($("body"));
         this.profileDisplay[0].getContext('2d').save();
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
         this.metrics[metricName] = { val: (fmt ? fmt.replace("#", v) : v), values: vals, act: v };
      } else {
         this.metrics[metricName] = { val: (fmt ? fmt.replace("#", value) : value), act: value };
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
      var h = "", ctx;
      if (this.showMetricsProfile) {
         ctx = this.profileDisplay[0].getContext('2d');
         ctx.save();
         ctx.translate(147, 0);
      }

      for (var m in this.metrics)
      {
			if (this.showMetricsWindow) {
	         h += m + ": " + this.metrics[m].val + "<br/>";
			}
         if (this.showMetricsProfile) {
            switch (m) {
               case "engineLoad": this.drawProfilePoint("#ffff00", this.metrics[m].act); break;
               case "frameGenTime": this.drawProfilePoint("#ff8888", this.metrics[m].act); break;
               case "visibleObj": this.drawProfilePoint("#339933", this.metrics[m].act); break;
               case "poolLoad" : this.drawProfilePoint("#a0a0ff", this.metrics[m].act); break;
            }
         }
      }
		if (this.showMetricsWindow) {
			$(".items", this.metricDisplay).html(h);
		}
	   if (this.showMetricsProfile) {
         ctx.restore();
         this.moveProfiler();
      }
   },

   drawProfilePoint: function(color, val) {
      var ctx = this.profileDisplay[0].getContext('2d');
      ctx.strokeStyle = color
      try {
         if (!isNaN(val)) {
            ctx.beginPath();
            ctx.moveTo(0, this.profiles[color] || 100);
            ctx.lineTo(1, (100 - val < 1 ? 1 : 100 - val));
            ctx.closePath();
            ctx.stroke();
            this.profiles[color] = (100 - val < 1 ? 1 : 100 - val);
         }
      } catch(ex) {
         
      }
   },
   
   moveProfiler: function() {
      var ctx = this.profileDisplay[0].getContext('2d');
      var imgData = ctx.getImageData(1,0,149,100);
      ctx.save();
      ctx.translate(-1,0);
      ctx.putImageData(imgData, 0, 0);
      ctx.restore();
   },

   /**
    * Run the metrics display.
    * @private
    * @memberOf Engine
    */
   doMetrics: function() { 
      // Output any metrics
      if (Engine.showMetricsWindow || Engine.showMetricsProfile) {
         Engine.renderMetrics();
      } else if (!Engine.showMetricsWindow && Engine.metricDisplay) {
         Engine.metricDisplay.remove();
         Engine.metricDisplay = null;
      }
   }
   
});

if (EngineSupport.checkBooleanParam("metrics"))
{
   Engine.showMetrics();
}

if (EngineSupport.checkBooleanParam("profile"))
{
   Engine.showProfile();
}

