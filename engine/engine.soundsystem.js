/**
 * The Render Engine
 * SoundSystem
 *
 * @fileoverview An abstraction class for the engine sound system.  Pluggable
 *					  architecture for linking in different sound managers.
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

Engine.include("/engine.timers.js");
Engine.include("/engine.pooledobject.js");

Engine.initObject("SoundSystem", null, function() {

	/**
	 * @class Sound system abstraction class for pluggable sound architecture.  The <tt>
	 *			 SoundSystem</tt> class is used to separate the sound manager from the resource
	 *			 loader and sound objects.
	 *
	 * @constructor
	 */
	var SoundSystem = Base.extend(/** @scope SoundLoader.prototype */{

		ready: false,
		queuedSounds: null,
		loadingSounds: null,
	
		constructor: function() {
			this.ready = false,
			this.queuedSounds = [];
			this.loadingSounds = {};
		},
		
		shutdown: function() {
		},
		
		isReady: function() {
			return this.ready;
		},
		
		makeReady: function() {
			// Retrieve queued sounds
			var self = this;
			Timeout.create("loadQueuedSounds", 100, function() {
				if (self.queuedSounds.length > 0) {
					while (self.queuedSounds.length > 0) {
						var s = self.queuedSounds.shift();
						self.retrieveSound(s.sLoader, s.sName, s.sUrl);
					}
				}

				this.destroy();
			});
			this.ready = true;
		},
		
		loadSound: function(resourceLoader, name, url) {
			if (!this.ready) {
				this.queuedSounds.push({
					sLoader: resourceLoader,
					sName: name,
					sUrl: url
				});
				return Sound.create(this, null);
			} else {
				return this.retrieveSound(resourceLoader, name, url);
			}
		},

		retrieveSound: function(resourceLoader, name, url) {
			return Sound.create(this, null);
		},
		
		/**
		 * [ABSTRACT] Destroy the given sound object
		 * @param sound {Sound} The sound object
		 */
		destroySound: function(sound) {
		},
		
		/**
		 * [ABSTRACT] Play the given sound object
		 * @param sound {Sound} The sound object
		 */
		playSound: function(sound) {
		},

		/**
		 * [ABSTRACT] Stop the given sound object
		 * @param sound {Sound} The sound object
		 */
		stopSound: function(sound) {
		},

		/**
		 * [ABSTRACT] Pause the given sound object
		 * @param sound {Sound} The sound object
		 */
		pauseSound: function(sound) {
		},

		/**
		 * [ABSTRACT] Resume the given sound object
		 * @param sound {Sound} The sound object
		 */
		resumeSound: function(sound) {
		},

		/**
		 * [ABSTRACT] Mute the given sound object
		 * @param sound {Sound} The sound object
		 */
		muteSound: function(sound) {
		},

		/**
		 * [ABSTRACT] Unmute the given sound object
		 * @param sound {Sound} The sound object
		 */
		unmuteSound: function(sound) {
		},

		/**
		 * [ABSTRACT] Set the volume of the given sound object
		 * @param sound {Sound} The sound object
		 * @param volume {Number} A value between 0 and 100, with 0 being muted
		 */
		setSoundVolume: function(sound, volume) {
		},

		/**
		 * [ABSTRACT] Pan the given sound object from left to right
		 * @param sound {Sound} The sound object
		 * @param pan {Number} A value between -100 and 100, with -100 being full left
		 * 		and zero being center
		 */
		setSoundPan: function(sound, pan) {
		},
		
		/**
		 * [ABSTRACT] Set the position, within the sound's length, to play at
		 * @param sound {Sound} The sound object
		 * @param millisecondOffset {Number} The millisecond offset from the start of
		 * 		the sounds duration
		 */
		setSoundPosition: function(sound, millisecondOffset) {
		},

		/**
		 * [ABSTRACT] Get the position, in milliseconds, within a playing or paused sound
		 * @param sound {Sound} The sound object
		 * @return {Number}
		 */
		getSoundPosition: function(sound) {
	      return 0;
		},
		
		/**
		 * [ABSTRACT] Get the size of the sound object, in bytes
		 * @param sound {Sound} The sound object
		 * @return {Number}
		 */
		getSoundSize: function(sound) {
			return 0;
		},

		/**
		 * [ABSTRACT] Get the length (duration) of the sound object, in milliseconds
		 * @param sound {Sound} The sound object
		 * @return {Number}
		 */
		getSoundDuration: function(sound) {
			return 0;
		},
		
		/**
		 * [ABSTRACT] Determine if the sound object is ready to be used
		 * @param sound {Sound} The sound object
		 * @return {Boolean} <code>true</code> if the sound is ready
		 */
		getSoundReadyState: function(sound) {
			return false;
		}
			
	});
	
	return SoundSystem;
	
});

