/**
 * The Render Engine
 * WiimoteInputComponent
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

Engine.initObject("WiimoteInputComponent", "InputComponent", function() {

/**
 * @class A component which responds to the Wiimote (in the Opera browser)
 * is notifies its host object by calling a number of methods.  The host object
 * should implement any of the following methods to receive the corresponding events.
 * <br/>
 * The next few events are fired on the host object, if they exist, when
 * the corresponding button is pressed and released.  All methods take two
 * arguments: the controller number and a boolean indicating <tt>true</tt>
 * if the button has been pressed and <tt>false</tt> when released.
 * <br/>
 * <ul>
 * <li>onWiimoteLeft - Direction pad left</li>
 * <li>onWiimoteLeft - Direction pad right</li>
 * <li>onWiimoteUp - Direction pad up</li>
 * <li>onWiimoteDown - Direction pad down</li>
 * <li>onWiimotePlus - Plus button pressed/released</li>
 * <li>onWiimoteMinus - Minus button pressed/released</li>
 * <li>onWiimoteButton1 - Button 1 pressed/released</li>
 * <li>onWiimoteButton2 - Button 2 pressed/released</li>
 * <li>onWiimoteButtonA - Button A pressed/released</li>
 * <li>onWiimoteButtonB - Button B pressed/released</li>
 * <li>onWiimoteButtonC - Button C pressed/released</li>
 * <li>onWiimoteButtonZ - Button Z pressed/released</li>
 * </ul>
 * <br/><br/>
 * The following events are status events and take different
 * arguments:
 * <ul>
 * <li>onWiimoteEnabled - Enabled/disabled status (controller, state)</li>
 * <li>onWiimoteValidity - Validity of data transfer (controller, validity)</li>
 * <li>onWiimoteDistance - Distance from screen in meters (controller, dist)</li>
 * <li>onWiimotePosition - X/Y position (controller, x, y)</li>
 * <li>onWiimoteRoll - X-axis roll in radians (controller, roll)</li>
 * </ul>
 *
 * @extends InputComponent
 */
