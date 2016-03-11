# Overriding the "Loading" dialog #

The Render Engine will provide a very basic loading dialog for you so you don't have to create one yourself.  However, if you want to override the one that is provided, you'll want to follow this format:

```
   <!-- The loading dialog... If this exists in your page, the engine
        will update this for you instead of creating one itself. -->
   <span id='loading'>
      
      <!-- This div is used as a progress bar -->
      <div id='engine-load-progress'></div>
      
      <!-- This span will be populated with the "[file] of [total]" text -->
      <span id='engine-load-info'></span>
   </span>
```

You only need to provide the three elements above.  Besides that, you can go crazy with graphics and other embellishments.