
Engine.include("/components/component.keyboardinput.js");
Engine.include("/engine.baseobject.js");
Engine.include("/engine.object2d.js");

Engine.initObject("TestObject", "Object2D", function() {
	
	var TestObject = Object2D.extend({
		
		rect: null,
		
		constructor: function(foo) {
			this.base();
			this.add(KeyboardInputComponent.create("input"));
		},
		
		update: function(ctx, time) {
			this.base(ctx, time);
		},
		
		onKeyDown: function(which, keyCode, ctrlKey, altKey, shiftKey, eventObj) {
			ManualTest.log("keydown: " + which + " [" + keyCode + "] c:" + ctrlKey + " a:" + altKey + " s:" + shiftKey);
		},

		onKeyUp: function(which, keyCode, ctrlKey, altKey, shiftKey, eventObj) {
			ManualTest.log("keyup: " + which + " [" + keyCode + "] c:" + ctrlKey + " a:" + altKey + " s:" + shiftKey);
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

