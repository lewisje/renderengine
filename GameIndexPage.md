# Introduction #

If you're looking to get up and running quickly, and don't plan to make changes to the engine classes, you can run from the latest stable release of the engine by using the following as a template for your game's `index.html`.  You won't need to host the engine or it's supporting code, instead relying on Google Code to host it for you.

```
<!-- ChromeFrame Support -->
<meta http-equiv="X-UA-Compatible" content="chrome=1"/>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html>
   <head>
      <title>Game Loader</title>

      <!-- Mobile View Definition
      <meta name="viewport" content="width=device-width; initial-scale=1.0; minimum-scale=1.0 maximum-scale=1.0; user-scalable=0;"/>
      -->

      <!-- Supporting Libraries -->
      <script type="text/javascript" src="http://renderengine.googlecode.com/svn/tags/latest/libs/base.js"></script>
      <script type="text/javascript" src="http://renderengine.googlecode.com/svn/tags/latest/libs/jquery.js"></script>
      <script type="text/javascript" src="http://renderengine.googlecode.com/svn/tags/latest/libs/jquery.ext.engine.js"></script>
      <script type="text/javascript" src="http://renderengine.googlecode.com/svn/tags/latest/libs/sylvester.js"></script>

      <!-- Load the main engine script -->
      <script type="text/javascript" src="http://renderengine.googlecode.com/svn/tags/latest/engine/runtime/engine.js"></script>
   </head>
   <body>
      <script type="text/javascript">
      	$(document).ready(function() {
            // Load the game script
            Engine.loadGame('GAME_JAVASCRIPT_FILE','GAME_CLASS','GAME_NAME');
        });
      </script>
   </body>
</html>

```

Just replace **GAME\_JAVASCRIPT\_FILE** with your game's ".js" file (usually `game.js`), **GAME\_CLASS\_NAME** with the class which extends the `Game` object class, and **GAME\_NAME** with a name to display while your game is loading.