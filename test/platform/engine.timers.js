/**
 * The Render Engine
 * Timers
 * 
 * A collection of timer objects
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
 
var Timer = BaseObject.extend({

   timer: null,
   
   running: false,
   
   constructor: function(name, interval, callback) {
      callback = name instanceof Number ? interval : callback;
      interval = name instanceof Number ? name : interval;
      name = name instanceof Number ? "Timeout" : name;
      
      Assert((typeof callback == "function"), "Callback must be a function in Timer");
      
      this.base(name);
      this.interval = interval;
      this.callback = callback;
      this.restart(); 
   },
   
   destroy: function() {
      this.timer = null;
      this.base();
   },
   
   getTimer: function() {
      return this.timer;
   },
   
   setTimer: function(timer) {
      this.timer = timer;
   },
   
   isRunning: function() {
      return this.running;
   },
   
   cancel: function() {
      this.timer = null;
      this.running = false;
   },
   
   restart: function() {
      this.cancel();
      this.running = true;
   },
   
   setCallback: function(callback) {
      Assert((typeof callback == "function"), "Callback must be a function in Timer.setCallback");
      this.callback = callback;
      if (this.isRunning)
      {
         this.restart();
      }
   },
   
   getCallback: function() {
      return this.callback;
   },
   
   setInterval: function(interval) {
      this.cancel();
      this.interval = interval;
   },
   
   getInterval: function() {
      return this.interval;
   },
   
   getClassName: function() {
      return "Timer";
   }


});

var Timeout = Timer.extend({

   cancel: function() {
      window.clearTimeout(this.getTimer());
      this.base();
   },
   
   restart: function() {
      this.setTimer(window.setTimeout(this.getCallback(), this.getInterval()));
   },
   
   getClassName: function() {
      return "Timeout";
   }

   
});

var Interval = Timer.extend({

   cancel: function() {
      window.clearInterval(this.getTimer());
      this.base();
   },
   
   restart: function() {
      this.setTimer(window.setInterval(this.getCallback(), this.getInterval()));
   },
   
   getClassName: function() {
      return "Interval";
   }

   
});
