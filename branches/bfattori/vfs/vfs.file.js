/**
 * The Render Engine
 * VFSFile
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
Engine.include("/vfs/vfs.node.js");

Engine.initObject("VFSNode", "PooledObject", function() {

/**
 * @class A file in a VFS.
 * @extends VFSNode
 */
var VFSFile = VFSNode.extend(/** @scope VFSFile.prototype */{

   size: 0,
   
   buffer: null,
   
   p: 0,
   
   constructor: function(fileId, fileName, readOnly, initialBuf) {
      this.base(fileId, fileName, readOnly);
      this.buffer = initalBuf;
      this.size = initalBuf.length;
      this.p = 0;
   },

   /**
    * Destroy the object, cleaning up any events that have been
    * attached to this object.
    */
   destroy: function() {
      this.base();
   },

   /**
    * Release the object back into the object pool.
    */
   release: function() {
      this.base();
      this.size = 0;
      this.buffer = null;
      this.p = 0;
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
      var gotLock = this.base();
      if (gotLock) {
         // Ask the server if the file was modified
         if (this.checkModified()) {
            this.update();
         }
      }
   },
   
   seek: function(loc) {
      loc = (loc < 0 ? 0 : (loc > this.buffer.length ? this.buffer.length : loc));
      this.p = loc;
   },
   
   read: function(bytes) {
      
   },
   
   write: function(bytes) {
      
   },
   
   /**
    * Update the file, from the server, respective to our
    * current buffer only.
    * @private
    */
   update: function() {
      
   },
   
 }, /** @scope VFSFile.prototype */{

   /**
    * Get the class name of this object
    *
    * @return {String} The string "VFSFile"
    */
   getClassName: function() {
      return "VFSFile";
   }

});

return VFSFile;

});
