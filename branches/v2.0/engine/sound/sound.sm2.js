/**
 * The Render Engine
 * SoundSystem
 *
 * @fileoverview An abstraction class for the engine sound system.  Pluggable
 *               architecture for linking in different sound managers.
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

Engine.include("/libs/soundmanager2.js");
Engine.include("/libs/AC_OETags.js");
Engine.include("/engine/engine.timers.js");
Engine.include("/engine/engine.pooledobject.js");

Engine.initObject("SM2", "SoundSystem", function() {

   /**
    * @class Sound system abstraction class for pluggable sound architecture.  The <tt>
    *        SoundSystem</tt> class is used to separate the sound manager from the resource
    *        loader and sound objects.
    *
    * @constructor
    * @extends SoundSystem
    */
   var SM2 = SoundSystem.extend(/** @scope SM2.prototype */{

		init: false,
		soundManager: null,

      constructor: function() {
      	this.base();
			if (typeof SoundManager != "undefined") {

				// Create a link to the object
				this.soundManager = window.soundManager;
				this.soundManager.debugMode = false;

				// directory where SM2 .SWFs live
				this.soundManager.url = Engine.getEnginePath() + '/libs/';

				if (GetSwfVer() != null) {
					// Detect the version of flash available.  If 9 or higher, use 9
					var hasReqestedVersion = DetectFlashVer(9, 0, 0);
					if (hasReqestedVersion) {
						this.soundManager.flashVersion = 9;
					} else {
						this.soundManager.flashVersion = 8;
					}

					// Debugging enabled?
					this.soundManager.debugMode = EngineSupport.checkBooleanParam("debugSound");

					var self = this;

					this.soundManager.onload = function() {
						Engine.soundsEnabled = true;
						Console.warn("SoundManager loaded successfully");
						self.makeReady();
					};

					this.soundManager.onerror = function() {
						Engine.soundsEnabled = false;
						Console.warn("SoundManager not loaded");
					};

					if (Engine.getEnginePath().indexOf("file:") == 0) {
						this.soundManager.sandbox.type = "localWithFile";
					}

					this.soundManager.go();

				} else {
					// Flash not installed
					Engine.soundsEnabled = false;
				}

			} else {
				Engine.soundsEnabled = false;
			}
		},
      
      retrieveSound: function(resourceLoader, name, url) {
      }
   
   });
   
   return SoundSystem;
   
});

Engine.initObject("Sound", "PooledObject", function() {

/**
 * @class Represents a sound object that is abstracted from the sound system.
 *        If the sound system does not initialize, for whatever reason, you can 
 *        still call a sound's methods.
 *
 * @constructor
 * @param name {String} The name of the sound
 * @extends PooledObject
 */
var SM2Sound = Sound.extend(/** @scope SM2Sound.prototype */{

	smSound: null;

   /**
    * @private
    */
   constructor: function(name, smSound) {
   	this.smSound = smSound;
      return this.base(name);
   },

   /**
    * Destroy the sound object
    */
   destroy: function() {
      this.smSound.unload();
      this.base();
   },

   /**
    * @private
    */
   release: function() {
      this.base();
      this.smSound = null;
   },

   /**
    * Play the sound.  If the volume is specified, it will set volume of the
    * sound before playing.  If the sound was paused, it will be resumed.
    *
    * @param volume {Number} <i>[optional]</i> An integer between 0 (muted) and 100 (full volume)
    */
   play: function(volume) {
   	this.base();
   	this.smSound.play();
   },

   /**
    * If the sound is playing, stop the sound and reset it to the beginning.
    */
   stop: function() {
		this.smSound.stop();
      this.base();
   },

   /**
    * If the sound is playing, pause the sound.
    */
   pause: function() {
		this.smSound.pause();
      this.base();
   },

   /**
    * If the sound is paused, it will resume playing the sound.
    */
   resume: function() {
      this.base();
		this.smSound.resume();
   },

   /**
    * Mute the sound (set its volume to zero).
    */
   mute: function() {
      this.base();
		this.smSound.mute();
   },

   /**
    * Unmute the sound (reset its volume to what it was before muting).
    */
   unmute: function() {
      if (this.base()) {
         this.smSound.unmute();
      }
   },

   /**
    * Set the volume of the sound to an integer between 0 (muted) and 100 (full volume).
    *
    * @param volume {Number} The volume of the sound
    */
   setVolume: function(volume) {
      if (this.base(volume)) {
         this.smSound.setVolume(volume);
      }
   },

   /**
    * Set the pan of the sound, with -100 being full left and 100 being full right.
    *
    * @param pan {Number} An integer between -100 and 100, with 0 being center.
    */
   setPan: function(pan) {
      this.base(pan);
		this.smSound.setPan(pan);
   },

   /**
    * Set the sound offset in milliseconds.
    *
    * @param millisecondOffset {Number} The offset into the sound to play from
    */
   setPosition: function(millisecondOffset) {
   	this.base(millisecondOffset);
		this.smSound.setPosition(millisecondOffset);
   },

   /**
    * Get the position of the sound, in milliseconds, from the start of the sound.
    * @return {Number} The millisecond offset into the sound
    */
   getLastPosition: function() {
      return this.smSound.position;
   },

   /**
    * Get the total size, in bytes, of the sound.  If the sound engine is not
    * initialized, returns 0.
    * @return {Number} The size of the sound, in bytes
    */
   getSizeBytes: function() {
      return this.smSound.bytesTotal;
   },

   /**
    * Get the length of the sound, in milliseconds.  If the sound hasn't fully loaded,
    * it will be the number of milliseconds currently loaded.  Due to the nature of
    * Variable Bitrate (VBR) sounds, this number may be inaccurate.
    * @return {Number} The length of the sound, in milliseconds
    */
   getDuration: function() {
      return this.smSound.duration;
   },

   getReadyState: function() {
      return this.smSound.readyState;
   }

}, /** @scope Sound.prototype */{
   /**
    * Gets the class name of this object.
    * @return {String} The string "SM2Sound"
    */
   getClassName: function() {
      return "SM2Sound";
   }
});

return SM2Sound;

});
