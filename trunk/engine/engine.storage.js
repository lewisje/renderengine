/**
 * The Render Engine
 * StorageBase
 *
 * @fileoverview The base object from which all storage objects are derived.
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

Engine.initObject("StorageBase", "PooledObject", function() {

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
var StorageBase = PooledObject.extend(/** @scope StorageBase.prototype */{

   storageObject: null,

   /**
    * @private
    */
   constructor: function(name) {
      this.base(name);
      this.storageObject = null;
   },

   /**
    * Destroy the object, cleaning up any events that have been
    * attached to this object.
    */
   destroy: function() {
      this.storageObject.flush();
      this.base();
   },

   /**
    * Release the object back into the object pool.
    */
   release: function() {
      this.base();
      this.storageObject = null;
   },

   /**
    * Get the storage object
    * @return {Object} The DOM object being used to store data
    */
   getStorageObject: function() {
      return this.storageObject;
   },

   /**
    * Set the storage object
    *
    * @param storageObject {Object} The DOM object to use to store data
    */
   setStorageObject: function(storageObject) {
      this.storageObject = storageObject;
   },

   /**
    * [ABSTRACT] Finalize any pending storage requests.
    */
   flush: function() {
   },
   
   /**
    * [ABSTRACT] Create a new table to store data in.
    * 
    * @param name {String} The name of the table
    * @param columns {Array} An array of column names
    * @return {Boolean} <code>true</code> if the table was created.  <code>false</code> if
    *         the table already exists or couldn't be created for another reason.
    */
   createTable: function(name, columns) {
   },
   
   /**
    * [ABSTRACT] Drop a table by its given name
    *
    * @param name {String} The name of the table to drop
    */
   dropTable: function(name) {
   },
   
   /**
    * [ABSTRACT] Insert data for the given columns/values into the table.
    *
    * @param name {String} The name of the table
    * @param columns {Array} An array of column names that will be inserted
    * @param values {Array} An array of values for the columns
    */
   insertData: function(name, columns, values) {
   },
   
   /**
    * [ABSTRACT] Update the data in the given columns with the values for the
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
    * [ABSTRACT] Query a table, with the given name, for the data which matches
    * the conditions.
    *
    * @param columns {Array} The data columns to be retrieved
    * @param name {String} The name of the table
    * @param conditions {Array} An array of conditions a row must match
    *        to be selected.
    */
   queryData: function(columns, name, conditions) {
   }
   
 }, /** @scope StorageBase.prototype */{

   /**
    * Get the class name of this object
    *
    * @return {String} "StorageBase"
    */
   getClassName: function() {
      return "StorageBase";
   }
   
});

return StorageBase;

});
