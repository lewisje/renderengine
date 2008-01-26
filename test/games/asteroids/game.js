
var Asteroids = Game.extend({

   constructor: null,

   renderContext: null,
   
   setup: function() {
      // Create the 2D context
      renderContext = new CanvasContext(600, 580);
      Engine.getDefaultContext().add(renderContext);
      renderContext.setBackgroundColor("black");
      
      // Add some asteroids to it
      for (var a = 0; a < 10; a++)
      {
         renderContext.add(new Asteroid(600, 580));
      }
   },
   
   teardown: function() {
      renderContext.destroy();
   }

});


