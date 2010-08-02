
Engine.include("/components/component.touchinput.js");
Engine.include("/engine/engine.baseobject.js");
Engine.include("/engine/engine.object2d.js");

Engine.initObject("TestObject", "Object2D", function() {
	
	var TestObject = Object2D.extend({
		
		rect: null,
		
		constructor: function(foo) {
			this.base();
			this.add(TouchInputComponent.create("input", true));
		},
		
		update: function(ctx, time) {
			this.base(ctx, time);
		},
		
		onTouchStart: function(touches, eventObj) {
			ManualTest.log("START touches: " + touches.length + " [" + touches[0].get() + "]");
		},

		onTouchEnd: function(touches, eventObj) {
			ManualTest.log("END touches: " + touches.length);
		},

		onTouchMove: function(touches, eventObj) {
			ManualTest.log("MOVE touches: " + touches.length + " [" + touches[0].get() + "]");
		}
		
	});
	
	return TestObject;
});

Engine.initObject("TestRunner", null, function() {

	var TestRunner = Base.extend({
		
		constructor: null,

		run: function() {
			ManualTest.showOutput();
			
			Engine.getDefaultContext().add(TestObject.create());
		}
		
	});

	EngineSupport.whenReady(TestRunner, function() {
		TestRunner.run();
	});

	return TestRunner;	
});

