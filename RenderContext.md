# Render Contexts... What Are They? #

A render context is where the engine displays the game world.  By default, The Render Engine has one context which it "creates" for you.  In fact, it doesn't really create it -- it [wraps the browser's document in a render context](http://renderengine.googlecode.com/svn/api/DocumentContext.html).  Each processing cycle, the engine will start at it's default rendering context and render it.

From there, a chain reaction occurs whereby objects that are containers (rendering contexts included) will render their objects, this process continues until all objects have been updated.  At the end of this cycle, one frame is displayed on-screen and the cycle begins again.

A rendering context has a ["surface"](http://renderengine.googlecode.com/svn/api/RenderContext.html#getSurface) to which the contents are drawn.  This surface is typically a reference to a DOM element.  It isn't a requirement, but since browsers don't currently know how to render to anything else... 'nuff said?  =)

## Base Rendering Contexts ##

### HTMLElementContext ###

The [HTMLElementContext](http://renderengine.googlecode.com/svn/api/HTMLElementContext.html) is an object that can wrap any HTML element as a context.  The [DocumentContext](http://renderengine.googlecode.com/svn/api/DocumentContext.html) is an extension of this class.  You might think that the [CanvasContext](http://renderengine.googlecode.com/svn/api/CanvasContext.html) should be, as well, but it extends the base [RenderContext2D](http://renderengine.googlecode.com/svn/api/RenderContext2D.html) since that context is aimed at 2D rendering with vectors and paths.

While the [HTMLElementContext](http://renderengine.googlecode.com/svn/api/HTMLElementContext.html) is quite suitable for creating a sprite based game, I wouldn't suggest making a game which can switch contexts like the examples do.  The reason being that since all features aren't fully supported in the DOM, your game might not work 100% in all contexts.  It can be done, but you'll want to design to one particular context since that will make your work easier.

### RenderContext2D ###

This context is the base class for the [CanvasContext](http://renderengine.googlecode.com/svn/api/CanvasContext.html), and the future SVGContext, which are well suited for displaying imagery drawn with more traditional techniques: rectangles, arcs, lines, curves, sprites, etc.

## Transformation Stacks ##

Some contexts implement a transformation stack which stores the state of position, rotation, and scale (among other things) in a stack structure. States can be pushed onto the stack (effectively combining them) and popped when no longer needed.  With no transformations on the stack the engine would be rendering in world space.  As transformations are pushed onto the stack, we move into object space.  An unbalanced stack can lead to strange rendering artifacts.  As such, the engine enforces the balance and will inform you if it becomes unbalanced.