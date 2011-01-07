/**
 * The Render Engine
 * AbstractStorage
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

// The class this file defines and its required classes
R.Engine.define({
	"class": "R.storage.AbstractStorage",
	"requires": [
		"R.engine.PooledObject",
		"R.lang.FNV1Hash"
	],
	"includes": [
		"/libs/trimpath-query-1.1.14.js"
	]
});

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
R.storage.AbstractStorage = function(){
	return R.engine.PooledObject.extend(/** @scope R.storage.AbstractStorage.prototype */{
	
		storageObject: null,
		fnv: null,
		schema: null,
		trimPath: null,
		
		/**
		 * @private
		 */
		constructor: function(name){
			this.base(name || "AbstractStorage");
			this.fnv = R.lang.FNV1Hash.create();
			this.storageObject = this.initStorageObject();
			
			// See if a table schema exists for the given name
			var schema = this.getSchema();
			if (schema != null) {
				// Load the table data
				var tSchema = {};
				for (var s in schema) {
					tSchema[schema[s]] = this.getTableDef(schema[s]);
				}
				this.schema = tSchema;
				
				// We'll update this as needed
				this.trimPath = TrimPath.makeQueryLang(this.schema);
			}
		},
		
		/**
		 * Destroy the object, cleaning up any events that have been
		 * attached to this object.
		 */
		destroy: function(){
			this.storageObject.flush();
			this.base();
		},
		
		/**
		 * Release the object back into the object pool.
		 */
		release: function(){
			this.base();
			this.storageObject = null;
		},
		
		/**
		 * [ABSTRACT] Initialize the storage object which holds the data
		 * @return {Object} The storage object
		 */
		initStorageObject: function(){
			return null;
		},
		
		/**
		 * [ABSTRACT] Get the data storage schema from the storage object.
		 * @return {Array} An array of tables for the storage object
		 */
		getSchema: function(){
			return null;
		},
		
		/**
		 * Get the storage object
		 * @return {Object} The DOM object being used to store data
		 */
		getStorageObject: function(){
			return this.storageObject;
		},
		
		/**
		 * Set the storage object
		 *
		 * @param storageObject {Object} The DOM object to use to store data
		 */
		setStorageObject: function(storageObject){
			this.storageObject = storageObject;
		},
		
		/**
		 * A unique identifier for the table name.
		 * @param name {String} The table name
		 * @return {String} A unique identifier
		 */
		getTableUID: function(name){
			var uid = this.fnv.getHash(this.getName() + name);
			return uid + "PS";
		},
		
		/**
		 * [ABSTRACT] Finalize any pending storage requests.
		 */
		flush: function(){
		},
		
		/**
		 * Create a new table to store data in.
		 *
		 * @param name {String} The name of the table
		 * @param def {Object} Table definition object
		 * @return {Boolean} <code>true</code> if the table was created.  <code>false</code> if
		 *         the table already exists or couldn't be created for another reason.
		 */
		createTable: function(name, def){
			if (this.schema == null) {
				this.schema = {};
			}
			this.schema[name] = def;
			this.trimPath = TrimPath.makeQueryLang(this.schema);
		},
		
		/**
		 * Drop a table by its given name
		 *
		 * @param name {String} The name of the table to drop
		 */
		dropTable: function(name){
			if (this.schema == null) {
				return;
			}
			delete this.schema[name];
			this.trimPath = TrimPath.makeQueryLang(this.schema);
		},
		
		/**
		 * Returns <tt>true</tt> if the table with the given name exists
		 * @param name {String} The name of the table
		 * @return {Boolean}
		 */
		tableExists: function(name){
			return false;
		},
		
		/**
		 * Set the data, for the given table, in the persistent storage.
		 *
		 * @param name {String} The name of the table
		 * @param data {Object} The table data to store
		 * @return {Number} 1 if the data was stored, or 0 if the table doesn't exist
		 */
		setTableData: function(name, data){
			return 0;
		},
		
		/**
		 * Get the schema object, for the given table.
		 * @param name {String} The name of the table
		 * @return {Object} The data object, or <tt>null</tt> if no table with the given name exists
		 */
		getTableDef: function(name){
			return null;
		},
		
		/**
		 * Get the data object, for the given table.
		 * @param name {String} The name of the table
		 * @return {Object} The data object, or <tt>null</tt> if no table with the given name exists
		 */
		getTableData: function(name){
			return null;
		},
		
		/**
		 * Execute SQL on the storage object, which may be one of <tt>SELECT</tt>,
		 * <tt>UPDATE</tt>, <tt>INSERT</tt>, or <tt>DELETE</tt>.
		 * @param sqlString {String} The SQL to execute
		 * @param bindings {Array} An optional array of bindings
		 * @return {Object} If the SQL is a <tt>SELECT</tt>, the object will be the result of
		 * 	the statement, otherwise the result will be a <tt>Boolean</tt> if the statement was
		 * 	successful.
		 */
		execSql: function(sqlString, bindings){
			if (this.trimPath != null) {
				// Compile the method
				var stmt = this.trimPath.parseSQL(sqlString, bindings);
				// Build an object with all of the data
				var schema = this.getSchema();
				var db = {};
				for (var s in schema) {
					db[schema[s]] = this.getTableData(schema[s]);
				}
				if (sqlString.indexOf("SELECT") != -1) {
					return stmt.filter(db);
				}
				else {
					// Determine which table was modified
					var result = stmt.filter(db);
					var tableName = "";
					if (result === true) {
						// Only update the storage if the statement was successful
						if (sqlString.indexOf("INSERT") != -1) {
							tableName = /INSERT INTO (\w*)/.exec(sqlString)[1];
						}
						else 
							if (sqlString.indexOf("UPDATE") != -1) {
								tableName = /UPDATE (\w*)/.exec(sqlString)[1];
							}
							else {
								tableName = /DELETE \w* FROM (\w*)/.exec(sqlString)[1];
							}
						
						// Extract that table from the database and store it
						var table = db[tableName];
						this.setTableData(tableName, table);
					}
					return result;
				}
			}
		}
		
	}, /** @scope R.storage.AbstractStorage.prototype */ {
	
		/**
		 * Get the class name of this object
		 *
		 * @return {String} "R.storage.AbstractStorage"
		 */
		getClassName: function(){
			return "R.storage.AbstractStorage";
		}
		
	});
	
}