
Engine.include("/components/component.sprite.js");
Engine.include("/components/component.transform2d.js");
Engine.include("/rendercontexts/context.canvascontext.js");
Engine.include("/engine.object2d.js");
Engine.include("/resourceloaders/loader.sprite.js");

Engine.initObject("TestObject", "Object2D", function() {
	
	var TestObject = Object2D.extend({
		
		rect: null,
		
		constructor: function(point, spriteName) {
			this.base();
			this.add(Transform2DComponent.create("move"));
			this.add(SpriteComponent.create("sprite", TestRunner.spriteLoader.getSprite("sprites", spriteName)));
			
			this.getComponent("move").setPosition(point);
		}		
	});
	
	return TestObject;
});

Engine.initObject("TestRunner", null, function() {

	var TestRunner = Base.extend({
		
		constructor: null,
		waitTimer: null,
		spriteLoader: null,
		ctx: null,

		viewRect: Rectangle2D.create(0,0,200,200),
		
		run: function() {
			// Set up a canvas for a simple object
			this.ctx = CanvasContext.create("context", 200, 200);
			this.ctx.setBackgroundColor("black");
			
			Engine.getDefaultContext().add(this.ctx);
			
			this.spriteLoader = SpriteLoader.create();
			this.spriteLoader.load("sprites", ManualTest.getTest() + "/smbtiles.js");
			var self = this;
			this.waitTimer = Timeout.create("resources", 100, function() {
				self.waitForResources();
			});
		},
		
		waitForResources: function() {
			if (this.spriteLoader.isReady()) {
				this.waitTimer.destroy();
				this.waitTimer = null;
				this.start();
			} else {
				this.waitTimer.restart();
			}
		},
		
		start: function() {
			this.ctx.add(TestObject.create(Point2D.create(10,10), "mario_walk"));
			this.ctx.add(TestObject.create(Point2D.create(10,80), "super_walk"));
		}
		
	});

	EngineSupport.whenReady(TestRunner, function() {
		TestRunner.run();
	});

	return TestRunner;	
});

