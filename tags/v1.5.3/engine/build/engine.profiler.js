/**
 * The Render Engine
 * JavaScript Profiler
 *
 * @fileoverview Profiler Object
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
 * Return a new date object.
 * @return {Date}
 */
function now() {
	return new Date();
}

/**
 * @class A static JavaScript implementation of a simple profiler.
 * @static
 */
var Profiler = {
	profileStack: [],
	allProfiles: {},
	profiles: [],
	running: false
};

/**
 * Start the profiler.
 * @memberOf Profiler
 */
Profiler.start = function() {
	Profiler.resetProfiles();
	Profiler.running = true;
};

/**
 * Stop the profiler, dumping whatever was being profiled.
 * @memberOf Profiler
 */
Profiler.stop = function() {
	Profiler.dump();
	Profiler.running = false;
};

/**
 * Add a profile monitor to the stack of running profiles.  A good way to profile code
 * is to use the <tt>try/finally</tt> method so that the profile will be exited even
 * if the method returns from multiple points.
<pre>
   function func() {
      try {
         Profiler.enter("func");
         
         doStuff = doStuff + 1;
         return doStuff;
      } finally {
         Profiler.exit();
      }
   }
</pre>
 *
 * @param prof {String} The name of the profile
 * @memberOf Profiler
 */
Profiler.enter = function(prof) {
	if (!Profiler.running) { return; }
	var profile = Profiler.allProfiles[prof];
	if (profile == null) {
		// Create a monitor
		profile = Profiler.allProfiles[prof] = {
			name: prof,
			startMS: now(),
			execs: 0,
			totalMS: 0,
			instances: 1,
			pushed: false
		};
	} else {
		profile.startMS = profile.instances == 0 ? now() : profile.startMS;
		profile.instances++;
	}
	Profiler.profileStack.push(profile);
};

/**
 * For every "enter", there needs to be a matching "exit" to
 * tell the profiler to stop timing the contained code.  Note
 * that "exit" doesn't take any parameters.  It is necessary that
 * you properly balance your profile stack.  Too many "exit" calls
 * will result in a stack underflow. Missing calls to "exit" will
 * result in a stack overflow.
 * @memberOf Profiler
 */
Profiler.exit = function() {
	if (!Profiler.running) { return; }
	if (Profiler.profileStack.length == 0) {
		var msg = "Profile stack underflow";
		if (typeof console !== "undefined") { console.error(msg); }
		throw(msg);
	}

	var profile = Profiler.profileStack.pop();
	profile.endMS = new Date();
	profile.execs++;
	profile.instances--;
	profile.totalMS += profile.instances == 0 ? (profile.endMS.getTime() - profile.startMS.getTime()) : 0;
	if (!profile.pushed) {
		// If we haven't remembered it, do that now
		profile.pushed = true;
		Profiler.profiles.push(profile);
	}
};

/**
 * Reset any currently running profiles and clear the stack.
 * @memberOf Profiler
 */
Profiler.resetProfiles = function() {
	Profiler.profileStack = [];
	Profiler.allProfiles = {};
	Profiler.profiles = [];
};

/**
 * Dump the profiles that are currently in the stack to a debug window.
 * The profile stack will be cleared after the dump.
 * @memberOf Profiler
 */
Profiler.dump = function() {
	if (!Profiler.running) { return; }
	if (Profiler.profileStack.length > 0) {
		// overflow - profiles left in stack
		var rProfs = "";
		for (var x in Profiler.profileStack) {
			rProfs += (rProfs.length > 0 ? "," : "") + x;
		}
		Console.error("Profile stack overflow.  Running profiles: ", rProfs);
	}

	var d = now();
	d = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

	var rev = Profiler.profiles.reverse();
	var totalTime = 0;
	var out = "";
	for (var r in rev) {
		var avg = Math.round(rev[r].totalMS / rev[r].execs);
		totalTime += rev[r].totalMS;
		out += "# " + rev[r].name + " | " + (rev[r].totalMS < 1 ? "<1" : rev[r].totalMS) + " ms | " + rev[r].execs + " @ " + (avg < 1 ? "<1" : avg) + " ms\n";
	}
	out += "# Total Time: | " + totalTime + " ms | \n";

	console.warn("PROFILER RESULTS @ " + d + "\n---------------------------------------------------\n");
	console.info(out);
	
	Profiler.resetProfiles();
};
