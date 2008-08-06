/**
 * The Render Engine
 * SoundResourceLoader
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 * @author: $Author$
 * @version: $Revision$
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

/**
 * @class Loads sounds and stores the reference to them.  Provides a simple
 *        way to play and stop the sounds that have been loaded.
 *        <p/>
 *        Sounds must be 44.1KHz and have a bitrate of 192k to play correctly.
 *
 * @extends ResourceLoader
 */
var SoundResourceLoader = ResourceLoader.extend(/** @scope SoundResourceLoader.prototype */{

   init: false,

   playingSounds: null,

   constructor: function() {
      this.base("SoundLoader");
      this.init = false;
      this.playingSounds = {};
   },

   /**
    * Load a sound resource from a URL.
    *
    * @param name {String} The name of the resource
    * @param url {String} The URL where the resource is located
    */
   load: function(name, url) {

      if (!Engine.isSoundEnabled()) {
         return;
      }

      // Only MP3 files are supported
      Assert(url.indexOf(".mp3") > 0, "Only MP3 sound format is supported!");

      // Create the sound object
      var sound = Engine.soundManager.createSound({
         "id": name,
         "url": url,
         "autoPlay": false,
         "volume": 50
      });


      if (!this.init) {
         Engine.getDefaultContext().add(this);
         this.init = true;
      }

      this.base(name, sound);
   },

   /**
    * Get the sound object.  If the sound object isn't found and the
    * sound engine didn't initialize, this will return a safe object
    * whose methods can be called without exceptions.
    *
    * @param name {String} The name of the sound to retrieve.
    * @type SMSound
    */
   get: function(name) {
      var sound = this.base(name);
      if (!sound && !Engine.isSoundEnabled()) {
         console.debug("in here");
         // If the sound engine didn't load, this will return an object
         // that won't throw exceptions when methods are called.
         sound = {
            play: function() {},
            stop: function() {}
         };
      }

      return sound;
   },

   /**
    * The name of the resource this loader will get.
    * @returns A String that represents the resource type.
    */
   getResourceType: function() {
      return "sound";
   }
}, {
   /**
    * Get the class name of this object
    *
    * @type String
    */
   getClassName: function() {
      return "SoundResourceLoader";
   }
});