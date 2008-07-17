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
 *			 way to play and stop the sounds that have been loaded.
 * @extends ResourceLoader
 */
var SoundResourceLoader = ResourceLoader.extend(/** @scope SoundResourceLoader.prototype */{

	init: false,

	playingSounds: null,

   /**
    * Load a sound resource from a URL.
    *
    * @param name {String} The name of the resource
    * @param url {String} The URL where the resource is located
    */
   load: function(name, url) {

		// Determine a possible MIME type
		var soundTypes = new RegExp(".*\.(wav|mp3|mid|aif|aifc|aiff|m3u)");
		var check = soundTypes.exec(url);
		var mimeType = "audio/";
		switch (check[1]) {
			case "wav": mimeType += "x-wav"; break;
			case "mp3": mimeType += "mpeg"; break;
			case "mid": mimeType += "mid"; break;
			case "aif":
			case "aifc":
			case "aiff": mimeType += "x-aiff"; break;
			case "m3u": mimeType += "x-mpegurl"; break;
			default: mimeType += "basic";
		}

		// Create the sound object
		var sound = jQuery("<object>")
			.attr("data", url)
			.attr("width", "0")
			.attr("height", "0")
			.attr("type", mimeType)
			.append(jQuery("<param>")
				.attr("name", "src")
				.attr("value", url));

		var thisObj = sound;
		sound.bind("load", function() {
			thisObj.setReady(name, true);
		});

		if (!this.init) {
			Engine.getDefaultContext().add(this);
			this.playingSounds = {};
			this.init = true;
		}

      this.base(name, sound);
   },

	/**
	 * Plays a sound effect.  There is no way to know which sounds
	 * are currently done playing, so sounds must be stopped.
	 *
	 * @param name {String} The name of the sound resource to play
	 * @return The Id of the sound so it can be stopped
	 */
   play: function(name) {
      var sound = this.get(name);
      var soundId = Engine.worldTimer + Math.floor(Math.random() * 200);

      // Clone the object so we can have multiples playing
      var cloned = $(sound).clone();

      // Remember the playing sounds
      this.playingSounds[soundId] = cloned;

      // Append the sound to the body element so it plays
      $("body", document).append(cloned);
      return soundId;
   },

	/**
	 * Stop the sound identified by the given <tt>soundId</tt>.
	 *
	 * @param soundId {String} The Id which was returned by the {@link #play} method
	 */
   stop: function(soundId) {
		var sound = this.playingSounds[soundId];
		if (sound) {
			sound.remove();
			delete this.playingSounds[soundId];
		}
	},

});