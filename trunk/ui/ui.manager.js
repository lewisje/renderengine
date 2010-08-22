/**
 * The Render Engine
 * UIManager
 *
 * @fileoverview User interface manager class.
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
Engine.include("/resourceloaders/loader.remotefile.js");
Engine.include("/resourceloaders/loader.multi.js");
Engine.include("/objects/object.ui.js");
Engine.include("/engine/engine.timers.js");

// UI Element types
Engine.include("/ui/elements/ui.base.js");
Engine.include("/ui/elements/ui.button.js");
Engine.include("/ui/elements/ui.checkbox.js");
Engine.include("/ui/elements/ui.image.js");
Engine.include("/ui/elements/ui.input.js");
Engine.include("/ui/elements/ui.textbox.js");

Engine.initObject("UIManager", null, function() {

/**
 * @class The user interface manager class is responsible for loading user interfaces
 * 		 and creating the equivalent {@link UIObject} instances.
 * 
 */
var UIManager = Base.extend(/** @scope UIManager.prototype */{

	multiLoader: null,
	fileLoader: null,
	gameObject: null,
	
	/**
	 * @private
	 */
	constructor: null,

	/**
	 * Set the game the manager is associated with.  This is required to allow
	 * user interfaces to be loaded relative to a game's server location.
	 * 
	 * @param game {Game} The game class
	 */
	setGame: function(game) {
		this.gameObject = game;
	},
	
	/**
	 * Get the game the manager is associated with.
	 * @return {Game}
	 */
	getGame: function() {
		return this.gameObject;
	},	
	
	/**
	 * Load a user interface from a file, returning a {@link UIObject} which represents
	 * the user interface.
	 * 
	 * @param name {String} The name of the user interface
	 * @param uiFile {String} The file location, relative to the game, where the UI description exists
	 */
	loadUI: function(name, uiFile) {
		Assert((UIManager.getGame() != null), "Cannot load a UI without associated Game object reference!");
		
		if (!UIManager.fileLoader) {
			UIManager.fileLoader = RemoteFileLoader.create("UIFileLoader");
		}	
		
		// Load user interface files synchronously so we know they exist
		// without having to check for them to be ready
		UIManager.fileLoader.load(name, uiFile, "text", true);
		
		// Parse the file into a UIObject
		var uiObject = UIObject.create(name);
		UIManager.parseUI(UIManager.fileLoader.getData(name), uiObject);
		
		return uiObject;
	},
	
	/**
	 * Parse a UI descriptor object into a {@link UIObject}.
	 * @param uiDescriptor {Object} The user interface descriptor
	 * @param uiObject {UIObject} The user interface object
	 * @private
	 */
	parseUI: function(uiDescriptor, uiObject) {
		// See if this is a user interface
		Assert(uiDescriptor.UserInterface != null, "You can only pass a UserInterface to UIObject");
		
		var ui = uiDescriptor.UserInterface;
		
		// See if their are resources to load
		if (ui.resources) {
			if (UIManager.multiLoader == null) {
				UIManager.multiLoader = MultiResourceLoader.create("UIMultiLoader");
			}
			
			// Use the multiresource loader to load the required UI resources
			var mload = UIManager.multiLoader;
			for (var r in ui.resources) {
				var res = ui.resources[r];
				var file = UIManager.getGame().getFilePath(res.file);
				mload.addLoader(res.type);
				switch (res.type) {
					case "bitmapfont":
					case "object":
					case "sprite":
					case "level":
					case "xml":
					case "sound": mload.load(res.type, res.name, file); break;
					case "image": mload.load("image", res.name, file, res.width, res.height); break;
					case "text": mload.load("text", res.name, file, "text", false);
					default: Assert(false, "Unknown resource type in UI Descriptor!");
				}
			}
			
			// We need to wait until the resources are loaded before we can finish parsing the UI
			Timeout.create("UIResourceTimer", 150, function() {
				if (UIManager.multiLoader.isReady()) {
					UIManager.finishParseUI(uiDescriptor, uiObject);
					this.destroy();
				} else {
					this.restart();
				}
			});
		} else {
			UIManager.finishParseUI(uiDescriptor, uiObject);	
		}
	},
	
	/**
	 * Finish parsing a UI descriptor into a UIObject when all of the resources are loaded.
	 * @param uiDescriptor {Object} The user interface descriptor
	 * @param uiObject {UIObject} The user interface object
	 * @private
	 */
	finishParseUI: function(uiDescriptor, uiObject) {

		var ui = uiDescriptor.UserInterface;
		var mload = UIManager.multiLoader;
		
		// Handle the elements of the user interface
		var uiTypes = ["UIImage", "UITextBox", "UIButton", "UICheckBox",
							"UIInput"];
		
		for (var e in ui.elements) {
			// Identify the type of ui elements
			var eType;
			for (var t in uiTypes) {
				if (ui.elements[e][uiTypes[t]] != null) {
					eType = uiTypes[t];
					break;
				}
			}
			
			// Create the element object and add it to the user interface
			var uiElem, element = ui.elements[e][eType],
				 alignment = element.alignment, hAlign = BaseUIElement.ALIGN_LEFT,
				 vAlign = BaseUIElement.VALIGN_TOP;
				 
			// Handle the alignment, if defined
			if (alignment != null) {
				hAlign = BaseUIElement[alignment[0]];
				vAlign = BaseUIElement[alignment[1]];	
			}
			 
			switch (eType) {
				case "UIImage" : uiElem = UIImageElement.create(element.name, hAlign, vAlign);
									  var resource = element.sprite ? element.sprite.split(":")[0] : element.image;
									  var rName = element.sprite ? element.sprite.split(":")[1] : ""; 
									  element.sprite ? uiElem.setSprite(mload.getLoader("sprite").getSprite(resource, rName)) :
									  						 uiElem.setImage(mload.getLoader("image").getImage(resource));
									  break;
				case "UIButton" : break; 
			}
			
			uiObject.add(uiElem);
		}
		
	}
});

return UIManager;

});