var WiimoteInputComponent = InputComponent.extend(/** @scope WiimoteInputComponent.prototype */{

   enabledRemotes: null,

   remoteValid: null,

   /**
    * Create an instance of a Wiimote input component.
    *
    * @param name {String} The unique name of the component.
    * @param priority {Number} The priority of the component among other input components.
    * @constructor
    */
   constructor: function(name, priority) {
      this.base(name, priority);
      this.enabledRemotes = [false, false, false, false];
      this.remoteValid = [0, 0, 0, 0];
   },

   release: function() {
      this.base();
      this.enabledRemotes = null;
      this.remoteValid = null;
   },

   /**
    * Set the host object this component exists within.  Additionally, this
    * component sets up the event listeners.  Due to key events occurring
    * less often than mouse events, every component listening for them will
    * attach a listener.
    *
    * @param hostObject {HostObject} The object which hosts this component
    */
   setHostObject: function(hostObject) {
      this.base(hostObject);

      this.downFn = function(eventObj) {
         eventObj.data.owner._keyDownListener(eventObj);
         return false;
      };

      this.upFn = function(eventObj) {
         eventObj.data.owner._keyUpListener(eventObj);
         return false;
      };

      this.pressFn = function(eventObj) {
         eventObj.data.owner._keyPressListener(eventObj);
         return false;
      };

      var context = this.getHostObject().getRenderContext();
      EventEngine.setHandler(context, {owner: this}, "keydown", this.downFn);
      EventEngine.setHandler(context, {owner: this}, "keyup", this.upFn);
   },

   /**
    * Destroy this instance and remove all references.
    */
   destroy: function() {
      var context = this.getHostObject().getRenderContext();
      EventEngine.clearHandler(context, "keydown", this.downFn);
      EventEngine.clearHandler(context, "keyup", this.upFn);

      this.notifyLists = null;
      this.downFn = null;
      this.upFn = null;
      this.pressFn = null;

      this.base();
   },

   /**
    * @private
    */
   _keyDownListener: function(eventObj) {
      // This is for handling the Primary Wiimote
      switch (event.keyCode) {
         case WiimoteInputComponent.KEYCODE_LEFT:
            this._wmLeft(0, true);
            break;
         case WiimoteInputComponent.KEYCODE_RIGHT:
            this._wmRight(0, true);
            break;
         case WiimoteInputComponent.KEYCODE_UP:
            this._wmUp(0, true);
            break;
         case WiimoteInputComponent.KEYCODE_DOWN:
            this._wmDown(0, true);
            break;
         case WiimoteInputComponent.KEYCODE_PLUS:
            this._wmPlus(0, true);
            break;
         case WiimoteInputComponent.KEYCODE_MINUS:
            this._wmMinus(0, true);
            break;
         case WiimoteInputComponent.KEYCODE_1:
            this._wmButton1(0, true);
            break;
         case WiimoteInputComponent.KEYCODE_2:
            this._wmButton2(0, true);
            break;
         case WiimoteInputComponent.KEYCODE_A:
            this._wmButtonA(0, true);
            break;
         case WiimoteInputComponent.KEYCODE_B:
            this._wmButtonB(0, true);
            break;
         case WiimoteInputComponent.KEYCODE_C:
            this._wmButtonC(0, true);
            break;
         case WiimoteInputComponent.KEYCODE_Z:
            this._wmButtonZ(0, true);
            break;
      }
   },

   /**
    * @private
    */
   _keyUpListener: function(eventObj) {
      // This is for handling the Primary Wiimote
      switch (event.keyCode) {
         case WiimoteInputComponent.KEYCODE_LEFT:
            this._wmLeft(0, false);
            break;
         case WiimoteInputComponent.KEYCODE_RIGHT:
            this._wmRight(0, false);
            break;
         case WiimoteInputComponent.KEYCODE_UP:
            this._wmUp(0, false);
            break;
         case WiimoteInputComponent.KEYCODE_DOWN:
            this._wmDown(0, false);
            break;
         case WiimoteInputComponent.KEYCODE_PLUS:
            this._wmPlus(0, false);
            break;
         case WiimoteInputComponent.KEYCODE_MINUS:
            this._wmMinus(0, false);
            break;
         case WiimoteInputComponent.KEYCODE_1:
            this._wmButton1(0, false);
            break;
         case WiimoteInputComponent.KEYCODE_2:
            this._wmButton2(0, false);
            break;
         case WiimoteInputComponent.KEYCODE_A:
            this._wmButtonA(0, false);
            break;
         case WiimoteInputComponent.KEYCODE_B:
            this._wmButtonB(0, false);
            break;
         case WiimoteInputComponent.KEYCODE_C:
            this._wmButtonC(0, false);
            break;
         case WiimoteInputComponent.KEYCODE_Z:
            this._wmButtonZ(0, false);
            break;
      }
   },

   /**
    * This will do the polling of the Wiimote and fire events when
    * statuses change.
    *
    * @private
    */
   execute: function(renderContext, time) {
      if (!(window.opera && opera.wiiremote)) {
         // If this isn't Opera for Wii, don't do anything
         return;
      }

      // Run through the available Wiimotes
      for (var w = 0; w < 4; w++) {
         var remote = opera.wiiremote.update(w);
         // Cannot perform this check on the primary remote,
         // that's why this object extends the keyboard input component...
         if (remote.isEnabled) {

            if (!this.enabledRemotes[w]) {
               // Let the host know that a Wiimote became enabled
               this._wmEnabled(w, true);
            }

            if (!remote.isBrowsing) {
               var chk;

               // Simple bitmask check to handle states and fire methods
               this._wmLeft(w, remote.hold & 1);
               this._wmRight(w, remote.hold & 2);
               this._wmDown(w, remote.hold & 4);
               this._wmUp(w, remote.hold & 8);
               this._wmPlus(w, remote.hold & 16);
               this._wmButton2(w, remote.hold & 256);
               this._wmButton1(w, remote.hold & 512);
               this._wmButtonB(w, remote.hold & 1024);
               this._wmButtonA(w, remote.hold & 2048);
               this._wmMinus(w, remote.hold & 4096);
               this._wmButtonZ(w, remote.hold & 8192);
               this._wmButtonC(w, remote.hold & 16384);
            }

            // Set distance and validity
            this._wmDistance(w, remote.dpdDistance);
            this._wmValidity(w, remote.dpdValidity);

            // Get position and roll
            this._wmPosition(w, remote.dpdScreenX, remote.dpdScreenY);
            this._wmRoll(w, Math.atan2(remote.dpdRollY, remote.dpdRollX));
         } else {
            if (this.enabledRemotes[w]) {
               // Let the host know that a Wiimote became disabled
               this._wmEnabled(w, false);
            }
         }
      }
   },

   /**
    * @private
    */
   _wmLeft: function(controllerNum, pressed) {
      if (this.getHostObject().onWiimoteLeft)
      {
         this.getHostObject().onWiimoteLeft(controllerNum, pressed);
      }
   },

   /**
    * @private
    */
   _wmRight: function(controllerNum, pressed) {
      if (this.getHostObject().onWiimoteRight)
      {
         this.getHostObject().onWiimoteRight(controllerNum, pressed);
      }
   },

   /**
    * @private
    */
   _wmUp: function(controllerNum, pressed) {
      if (this.getHostObject().onWiimoteUp)
      {
         this.getHostObject().onWiimoteUp(controllerNum, pressed);
      }
   },

   /**
    * @private
    */
   _wmDown: function(controllerNum, pressed) {
      if (this.getHostObject().onWiimoteDown)
      {
         this.getHostObject().onWiimoteDown(controllerNum, pressed);
      }
   },

   /**
    * @private
    */
   _wmPlus: function(controllerNum, pressed) {
      if (this.getHostObject().onWiimotePlus)
      {
         this.getHostObject().onWiimotePlus(controllerNum, pressed);
      }
   },

   /**
    * @private
    */
   _wmMinus: function(controllerNum, pressed) {
      if (this.getHostObject().onWiimoteMinus)
      {
         this.getHostObject().onWiimoteMinus(controllerNum, pressed);
      }
   },

   /**
    * @private
    */
   _wmButton1: function(controllerNum, pressed) {
      if (this.getHostObject().onWiimoteButton1)
      {
         this.getHostObject().onWiimoteButton1(controllerNum, pressed);
      }
   },

   /**
    * @private
    */
   _wmButton2: function(controllerNum, pressed) {
      if (this.getHostObject().onWiimoteButton2)
      {
         this.getHostObject().onWiimoteButton2(controllerNum, pressed);
      }
   },

   /**
    * @private
    */
   _wmButtonA: function(controllerNum, pressed) {
      if (this.getHostObject().onWiimoteButtonA)
      {
         this.getHostObject().onWiimoteButtonA(controllerNum, pressed);
      }
   },

   /**
    * @private
    */
   _wmButtonB: function(controllerNum, pressed) {
      if (this.getHostObject().onWiimoteButtonB)
      {
         this.getHostObject().onWiimoteButtonB(controllerNum, pressed);
      }
   },

   /**
    * @private
    */
   _wmButtonC: function(controllerNum, pressed) {
      if (this.getHostObject().onWiimoteButtonC)
      {
         this.getHostObject().onWiimoteButtonC(controllerNum, pressed);
      }
   },

   /**
    * @private
    */
   _wmButtonZ: function(controllerNum, pressed) {
      if (this.getHostObject().onWiimoteButtonZ)
      {
         this.getHostObject().onWiimoteButtonZ(controllerNum, pressed);
      }
   },

   /**
    * @private
    */
   _wmEnabled: function(controllerNum, state) {
      // Store the Wiimote enabled state
      this.enabledRemotes[w] = state;
      if (this.getHostObject().onWiimoteEnabled)
      {
         this.getHostObject().onWiimoteEnabled(controllerNum, state);
      }
   },

   /**
    * @private
    */
   _wmDistance: function(c, d) {
      if (this.getHostObject().onWiimoteDistance)
      {
         this.getHostObject().onWiimoteDistance(c, d);
      }
   },

   /**
    * @private
    */
   _wmValidity: function(c, v) {
      if (this.remoteValid[c] != v) {
         this.removeValid[c] = v;
         if (this.getHostObject().onWiimoteValidity)
         {
            this.getHostObject().onWiimoteValidity(c, v);
         }
      }
   },

   /**
    * @private
    */
   _wmPosition: function(c, x, y) {
      if (this.getHostObject().onWiimotePosition)
      {
         this.getHostObject().onWiimotePosition(c, x, y);
      }
   },

   /**
    * @private
    */
   _wmRoll: function(c, r) {
      if (this.getHostObject().onWiimoteRoll)
      {
         this.getHostObject().onWiimoteRoll(c, r);
      }
   }
}, {

   /**
    * Get the class name of this object
    *
    * @type String
    * @memberOf KeyboardInputComponent
    */
   getClassName: function() {
      return "WiimoteInputComponent";
   },

   /**
    * For second argument to <tt>onWiimoteValidity()</tt>: the data is good
    */
   DATA_GOOD: 2,

   /**
    * For second argument to <tt>onWiimoteValidity()</tt>: the data is poor
    */
   DATA_POOR: 1,

   /**
    * For second argument to <tt>onWiimoteValidity()</tt>: the Wiimote isn't pointing at the screen
    */
   DATA_INVALID: 0,

   /**
    * For second argument to <tt>onWiimoteValidity()</tt>: the data is very poor (unreliable)
    */
   DATA_VERY_POOR: -1,

   /**
    * For second argument to <tt>onWiimoteValidity()</tt>: the data is extremely poor (garbage)
    */
   DATA_EXTREMELY_POOR: -2,

   KEYCODE_A: 13,

   KEYCODE_B: 32,

   KEYCODE_C: 67,

   KEYCODE_Z: 90,

   KEYCODE_1: 49,

   KEYCODE_2: 50,

   KEYCODE_MINUS: 109,

   KEYCODE_PLUS: 61,

   KEYCODE_LEFT: 37,

   KEYCODE_RIGHT: 39,

   KEYCODE_UP: 38,

   KEYCODE_DOWN: 40
});

return WiimoteInputComponent;

});