Engine.initObject("Sound", "PooledObject", function() {

/**
 * @class Represents a sound object that is abstracted from the sound system.
 *        If the sound system does not initialize, for whatever reason, you can 
 *			 still call a sound's methods.
 *
 * @constructor
 * @param name {String} The name of the sound
 * @extends PooledObject
 */
var Sound = PooledObject.extend(/** @scope Sound.prototype */{

   volume: -1,
   paused: false,
   pan: -1,
   muted: false,
	soundObj: null,
	soundSystem: null,

   /**
    * @private
    */
   constructor: function(soundSystem, soundObj) {
      this.volume = 50;
      this.paused = false;
      this.pan = 0;
      this.muted = false;
		this.soundObj = soundObj;
		this.soundSystem = soundSystem;
      return this.base(name);
   },

   /**
    * Destroy the sound object
    */
   destroy: function() {
		this.soundSystem.destroySound(this.sound);
      this.base();
   },

   /**
    * @private
    */
   release: function() {
      this.base();
      this.volume = -1;
      this.pan = -1;
      this.paused = false;
      this.muted = false;
		this.soundObj = null;
		this.soundSystem = null;
   },

	/**
	 * Get the native sound object which was created by the subclassed sound system.
	 * @return {Object}
	 */
	getSoundObject: function() {
		return this.soundObj;
	},

	/**
	 * Set the sound object which the subclassed sound system created.
	 * @param soundObj {Object} The sound's native object
	 */
	setSoundObject: function(soundObj) {
		this.soundObj = soundObj;
	},

   /**
    * Play the sound.  If the volume is specified, it will set volume of the
    * sound before playing.  If the sound was paused, it will be resumed.
    *
    * @param volume {Number} <i>[optional]</i> An integer between 0 (muted) and 100 (full volume)
    */
   play: function(volume) {
      if (this.paused) {
         this.resume();
         return;
      }

      if (volume && volume != this.getVolume()) {
         this.setVolume(volume);
      }
		
		this.soundSystem.playSound(this.soundObj);
   },

   /**
    * If the sound is playing, stop the sound and reset it to the beginning.
    */
   stop: function() {
      this.paused = false;
		this.soundSystem.stopSound(this.soundObj);
   },

   /**
    * If the sound is playing, pause the sound.
    */
   pause: function() {
		this.soundSystem.pauseSound(this.soundObj);
      this.paused = true;
   },

   /**
    * Returns <tt>true</tt> if the sound is currently paused.
    * @return {Boolean} <tt>true</tt> if the sound is paused
    */
   isPaused: function() {
      return this.paused;
   },

   /**
    * If the sound is paused, it will resume playing the sound.
    */
   resume: function() {
      this.paused = false;
		this.soundSystem.resumeSound(this.soundObj);
   },

   /**
    * Mute the sound (set its volume to zero).
    */
   mute: function() {
		this.soundSystem.muteSound(this.soundObj);
      this.muted = true;
   },

   /**
    * Unmute the sound (reset its volume to what it was before muting).
    */
   unmute: function() {
      if (!this.muted) {
         return;
      }
		this.soundSystem.unmuteSound(this.soundObj);
      this.muted = false;
   },

   /**
    * Set the volume of the sound to an integer between 0 (muted) and 100 (full volume).
    *
    * @param volume {Number} The volume of the sound
    */
   setVolume: function(volume) {
      if (isNaN(volume)) {
         return;
      }

      // clamp it
      volume = (volume < 0 ? 0 : volume > 100 ? 100 : volume);
      this.volume = volume;
		this.soundSystem.setSoundVolume(this.soundObj, volume);
   },

   /**
    * Get the volume the sound is playing at.
    * @return {Number} An integer between 0 and 100
    */
   getVolume: function() {
      return this.volume;
   },

   /**
    * Set the pan of the sound, with -100 being full left and 100 being full right.
    *
    * @param pan {Number} An integer between -100 and 100, with 0 being center.
    */
   setPan: function(pan) {
      this.pan = pan;
		this.soundSystem.setSoundPan(this.soundObj, pan);
   },

   /**
    * Get the pan of the sound, with -100 being full left and 100 being full right.
    * @return {Number} An integer between -100 and 100
    */
   getPan: function() {
      return this.pan;
   },

   /**
    * Set the sound offset in milliseconds.
    *
    * @param millisecondOffset {Number} The offset into the sound to play from
    */
   setPosition: function(millisecondOffset) {
      this.position = millisecondOffset;
		this.soundSystem.setSoundPosition(this.soundObj, millisecondOffset);
   },

   /**
    * Get the position of the sound, in milliseconds, from the start of the sound.
    * @return {Number} The millisecond offset into the sound
    */
   getLastPosition: function() {
      return this.soundSystem.getSoundPosition(this.soundObj);
   },

   /**
    * Get the total size, in bytes, of the sound.  If the sound engine is not
    * initialized, returns 0.
    * @return {Number} The size of the sound, in bytes
    */
   getSizeBytes: function() {
   	return this.soundSystem.getSoundSize(this.soundObj);
   },

   /**
    * Get the length of the sound, in milliseconds.  If the sound hasn't fully loaded,
    * it will be the number of milliseconds currently loaded.  Due to the nature of
    * Variable Bitrate (VBR) sounds, this number may be inaccurate.
    * @return {Number} The length of the sound, in milliseconds
    */
   getDuration: function() {
      return this.soundSystem.getSoundDuration(this.soundObj);
   },

   getReadyState: function() {
      return this.soundSystem.getSoundReadyState(this.soundObj);
   }

}, /** @scope Sound.prototype */{
   /**
    * Gets the class name of this object.
    * @return {String} The string "Sound"
    */
   getClassName: function() {
      return "Sound";
   }
});

return Sound;

});
