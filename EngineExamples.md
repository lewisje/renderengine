# Engine Examples #

The Render Engine is a [fully featured](EngineFeatureList.md) engine which can be used to write both games and to write applications.  Below are examples of the engine in use.  All of the following examples were written using The Render Engine and, as you can tell, are the old "eat your own dog food" type of examples.

## Asteroids Clone ##

This example is a clone of Asteroids by Atari.  There are two modes in which the game runs.  The first is a clone of the original, mostly complete, with sounds and vector rendering.  It's not meant to be a complete game, but more how to make the engine work.

  * [Asteroids Evolution](http://renderengine.googlecode.com/svn/tags/v1.5.3/demos/vector/index.html?metrics=true&profile=true)

## Box2D Physics Integration ##

We've added support for the Box2D physics engine.  This example demonstrates the physics components, sprite rendering, and even has Wii remote support.

  * [Physics Demo](http://renderengine.googlecode.com/svn/tags/v1.5.3/demos/physics/index.html?metrics=true&profile=true)

The physics include complex objects comprised of rigid bodies and joints as well.

  * [Ragdoll Demo](http://renderengine.googlecode.com/svn/tags/v1.5.3/demos/physics2/index.html?metrics=true&profile=true)

## Text Rendering Capabilities ##

The following is a quick test I put together to test text rendering with the three supported renderers.  If your browser doesn't support natively rendering fonts to the canvas, you'll only see the first two (Vector and Bitmap).  In most cases, the bitmap fonts are a decent alternative to rendering text to the canvas.

  * [Vector, bitmap, and native font rendering](http://renderengine.googlecode.com/svn/tags/v1.5.3/test/textrender/index.html?metrics=true)
