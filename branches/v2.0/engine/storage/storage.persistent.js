/**
 * The Render Engine
 * PersistentStorage
 *
 * @fileoverview A storage object where data is maintained between browser sessions.
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
Engine.include("/engine/engine.storage.js");

Engine.initObject("PersistentStorage", "StorageBase", function() {

/**
 * @class <tt>BaseStorage</tt> is the base class of all storage objects.
 *        Currently, The Render Engine supports three types of storage,
 *        all with the ability to export their data remotely
 *        and to import data from a remote source.
 * 
 * @param name {String} The name of the object
 * @extends PooledObject
 * @constructor
 * @description This base class is considered abstract and should not be
 *              instantiated directly.  See {@link TransientStorage}, 
 *              {@link PersistentStorage}, or {@link IndexedStorage} for
 *              implementations.
 */
var PersistentStorage = StorageBase.extend(/** @scope PersistentStorage.prototype */{

   enabled: null,

   /**
    * @private
    */
   constructor: function(name) {
      this.base(name);
      this.enabled = EngineSupport.sysInfo().support.storage.local;
      AssertWarn(enabled, "PersistentStorage is not supported by browser - DISABLED");
      this.setStorageObject(window.localStorage);
   },

   /**
    * Release the object back into the object pool.
    */
   release: function() {
      this.base();
      this.enabled = null;
   },

   /**
    * Create a new table to store data in.
    * 
    * @param name {String} The name of the table
    * @param columns {Array} An array of column names
    * @return {Boolean} <code>true</code> if the table was created.  <code>false</code> if
    *         the table already exists or couldn't be created for another reason.
    */
   createTable: function(name, columns) {
      if (!this.enabled) {
         return;
      }
      
      try {
         var exists = this.getStorageObject().getItem(name + ":def");
         if (!exists) {
            this.getStorageObject().setItem(name + ":def", JSON.stringify(columns));
            this.getStorageObject().setItem(name + ":idx", 0);
            return true;
         } else {
            return false;
         }
      } catch (ex) {
         return false;
      }
   },
   
   /**
    * Drop a table by its given name
    *
    * @param name {String} The name of the table to drop
    */
   dropTable: function(name) {
      if (!this.enabled) {
         return;
      }
      
      this.getStorageObject().removeItem(name + ":def");
      var idx = this.getStorageObject().getItem(name + ":idx");
      for (var i = 0; i < idx; i++) {
         this.getStorageObject().removeItem(name + ":" + i);
      }
      this.getStorageObject().removeItem(name + ":idx");
   },
   
   /**
    * Insert data for the given columns/values into the table.
    *
    * @param name {String} The name of the table
    * @param columns {Array} An array of column names that will be inserted
    * @param values {Array} An array of values for the columns 
    */
   insertData: function(name, columns, values) {
   },
   
   /**
    * Update the data in the given columns with the values for the
    * table provided, replacing data based on the given conditions.
    * 
    * @param name {String} The table name
    * @param columns {Array} An array of column names
    * @param values {Array} An array of values for the columns
    * @param conditions {Array} An array of conditions a row must match
    *        to be updated.
    */
   updateData: function(name, columns, values, conditions) {
   },
   
   /**
    * Query a table, with the given name, for the data which matches
    * the conditions.
    *
    * @param columns {Array} The data columns to be retrieved
    * @param name {String} The name of the table
    * @param conditions {Array} An array of conditions a row must match
    *        to be selected.
    */
   queryData: function(columns, name, conditions) {
   }
   
 }, /** @scope PersistentStorage.prototype */{

   /**
    * Get the class name of this object
    *
    * @return {String} "PersistentStorage"
    */
   getClassName: function() {
      return "PersistentStorage";
   }
   
});

return PersistentStorage;

});
