
/**
 * The Render Engine
 * Engine Linker Class
 *
 * @fileoverview A class for checking class dependencies and class intialization
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

/**
 * @class A static class for processing class files, looking for dependencies, and
 *        ensuring that all dependencies exist before initializing a class.  The linker
 *        expects that files will follow a fairly strict format, so that patterns can be
 *        identified and all dependencies resolved.
 *        <p/>
 *        These methods handle object dependencies so that each object will be
 *        initialized as soon as its dependencies become available.  Using this method
 *        scripts can be loaded immediately, using the browsers threading model, and
 *        executed when dependencies are fulfilled.
 *
 * @static
 */
var Linker = Base.extend(/** @scope Linker.prototype */{ 

   constructor: null,

   //====================================================================================================
   //====================================================================================================
   //                                   DEPENDENCY PROCESSOR
   //
   //====================================================================================================
   //====================================================================================================

   dependencyList: {},
   dependencyCount: 0,
   dependencyProcessor: null,
   dependencyTimer: null,
   dependencyCheckTimeout: $.browser.Wii ? 8500 : 6500,
   dependencyProcessTimeout: 100,
   
   loadedClasses: [],
   
   /**
    * Cleanup all initialized classes and start fresh.
    * @private
    */
   cleanup: function() {
      for (var c in Linker.loadedClasses) {
         var d = Linker.loadedClasses[c]
         var parentObj = Linker.getParentClass(d);
         if (EngineSupport.sysInfo().browser != "msie") {
            // IE doesn't allow this
            delete parentObj[d];
         }
      }
      Linker.loadedClasses = [];
   },

   /**
    * Initializes an object for use in the engine.  Calling this method is required to make sure
    * that all dependencies are resolved before actually instantiating an object of the specified
    * class.
    *
    * @param objectName {String} The name of the object class
    * @param primaryDependency {String} The name of the class for which the <tt>objectName</tt> class is
    *                                   dependent upon.  Specifying <tt>null</tt> will assume the <tt>Base</tt> class.
    * @param fn {Function} The function to run when the object can be initialized.
    */
   initObject: function(objectName, primaryDependency, fn) {
      var objDeps = Linker.findAllDependencies(objectName, fn);

      // Add the known dependency to the list of object
      // dependencies we discovered
      if (primaryDependency) {
         objDeps.push(primaryDependency);
      }
      
      var newDeps = [];

      // Check for nulls and circular references
      for (var d in objDeps) {
         if (objDeps[d] != null) {
            if (objDeps[d].split(".")[0] != objectName) {
               newDeps.push(objDeps[d]);
            } else {
               Console.warn("Object references itself: ", objectName);
            }
         }
      }

      // Store the object for intialization when all dependencies are resolved
      Linker.dependencyList[objectName] = {deps: newDeps, objFn: fn};
      Linker.dependencyCount++;
      Console.info(objectName, " depends on: ", newDeps);

      // Check for 1st level circular references
      this.checkCircularRefs(objectName);

      // After a period of time has passed, we'll check our dependency list.
      // If anything remains, we'll drop the bomb that certain files didn't resolve...
      window.clearTimeout(Linker.dependencyTimer);
      Linker.dependencyTimer = window.setTimeout(Linker.checkDependencyList, Linker.dependencyCheckTimeout);

      if (!Linker.dependencyProcessor) {
         Linker.dependencyProcessor = window.setTimeout(Linker.processDependencies, Linker.dependencyProcessTimeout);
      }
   },

   /**
    * Check the object to make sure the namespace(s) are defined.
    * @param objName {String} A dot-notation class name
    * @private
    */
   checkNSDeps: function(objName) {
      var objHr = objName.split(".");

      if (objHr.length == 1) {
         return true;
      }

      var o = window;
      for (var i = 0; i < objHr.length - 1; i++) {
         o = o[objHr[i]];
         if (!o) {
            return false;
         }
      }
      return true;
   },

   /**
    * Get the parent class of the object specified by classname string.
    * @param classname {String} A dot-notation class name
    * @private
    */
   getParentClass: function(classname) {
      var objHr = classname.split(".");
      var o = window;
      for (var i = 0; i < objHr.length - 1; i++) {
         o = o[objHr[i]];
         if (!o) {
            return null;
         }
      }
      return o;
   },

   /**
    * The dependency processor and link checker.
    * @private
    */
   processDependencies: function() {
      var pDeps = [];
      var dCount = 0;
      for (var d in Linker.dependencyList) {
         // Check to see if the dependencies of an object are loaded
         // We also need to make sure that it's namespace(s) are initialized
         dCount++;

         var deps = Linker.dependencyList[d].deps;
         var resolved = [];
         var miss = false;
			if (deps.length > 0) {
	         for (var dep in deps) {
	            if (deps[dep] != null && window[deps[dep]] == null) {
	               miss = true;
	            } else {
	               resolved.push(deps[dep]);
	            }
	         }
	
	         for (var x in resolved) {
	            EngineSupport.arrayRemove(Linker.dependencyList[d].deps, resolved[x]);
	         }
			}

         if (!miss && Linker.checkNSDeps(d)) {
            // We can initialize it now
            Console.log("Initializing '", d, "'");
            var parentObj = Linker.getParentClass(d);
            parentObj[d] = Linker.dependencyList[d].objFn();
            Console.info("-> Initialized '", d, "'");
            Linker.loadedClasses.push(d);

            // Remember what we processed so we don't process them again
            pDeps.push(d);
            
            // After it has been initialized, check to see if it has the
            // resolved() class method
            if (parentObj[d].resolved) {
					try {
	               parentObj[d].resolved();
					} catch (rEx) {
						Console.error("Error calling " + d + ".resolved() due to: " + rEx.message, rEx);
					}
            }
         }
      }

      for (var i in pDeps) {
         delete Linker.dependencyList[pDeps[i]];
      }

      if (dCount != 0) {
         Linker.dependencyProcessor = window.setTimeout(Linker.processDependencies, Linker.dependencyProcessTimeout);
      } else {
         window.clearTimeout(Linker.dependencyProcessor);
         Linker.dependencyProcessor = null;
      }
   },

   /*
    * The following set of functions breaks apart a function into its
    * components.  It is used to determine the dependencies of classes.
    */

   /**
    * Find variables defined in a function:
    *   var x = 10;
    *   var y;
    *   for (var z=3; z < 10; z++)
    *   -- Still need to handle:  var x,y,z;
    *
    * @private
    */
   findVars: function(objectName, obj) {
      // Find all variables explicitly defined
      var def = obj.toString();
      var vTable = [];
      var nR = "([\\$_\\w\\.]*)";
      var vR = new RegExp("(var\\s*" + nR + "\\s*)","g");
      var m;
      while ((m = vR.exec(def)) != null) {
         vTable.push(m[2]); 
      }
      return vTable;
   },

   /**
    * Find object dependencies in variables, arguments, and method usage.
    * @private
    */
   findDependencies: function(objectName, obj) {
      // Find all dependent objects
      var def = obj.toString();
      var dTable = [];
      var nR = "([\\$_\\w\\.]*)";
      var nwR = new RegExp("(new\\s+" + nR + ")","g");
      var ctR = new RegExp("(" + nR + "\\.create\\()","g");
      var fcR = new RegExp("(" + nR + ".isInstance\\()", "g");
      var inR = new RegExp("(" + nR + "\\()", "g");
      //var inR = new RegExp("(instanceof\\s+"+ nR + ")", "g");
      var m;

      // "new"-ing objects
      while ((m = nwR.exec(def)) != null) {
         if (EngineSupport.indexOf(dTable, m[2]) == -1) {
            dTable.push(m[2]);
         }
      }

      // "create"-ing objects
      while ((m = ctR.exec(def)) != null) {
         if (EngineSupport.indexOf(dTable, m[2]) == -1) {
            dTable.push(m[2]);
         }
      }

      // method dependencies
      while ((m = fcR.exec(def)) != null) {
         if (m[2].indexOf(".") != -1) {
            var k = m[2].split(".")[0];
            if (EngineSupport.indexOf(dTable, k) == -1) {
               dTable.push(k);
            }
         }
      }

      // "isInstance" method dependencies
      while ((m = fcR.exec(def)) != null) {
         if (m[2].indexOf(".") != -1) {
            var k = m[2].split(".")[0];
            if (EngineSupport.indexOf(dTable, k) == -1) {
               EngineSupport.arrayRemove(dTable, k);
            }
         }
      }

      // "instanceof" checks
      /*
      while ((m = inR.exec(def)) != null) {
         if (EngineSupport.indexOf(dTable, m[2]) == -1) {
            dTable.push(m[2]);
         }
      }
      */
      return dTable;
   },

   /**
    * Process anonymous functions, extracting the function arguments
    * @private
    */
   findAnonArgs: function(objectName, str) {
      var a = [];

      var aFnRE = new RegExp("function\\s*\\(([\\$\\w_, ]*?)\\)","g");
      while ((m = aFnRE.exec(str)) != null) {
         var args = m[1].split(",");

         for (var x in args) {
            a.push(args[x].replace(" ",""));
         }
      }

      return a;
   },
   
   /**
    * Finds all of the dependencies within an object class.
    * @private
    */
   findAllDependencies: function(objectName, obj) {
      var defs;
      var fTable = {};
      Console.warn("Process: " + objectName);

      try {
         var k = obj();
      } catch (ex) {
         // The class probably extends a non-existent class. Replace the parent
         // class with a known class and evaluate as a dummy class
         var extRE = new RegExp("(var\\s*)?([\\$_\\w\\.]*?)\\s*=\\s*([\\$_\\w\\.]*?)\\.extend\\(");
         var classDef = obj.toString();
         var nm = null;
         classDef = classDef.replace(extRE, function(str, varDef, classname, parent, offs, s) {
            nm = classname;
            return "return Base.extend(";
         });
         try {
            k = eval("(" + classDef.replace("return " + nm + ";", "") + ")();");
         } catch (inEx) {
            Console.error("Cannot parse class '" + nm + "'");
         }
      }

      var kInstance = null;
      if ($.isFunction(k)) {
         // If the class is an instance, get it's class object
         kInstance = k;
         k = k.prototype;
      }

      // Find the internal functions
      for (var f in k) {
         var def = k[f];
         if (kInstance && f == "constructor" && $.isFunction(kInstance) && k.hasOwnProperty(f)){
            // If it's an instance, we're looking at the constructor, and the
            // instance has its own constructor (not inherited)
            def = kInstance;
         }
         if ($.isFunction(def) && k.hasOwnProperty(f)) {
            def = def.toString();
            var fR = new RegExp("function\\s*\\(([\\$\\w_, ]*?)\\)\\s*\\{((.|\\s)*)","g");
            var m = fR.exec(def);
            if (m) {
               // Remove strings, then comments
               var fdef = m[2].replace(/(["|']).*?\1/g, "");
               fdef = fdef.replace(/\/\/.*\r\n/g, "");
               fdef = fdef.replace("\/\*(.|\s)*?\*\/", "");

               // Process anonymous function arguments
               var anonArgs = Linker.findAnonArgs(objectName, fdef);

               // Process each function
               fTable[f] = { vars: Linker.findVars(objectName, fdef),
                             deps: Linker.findDependencies(objectName, fdef) };
               fTable[f].deps = EngineSupport.filter(fTable[f].deps, function(e) {
                  return (e != "" && e != "this" && e != "arguments");
               });

               // Consider arguments as local variables
               var args = m[1].split(",");
               var vs = fTable[f].vars;
               for (var a in args) {
                  if (EngineSupport.indexOf(vs, args[a]) == -1) {
                     vs.push(args[a].replace(" ",""));
                  }
               }

               // Combine args with the anonymous function args
               for (var a in anonArgs) {
                  if (EngineSupport.indexOf(vs, anonArgs[a]) == -1) {
                     vs.push(anonArgs[a]);
                  }
               }
            }
         }
      }

      // This is useful for debugging dependency problems...
      Console.log("DepTable: ", objectName, fTable);

      return Linker.procDeps(objectName, fTable);
   },

   /**
    * Process dependencies and clear any that have been resolved.
    * @private
    */
   procDeps: function(objectName, fTable) {
      // Remove dependencies resolved by local variables and arguments
      var r = [];
      var allDeps = [];
      for (var f in fTable) {
         var deps = fTable[f].deps;
         var vars = fTable[f].vars;

         for (var d in deps) {
            var dp = deps[d].split(".")[0];
            if (EngineSupport.indexOf(vars, dp) != -1 && EngineSupport.indexOf(r, deps[d]) == -1) {
               r.push(deps[d]);
            }
         }

         fTable[f].deps = EngineSupport.filter(deps, function(e) {
            return (EngineSupport.indexOf(r, e) == -1);
         });

         for (var d in fTable[f].deps) {
            if (EngineSupport.indexOf(allDeps, fTable[f].deps[d]) == -1) {
               allDeps.push(fTable[f].deps[d]);
            }
         }
      }

      return allDeps;
   },

   /**
    * Perform resolution on first-level circular references.
    * @private
    */
   checkCircularRefs: function(objectName) {
      // Remove first-level dependencies           
      var deps = Linker.dependencyList[objectName].deps;
      for (var dep in deps) {
         if (Linker.dependencyList[deps[dep]] && EngineSupport.indexOf(Linker.dependencyList[deps[dep]].deps, objectName) != -1) {
            // Try removing the circular reference
            EngineSupport.arrayRemove(Linker.dependencyList[objectName].deps, deps[dep]);
         }
      }
      
   },
	
   /**
    * Check the dependency list for any unresolved dependencies.  Anything that hasn't
    * been resolved will be dumped to the console as an error.
    * @private
    */
   checkDependencyList: function() {
      // Stop processing
      window.clearTimeout(Linker.dependencyTimer);
      Linker.dependencyTimer = null;
      window.clearTimeout(Linker.dependencyProcessor);
      Linker.dependencyProcessor = null;      

      // Build the list
      var unresolved = [], unresDeps = "", dCount = 0;
      for (var obj in Linker.dependencyList) {
         dCount++;
         unresDeps += "Object '" + obj + "' has the following unresolved dependencies: ";
         unresDeps += "(" + Linker.dependencyList[obj].deps.length + ") ";
         for (var d in Linker.dependencyList[obj].deps) {
            unresDeps += Linker.dependencyList[obj].deps[d] + " ";
         }
         unresolved.push(unresDeps);
         unresDeps = "";
      }
      
      if (dCount != 0) {
         // Dump the dependency list
         Console.setDebugLevel(Console.DEBUGLEVEL_ERRORS);
         for (var ud in unresolved) {
            Console.error(unresolved[ud]);
         }
         Engine.shutdown();
      }
   },

   /**
    * Dump out any unresolved class dependencies to the console.
    * @return {Object} A list of all classes that haven't been loaded due to resolution conflicts.
    */
   dumpDependencies: function() {
      Console.debug(Linker.dependencyList);
   },

   //====================================================================================================
   //====================================================================================================
   //                                         SYNTAX PARSER
   //====================================================================================================
   //====================================================================================================
   
   /**
    * Parse a javascript file for common syntax errors which might otherwise cause a script
    * to not load.  On platforms, such as Wii and iPhone, it might not be possible to see
    * errors which cause the code to not compile.  By checking a known set of possible errors,
    * it might be possible to reduce headaches on those platforms when developing.
    * @private
    */
   parseSyntax: function(jsCode) {
      
      // Clean the source first so we only have code
      //jsCode = EngineSupport.cleanSource(jsCode, true);
      
      // Check for the following:
      // * Variable comparison in assignment statement
      // * Extra comma after last item in Object definition
      // * Missing comma between items in Object definition
      // * Missing colon between name and definition
      // * Equal sign where colon expected
      // * Try without catch and finally
      
      //Console.error("Syntax errors:\n", errors);
      
      return true;   
   }
   
});
