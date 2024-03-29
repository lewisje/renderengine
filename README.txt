The Render Engine @BUILD_VERSION [@BUILD_DATE]
(c)2008-2010 Brett Fattori (bfattori AT gmail DOT com)

---------------------------------------------------------

The Render Engine is an open source game engine written entirely in Javascript.  The intent of this engine is to provide you, the developer, with the tools necessary to create your own game without needing to first design and write an engine.  The engine has all of the capabilities to load and execute scripts which contain game objects, render contexts, and so forth.  The Render Engine is a starting point, written using a clean OO framework, from which you can extend and expand into whatever you desire.

The engine includes a demonstration using vector-based graphics.  A simple Asteroids clone with player, asteroid, and bullet objects which demonstrates the component system.  It also uses the spatial grid collision system, and shows how to work with that.  An "evolved" mode is available (set the URL parameter "evolved=true") to demonstrate the particle system.

Visit our project page for the latest release, examples, and tutorials @
http://www.renderengine.com

The engine source is accessible through Google Code @
http://code.google.com/p/renderengine

There are many useful pages in The Render Engine wiki @
http://code.google.com/p/renderengine/w/list

Full API documentation is available online @
http://renderengine.googlecode.com/svn/api/index.html

A Google Discussion Group is available @
http://groups.google.com/group/the-render-engine



Source Code Access
------------------------

The source code is hosted on Google Code in a Subversion (SVN) repository.  Use the following command to anonymously access to the latest source code:

> svn checkout http://renderengine.googlecode.com/svn/trunk/ renderengine-read-only

An integrated tool, such as TortoiseSVN, will make access to the source much simpler.  You can get TortoiseSVN @
http://tortoisesvn.tigris.org/



Setting up a Tomcat server for testing & development
--------------------------------------------------------

Go to the Apache Tomcat website and download the latest version of the server.  Install Tomcat and then copy the "[INSTALL_DIR]/setup/tomcat/renderengine.xml" file to the "${CATALINA_HOME}/conf/Catalina/localhost" directory.  You will need to edit the file and change the "docBase" property to point to the location where the engine was installed.

Start up, or restart, the Tomcat server and navigate to "http://localhost:8080/renderengine/demos/spaceroids" to test the installation.  If all went well, you should be presented with the Asteroids demo game.

Get Tomcat @
http://tomcat.apache.org


Using the Jibble Web Server for testing & development
---------------------------------------------------------

The distribution comes with the Jibble Web Server which is a very small Java web server.  It doesn't support request parameters, so it is a bit limited.  It will, however, give you a quick and easy way to test your game development.  See the file "run.bat" in the root folder.  You will need the JRE to use the web server.

In the "run.bat" file, you will notice two arguments to run the server.  The first is the path, which you can leave at "." (the root folder) and the second is the port to run the server on (default: 8010).  After starting the server, you can go to your web browser and try:
"http://localhost:8010/demos/spaceroids/index.html"

The web server is running properly if you see the Asteroids demo start up.


Supported Browsers
-------------------------

The following list is taken from the wiki page @ http://code.google.com/p/renderengine/wiki/SupportedBrowsers


This is a list of browsers that I have tested the engine and examples in. As more browsers are tested and pass, I will add them to this list.

Browser           Version         Tested Platforms        Support Level
--------          --------        -----------------       --------------
Chrome            3.0+            Windows                 Near Perfect
Firefox           3.5+            Windows, Mac            Perfect
Safari            3.0+            Windows, Mac, iPhone    Great - Win/Mac, Ok - iPhone
Opera             9.5+            Windows                 Great
Opera             9.5+            Wii                     Ok - Needs optimization

Chrome            1.0,2.0         Windows                 Great
Firefox           3.0             Windows                 Great
Firefox           1.5,2.0         Windows                 Good
Internet Explorer 6.0+            Windows                 Fail


Levels of support:

  * Perfect - All features working as expected
  * Great - Fully functional with minor issues
  * Good - Baseline, functioning
  * Ok - Runs, missing features or poor performance
  * Poor - Most features not working
  * Fail - Engine not working on this browser


Internet Explorer Support
---------------------------------

For those who are using Internet Explorer, and prefer to keep their browser intact, that would like to enjoy The Render Engine and what it has to offer should consider downloading the following plug-in for Internet Explorer:

http://code.google.com/chrome/chromeframe/


Notes:

    * Just as a note, the best performance of any browser is Google's Chrome.  Their V8 Javascript engine is just fantastic.  I'm not stating this as an endorsement, but more as a challenge for the other browser makers to step up and compete! However, there are some features not yet supported in Chromium which need to be addressed before I will endorse it fully.

    * Additional tests for different browsers on multiple platforms would be nice. I only have a Windows PC and occasional access to a Mac and/or iPhone.

    * Requests for additional browsers should be sent to bfattori AT gmail DOT com, or posted to the discussion group.

    * There is a project to bring the Cairo (Firefox's renderer) canvas to Internet Explorer. When this works, I will test and add IE to my list of browsers. The ExCanvas object doesn't perform fast enough for this engine.

    * In Firefox 1.5 and 2.0 the garbage collection, in tandem with the older Javascript engine, is passable. 


----
This engine is open source, and is protected under the terms of the MIT License which guarantees that all source is, and will remain, open for your creative consumption.

