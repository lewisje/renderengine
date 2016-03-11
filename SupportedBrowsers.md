# List of Supported Browsers #

The following is a list of browsers that I have tested the engine and examples in.  As more browsers are tested and pass, I will add them to this list.

|  **Browser**  |  **Version**  |  **Tested Platforms**  |  **Support Level**  |  **Performance**  |
|:--------------|:--------------|:-----------------------|:--------------------|:------------------|
| [Google Chrome](http://www.google.com/chrome) | 3.0+          | Windows                | Great               | Excellent         |
| [Mozilla Firefox](http://www.firefox.com/) | 3.6+          | Windows, Linux         | Perfect             | Great             |
| [Apple Safari](http://www.apple.com/safari/download/) | 3.0+          | Windows, Mac           | Perfect             | Excellent         |
| [Opera](http://www.opera.com/) | 9.5+          | Windows                | Great               | Good              |
| **Chrome**    | 1.0, 2.0      | Windows                | Great               | Great             |
| **Android**   | 7.0           | Android 2.1            | Good                | Fair              |
| **iPhone/iPod** | ??            | iPhone 2.0+            | Good                | Fair              |
| **Firefox**   | 3.0, 3.5      | Windows                | Great               | Good              |
| **Firefox**   | 1.5, 2.0      | Windows                | Good                | Fair              |
| **Opera**     | 9.5+          | Wii                    | Ok                  | Poor              |

**Levels of support:**
  * Perfect - All features working as expected
  * Great - Fully functional with minor issues
  * Good - Baseline, functioning
  * Ok - Runs, missing features
  * Poor - Most features not working
  * Fail - Engine not working on this browser

**Levels of performance:**
  * Excellent - High framerate under any load
  * Great - High framerate under normal load, drops under high load
  * Good - Medium framerate, drops noticeably under high load
  * Fair - Low framerate, drops under medium load
  * Poor - Very low framerate

**Explanation of "Load":**

My definition of load may not be the same as others, so let me try to summarize it in my own words.  When I speak of load, I think about the amount of processing that must occur to render one frame to the screen.  This involves everything from moving objects around to checking collisions, getting input and general game logic.  The more objects on screen, at any time, which must be updated and subsequently rendered increases load.  So, the more objects on screen, the higher the load.  A good example of high load is when the Asteroids Redux demo has upwards of fifty rocks, the player, five bullets, and hundreds of particles all being animated in one frame (about 400 objects on screen).  Medium load is about half that (200 objects), and low load would be about one eighth of medium (25 objects).

# List of Unsupported Browsers #

Non-stable (non-release) versions of browsers are not supported.  Thus, browsers which are alpha, or even beta, are in the "Unsupported Browsers" table if they have been at least tested with the engine.  Due to the possibility that the browser may still change operation, supporting these browsers doesn't make sense.

|  **Browser**  |  **Version**  |  **Tested Platforms**  |  **Support Level**  |  **Reason**  |
|:--------------|:--------------|:-----------------------|:--------------------|:-------------|
| **Internet Explorer** | 6.0+          | Windows                | **Fail** (_see notes_) | No canvas    |


## Internet Explorer ChromeFrame Plug-in ##

Those folks who are using Internet Explorer, that would like to enjoy The Render Engine and what it has to offer, should consider downloading the following plug-in:

[ChromeFrame for Internet Explorer](http://code.google.com/chrome/chromeframe/)


---


_Notes:_

  * Firefox 4.0b1 has an issue with concurrent modification which didn't present itself in earlier versions.  I'm aware of the issue and working to resolve it.
  * The best performance of any browser is Google's _Chrome_.  Their V8 JavaScript engine is just fantastic.  I'm not stating this as an endorsement, but more as a challenge for the other browser makers to step up and compete!  However, there are some features not yet supported in Chromium which need to be addressed before I _will_ endorse it fully.
  * Firefox 3.6 has significantly improved the overall performance of the engine.  The lengthy pauses when the browser was running the GC are now much less noticeable, but still there.
  * Additional tests for different browsers on multiple platforms would be nice.  I only have a Windows PC, Android phone, and occasional access to a Mac and/or iPhone.
  * Requests for additional browsers should be added to the comments of this page.
  * There is a project to bring the Cairo (Firefox's renderer) canvas to Internet Explorer.  When this works, I will test and add IE to my list of browsers.  The ExCanvas object doesn't perform fast enough for this engine.
  * In Firefox 1.5 and 2.0 the garbage collection, in tandem with the older Javascript engine, is passable.