# User Interface Development #

The next version of _The Render Engine_ (v2.0) will have a new mechanism for creating user interfaces.  This new mechanism aims to simplify the creation of a UI with common, styleable controls and loading from either an XML or JSON file.  The spec is in early development right now, and may change, so be wary of this if using the UI object.

## User Interface Objects ##

The new UIObject is the foundation of all user interfaces.  A UIObject is a container of multiple elements which consist of:

  * Images (UIImageElement)
  * Buttons (UIButtonElement)
  * Text inputs (UITextInputElement)
  * Text boxes (UITextBoxElement)
  * Checkboxes or Radioboxes (UICheckboxElement)
  * Sliders (UISliderElement)
  * ...more to come

The UIObject can be displayed or hidden, wholesale, allowing the UI to be loaded and added to the render context without an impact to framerate if it's hidden.  Elements within the UI can be positioned relative to each other to simplify layout and design of a user interface.  Additionally, interfaces can be serialized to a file and reloaded so that a UI can be recreated without needing to implement a lot of code.

## User Interface Elements ##

As you can see above, there are a number of elements which can be used to build a user interface.  Each element can have multiple interactions, and possibly multiple rendered parts.  An element is positionable, and can be relative to another element within the same UI.

### UIImageElement ###

An image element can either be a static image or a sprite to allow animations.  An image can be clicked or, if enabled, touched to call a method.

### UIButtonElement ###

A button element has three states: up, down, and disabled.  When the button is enabled, it can be clicked or, if enabled, touched to call a method.  A button can be styled with either three static images, or sprites.  A button also uses a text renderer, if desired, to execute the text on the button.

### UITextInputElement ###

Text inputs are styleable boxes which respond to keyboard events.  The background of a text input can be provided either by a static image, or a sprite.

### UITextBoxElement ###

A text box element is used to display a string of text, drawn with one of the text renderers.

### UICheckboxElement ###

A checkbox element can either function independently, or as a group with other checkboxes like a radiobox element.  The images of a check box can be provided either by two static images, or sprites.

### UISliderElement ###

A slider element is a numeric range element which is displayed either horizontally or vertically.  It is comprised of either two images, or sprites, one for the background and one for the thumb.  The slider can be controlled by either the mouse or, if enabled, by touch.

## Serialization of a User Interface Object ##

A UIObject can be created from a JSON object to reduce the need to write a lot of code.  The serialization and subsequent deserialization of a UIObject will produce the same result.  A serialized UIObject can be stored as a resource and loaded with the JSONLoader object.  An example of a simple UIObject is:

```
   /* UIObject */ {
      name: "mainmenu",
      visible: false,
      width: 320,
      height: 480,
      elements: [
         { UIImageElement: {
            name: "title",
            image: {
               file: "resources/title_image.png",
               width: 280,
               height: 95
            },
            layout: [ ALIGN_CENTER, VALIGN_BOTTOM ],
            position: ["50%", 115] 
         }},
         { UIImageElement: {
            name: "copyright",
            sprite: {
               sheet: "resources/title_sprites.png",
               name: "copyright",
               speed: 150
            },
            layout: [ ALIGN_CENTER, VALIGN_BOTTOM ],
            relativeTo: "title",
            position: ["50%", 20]
         }}
      ]
   };
```