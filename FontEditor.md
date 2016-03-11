# The "Font Editor" Tool #

The font editor isn't as much a font editor as it is a tool to assist you in creating your own font definition files for The Render Engine's bitmap font renderer.  It's main purpose is to help you determine where divisions between characters occur and generate a font definition file.  A bitmap font is made up of two parts: the definition file, and the image file.

The image file should be a PNG image of the font, in white on a transparent background, at a size of 36pt.  Fonts should not be in italics since character overlap is more likely.  Fonts which parse better are ones with very little overlap and well defined character boundaries.  Since the rendering of a bitmap font is more of a hack to get text onto the canvas, it should be understood that support for very elegant fonts isn't going to be superb.

## Loading and Parsing a Font ##

A font will need to contain the following characters (in this order exactly):
```
!"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz
```

The font image should be placed into the "fonts" folder of The Render Engine.  You can then run the font editor and simply select the font image to load.  Once the font is loaded, a quick analysis is performed to determine the average density of the pixels in each row of the image.  This value is placed in the "Min Alpha" field.  This is just a guideline that might work for the font, but a higher or lower number (from zero to 255) might be necessary.

The "Min Alpha" is the amount of alpha density that can be located in a single row to determine if the row might be a character boundary.  Higher values mean that a row will be more dense, and lower values are obviously less dense.  Thin characters (such as those in courier or times roman) will require a much lower "Min Alpha", whereas thicker characters (such as those in century gothic) will need a higher value.  You will eventually get a feel for a number to start with.

Pressing the "Analyze" button will scan the image and, using the "Min Alpha" value, will attempt to find boundaries between characters.  It is important that you provide the height and width of the bitmap so that the image is not only loaded properly, but also fully scannable.  Once the analysis is complete, the boundaries which were located will be drawn as yellow lines.  Two special boundaries (which you should avoid changing) are the leftmost and rightmost boundary of the whole bitmap (in orange).

You can adjust these dividers by either clicking on an existing one (to remove it) or clicking in an empty space to create a new one (in blue).  It takes some getting used to, but eventually you should be able to utilize the boundary tool.  Once all of the 91 required dividers (90 characters) have been isolated, the tool will attempt to render a phrase and some other characters to the smaller test area:
```
   The quick brown fox jumps over the lazy dog.
   !@#$%^&*()[]/?,.':;" ABC WMX LIO
```

One small nuance of finding the character boundaries is the double quote character.  It will typically be determined to be two individual characters.  Removing the center divider will fix that.  Other characters to watch out for are the capital W, X, Y, M, and N in serifed fonts.  Their serifs typically run into each other.

## Adjusting the Font ##

The space between characters, known as the kerning value, can be adjusted to make the flow of the characters more presentable.  A value between 0.8 and 1.0 is usually desirable.  Plus, you'll need to define how large a space character will be (in pixels).  For extremely light fonts, you may want to check the box for "Bold" to render the font a little thicker (this won't be stored in the definition).

If everything went well, you should have a font definition which can be copied into a ".js" file of the same name as the font and placed in the "fonts" folder.  You can now use the bitmap font loader to load your new font.

## Final Thoughts ##

To get used to using the tool, I suggest loading some of the included fonts and attempting to get them to render.  The tool isn't 100% foolproof, but it can certainly help you when it comes to parsing new fonts for your games.