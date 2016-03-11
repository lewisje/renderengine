# The Engine Console #

The Render Engine provides an abstraction for the many consoles which are available in the different browsers.  Instead of having to know that in Firefox (with Firebug installed) it's "console", and in Opera it's "window.opera.postError", you can just refer to the [Console](http://renderengine.googlecode.com/svn/api/Console.html) object.  The `Console` object has a few methods that you can call:

| **Method** | **Result** |
|:-----------|:-----------|
| [log()](http://renderengine.googlecode.com/svn/api/Console.html#log) | Lowest level logging.  At this level, object creation and destruction will be reported.  Prints out when `debugLevel` is set to `0` or `Console.DEBUGLEVEL_VERBOSE` |
| [info()](http://renderengine.googlecode.com/svn/api/Console.html#info) | Semi-verbose logging.  Displays object initialization.  Prints out when `debugLevel` is set to `1` or `Console.DEBUGLEVEL_INFO` |
| [debug()](http://renderengine.googlecode.com/svn/api/Console.html#debug) | Debug messages.  Prints out when `debugLevel` is set to `2`(the default) or `Console.DEBUGLEVEL_DEBUG` |
| [warn()](http://renderengine.googlecode.com/svn/api/Console.html#warn) | Prints warnings.  Engine startup and shutdown, sounds initialization.  Prints out when `debugLevel` is set to `3` or `Console.DEBUGLEVEL_WARNING` |
| [error()](http://renderengine.googlecode.com/svn/api/Console.html#error) | Prints errors.  Prints out when `debugLevel` is set to `4` or `Console.DEBUGLEVEL_ERRORS` |

You can set the debug level by calling [Engine.setDebugLevel()](http://renderengine.googlecode.com/svn/api/Engine.html#setDebugLevel) and passing one of the constants.

**NOTE:** _It is recommended that you use this object for cross-browser compatibility._