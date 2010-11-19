
Engine.include("/components/component.image.js");
Engine.include("/components/component.transform2d.js");
Engine.include("/rendercontexts/context.canvascontext.js");
Engine.include("/engine.object2d.js");
Engine.include("/resourceloaders/loader.image.js");

Engine.initObject("TestObject", "Object2D", function() {
	
	var TestObject = Object2D.extend({
		
		rect: null,
		
		constructor: function(point, image) {
			this.base();
			this.add(Transform2DComponent.create("move"));
			this.add(ImageComponent.create("image", TestRunner.imageLoader, "redball"));
			
			this.getComponent("move").setPosition(point);
		}		
	});
	
	return TestObject;
});

Engine.initObject("TestRunner", null, function() {

	var TestRunner = Base.extend({
		
		constructor: null,
		waitTimer: null,
		imageLoader: null,
		ctx: null,

		viewRect: Rectangle2D.create(0,0,200,200),
		
		run: function() {
			// Set up a canvas for a simple object
			this.ctx = CanvasContext.create("context", 200, 200);
			this.ctx.setBackgroundColor("black");
			
			Engine.getDefaultContext().add(this.ctx);
			
			this.imageLoader = ImageLoader.create();
			this.imageLoader.load("redball", ManualTest.getTest() + "/redball.png", 120, 60);
			var self = this;
			this.waitTimer = Timeout.create("resources", 100, function() {
				self.waitForResources();
			});
		},
		
		waitForResources: function() {
			if (this.imageLoader.isReady()) {
				this.waitTimer.destroy();
				this.waitTimer = null;
				this.start();
			} else {
				this.waitTimer.restart();
			}
		},
		
		start: function() {
			this.ctx.add(TestObject.create(Point2D.create(10,10), "redball"));
		}
		
	});

	EngineSupport.whenReady(TestRunner, function() {
		TestRunner.run();
	});

	return TestRunner;	
});

