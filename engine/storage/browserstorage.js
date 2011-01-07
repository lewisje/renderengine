/**
 * The Render Engine
 * BrowserStorage
 *
 * @fileoverview Generalized browser-based storage class for W3C storage types.
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
	"class": "R.storage.BrowserStorage",
	"requires": [
		"R.storage.AbstractStorage"
	]
});

/**
 * @class <tt>BrowserStorage</tt> is a generalized class for browser-based
 * 	storage mechanisms.
 * 
 * @param name {String} The name of the object
 * @extends StorageBase
 * @constructor
 * @description Generalized base storage class for browser storage objects.
 */
R.storage.BrowserStorage = function(){
	return R.storage.AbstractStorage.extend(/** @scope R.storage.BrowserStorage.prototype */{
	
		/**
		 * @private
		 */
		constructor: function(name){
			this.setStorageObject(this.initStorageObject());
			this.base(name);
		},
		
		/**
		 * Get the overall schema for the tables in persistent storage.
		 * @return {Array} The tables in the schema
		 */
		getSchema: function(){
			var schema = this.getStorageObject().getItem(this.getName() + ":schema");
			if (schema) {
				return JSON.parse(schema);
			}
			return null;
		},
		
		/**
		 * Create a new table to store data in.
		 *
		 * @param name {String} The name of the table
		 * @param columns {Array} An array of case-sensitive column names
		 * @param types {Array} An array of the columns types.  The types are 1:1 for the column
		 * 	names.  If you omit <tt>types</tt>, all columns will be assumed type "String".
		 * @return {Boolean} <code>true</code> if the table was created.  <code>false</code> if
		 *         the table already exists or couldn't be created for another reason.
		 */
		createTable: function(name, columns, types){
			if (!this.enabled) {
				return;
			}
			
			try {
				if (!this.tableExists(name)) {
					var tName = this.getTableUID(name);
					
					// Create the schema object
					var def = {};
					for (var c in columns) {
						def[columns[c]] = {
							type: types ? types[c] : "String"
						};
					}
					this.getStorageObject().setItem(tName + ":def", JSON.stringify(def));
					this.getStorageObject().setItem(tName + ":dat", JSON.stringify([]));
					
					// Add it to the overall schema
					var schema = this.getSchema();
					if (schema != null) {
						schema.push(name);
					}
					else {
						schema = [name];
					}
					this.getStorageObject().setItem(this.getName() + ":schema", JSON.stringify(schema));
					
					// Make sure the underlying system is updated
					return this.base(name, def);
				}
				else {
					return false;
				}
			} 
			catch (ex) {
				return false;
			}
		},
		
		/**
		 * Drop a table by its given name
		 *
		 * @param name {String} The name of the table to drop
		 */
		dropTable: function(name){
			if (!this.enabled) {
				return;
			}
			
			var tName = this.getTableUID(name);
			this.getStorageObject().removeItem(tName + ":def");
			this.getStorageObject().removeItem(tName + ":dat");
			
			// Remove it from the overall schema
			var schema = this.getSchema();
			if (schema != null) {
				R.engine.Support.arrayRemove(schema, name);
			}
			else {
				schema = [];
			}
			if (schema.length == 0) {
				this.getStorageObject().removeItem(this.getName() + ":schema");
			}
			else {
				this.getStorageObject().setItem(this.getName() + ":schema", JSON.stringify(schema));
			}
			
			this.base(name);
		},
		
		/**
		 * Returns <tt>true</tt> if the table with the given name exists
		 * @param name {String} The name of the table
		 * @return {Boolean}
		 */
		tableExists: function(name){
			if (!this.enabled) {
				return false;
			}
			
			// See if the table exists		
			var tName = this.getTableUID(name);
			return !!this.getStorageObject().getItem(tName + ":def");
		},
		
		/**
		 * Set the data, for the given table, in the persistent storage.
		 *
		 * @param name {String} The name of the table
		 * @param data {Object} The table data to store
		 * @return {Number} 1 if the data was stored, or 0 if the table doesn't exist
		 */
		setTableData: function(name, data){
			if (!this.enabled) {
				return;
			}
			
			// See if the table exists		
			if (this.tableExists(name)) {
				var tName = this.getTableUID(name);
				this.getStorageObject().setItem(tName + ":dat", JSON.stringify(data));
				return 1;
			}
			else {
				return 0;
			}
		},
		
		/**
		 * Get the schema object, for the given table.
		 * @param name {String} The name of the table
		 * @return {Object} The data object, or <tt>null</tt> if no table with the given name exists
		 */
		getTableDef: function(name){
			if (!this.enabled) {
				return;
			}
			
			// See if the table exists		
			if (this.tableExists(name)) {
				var tName = this.getTableUID(name);
				return JSON.parse(this.getStorageObject().getItem(tName + ":def"));
			}
			else {
				return null;
			}
		},
		
		/**
		 * Get the data object, for the given table.
		 * @param name {String} The name of the table
		 * @return {Object} The data object, or <tt>null</tt> if no table with the given name exists
		 */
		getTableData: function(name){
			if (!this.enabled) {
				return;
			}
			
			// See if the table exists		
			if (this.tableExists(name)) {
				var tName = this.getTableUID(name);
				return JSON.parse(this.getStorageObject().getItem(tName + ":dat"));
			}
			else {
				return null;
			}
		}
		
	}, /** @scope R.storage.BrowserStorage.prototype */ {
	
		/**
		 * Get the class name of this object
		 *
		 * @return {String} "R.storage.BrowserStorage"
		 */
		getClassName: function(){
			return "R.storage.BrowserStorage";
		}
		
	});
	
}