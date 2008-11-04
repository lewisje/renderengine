/**
 * The Render Engine
 * VFSNode
 *
 *
 * @author: Brett Fattori (brettf@renderengine.com)
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

// Includes
Engine.include("/engine/engine.pooledobject.js");

Engine.initObject("VFSNode", "PooledObject", function() {

/**
 * @class A generic representation of an object in the VFS.
 * @extends PooledObject
 */
var VFSNode = PooledObject.extend(/** @scope VFSNode.prototype */{

   id: null,
   
   vfsName: null,
   
   readOnly: false,
   
   locked: false,
   
   open: false,
   
   checksum: null,
   
   constructor: function(fileId, fileName, readOnly, checksum) {
      this.base("VFSFile" + fileId);
      this.vfsName = fileName;
      this.readOnly = readOnly;
      this.locked = false;
      this.open = true;
      this.checksum = checksum;
   },

   /**
    * Destroy the object, cleaning up any events that have been
    * attached to this object.
    */
   destroy: function() {
      // It will be necessary, if the file is locked on the server, to unlock it
      this.releaseLock();
      this.base();
   },

   /**
    * Release the object back into the object pool.
    */
   release: function() {
      this.base();
      this.id = null;
      this.folder = false;
      this.vfsName = null;
      this.size = 0;
      this.readOnly = false;
      this.buffer = null;
      this.locked = false;
   },
   
   /**
    * Close the file.  A closed file cannot be written to, or read from.
    */
   close: function() {
      this.releaseLock();      
      this.open = false;   
   },

   /**
    * Open the file.
    */
   open: function() {
      if (!this.open) {
         this.open = true;
      }
   },
   
   /**
    * Determine if the node is currently open.
    * @return {Boolean} <tt>true</tt> if the node is open
    */
   isOpen: function() {
      return this.open;
   },
   
   /**
    * Before a file can be modified, it must be locked on the server.  This
    * prevents any other clients from modifying the same file.  If the lock
    * isn't available (i.e. some other client currently holds the lock) then
    * this method will return false.
    *
    * @return {Boolean} <tt>true</tt> if the file lock was obtained by this client
    */
   obtainLock: function() {
      // Ask the server for the lock on the file
      this.locked = true;
      return true;
   },
   
   /**
    * Release the lock on the server.
    */
   releaseLock: function() {
      if (this.locked) {
         // Tell the server we're done with the file   
         this.locked = false;
      }
   },
   
   /**
    * Determine if the node is currently locked for modifications.
    * @return {Boolean} <tt>true</tt> if the node is locked
    */
   isLocked: function() {
      return this.locked;
   },
   
   /**
    * Get the checksum for this file from the server.
    */
   getChecksum: function() {
      
   },
   
   /**
    * Determine if a node was modified by comparing the checksum stored
    * locally and the checksum from the server.
    * @return {Boolean} <tt>true</tt> if the node was modified
    */
   checkModified: function() {
      return (this.getChecksum() !== this.checksum);
   },

 }, /** @scope VFSNode.prototype */{

   /**
    * Get the class name of this object
    *
    * @return {String} The string "VFSNode"
    */
   getClassName: function() {
      return "VFSNode";
   }

});

return VFSNode;

});
