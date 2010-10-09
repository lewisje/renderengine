/**
 * The Render Engine
 * MultiResourceLoader
 *
 * @fileoverview A resource loader which can load resources of differing types.
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
Engine.include("/engine/engine.resourceloader.js");
Engine.include("/engine/engine.timers.js");

Engine.initObject("MultiResourceLoader", "ResourceLoader", function() {

/**
 * @class A resource loader which can load files of varying types from the
 * 		 server.
 *
 * @constructor
 * @param name {String=RemoteLoader} The name of the resource loader
 * @extends ResourceLoader
 * @description Loads files from multiple resource loaders based on a type specifier.  Each type of
 * 				 loader is registered with the multiresource loader.
 */
var MultiResourceLoader = ResourceLoader.extend(/** @scope MultiResourceLoader.prototype */{

	loaderMappings: null,
	deferments: null,
	deferTimer: null,
	loaders: null,

   /**
    * private
    */
   constructor: function(name) {
      this.base(name || "MultiResourceLoader");
		
		// Map the types to their file names
		this.loaderMappings = {
			"bitmapfont": {
				file: "loader.bitmapfont.js",
				clazz: "BitmapFontLoader",
				extension: ".font,.fnt",
				instance: null
			},
			"image": {
				file: "loader.image.js",
				clazz: "ImageLoader",
				extension: ".png,.jpg,.gif",
				instance: null
			},
			"level": {
				file: "loader.level.js",
				clazz: "LevelLoader",
				extension: ".level,.lvl",
				instance: null
			},
			"object": {
				file: "loader.object.js",
				clazz: "ObjectLoader",
				extension: ".json,.js,.ui",
				instance: null
			},
			"text": {
				file: "loader.remotefile.js",
				clazz: "RemoteFileLoader",
				extension: ".text,.txt",
				instance: null
			},
			"sound": {
				file: "loader.sound.js",
				clazz: "SoundLoader",
				extension: ".mp3,.mp4,.wav,.ogg",
				instance: null
			},
			"sprite": {
				file: "loader.sprite.js",
				clazz: "SpriteLoader",
				extension: ".sprite,.spr",
				instance: null
			},
			"xml": {
				file: "loader.xml.js",
				clazz: "XMLLoader",
				extension: ".xml",
				instance: null
			} 			
		};
		
		this.deferments = [];
		this.loaders = [];
   },
	
	/**
	 * Register a new loader type, or override an existing one.
	 * 
	 * @param type {String} The resource loader type identifier.  This is used when adding a loader or
	 * 			loading a resource with the multiresource loader.
	 * @param filename {String} The path where the resource loader class file is located.
	 * @param className {String} The class name of the of the resource loader 
	 * @param extension {String} A comma separated list of possible extensions which can
	 *		be used to automatically determine the type of loader to use.
	 */
	registerLoader: function(type, filename, className, extensions) {
		AssertWarn((this.loaderMappings[type] == null), "Overriding loader mapped to '" + type + "' with '" + filename + "'");
		this.loaderMappings[type] = {
		  	file: filename,
		  	clazz: className,
		  	extension: extensions,
			instance: null
		};
	},
	
	/**
	 * Add a loader type which the multiresource loader will user.  Calling this method will
	 * dynamically load the resource loader's class file and prepare it for loading objects.
	 * Supported default loaders are:
	 * <ul><li>bitmapfont</li>
	 * <li>image</li>
	 * <li>level</li>
	 * <li>object</li>
	 * <li>text</li>
	 * <li>sound</li>
	 * <li>sprite</li>
	 * <li>xml</li></ul>
	 * 
	 * @param loaderType {String} The resource loader type to add
	 */
	addLoader: function(loaderType) {
		Assert((this.loaderMappings[loaderType] != null), "The specified resource loader type is unsupported!");
		var f = this.loaderMappings[loaderType].file;
		
		// Load the resource loader class and remember the loader type being used
		Engine.include("/resourceloaders/" + f);
		this.loaders.push(loaderType);
	},
	
	/**
	 * Add multiple resource loaders at one time by their loader names.
	 * @param loaderArray {Array} An array of loader types
	 */
	addLoaders: function(loaderArray) {
		for (var l in loaderArray) {
			this.addLoader(loaderArray[l]);
		}
	},
	
	/**
	 * Remove a loader type which the multiresource loader uses.
	 * @param loaderType {String} The loader type to remove
	 */
	removeLoader: function(loaderType) {
		Assert((this.loaderMappings[loaderType] != null), "The specified resource loader type is unsupported!");
		this.loaders = EngineSupport.filter(this.loaders, function(obj) {
			return obj !== loaderType;
		});
	},

	/**
	 * Determine if the argument is a path by checking for either the
	 * forward slash, or the dot.
	 * @private
	 */
	isPath: function(arg) {
		return (arg.indexOf("/") != -1 || arg.indexOf(".") != -1);
	},

	/**
	 * Load a resource with the registered loader type.  The arguments passed after the
	 * loader type should match the required arguments for the <code>load()</code> method of the type of loader being used.
	 * If the class isn't loaded yet, the request will be deferred until the class is available.
	 * 
	 * @param loaderType {String} The type of loader to load the resource
	 * @param [args...] {Object} The arguments for the loader
	 */
	load: function(loaderType /*, args */) {
		var args = arguments, argArray = [];
		for (var a in arguments) {
			argArray.push(arguments[a]);
		}
		if (!this.isPath(argArray[0])) {
			argArray.shift();
		} else {
			// Determine the loader type by file extension
			loaderType = "object";
			for (var lm in this.loaderMappings) {
				var l = this.loaderMappings[l];
				var exts = l.extension.split(",");
				for (var e in exts) {
					if (argArray[0].indexOf("." + exts[e]) != -1) {
						loaderType = l;
						break;
					}
				}
			}
				
		}

		var c = this.loaderMappings[loaderType].clazz;
		if (!this.checkForClass(c)) {
			this.defer(loaderType, argArray);
		} else {
			// The class is loaded, load the resource
			this.getLoader(loaderType).load.apply(window, argArray);
		}
	},
	
	/**
	 * Check for the existence of the loader's class object.
	 * @param loaderClass {String} The class name
	 * @private
	 */
	checkForClass: function(loaderClass) {
		return (typeof window[loaderClass] !== "undefined");
	},
	
	/**
	 * Defer the loading of a resource until the resource loader class becomes
	 * available.
	 * 
	 * @param type {String} The type of loader
	 * @param args {Array} The arguments array to pass to the load() method
	 * @private
	 */
	defer: function(type, args) {
		if (this.deferTimer == null) {
			var self = this;
			this.deferTimer = Timeout.create("multidefer", 150, function() {
				var processed = [];
				if (self.deferments.length > 0) {
					// Process deferments
					for (var d in self.deferments) {
						var defer = self.deferments[d];
						if (self.checkForClass(self.loaderMappings[defer.loader].clazz)) {
							// The class is loaded, process the deferment and mark processed
							processed.push(defer);
							self.getLoader(defer.loader).load.apply(window, defer.args); 
						}	
					}
					
					// Clear out processed deferments
					self.deferments = EngineSupport.filter(self.deferments, function(obj) {
						var found = false;
						for (var p in processed) {
							if (processed[p] === obj) {
								found = true;
							}
						}
						return !found;
					});
					
					if (self.deferments.length > 0) {
						// If there are still deferments pending, restart the timer
						this.restart();
						return;
					}
				}

				// Destroy the timer
				this.destroy();
				self.deferTimer = null;
			});
		}
		
		this.deferments.push({
			loader: type,
			args: args	
		});	
	},

	/**
	 * Checks all of the resource loaders to see if the specified resource is ready.  If the name
	 * is used by multiple loaders, you can optionally specify the loader type the resource should
	 * be checked against.  If no arguments are passed, all resource loaders are checked to see if
	 * all resources are loaded.
	 * 
	 * @param name {String} The name of the resource to check for
	 * @param [loaderType] {String} Optionally, the name of the loader to check against
	 */
	isReady: function(name, loaderType) {
		if (loaderType != null) {
			// Check a specific loader
			if (!this.checkForClass(this.loaderMappings[loaderType].clazz)) {
				// The loader isn't even loaded itself yet
				return false;
			}
			
			// The class is loaded, check for the resource
			return this.getLoader(loaderType).isReady(name);
		}
		
		// Assume ready until a loader says otherwise
		var ready = true;
		for (var l in this.loaders) {
			var loader = this.loaders[l];
			ready &= (this.checkForClass(this.loaderMappings[loader].clazz) &&
							this.getLoader(loader).isReady(name));
		}
		
		return ready;	
	},
	
	/**
	 * Unload a resource, by its name, from the resource loader type specified, or from all
	 * loaders where the name might be in use.
	 * @param name {String} The resource name to unload
	 * @param [loaderType] {String} Optionally, the name of the resource loader
	 */
	unload: function(name, loaderType) {
		if (loaderType != null && this.checkForClass(this.loaderMappings[loaderType].clazz)) {
	  		this.getLoader(loaderType).unload(name);
	   } else if (!loaderType) {
			for (var l in this.loaders) {
				var loader = this.loaders[l];
				if (this.checkForClass(this.loaderMappings[loader].clazz)) {
					this.getLoader(loader).unload(name);
				}	
			}
		} 
	},

	/**
	 * Get the cached object from the specified loader, by name.
	 * 
	 * @param loaderType {String} The type of loader to get the object from
	 * @param name {String} The name of the object to get from the cache
	 * @return {Object}
	 */
	get: function(loaderType, name) {
		if (!this.checkForClass(this.loaderMappings[loader].clazz)) {
	  		return null;
	   } else {
			return this.getLoader(loaderType).get(name);
		}
	},
	
	/**
	 * Gets the loader object by its given type, allowing you to call its methods
	 * directly.
	 * 
	 * @param loaderType {String} The name of the loader type
	 * @return {ResourceLoader}
	 */
	getLoader: function(loaderType) {
		var inst = this.loaderMappings[loaderType].instance;
		if (inst == null) {
			inst = this.loaderMappings[loaderType].instance = window[this.loaderMappings[loaderType].clazz].create();
		}
		return inst;
	},

   /**
    * The name of the resource this loader will get.
    * @returns {String} The string "multi"
    */
   getResourceType: function() {
      return "multi";
   }

}, /** @scope RemoteLoader.prototype */{
   /**
    * Get the class name of this object.
    * @return {String} The string "MultiResourceLoader"
    */
   getClassName: function() {
      return "MultiResourceLoader";
   }
});

return MultiResourceLoader;

});