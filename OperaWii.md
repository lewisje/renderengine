# Developing for the Wii #

This document is intended to list some of the pitfalls I've run into.  I'm hoping that by the time I release version 2.0 of the engine, the Wii support will be better optimized.  Some things to note when developing for the Wii:

### `for..in` Loops During Dependency Checking (Linking) ###

The variable declaration part causes problems with the dependency checker on the Wii.  A quick workaround is to specify a variable that references the declared variable in the `for..in` statement.  For example:

```
   for (var ref in events) {
      // This will fail in the dependency checker
      var t = ref.split("|")[0];
   }
```

Instead, just drop an intermediate variable in the loop, like so:

```
   for (var ref in events) {
      var r = ref;
      var t = r.split("|")[0];
   }
```

Now the dependency checker will properly handle the reference for `r` and not miss the reference to `ref`.

### Debugging ###

Since debugging isn't the best on the Wii, The Render Engine contains some aid.  To enable the console for the Wii, just supply the URL parameter `debug=true` and set `debugLevel=1`.  Doing so will output a lot of helpful information.  Class dependency resolution has, historically, been one of the most troublesome areas.  The debugger will help determine which classes are having an issue.

Another major issue is syntax errors.  After many problems with my own development, I'm going to try to create a syntax checker for the most common problems that I run into on the Wii (during optimization, but maybe before since it causes _me_ big headaches).  There are some patterns which are easily detectable, but creating a decent syntax checker will surely give me migraines.

### `onload` and `onerror` Events ###

It appears that these two events are _not_ being fired on the Wii.  The only approximation for `onload` is to wait for a period of time and _assume_ that an external resource is loaded.  The estimate is anyone's guess.  Based on some simple testing, I have found that for image resources, using the width times the height plus an error value gives a decent result.  So, for a 60 x 60 image, I wait 3600ms plus 500ms (4.1 seconds) just to be safe on slower connections.  Yes, loading takes longer since it's not exactly when the image is ready, but overall it's a good tradeoff.

In reality, a better formulation (when I get a chance to optimize for the Wii) would be to come up with a graduated scale for timing of images.  Obviously waiting for nearly two minutes for _one_ 320 x 320 pixel image is unrealistic (and unwanted for obvious reasons).  I will tweak this calculation, as I said, when I optimize for the Wii.

### Overall Processing Power ###

Since games developed with the engine are running in a web browser, as script, it is necessary to take overall processing power into consideration.  While the Wii can run the Asteroids demo, it doesn't run it well.  There are many calculations that are occurring every millisecond which require a lot of horsepower.  The Wii doesn't appear to provide that much horsepower.  I plan on getting some specific numbers so that you will have a benchmark against which to develop in the future.