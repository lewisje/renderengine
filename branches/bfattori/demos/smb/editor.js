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

Engine.initObject("SpriteTestEditor", null, function() {

/**
 * @class The player object.  Creates the player and assigns the
 *        components which handle collision, drawing, drawing the thrust
 *        and moving the object.
 */
var SpriteTestEditor = Base.extend({

   nextZ: 0,

   gridSize: 16,

   currentSelectedObject: null,

   constructor: null,

   edit: function() {
      // Render the editor controls
      var tbar = $("<div class='toolbar'/>");
      var self = this;

      // Create actor
      tbar.append($("<span class='tool'>Actors:</span>"));
      var s = $("<select id='actor' class='tool'>");
      var spr = SpriteTest.spriteLoader.getSpriteNames("smbtiles");
      $.each(spr, function() {
         s.append($("<option value='" + this + "'>" + this + "</option>"));
      });
      tbar.append(s);
      tbar.append($("<input type='button' value='Add' class='tool'/>").click(function() {
         self.createActor($("#actor option:selected").val());
      }));

      // Remove actor
      tbar.append($("<input type='button' value='Delete' class='tool'/>").click(function() {
         SpriteTestEditor.deleteObject();
      }));

      // Update grid size
      tbar.append($("<span class='tool'>Grid Size:</span>"));
      tbar.append($("<input class='tool' type='text' size='3' value='16'/>").change(function() {
         if (!isNaN($(this).val())) {
            SpriteTestEditor.gridSize = $(this).val();
         } else {
            $(this).val(SpriteTestEditor.gridSize);
         }
      }));

      // Create collision rect
      tbar.append($("<input type='button' value='Collision Box' class='tool'/>").click(function() {
         self.createCollisionBox();
      }));

      // We need a scrollbar to move the world
      var sb = $("<div style='height: 20px; width: " + SpriteTest.fieldWidth + "px; overflow-x: auto;'><div style='width: " +
         SpriteTest.getLevel().getFrame().get().w + "px; border: 1px dashed'></div></div>").bind("scroll", function() {
            SpriteTest.getRenderContext().setHorizontalScroll(this.scrollLeft);
      });

      $(document.body).append(sb);

      $(document.body).append(tbar);


      // Add an event handler to the context
      var ctx = SpriteTest.getRenderContext();
      ctx.addEvent(this, "mousedown", function(evt) {
         self.selectObject(evt.pageX, evt.pageY);
         self.mouseDown = true;
      });

      ctx.addEvent(this, "mouseup", function() {
         self.mouseDown = false;
         SpriteTestEditor.createPropertiesTable(SpriteTestEditor.currentSelectedObject);
      });

      ctx.addEvent(this, "mousemove", function(evt) {
         if (self.mouseDown) {
            self.moveSelected(evt.pageX, evt.pageY);
         }
      });
   },

   createActor: function(actorName) {
      var ctx = SpriteTest.getRenderContext();
      var actor = SpriteTestActor.create();
      actor.setSprite(SpriteTest.spriteLoader.getSprite("smbtiles", actorName));

      // Adjust for scroll
      var s = ctx.getHorizontalScroll();
      var pT = Point2D.create(SpriteTest.centerPoint.x + s, SpriteTest.centerPoint.y);

      actor.setPosition(pT);
      actor.setZIndex(SpriteTest.nextZ++);
      ctx.add(actor);
      SpriteTestEditor.setSelected(actor);
   },

   createCollisionBox: function() {
      var ctx = SpriteTest.getRenderContext();
      var cbox = SpriteTestCollisionBox.create();

      // Adjust for scroll
      var s = ctx.getHorizontalScroll();
      var pT = Point2D.create(SpriteTest.centerPoint.x + s, SpriteTest.centerPoint.y);

      cbox.setPosition(pT);
      cbox.setBoxSize(80, 80);
      cbox.setZIndex(SpriteTestEditor.nextZ++);
      ctx.add(cbox);
      SpriteTestEditor.setSelected(cbox);
   },

   selectObject: function(x, y) {
      this.deselectObject();

      // Adjust for scroll
      var ctx = SpriteTest.getRenderContext();
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
            SpriteTestEditor.setSelected(obj);
            break;
         }
      }
   },

   deselectObject: function(obj) {
      if (obj == null) {
         if (SpriteTestEditor.currentSelectedObject) {
            SpriteTestEditor.currentSelectedObject.setEditing(false);
            SpriteTestEditor.currentSelectedObject = null;
         }
      } else {
         obj.setEditing(false);
      }
   },

   deleteObject: function(obj) {
      if (obj == null) {
         if (SpriteTestEditor.currentSelectedObject) {
            SpriteTest.getRenderContext().remove(SpriteTestEditor.currentSelectedObject);
            SpriteTestEditor.currentSelectedObject = null;
         }
      } else {
         SpriteTest.getRenderContext().remove(obj);
      }
      SpriteTestEditor.createPropertiesTable(null);
      SpriteTestEditor.updateLevelData();
   },

   setSelected: function(obj) {
      SpriteTestEditor.deselectObject();
      SpriteTestEditor.currentSelectedObject = obj;
      obj.setEditing(true);
      SpriteTestEditor.createPropertiesTable(obj);
      SpriteTestEditor.updateLevelData();
   },

   moveSelected: function(x, y) {
      // Adjust for scroll
      x += SpriteTest.renderContext.getHorizontalScroll();

      if (SpriteTestEditor.currentSelectedObject) {
         var grid = SpriteTest.fieldWidth / SpriteTestEditor.gridSize;
         x = x - x % SpriteTestEditor.gridSize;
         y = y - y % SpriteTestEditor.gridSize;
         SpriteTestEditor.currentSelectedObject.setPosition(Point2D.create(x, y));
      }
   },

   createPropertiesTable: function(obj) {
      // Remove any existing property table
      $("#propTable").remove();

      if (SpriteTestEditor.currentSelectedObject == null) {
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
      SpriteTestEditor.updateLevelData();
   },

   updateLevelData: function() {
      var level = "<?xml version='1.0' encoding='UTF-8'?>\n";
      level += "<level resource='" + SpriteTest.getLevel().getName() + "'>\n";

		level += SpriteTest.renderContext.toString("   ");

      level += "</level>";
      $("#levelData").remove();
      $("body", document).append($("<textarea id='levelData'>" + level + "</textarea>"));
   },

});

return SpriteTestEditor;

});