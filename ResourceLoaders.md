# Resource Loaders #

A resource loader is an abstraction of an interface allowing the loading, and caching, of objects of all types by identifiable name.  Resources can be as simple as a text file, to as complex as a Sprite or Level definition encompassing multiple resources.  Each resource loader must implement the `load()` method and the `get()` method at the very least.

Caching is performed to speed up processing, and reduce memory overhead when loading the same resource over and over.  Eventually resource loaders will be able to be pooled so that once resource loader can handle loading resources of many types and properly caching and retrieving them.

## Ready State of Resources ##

When you load a resource, you'll need to wait until it is ready before you use it.  A lot of times, you'll want to wait until resources are loaded before starting your game.  Using a timer in the engine, you can write a simple method which will poll the resource loaders for readiness.  Here's an example:

```
      // Don't start until all of the resources are loaded
      WiiTest.loadTimeout = Timeout.create("wait", 250, WiiTest.waitForResources);
   },
      
   /**
    * Wait for resources to become available before starting the game
    * @private
    */
   waitForResources: function(){
      if (WiiTest.spriteLoader.isReady()) {
            WiiTest.loadTimeout.destroy();
            WiiTest.run();
            return;
      }
      else {
         // Continue waiting
         WiiTest.loadTimeout.restart();
      }
   },
```

You can either query a loader for a single resource by specifying the name in the `isReady()` method call.  Or you can simple ask if all resources which were loading are now loaded by calling `isReady()` with no arguments.

## XML Loader ##

The [XML resource loader](http://renderengine.googlecode.com/svn/api/XMLLoader.html) simply loads an XML document and makes it available.  Once the resource is loaded, the DOM will be returned as the object from the resource loader.

## JSON Object Loader ##

Loads JSON (JavaScript Object Notation) files from the server.  The [ObjectLoader](http://renderengine.googlecode.com/svn/api/ObjectLoader.html) will load a JSON object and when you request the object from the loader, you will be passed a JavaScript object.

## Sound Loader ##

The [SoundLoader](http://renderengine.googlecode.com/svn/api/SoundLoader.html) is paired with the [Sound](http://renderengine.googlecode.com/svn/api/Sound.html) object to abstract whatever sound engine _The Render Engine_ is using.  Currently, the engine is using SoundManager2 which is a Flash to Javascript bridge (the only thing _not_ 100% Javascript in the engine).

Sound files are loaded and associated with a name for later retrieval.  When you request a sound from the loader, you are given a `Sound` object which has methods for playing, pausing, volume adjustment and more.  Loading a sound is simple:

```
   this.soundLoader.load("explode", this.getFilePath("resources/explode1.mp3"));
```

And so is working with a sound:

```
   this.soundLoader.get("explode").setVolume(75);
   this.soundLoader.get("explode").play();
```

## Image Loader ##

The [ImageLoader](http://renderengine.googlecode.com/svn/api/ImageLoader.html) is the foundation for a few other resource loaders, such as the `BitmapFontLoader` and the `SpriteLoader`.  Loading and retrieving an image is fairly straightforward, like the following from [Tutorial 4](http://www.renderengine.com/tutorials/tutorial4a_1.php):

```
   Tutorial4.imageLoader = ImageLoader.create();
   Tutorial4.imageLoader.load("keys", this.getFilePath("resources/fingerboard.png"), 220, 171);
```

And using it to seed a component with an image:

```
   this.add(ImageComponent.create("draw", Tutorial4.imageLoader, "keys"));
```

The [ImageComponent](http://renderengine.googlecode.com/svn/api/ImageComponent.html) takes the `ImageLoader` and the image name as arguments, but you could also access the image simply by calling the `get()` method of the resource loader.

## Sprite Loader ##

The SpriteLoader is a way to load sprites based on a definition file which describes the sprite (or sprites) located in a single bitmap.  The descriptor says what the base image file is, the overall height and width of the image, and then an object which describes each sprite (either a single static frame, or an animation).  If you look at the documentation for the [SpriteLoader](http://renderengine.googlecode.com/svn/api/SpriteLoader.html) class, you can see an example of the descriptor.  The bitmap is either a single sprite, or more commonly, it is a sprite "sheet" with multiple sprites on it.  For example, [this is](http://renderengine.googlecode.com/svn/trunk/demos/wii_test/resources/redball.png) the sprite for the ["Bounce The Ball"](http://renderengine.googlecode.com/svn/trunk/demos/wii_test/index.html?metrics=true&context=1) example, and the following is the descriptor for it:

```
{
   // Frame (f): left, top, frameWidth, frameHeight
   // Animation (a): left, top, frameWidth, frameHeight, frameCount, speedMS, loop/toggle
   bitmapImage: "redball.png",
   bitmapWidth: 120,
   bitmapHeight: 60,
   sprites: {
      "red": {
         "f" : [0, 0, 60, 60]
      },
      "blue": {
         "f" : [60, 0, 60, 60]
      }
   }
}
```

You would load the sprite "sheet" using code like the following from the previously mentioned example:

```
   // Load the sprites
   this.spriteLoader.load("redball", this.getFilePath("resources/redball.js"));
```

Once you have loaded a sprite descriptor, you'll be able to access those sprites by requesting them from the SpriteLoader by the name of the sprite "sheet", in this case it's _"redball"_.  You request sprites by name from that sprite "sheet", like so:

```
   // The sprites
   this.sprites = [];
   this.sprites.push(WiiTest.spriteLoader.getSprite("redball", "red"));
   this.sprites.push(WiiTest.spriteLoader.getSprite("redball", "blue"));
   this.setSprite(0);
```

You'll get a [Sprite](http://renderengine.googlecode.com/svn/api/Sprite.html) object back which is not only used by the [SpriteComponent](http://renderengine.googlecode.com/svn/api/SpriteComponent.html), but allows you to manipulate the sprite itself.

## Bitmap Font Loader ##

Currently, the [BitmapFontLoader](http://renderengine.googlecode.com/svn/api/BitmapFontLoader.html) is only used by the [BitmapText](http://renderengine.googlecode.com/svn/api/BitmapText.html) text renderer, but that doesn't mean it can't be used elsewhere.  A simple example of loading a bitmap font, and then using it can be seen below (from the [text render demo](http://renderengine.googlecode.com/svn/trunk/test/textrender/index.html?metrics=true)):

```
   FontTest.fontLoader = BitmapFontLoader.create();
   FontTest.fontLoader.load("lucida", "lucida_sans_36.js");
```

The font descriptor file is loaded, which contains the definition of the font (image, size, glyph positions) and is associated with a name.  That name is later used to retrieve the font for rendering:

```
   var bitmap2 = TextRenderer.create(BitmapText.create(FontTest.fontLoader.get("lucida")), "ABCxyz123!@#$%^&*()", 1);
   bitmap2.setPosition(Point2D.create(10, 143));
   bitmap2.setTextWeight(1);
   bitmap2.setColor("#ff0000");
   this.renderContext.add(bitmap2);
```