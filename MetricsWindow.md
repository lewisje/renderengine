# Engine Metrics #

The engine collects metrics to help you tune your game.  The metrics sample everything from new objects to visible objects.  Including different engine classes in your game will change what metrics are displayed.  Metrics, by default, are sampled once every 10 frames.  This rate can be modified by calling [Engine.setMetricSampleRate()](http://renderengine.googlecode.com/svn/api/Engine.html#setMetricSampleRate).  The following are the metrics, categorized by their location in the engine.

### Metrics Values ###

| **Area** | **Name** | **Description** |
|:---------|:---------|:----------------|
| _Engine_ | `FPS`    | The desired engine frames per second (constant) |
| _Engine_ | `upTime` | The number of seconds the engine has been running. |
| _Engine_ | `aFPS`   | The "actual" maximum frames per second the engine can generate, based on load and available time.  This value is very dependent on the platform on which the code is being executed.  Google's Chrome browser, for example, typically has a higher actual FPS, whereas Opera has a lower actual FPS. |
| _Engine_ | `availTime` | The time available (in milliseconds) to render a frame.  This is based off of the desired `FPS` and the time to generate each frame |
| _Engine_ | `frameGenTime` | The average time to render a frame (in milliseconds).  A higher value in this metric indicates that too much processing is required to create each frame.  Occasional spikes, however, are not abnormal. |
| _Engine_ | `engineLoad` | The load to generate frames. This is the ratio between the availble frame time, and the time taken to render each frame.  Occasional spikes above 100% are not abnormal, but if the load is consistently above 100%, it is a good indication that too much processing is required to generate each frame. |
| _Engine_ | `visibleObj` | The number of visible, rendered objects in a frame. |
| _Engine_ | `poolNew` | The number of times a new instance has been created via ObjectPooling. |
| _Engine_ | `poolLoad` | Shows how much the pool is being used.  The ratio between objects currently in the pool and the number of new objects created. Higher stable load is better, since it shows that the number of new objects, to the number of pooled objects is more equal.  A lower, stable percentage shows objects which have been created new and not returned to the pool. |
| _Engine_ | `pooledObjects` | The number of objects currently in the pool, available for use.  This value fluctuates as objects are used from the pool and subsequently returned to it. |
| _Engine_ | `droppedFrames` | The number of frames which have been skipped (dropped) to keep the frame rate constant.  Each time engine load goes above 100%, frames will be dropped. |
| _ParticleEngine_ | `particles` | The number of active particles being updated each frame. |


The display of the metrics window can be toggled from code, using the two methods:

  * [Engine.showMetrics()](http://renderengine.googlecode.com/svn/api/Engine.html#showMetrics) - Display the metrics window
  * [Engine.hideMetrics()](http://renderengine.googlecode.com/svn/api/Engine.html#hideMetrics) - Hide the metrics window

Additionally, specifying the "metrics=true" query parameter will show the metrics window when the engine is starting.  The metrics window can be used to pause, run, and shutdown the engine, at any point, to allow a developer to examine metrics values or to interrogate parts of the engine from debugging tools.  Note that timers which are running are currently _not paused_ when the engine is paused.

## Adding Your Own Metrics ##

It is possible to add your own metrics to the window while your game is executing.  Just make a call to [Engine.addMetric()](http://renderengine.googlecode.com/svn/api/Engine.html#addMetric) each time you want to update the value.

Examples:
```
   // Add a simple value, updated with each sample
   Engine.addMetric("myValue", value);

   // Add a value which should be smoothed
   Engine.addMetric("smoothValue", value2, true);

   // Special formatting
   Engine.addMetric("ratio", Math.floor((value3 / value4)*100), true, "#%");
```