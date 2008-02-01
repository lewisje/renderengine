/**
 * The Render Engine
 * InputComponent
 * 
 * A component which can read an input device and make those inputs
 * available for usage.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 * @author: $Author: bfattori $
 * @version: $Revision: 42 $
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
 
var NotifierComponent = BaseComponent.extend({

   notifyLists: null,   

   constructor: function(name, type, priority) {
      this.base(name, type, priority || 1.0);
      this.notifyLists = {};
   },

   /**
    * Add a recipient function for the event type specified.  The function
    * will be passed the event object as its only parameter.
    *
    * @param type {String} The type name of the event list.
    * @param fn {Function} The function to call when the event triggers.
    */
   addRecipient: function(type, thisObj, fn) {
      if (this.notifyLists[type] == null) {
         this.notifyLists[type] = [];
      }
      this.notifyLists[type].push({parent: thisObj, func: fn});
   },
   
   /**
    * Remove a recipient function for the event type specified.
    *
    * @param type {String} The type name of the event list.
    * @param fn {Function} The function to remove from the notification list.
    */
   removeRecipient: function(type, thisObj, fn) {
      var o = {parent: thisObj, func: fn};
      var idx = -1;
      if (Array.prototype.indexof)
      {
         idx = this.notifyLists[type].indexOf(o);   
      }
      else
      {
         for (var i = 0; i < this.notifyLists[type].length; i++)
         {
            if (this.notifyLists[type][i] == o)
            {
               idx = i;
               break;
            }
         }
      }
      
      this.slice(idx, 1);
   },
   
   /**
    * Run through the list of recipients functions for the
    * event type specified.  Optimized for speed if the list
    * is large.
    */
   notifyRecipients: function(type, eventObj) {
      if (this.notifyLists[type] == null)
      {
         // No handlers for this type
         return;
      }
   
      // Using Duff's device with loop inversion
      var p = 0;
      var s = null;
      switch(this.notifyLists[type].length & 0x3)
      {
         case 3:
            s = this.notifyLists[type][p++];
            s.func.call(s.parent, eventObj);
         case 2:
            s = this.notifyLists[type][p++];
            s.func.call(s.parent, eventObj);
         case 1:
            s = this.notifyLists[type][p++];
            s.func.call(s.parent, eventObj);
      }
      
      if (p < this.notifyLists[type].length)
      {
         do
         {
            s = this.notifyLists[type][p++];
            s.func.call(s.parent, eventObj);

            s = this.notifyLists[type][p++];
            s.func.call(s.parent, eventObj);

            s = this.notifyLists[type][p++];
            s.func.call(s.parent, eventObj);

            s = this.notifyLists[type][p++];
            s.func.call(s.parent, eventObj);

         } while (p < this.notifyLists[type].length);
      }
   },
   
   /**
    * Get the class name of this object
    *
    * @type String
    */
   getClassName: function() {
      return "NotifierComponent";
   }

});