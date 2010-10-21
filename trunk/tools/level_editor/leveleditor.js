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

Engine.include("/resourceloaders/loader.sound.js");
Engine.include("/resourceloaders/loader.sprite.js");
Engine.include("/resourceloaders/loader.level.js");

Engine.include("/objects/object.spriteactor.js");
Engine.include("/objects/object.collisionbox.js");

Engine.initObject("LevelEditor", null, function() {

/**
 * @class The 2D level editor.
 */
var LevelEditor = Base.extend({

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
            if (SpriteLoader.isInstance(this.game[o])) {
               this.loaders.sprite.push(this.game[o]);
            } else if (SoundLoader.isInstance(this.game[o])) {
               this.loaders.sound.push(this.game[o]);
            } else if (LevelLoader.isInstance(this.game[o])) {
               this.loaders.level.push(this.game[o]);
            } else if (RenderContext.isInstance(this.game[o])) {
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

   getAllSprites: function() {
      var allSprites = [];
      
      // For each of the sprite loaders
      for (var l in this.loaders.sprite) {
         var loader = this.loaders.sprite[l];
         
         // Locate the resources (sprite sheets)
         var resources = loader.getResources();
         for (var r in resources) {
            
            // Get all of the sprites
            var sprites = loader.getSpriteNames(resources[r]);
            for (var s in sprites) {
               allSprites.push({
                  lookup: l + ":" + resources[r] + ":" + sprites[s],
                  sprite: resources[r] + ": " + sprites[s]
               });
            }
         }
      }
      
      return allSprites;
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
      // Render the editor controls
      var tbar = $("<div class='toolbar'/>");
      
      // Set the Game object which is being edited
      this.setGame(game);

      // Create actor
      tbar.append($("<span class='tool'>Actors:</span>"));
      var s = $("<select id='actor' class='tool'>");
      var spr = this.getAllSprites();
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

   createActor: function(actorName) {
      var ctx = this.getGame().getRenderContext();
      var actor = SpriteActor.create();
		
		// Determine the loader, sheet, and sprite
		var spriteIdent = actorName.split(":");
		var loader = this.loaders.sprite[spriteIdent[0]];
		var sprite = loader.getSprite(spriteIdent[1], spriteIdent[2]);
      actor.setSprite(sprite);

      // Adjust for scroll
      var s = ctx.getHorizontalScroll();
		
		var vPort = this.getGame().getRenderContext().getViewport().get();
		var hCenter = Math.floor(vPort.w / 2), vCenter = Math.floor(vPort.h / 2); 
      var pT = Point2D.create(hCenter + s, vCenter);
      actor.setPosition(pT);
      actor.setZIndex(LevelEditor.nextZ++);
		
      ctx.add(actor);
      this.setSelected(actor);
   },

   createCollisionBox: function(game) {
      var ctx = game.getRenderContext();
      var cbox = CollisionBox.create();

      // Adjust for scroll
      var s = ctx.getHorizontalScroll();
      var pT = Point2D.create(game.centerPoint.x + s, game.centerPoint.y);

      cbox.setPosition(pT);
      cbox.setBoxSize(80, 80);
      cbox.setZIndex(this.nextZ++);
      ctx.add(cbox);
      this.setSelected(cbox);
   },

   selectObject: function(x, y) {
      this.deselectObject();

      // Adjust for scroll
      var ctx = this.getGame().getRenderContext();
      //x += ctx.getHorizontalScroll();

      // Check to see if this object falls on top of an object
      var pt = Point2D.create(x,y);
      var itr = Iterator.create(ctx);
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

   deselectObject: function(obj) {
      if (obj == null) {
         if (this.currentSelectedObject) {
            this.currentSelectedObject.setEditing(false);
            this.currentSelectedObject = null;
         }
      } else {
         obj.setEditing(false);
      }
   },

   deleteObject: function(obj) {
      if (obj == null) {
         if (this.currentSelectedObject) {
            this.getGame().getRenderContext().remove(LevelEditor.currentSelectedObject);
            LevelEditor.currentSelectedObject.destroy();
            LevelEditor.currentSelectedObject = null;
         }
      } else {
         this.getGame().getRenderContext().remove(obj);
         obj.destroy();
      }
      LevelEditor.createPropertiesTable(null);
      LevelEditor.updateLevelData();
   },

   setSelected: function(obj) {
      this.deselectObject();
      this.currentSelectedObject = obj;
      obj.setEditing(true);
      this.createPropertiesTable(obj);
      this.updateLevelData();
   },

   moveSelected: function(x, y) {
      // Adjust for scroll
      x += this.getGame().getRenderContext().getHorizontalScroll();

		var viewWidth = this.getGame().getRenderContext().getViewport().get().w;

      if (this.currentSelectedObject) {
         var grid = viewWidth / this.gridSize;
         x = x - x % this.gridSize;
         y = y - y % this.gridSize;
         var pt = Point2D.create(x, y);
         this.currentSelectedObject.setPosition(pt);
         pt.destroy();
      }
   },

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
            var fn = function() {
               arguments.callee.cb(this.value);
            };
            fn.cb = bean[p][1];

            e = $("<input type='text' size='15' value='" + bean[p][0]() + "'/>").change(fn);
         } else {
            e = $("<div>").text(bean[p][0]().toString());
         }

         r.append(e);
         pTable.append(r);
      }

      // Append the new property table
      $("body", document).append(pTable);
      this.updateLevelData();
   },

   updateLevelData: function() {
      var level = "<?xml version='1.0' encoding='UTF-8'?>\n";
      level += "<level resource='" + this.getGame().getLevel().getName() + "'>\n";

      level += this.getGame().getRenderContext().toXML("  ");

      level += "</level>";
      $("#levelData").remove();
      $("body", document).append($("<textarea id='levelData'>" + level + "</textarea>"));
   },

});

return LevelEditor;

});