/**
 * The Render Engine
 * SoundSystem
 *
 * @fileoverview The HTML5 sound system.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 * @author: $Author: bfattori $
 * @version: $Revision: 1307 $
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

Engine.include("/sound/sound.system.js");
Engine.include("/engine.timers.js");
Engine.include("/engine.pooledobject.js");

Engine.initObject("SoundSystemHTML5", "SoundSystem", function() {

   /**
    * @class Initializes the HTML5 sound system.
    *
    * @constructor
    * @extends SoundSystem
    */
   var SoundSystemHTML5 = SoundSystem.extend(/** @scope SoundSystemHTML5.prototype */{

		supported: false,
		types: null,
		audioRoot: null,

      constructor: function() {
      	this.base();
			try {
				// Check for the Audio tag
				this.audioRoot = new Audio("");
				this.supported = true;
				// Interrogate the supported audio types
				this.types = { 
					mp3: this.canPlayType("audio/mpeg"),
					ogg: this.canPlayType("audio/ogg; codecs='vorbis'"),
					wav: this.canPlayType("audio/x-wav")
				};					
			} catch (ex) {
				this.supported = false;
			}
		},
		
		verifyType: function(mime) {
			return (this.audioRoot.canPlayType(mime) != "");	
		},
      
      retrieveSound: function(resourceLoader, name, url) {
      },
   
		destroySound: function(sound) {
			if (!this.supported) { return; }
		},
		
		playSound: function(sound) {
			if (!this.supported) { return; }
			sound.play();
		},

		stopSound: function(sound) {
			if (!this.supported) { return; }
			sound.pause();
			sound.currentTime = 0;
		},

		pauseSound: function(sound) {
			if (!this.supported) { return; }
			sound.pause();
		},

		resumeSound: function(sound) {
			if (!this.supported) { return; }
			sound.play();
		},

		muteSound: function(sound) {
			if (!this.supported) { return; }
			sound.muted = true;
		},

		unmuteSound: function(sound) {
			if (!this.supported) { return; }
			sound.muted = false;
		},

		setSoundVolume: function(sound, volume) {
			if (!this.supported) { return; }
			sound.volume = volume;
		},

		/** 
		 * Unsupported in HTML5
		 */
		setSoundPan: function(sound, pan) {
			return;
		},
		
		setSoundPosition: function(sound, millisecondOffset) {
			if (!this.supported) { return; }
			sound.currentTime = Math.floor(millisecondOffset / 1000);
		},

		getSoundPosition: function(sound) {
			if (!this.supported) { return 0; }
	      return sound.currentTime * 1000;
		},
		
		/**
		 * Unsupported in HTML5
		 */
		getSoundSize: function(sound) {
			return 0;
		},

		getSoundDuration: function(sound) {
			if (!this.supported) { return 0; }
			var d = sound.duration;
			return (isNaN(d) ? 0 : d);
		},
		
		getSoundReadyState: function(sound) {
			if (!this.supported) { return true; }
			return (sound.readyState >= SoundSystemHTML5.HAVE_CURRENT_DATA);
		}
	
   }, {
		HAVE_NOTHING: 0,
		HAVE_METADATA: 1,
		HAVE_CURRENT_DATA: 2,
		HAVE_FUTURE_DATA: 3,
		HAVE_ENOUGH_DATA: 4
	});
   
   return SoundSystem;
   
});
