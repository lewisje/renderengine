# Coding Styles Used in the Engine #

When writing code to work with The Render Engine, it's important to follow some coding guidelines.  Developers all have their own way of writing Javascript, which makes it difficult to impose a certain style.  However, ignoring some basic styles will cause the DependencyProcessor to fail.

All classes must be declared using Base style.  No Prototype, no moo-tools, no Script.aculo.us... I know there are some libraries out there that people have adjusted to.  They understand how they work and they accept them as being _the way to code in Javascript._  The problem is that there isn't just _one way_ to code in Javascript.  This engine has adopted Base by Dean Edwards as its model.  I suggest you [read up on it](http://dean.edwards.name/weblog/2006/03/base/).  Here's the basic class pattern in the engine:

```
   /**
    * @class Document the class, be sure to include as much information
    *        as you can about it.  This will keep the API clean and make the
    *        documentation effective.  You can never be too verbose with your
    *        documentation.  If your class extends from a class other than
    *        Base, which it most likely will, be sure to let the documentation
    *        system know that.
    *
    * @extends SuperClass
    * @param arg1 {Type} Description of argument 1
    * @param [arg2=default] {Type} Description of argument 2
    * @constructor
    * @description This is the constructor description for a <tt>NewClass</tt> instance
    */
   var NewClass = SuperClass.extend(/** @scope NewClass.prototype */{

      //==================================================================
      // INSTANCE FIELDS

      /** 
       * Document any public fields that are on the prototype.
       * Be sure to also document the type.
       * @type {String}
       */
      fieldA: null,

      // Unless they are private fields
      fieldB: null,

      // In most cases, you'll probably want all of your fields to be
      // private and to provider getters and setters.
      fieldC: 0,

      //==================================================================
      // INSTANCE METHODS

      /**
       * Document the constructor as shown above. Remember to include
       * the parameters up there as well. Then mark the actual constructor 
       * method as private.
       * @private
       */
      constructor: function(arg1, arg2) {
         // Call the super-class
         this.base(arg1, arg2);

         // Be sure to initialize instance fields in the constructor
         this.fieldA = "foo";
         this.fieldB = "bar";

         // The constructor for the class
         // ...
      },

      /**
       * Methods intended to be private to the class should be
       * marked as such so that they aren't documented as usable in
       * the API.
       * @param x {Type} Still document arguments, even for private methods
       * @private
       */
      internalMethod: function(x) {
         // Be sure to use inline comments where possible.
         // It's important to describe what is going on, especially
         // when it cannot be inferred from the code.

         // Variables should be scoped to the function with the "var" keyword
         var localVar = 0;
      },

      /**
       * Public methods should be well documented.  There should be
       * a short sentence which describes the method, followed by
       * a paragraph of information (if warranted) to make it absolutely
       * clear what the method does.
       *
       * @param y {Type} Always document arguments
       * @param [z=default] {Type} Especially optional arguments and their
       *                    default values.
       * @return {PooledObject} Be sure to document any return value
       */
      extMethod: function(y, z) {

         // Instead of using the "new" keyword to construct
         // objects, use the ".create()" method of pooled objects.
         var myObj = PooledObject.create(y, this.field1, z);

         return myObj;
      },

      /**
       * Setter methods should match the field name preceded by the
       * "set" identifier.  Remember to document the arguments!
       * @param val {Number} The value for field C
       */
      setFieldC: function(val) {
         this.fieldC = val;
      },

      /**
       * The getter should also match the field name, preceded with the "get"
       * identifier.  For boolean fields, consider using "is" instead of
       * "get".  Be sure to indicate the return type!
       * @return {Number}
       */
      getFieldC: function() {
         return this.fieldC;
      }

   }, /** @scope NewClass.prototype */{

      //==================================================================
      // CLASS FIELDS AND METHODS

      /** 
       * Static members of a class should be well documented. 
       * @type {Number}
       */
      STATUS_OK: 1,

      /** 
       * These will show up as fields of the class. 
       * @type {Number}
       */
      STATUS_FAIL: -1,

      /** 
       * The uppercase name is standard for a constant. 
       * @type {Number}
       */
      STATUS_INIT: 0,

      /**
       * Remember to include the method to get your class's name.
       * @return {String} "NewClass"
       */
      getClassName: function() {
         return "NewClass";
      }

   });
```