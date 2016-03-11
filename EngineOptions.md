# Introduction #

There are a few ways to configure The Render Engine to your liking. The query parameters are meant to give you a method to intialize the engine with values before it runs anything.

## Query Parameters ##

The following table lists query parameters you can pass to the engine to configure it before it starts a game's execution:

| **Query Parameter** | **Description** |
|:--------------------|:----------------|
| `debug`             |Set this vale to `true` to enable debugging output from the engine.  The engine will try to utilize a method best suited for the browser you are running within. |
| `debugLevel`        | The level determines the amount of output in debugging mode.  0 = Verbose, 1 = Semi-verbose, 2 = Debug messages, 3 = Warnings, 4 = Errors.  Each level, starting at Warn(2) will also display messages of the following level.  So, Debug(1) shows Warnings and Errors too. See the article about the EngineConsole for more information. |
| `metrics`           |Setting this value to `true` will enable the display of engine metrics collected during runtime.  You can use these values to tune your game. See [this list](MetricsWindow.md) for values and their meaning. |
| `debugSound`        |To see the sound engine initialization messages, and get a better idea of what SoundManager2 is doing, set this value to `true`.|
| `fps`               |The FPS to default the engine to.|
| `simWii`            | `true` to simulate running on a Wii. Uses the HTMLConsole which appears in the browser's window. |

## Engine methods ##

This table lists methods you can call, on the `Engine` global object, to modify it during runtime or from within a game.  This is, by no means, a complete list.  You should refer to the engine API for more detailed listings:

| **Method Name** | **Description** |
|:----------------|:----------------|
| [setFPS(int)](http://renderengine.googlecode.com/svn/api/Engine.html#setFPS) | Set the FPS the engine will attempt to render at. |
| [toggleMetrics()](http://renderengine.googlecode.com/svn/api/Engine.html#toggleMetrics) | Toggle the display of engine metrics. |
| [showMetrics()](http://renderengine.googlecode.com/svn/api/Engine.html#showMetrics) | Show the metrics display. |
| [hideMetrics()](http://renderengine.googlecode.com/svn/api/Engine.html#hideMetrics) | Hide the metrics display. |
| [setMetricSampleRate()](http://renderengine.googlecode.com/svn/api/Engine.html#setMetricSampleRate) | Set how often metrics, that are averaged, are sampled.  This is the number of generated frames between samples. |
| [addMetric(str,val,bool,str)](http://renderengine.googlecode.com/svn/api/Engine.html#addMetric) | Add a metric to the engine's metrics display. Usage: `Engine.addMetric('displayName', calculatedValue, true, '#%');` You can average the metric with the third arg.  The final argument will replace the `#` sign with the value, so you can format the output.  e.g. The value of 123 using the format `#ms` would appear as `123ms` |
| [getObject(str)](http://renderengine.googlecode.com/svn/api/Engine.html#getObject) | Get a reference to an object created in the engine.  The string is the one returned by the engine when it was created. |
| [setDebugMode(bool)](http://renderengine.googlecode.com/svn/api/Engine.html#setDebugMode) | Enable or disable debug output. |
| [getDebugMode()](http://renderengine.googlecode.com/svn/api/Engine.html#getDebugMode) | Determine if debugging is enabled. |
| [isSoundEnabled()](http://renderengine.googlecode.com/svn/api/Engine.html#isSoundEnabled) | Determine if the sound engine initialized. |
| [pause()](http://renderengine.googlecode.com/svn/api/Engine.html#pause) | Pause the execution of the engine.  No additional frames will be processed until `run()` is called. |
| [run()](http://renderengine.googlecode.com/svn/api/Engine.html#run) | Run the engine after it has been paused. |
| [shutdown()](http://renderengine.googlecode.com/svn/api/Engine.html#shutdown) | Shutdown the engine and clean up object instances. |
| [getDefaultContext()](http://renderengine.googlecode.com/svn/api/Engine.html#getDefaultContext) | Get the engine's default rendering context.  You will need to add objects to this for the engine to process them. |
| [getEnginePath()](http://renderengine.googlecode.com/svn/api/Engine.html#getEnginePath) | Retrieve the path where the engine was started from.  All other scripts will be loaded relative to that. |
| [dumpScripts()](http://renderengine.googlecode.com/svn/api/Engine.html#dumpScripts) | Outputs all of the scripts loaded by the engine to the debugger window. |
| [clearScriptCache()](http://renderengine.googlecode.com/svn/api/Engine.html#clearScriptCache) | Clears any references to scripts that have been loaded, allowing them to be loaded again. |
| [toString()](http://renderengine.googlecode.com/svn/api/Engine.html#toString) | Output the engine name and version. |