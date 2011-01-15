/**
 * The Render Engine
 *
 * The level editor
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 *
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

R.Engine.define({
	"class": "LevelEditor",
	"requires": [
		"R.engine.Game",
		"R.lang.Timeout",
		"R.lang.Iterator",
		"R.engine.Events",

		// Resource loaders and types
		"R.resources.loaders.SoundLoader",
		"R.resources.loaders.SpriteLoader",
		"R.resources.loaders.LevelLoader",
		"R.resources.types.Level",
		"R.resources.types.Sprite",
		"R.resources.types.Sound",

		// Persistent storage to save level
		"R.storage.PersistentStorage",

		// Math objects
		"R.math.Math2D",
		"R.math.Point2D",
		"R.math.Vector2D",
		"R.math.Rectangle2D",
		
		// Game objects
		"R.objects.SpriteActor",
		"R.objects.CollisionBox"
	],
	
	"includes": [
		"/../tools/level_editor/jquery.jstree.js",
		"/../tools/level_editor/jquery.cookie.js",
		"/../tools/level_editor/jquery.hotkeys.js"
	],
	
	// Game class dependencies
	"depends": [
	]
});

/**
 * @class The 2D level editor.
 */
var LevelEditor = function() {
	return Base.extend({

   nextZ: 0,
   gridSize: 16,
   currentSelectedObject: null,


   game: null,
   loaders: {
      sprite: null,
      sound: null,
      level: null
   },
   gameRenderContext: null,
   nextZ: 1,
	defaultSprite: null,
	spriteOptions: null,
	allSprites: null,

   constructor: null,
	
	getName: function() {
		return "LevelEditor";
	},

   /**
    * Read the <tt>Game</tt> which is being edited to get the
    * relevant parts which are going to be used by the editor.
    * @param game {Game} The <tt>Game</tt> class
    */
   setGame: function(game) {
      this.game = game;
      
      // See what kind of resource loaders the game has assigned to it
      this.loaders.sprite = [];
      this.loaders.sound = [];
      this.loaders.level = [];
      
      for (var o in this.game) {
         try {
            if (this.game[o] instanceof R.resources.loaders.SpriteLoader) {
               this.loaders.sprite.push(this.game[o]);
            } else if (this.game[o] instanceof R.resources.loaders.SoundLoader) {
               this.loaders.sound.push(this.game[o]);
            } else if (this.game[o] instanceof R.resources.loaders.LevelLoader) {
               this.loaders.level.push(this.game[o]);
            } else if (this.game[o] instanceof R.rendercontexts.AbstractRenderContext) {
               // The render context (if there's more than one, we'll need to update this)
               this.gameRenderContext = this.game[o];
            }
         } catch (ex) {
            // Some objects don't like to be touched
         }
      }
   },

   /**
    * Get the <tt>Game</tt> object which is being edited
    * @return {Game} The game being edited
    */
   getGame: function() {
      return this.game;
   },

	/**
	 * Get all of the sprites in all of the sprite resources
	 */
   getAllSprites: function() {
      if (!LevelEditor.allSprites) {
			LevelEditor.allSprites = [];
	      
	      // For each of the sprite loaders
	      for (var l in this.loaders.sprite) {
	         var loader = this.loaders.sprite[l];
	         
	         // Locate the resources (sprite sheets)
	         var resources = loader.getResources();
	         for (var r in resources) {
	            
	            // Get all of the sprites
	            var sprites = loader.getSpriteNames(resources[r]);
	            for (var s in sprites) {
	               LevelEditor.allSprites.push({
	                  lookup: l + ":" + resources[r] + ":" + sprites[s],
	                  sprite: resources[r] + ": " + sprites[s]
	               });
	            }
	         }
	      }
		}

      return LevelEditor.allSprites;
   },

   /**
    * This is the main entry point when editing a game.  Providing the
    * {@link Game} object which is being edited gives the editor a chance
    * to find all of the resource loaders being used by the game, and
    * also locate other parts of the game which can be edited.  The editor
    * will create interfaces for working with the game's structure, plus
    * it will generate data objects for the level being edited.
    * @param game {Game} The <tt>Game</tt> object being edited
    */
   edit: function(game) {
		// Create the areas for the scene graph and the object properties
      $("body", document).append($("<div id='editPanel'>").append($("<div class='sceneGraph'>")).append($("<div class='props'>")));
		
		// Set up the scene graph tree
		$("#editPanel div.sceneGraph")
			.append($("<ul>").append($("<li id='sceneGraph'>").append($("<a href='#'>").text("Level Objects"))));
			
		$("#editPanel div.sceneGraph")
			.jstree({
				"themes": {
					"theme": "default",
					"dots": true,
					"icons": false
				},
				"ui": {
					"select_limit": 1	
				},
				"contextmenu": {
					"select_node": true,
					"items": function(obj) { return LevelEditor.contextMenu(obj); }	
				},
				"plugins": ["themes","crrm","html_data","ui","contextmenu"]
			});
		
		// Bind to the method to catch renamed objects
		$("#editPanel").bind("setName", function(evt, obj, value) {
			$("#editPanel div.sceneGraph").jstree("set_text", "#" + obj.getId(), value + " [" + obj.getId() + "]");		
		});
		
		$("#editPanel div.sceneGraph").bind("select_node.jstree", function(e, data) {
			var id = $(data.args[0]).attr("id") || "";
			if (id == "") {
				id = $(data.args[0]).parent().attr("id") || "";
			}
			LevelEditor.selectById(id);			
		});
		
		// Render the editor controls
      var tbar = $("<div class='toolbar'/>");
      
      // Set the Game object which is being edited
      this.setGame(game);

      // Create actor
      tbar.append($("<span class='tool'>Actors:</span>"));
      var s = $("<select id='actor' class='tool'>");
      var spr = LevelEditor.getAllSprites();
		
		// Set the default sprite unless otherwise specified
		this.defaultSprite = spr[0].lookup;
		
      $.each(spr, function() {
         s.append($("<option value='" + this.lookup + "'>" + this.sprite + "</option>"));
      });
      tbar.append(s);
      tbar.append($("<input type='button' value='Add' class='tool'/>").click(function() {
         LevelEditor.createActor($("#actor option:selected").val());
      }));

      // Remove actor
      tbar.append($("<input type='button' value='Delete' class='tool'/>").click(function() {
         LevelEditor.deleteObject();
      }));

      // Update grid size
      tbar.append($("<span class='tool'>Grid Size:</span>"));
      tbar.append($("<input class='tool' type='text' size='3' value='16'/>").change(function() {
         if (!isNaN($(this).val())) {
            LevelEditor.gridSize = $(this).val();
         } else {
            $(this).val(LevelEditor.gridSize);
         }
      }));

      // Create collision rect
      tbar.append($("<input type='button' value='Collision Box' class='tool'/>").click(function() {
         LevelEditor.createCollisionBox();
      }));

      // We need a scrollbar to move the world
		var viewWidth = game.getRenderContext().getViewport().get().w;
      var sb = $("<div style='height: 25px; width: " + viewWidth + "px; overflow-x: auto;'><div style='width: " +
         game.getLevel().getFrame().get().w + "px; border: 1px dashed'></div></div>").bind("scroll", function() {
            game.getRenderContext().setHorizontalScroll(this.scrollLeft);
      });

      $(document.body).append(sb);

      $(document.body).append(tbar);


      // Add an event handler to the context
      var ctx = game.getRenderContext();
      ctx.addEvent(this, "mousedown", function(evt) {
         LevelEditor.selectObject(evt.pageX, evt.pageY);
         LevelEditor.mouseDown = true;
      });

      ctx.addEvent(this, "mouseup", function() {
         LevelEditor.mouseDown = false;
         LevelEditor.createPropertiesTable(LevelEditor.currentSelectedObject);
      });

      ctx.addEvent(this, "mousemove", function(evt) {
         if (LevelEditor.mouseDown) {
            LevelEditor.moveSelected(evt.pageX, evt.pageY);
         }
      });
   },

	contextMenu: function(node) {
		// Determine what type of object has been selected
		var id = node.attr("id");
		var selObj = (id == "sceneGraph" ? null : LevelEditor.getObjectById(id));
		return {
			"create": {
				"label": "Create New...",
				"action": function() { /* noop */ },
				"submenu": {
					"actor": {
						"label": "Actor",
						"action": function() { LevelEditor.createActor(LevelEditor.defaultSprite); }
					},
					"collbox": {
						"label": "Collision Block",
						"action": function() { LevelEditor.createCollisionBox(); }
					},
					"trigger": {
						"label": "Trigger Block",
						"action": function() { LevelEditor.createTriggerBox(); }
					}
				}
			},
			"copy": {
				"label": "Create Copy",
				"_disabled": selObj == null,
				"separator_after": true,
				"action": function() { LevelEditor.copyObject(selObj); }
			},
			"jump": {
				"label": "Reposition on...",
				"_disabled": selObj == null,
				"action": function() { LevelEditor.repositionViewport(selObj); }
			},
			"activate": {
				"label": "Active",
				"_disabled": selObj == null,
				"action": function(){},
				"separator_after": true
			},
			"delete": {
				"label": "Delete",
				"_disabled": selObj == null,
				"action": function() { LevelEditor.deleteObject(selObj); }
			}
		};
	},

	/**
	 * Create a sprite actor object
	 * @param actorName {String} The canonical name of the sprite
	 */
   createActor: function(actorName) {
      var ctx = LevelEditor.getGame().getRenderContext();
      var actor = R.objects.SpriteActor.create();
		
		// Set the sprite given the canonical name for it
      actor.setSprite(LevelEditor.getSpriteForName(actorName));

      // Adjust for scroll
      var s = ctx.getHorizontalScroll();
		
		var vPort = LevelEditor.getGame().getRenderContext().getViewport().get();
		var hCenter = Math.floor(vPort.w / 2), vCenter = Math.floor(vPort.h / 2); 
      var pT = R.math.Point2D.create(hCenter + s, vCenter);
      actor.setPosition(pT);
      actor.setZIndex(LevelEditor.nextZ++);
		
      ctx.add(actor);
      this.setSelected(actor);
		
		// Add the actor to the tree
		$("#editPanel div.sceneGraph").jstree("create","#sceneGraph","last",{
	  		"attr": { "id": actor.getId() },
	  		"data": actor.getName() + " [" + actor.getId() + "]"
	  	},false,true);
   },

	/**
	 * Create a simple collision box
	 * @param {Object} game
	 */
   createCollisionBox: function() {
      var ctx = LevelEditor.getGame().getRenderContext();
      var cbox = R.objects.CollisionBox.create();

      // Adjust for scroll
      var s = ctx.getHorizontalScroll();
		var vPort = ctx.getViewport();
		var hCenter = Math.floor(vPort.w / 2), vCenter = Math.floor(vPort.h / 2); 
      var pT = R.math.Point2D.create(hCenter + s, vCenter);

      cbox.setPosition(pT);
      cbox.setBoxSize(80, 80);
      cbox.setZIndex(LevelEditor.nextZ++);
      ctx.add(cbox);
      this.setSelected(cbox);
   },

	/**
	 * Copy an object and all of its properties into a new object of the same type
	 * @param obj {Object2D} The object to copy
	 */
	copyObject: function(obj) {
		obj = obj || this.currentSelectedObject;
      if (obj != null) {
		  	var original = obj;
		  	
		  	// What type of object is this?
			if (obj instanceof R.objects.SpriteActor) {
				// Create a new actor
				var cName = LevelEditor.getSpriteCanonicalName(obj.getSprite());
				LevelEditor.createActor(cName);
			} else if (obj instanceof R.objects.CollisionBox) {
				LevelEditor.createCollisionBox();	
			} /* else if (obj instanceof TriggerBox) {
		 
		 	}*/

			var bean = LevelEditor.currentSelectedObject.getProperties(), origProps = original.getProperties();
			
			for (var p in bean) {
				if (bean[p][1]) {
					if (bean[p][1].multi && bean[p][1].multi === true) {
						// Multi-option
						bean[p][1].fn(origProps[p][0]());
					} else if (bean[p][1].checkbox && bean[p][1].checkbox === true) {
						// Checkbox toggle
					} else if (bean[p][1].editor && bean[p][1].editor === true) {
						// Custom editor
					} else {
						// Single value
						bean[p][1](origProps[p][0]());
					}
				}
			}
			
			// If the object isn't in the current viewport, move it to the viewport's center
			// otherwise, offset it by half width and height down and to the right
			var newObj = LevelEditor.currentSelectedObject, 
				 ctx = LevelEditor.getGame().getRenderContext(), s = ctx.getHorizontalScroll(), pT;

			if (!ctx.getViewport().isIntersecting(newObj.getWorldBox())) {
				var vPort = LevelEditor.getGame().getRenderContext().getViewport();
				var hCenter = Math.floor(vPort.w / 2), vCenter = Math.floor(vPort.h / 2); 
		      pT = R.math.Point2D.create(hCenter + s, vCenter);
			} else {
				var offs = R.math.Point2D.create(newObj.getBoundingBox().getHalfWidth() + s, newObj.getBoundingBox().getHalfHeight());
				pT = R.math.Point2D.create(newObj.getRenderPosition()).add(offs);
				offs.destroy();
			}		

	      newObj.setPosition(pT);
			pT.destroy();
		}
	},

	/**
	 * Select the object which is at the given coordinates
	 * @param {Object} x
	 * @param {Object} y
	 */
   selectObject: function(x, y) {
      this.deselectObject();

      // Adjust for scroll
      var ctx = this.getGame().getRenderContext();
      //x += ctx.getHorizontalScroll();

      // Check to see if this object falls on top of an object
      var pt = R.math.Point2D.create(x,y);
      var itr = R.lang.Iterator.create(ctx);
      itr.reverse();
      while (itr.hasNext()) {
         var obj = itr.next();
         if (obj.isEditable &&
               obj.getWorldBox().containsPoint(pt))
         {
            this.setSelected(obj);
            break;
         }
      }
      pt.destroy();
   },

	/**
	 * Deselect the given object, or the currently selected object if "obj" is null
	 * @param {Object} obj
	 */
   deselectObject: function(obj) {
		var objId;
      if (obj == null) {
         if (this.currentSelectedObject) {
				objId = this.currentSelectedObject.getId();
            this.currentSelectedObject.setEditing(false);
            this.currentSelectedObject = null;
         }
      } else {
         obj.setEditing(false);
			objId = obj.getId();
      }

		// Deselect node in tree
		$("#editPanel div.sceneGraph").jstree("deselect_node", "#" + objId);
   },

	/**
	 * Delete the given object, or delete the currently selected object if "obj" is null
	 * @param {Object} obj
	 */
   deleteObject: function(obj) {
		var objId;
      if (obj == null) {
         if (this.currentSelectedObject) {
				objId = this.currentSelectedObject.getId();
            this.getGame().getRenderContext().remove(LevelEditor.currentSelectedObject);
            LevelEditor.currentSelectedObject.destroy();
            LevelEditor.currentSelectedObject = null;
         }
      } else {
			objId = obj.getId()
         this.getGame().getRenderContext().remove(obj);
         obj.destroy();
      }
      LevelEditor.createPropertiesTable(null);
      LevelEditor.updateLevelData();
		
		// Update the scene graph tree
		$("#editPanel div.sceneGraph").jstree("remove","#" + objId);
   },

	/**
	 * Get a reference to the object given its Id
	 * @param {Object} objId
	 */
	getObjectById: function(objId) {
		var objs = LevelEditor.gameRenderContext.getObjects(function(el) {
			return (el.getId() == objId);	
		});
		if (objs.length == 0) {
	  		// Invalid object, so deselect the current node
			LevelEditor.deselectObject();
			return null;
		}
		return objs[0];
	},

	/**
	 * Select an object by its Id
	 * @param {Object} objId
	 */
	selectById: function(objId) {
		LevelEditor.setSelected(LevelEditor.getObjectById(objId));
	},

	/**
	 * Set the selected object
	 * @param {Object} obj
	 */
   setSelected: function(obj) {
      this.deselectObject();

		if (obj) {
	  		// Update the selection in the tree
			$("#editPanel div.sceneGraph").jstree("select_node", "#" + obj.getId());
		}
			
      this.currentSelectedObject = obj;
		if (obj) {
	      obj.setEditing(true);
		}
      this.createPropertiesTable(obj);
      this.updateLevelData();
   },

	/**
	 * Move the currently selected object relative to the given coordinates
	 * @param {Object} x
	 * @param {Object} y
	 */
   moveSelected: function(x, y) {
      // Adjust for scroll
      x += this.getGame().getRenderContext().getHorizontalScroll();

		var viewWidth = this.getGame().getRenderContext().getViewport().get().w;

      if (this.currentSelectedObject) {
         var grid = viewWidth / this.gridSize;
         x = x - x % this.gridSize;
         y = y - y % this.gridSize;
         var pt = R.math.Point2D.create(x, y);
         this.currentSelectedObject.setPosition(pt);
         pt.destroy();
      }
   },

	/**
	 * Create the table which will hold all of the given object's properties
	 * @param {Object} obj
	 */
   createPropertiesTable: function(obj) {
      // Remove any existing property table
      $("#propTable").remove();

      if (this.currentSelectedObject == null) {
         return;
      }

      // Create a new property table
      var pTable = $("<table id='propTable'>");

      // Get the objects properties and bean methods
      var bean = obj.getProperties();
      for (var p in bean) {
         var r = $("<tr>");
         r.append($("<td class='propName'>" + p + "</td>"));
         var e;

         if (bean[p][1]) {
				
				if (bean[p][1].multi && bean[p][1].multi === true) {
					// Multi-select dropdown
					e = $("<select>");
					
					// If it's a function, call it to get the options as: [{ val: "foo", label: "Foo Label" }, ...]
					// otherwise, treat it as already in array/object notation above
					var opts = $.isFunction(bean[p][1].opts) ? bean[p][1].opts() : bean[p][1].opts;
					
					// Build options
					$.each(opts, function() {
						e.append($("<option value='" + this.val + "'>").text(this.label));	
					});
					
					// When the option is chosen, call the setter function
	            var fn = function() {
	               arguments.callee.cb($(this).val());
						$("#editPanel").trigger("set" + arguments.callee.prop, [arguments.callee.obj, this.value]);
	            };
					fn.cb = bean[p][1].fn;
					fn.prop = p;
					fn.obj = obj;
					
					e.change(fn).val(bean[p][0]);
				} else if (bean[p][1].checkbox && bean[p][1].checkbox === true) {
					// Checkbox toggle
					
				} else if (bean[p][1].editor && bean[p][1].editor === true) {	
					// Custom editor
					var fn = function() {
						arguments.callee.cb.apply(arguments.callee.obj, arguments.callee.args);
					};
					fn.obj = obj;
					fn.cb = bean[p][1].fn;
					fn.args = bean[p][1].args;
					e = $("<span>").text(bean[p][0]()).append($("<input type='button' value='...'>").click(bean[p][1].fn()))					
				} else {
					// Single value input
	            var fn = function() {
	               arguments.callee.cb(this.value);
						$("#editPanel").trigger("set" + arguments.callee.prop, [arguments.callee.obj, $(this).val()]);
	            };
	            fn.cb = bean[p][1];
					fn.prop = p;
					fn.obj = obj;
	
	            e = $("<input type='text' size='35' value='" + bean[p][0]().toString() + "'/>").change(fn);
				}
         } else {
            e = $("<div>").text(bean[p][0]().toString());
         }

         r.append($("<td>").append(e));
         pTable.append(r);
      }

      // Append the new property table
      $("#editPanel div.props").append(pTable);
      this.updateLevelData();
   },

	/**
	 * Return an array of sprites for a select dropdown from every sprite loader found
	 */
	getSpriteOptions: function() {
		if (!LevelEditor.spriteOptions) {
	      var spr = LevelEditor.getAllSprites();
			LevelEditor.spriteOptions = [];
	      $.each(spr, function() {
				LevelEditor.spriteOptions.push({ "val": this.lookup, "label": this.sprite });
	      });
		}
		return LevelEditor.spriteOptions;		
	},

	/**
	 * Get the sprite object for the given canonical name
	 * @param {Object} spriteOpt
	 */
	getSpriteForName: function(spriteOpt) {
		// Determine the loader, sheet, and sprite
		var spriteIdent = spriteOpt.split(":");
		var loader = LevelEditor.loaders.sprite[spriteIdent[0]];
		return loader.getSprite(spriteIdent[1], spriteIdent[2]);
	},

	/**
	 * Get the sprite's canonical name.
	 * "loaderIndex:resourceName:spriteName"
	 * 
	 * @param sprite {Sprite}
	 */
	getSpriteCanonicalName: function(sprite) {
		var loader = sprite.getSpriteLoader(), loaderIdx = 0;
		
		// Locate the sprite loader index
      for (var l in this.loaders.sprite) {
		  	if (loader === this.loaders.sprite) {
		  		loaderIdx = l;
		  		break;
		  	}
		}	         
	   
		// Return the canonical name which contains the loader index, resource name, and sprite name
		return loaderIdx + ":" + sprite.getSpriteResource().resourceName + ":" + sprite.getName();
	},

	/**
	 * Update the level data
	 */
   updateLevelData: function() {
	
		return;
      var level = "<?xml version='1.0' encoding='UTF-8'?>\n";
      level += "<level resource='" + this.getGame().getLevel().getName() + "'>\n";

      level += this.getGame().getRenderContext().toXML("  ");

      level += "</level>";
      $("#levelData").remove();
      $("body", document).append($("<textarea id='levelData'>" + level + "</textarea>"));
   },

});
}