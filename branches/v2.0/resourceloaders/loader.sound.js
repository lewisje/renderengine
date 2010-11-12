/**
 * The Render Engine
 * SoundResourceLoader
 *
 * @fileoverview A resource loader for sounds.
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

// Includes
Engine.include("/engine/engine.pooledobject.js");
Engine.include("/resourceloaders/loader.remote.js");

Engine.initObject("SoundLoader", "RemoteLoader", function() {

/**
 * @class Loads sounds and stores the reference to them.  Provides a simple
 *        way to play and stop the sounds that have been loaded.
 *        <p/>
 *        Sounds must be 44.1KHz and have a bitrate of 192k to play correctly.
 *
 * @constructor
 * @param name {String=SoundLoader} The name of the resource loader
 * @extends RemoteLoader
 */
var SoundLoader = RemoteLoader.extend(/** @scope SoundLoader.prototype */{

   init: false,

   queuedSounds: null,

   checkReady: null,

   soundManager: null,

   queueingSounds: true,

   loadingSounds: 0,

   /**
    * @private
    */
   constructor: function(name) {
      this.base(name || "SoundLoader");
      this.init = false;
      this.queuedSounds = [];
      this.queueingSounds = true;
      this.loadingSounds = 0;

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
	            self.queueingSounds = false
	            self.loadQueuedSounds();
	         };
	
	         this.soundManager.onerror = function() {
	            Engine.soundsEnabled = false;
	            Console.warn("SoundManager not loaded");
	            self.queueingSounds = false;
	            self.loadQueuedSounds();
	         };
	
	         if (Engine.getEnginePath().indexOf("file:") == 0) {
	            this.soundManager.sandbox.type = "localWithFile";
	         }
	
	         this.soundManager.go();

			} else {
				// Flash not installed
				Engine.soundsEnabled = false;
				this.queueingSounds = false;
			}

      } else {
			this.queueingSounds = false;
         Engine.soundsEnabled = false;
      }
   },

   destroy: function() {
      // Stop the sound manager
      if (Engine.isSoundEnabled()) {
         this.soundManager.destruct();
      }
   },

   /**
    * Load a sound resource from a URL. If the sound system does not initialize, for whatever
    * reason, you can still call the sound's methods.
    *
    * @param name {String} The name of the resource
    * @param url {String} The URL where the resource is located
    */
   load: function(name, url) {

      if (this.queueingSounds) {
         this.queuedSounds.push({n: name, u: url});
         return;
      }

      var soundObj = null;

      if (Engine.isSoundEnabled()) {

         // Only MP3 files are supported
         Assert(url.indexOf(".mp3") > 0, "Only MP3 sound format is supported!");

         // Create the sound object
         var sound = this.soundManager.createSound({
            "id": name,
            "url": url,
            "autoPlay": false,
            "autoLoad": true,
            "volume": 50
         });
         soundObj = Sound.create(name, sound);

         // We'll need to periodically check a sound's "readyState" for success
         // to know when the sound is ready for usage.
         this.loadingSounds++;
         if (!this.checkReady) {
            var self = this;
            this.checkReady = window.setTimeout(function() {
               var sounds = self.getResources();
               for (var s in sounds) {
                  if (!self.isReady(sounds[s]) && self.get(sounds[s]).smSound.readyState == SoundLoader.LOAD_SUCCESS) {
                     self.setReady(sounds[s], true);
                     self.loadingSounds--;
                  } else if (self.get(sounds[s]).smSound.readyState == SoundLoader.LOAD_ERROR) {
                     Console.error("An error occurred loading the sound ", sounds[s]);
                  }
               }

               if (self.loadingSounds != 0) {
                  // There are still sounds loading
                  self.checkReady = window.setTimeout(arguments.callee, 500);
               } else {
                  window.clearTimeout(self.checkReady);
                  self.checkReady = null;
               }
            }, 500);
         }

         if (!this.init) {
            Engine.getDefaultContext().add(this);
            this.init = true;
         }
      } else {
         soundObj = Sound.create(name, null);
      }

      this.base(name, soundObj);
   },

   loadQueuedSounds: function() {
      for (var s in this.queuedSounds) {
         this.load(this.queuedSounds[s].n, this.queuedSounds[s].u);
      }
      this.queuedSounds = null;
   },

   /**
    * Unload a sound, calling the proper methods in SoundManager2.
    *
    * @param sound {String} The name of the sound to unload
    */
   unload: function(sound) {
      var s = this.get(sound).destroy();
      this.base(sound);
   },

   /**
    * Creates a {@link Sound} object representing the named sound.
    *
    * @param resource {String} A loaded sound resource
    * @param sound {String} The name of the sound from the resource
    * @return {Sound} A {@link Sound} instance
    */
   getSound: function(sound) {
      return this.get(sound);
   },

   /**
    * The name of the resource this loader will get.
    * @return {String} The string "sound"
    */
   getResourceType: function() {
      return "sound";
   }
}, /** @scope SoundResourceLoader.prototype */{
   /**
    * Get the class name of this object
    * @return {String} The string "SoundResourceLoader"
    */
   getClassName: function() {
      return "SoundLoader";
   },

   /**
    * Indicates that a sound is loading.
    * @type Number
    */
   LOAD_LOADING: 1,

   /**
    * Indicates an error state during sound loading.
    * @type Number
    */
   LOAD_ERROR: 2,

   /**
    * Indicates a successful sound load.
    * @type Number
    */
   LOAD_SUCCESS: 3
});

return SoundLoader;

});
