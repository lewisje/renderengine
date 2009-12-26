
Engine.include("/rendercontexts/context.parallaxcontext.js");
Engine.include("/engine/engine.object2d.js");
Engine.include("/resourceloaders/loader.sprite.js");
Engine.include("/components/component.sprite.js");
Engine.include("/components/component.transform2d.js");

Engine.initObject("TestObject", "Object2D", function() {
   
   var TestObject = Object2D.extend({
      
      velocity: null,
      
      constructor: function(foo) {
         this.base();
         this.add(SpriteComponent.create("draw", 1.0, TestRunner.spriteLoader.get("redball", "red")));
         this.add(Transform2DComponent.create("move"));
         
         var start = Point2D.create(50 + (Math.floor(Math.random() * fBox.w - this.width)), 
                                    50 + (Math.floor(Math.random() * fBox.h - this.height)));

         // Pick a random velocity for each axis
         this.velocity = Point2D.create(1 + Math.floor(Math.random() * 3), 
                                        1 + Math.floor(Math.random() * 3));
         
         this.getComponent("move").setPosition(start);
      },

      getSprite: function() {
         return this.getComponent("draw").getSprite();
      },

      move: function() {
         var pos = this.getComponent("move").getPosition();
         pos.add(this.velocity);
         this.getComponent("move").setPosition(pos);
         
         var bb = this.getSprite().getBoundingBox().get();
         
         // Determine if we hit a "wall" of our playfield
         var fieldBox = TestRunner.getFieldBox().get();
         if ((pos.x + bb.w > fieldBox.r) || (pos.x < 0)) {
            // Reverse the X velocity
            this.velocity.setX(this.velocity.get().x * -1);
         }  
         if ((pos.y + bb.h > fieldBox.b) || (pos.y < 0)) {
            // Reverse the Y velocity
            this.velocity.setY(this.velocity.get().y * -1);
         }
      },
      
      update: function(ctx, time) {
         this.base(ctx, time);
         ctx.pushTransform();
         this.move();
         ctx.popTransform();
      }
      
   });
   
   return TestObject;
});

Engine.initObject("TestRunner", null, function() {

   var TestRunner = Base.extend({
      
      constructor: null,

      viewRect: Rectangle2D.create(0,0,400,400),
      
      run: function() {
         // Set up a parallax canvas for a simple object
         var pCtx = ParallaxContext.create("context", 400, 400, 50);
         pCtx.addLayer("back", CanvasContext.create("context", 400, 400));
         pCtx.addLayer("middle", CanvasContext.create("context", 400, 400));
         pCtx.addLayer("front", CanvasContext.create("context", 400, 400));

         pCtx.getLayer("back").setBackgroundColor("black");
         pCtx.getLayer("middle").setBackgroundColor("transparent");
         pCtx.getLayer("front").setBackgroundColor("transparent");
         
         Engine.getDefaultContext().add(pCtx);
         
         // Create the object and add it
         //ctx.add(TestObject.create());
      },
      
      getFieldBox: function() {
         return this.viewRect;
      }
      
   });

   EngineSupport.whenReady(TestRunner, function() {
      TestRunner.run();
   });

   return TestRunner;   
});

