/*
   Base, version 1.0.2
   Copyright 2006, Dean Edwards
   License: http://creativecommons.org/licenses/LGPL/2.1/
*/

var Base = function() {
   if (arguments.length) {
      if (this == window) { // cast an object to this class
         Base.prototype.extend.call(arguments[0], arguments.callee.prototype);
      } else {
         this.extend(arguments[0]);
      }
   }
};

Base.version = "1.0.2";

Base.prototype = {
   extend: function(source, value) {
      var extend = Base.prototype.extend;
      if (arguments.length == 2) {
         var ancestor = this[source];
         var ancestorClass = this.constructor ? this.constructor.prototype : null;
         // overriding?
         if ((ancestor instanceof Function) && (value instanceof Function) &&
            ancestor.valueOf() != value.valueOf() && /\bbase\b/.test(value)) {
            var method = value;
         // var _prototype = this.constructor.prototype;
         // var fromPrototype = !Base._prototyping && _prototype[source] == ancestor;
            value = function() {
               var previous = this.base;
               var previousClass = this;
            // this.base = fromPrototype ? _prototype[source] : ancestor;
               this.base = ancestor;
               this.baseClass = ancestorClass;
               var returnValue = method.apply(this, arguments);
               this.base = previous;
               this.baseClass = previousClass;
               return returnValue;
            };
            // point to the underlying method
            value.valueOf = function() {
               return method;
            };
            value.toString = function() {
               return String(method);
            };
         }
         return this[source] = value;
      } else if (source) {
         var _prototype = {toSource: null};
         // do the "toString" and other methods manually
         var _protected = ["toString", "valueOf"];
         // if we are prototyping then include the constructor
         if (Base._prototyping) _protected[2] = "constructor";
         for (var i = 0; (name = _protected[i]); i++) {
            if (source[name] != _prototype[name]) {
               extend.call(this, name, source[name]);
            }
         }
         // copy each of the source object's properties to this object
         for (var name in source) {
            if (!_prototype[name]) {
               extend.call(this, name, source[name]);
            }
         }
      }
      return this;
   },

   base: function() {
      // call this method from any other method to invoke that method's ancestor
   }
};

Base.extend = function(_instance, _static) {
   var extend = Base.prototype.extend;
   if (!_instance) _instance = {};
   // build the prototype
   Base._prototyping = true;
   var _prototype = new this;
   extend.call(_prototype, _instance);
   var constructor = _prototype.constructor;
   _prototype.constructor = this;
   delete Base._prototyping;
   // create the wrapper for the constructor function
   var klass = function() {
      if (!Base._prototyping) constructor.apply(this, arguments);
      this.constructor = klass;
   };
   klass.prototype = _prototype;
   // build the class interface
   klass.extend = this.extend;
   klass.implement = this.implement;
   klass.create = this.create;
   klass.getClassName = this.getClassName;
   klass.toString = function() {
      return String(constructor);
   };
	
	klass.isInstance = function(obj) {
		/*
		return (typeof obj != "undefined" && obj !== null && 
				  obj.constructor && obj.constructor.__ancestors &&
				  obj.constructor.__ancestors[klass.getClassName()]);
		*/
		return obj instanceof klass;
	};
   extend.call(klass, _static);
   // single instance
   var object = constructor ? klass : _prototype;
   // class initialisation
   if (object.init instanceof Function) object.init();

	if (!klass.__ancestors) {
		klass.__ancestors = {};
		klass.__ancestors[klass.getClassName()] = true;
		var chain = function(k) {
			if (k.prototype && k.prototype.constructor && k.prototype.constructor.getClassName) {
				klass.__ancestors[k.prototype.constructor.getClassName()] = true;
				chain(k.prototype.constructor);
			}
		};
		chain(klass);
	}

   if (klass.getClassName) {
      // remember the class name
      object.className = klass.getClassName();
   }

   return object;
};

Base.implement = function(_interface) {
   if (_interface instanceof Function) _interface = _interface.prototype;
   this.prototype.extend(_interface);
};

Base.create = function() {
};

Base.getClassName = function() {
   return "Base";
};

Base.isInstance = function() {
};
