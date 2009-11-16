module("engine");

test("Objects", function() {
	expect(10);

	ok( ConsoleRef != null, "ConsoleRef exists" );
	ok( HTMLConsoleRef != null, "HTMLConsoleRef exists" );
	ok( SafariConsoleRef != null, "SafariConsoleRef exists" );
	ok( OperaConsoleRef != null, "OperaConsoleRef exists" );
	ok( FirebugConsoleRef != null, "FirebugConsoleRef exists" );
	ok( Console != null, "Console exists" );
	ok( Assert != null, "Assert exists" );
	ok( AssertWarn != null, "AssertWarn exists" );
	ok( EngineSupport != null, "EngineSupport exists" );
	ok( Engine != null, "Engine exists" );

});

var TestConsoleRef = ConsoleRef.extend({
	output: null,
   constructor: function() {
		this.output = [];
	},
	getOutputLength: function() {
		return this.output.length;
	},
   info: function() {
		this.output.push("info");
	},
   debug: function() {
		this.output.push("debug");
	},
   warn: function() {
		this.output.push("warn");
	},
   error: function() {
		this.output.push("error");
	},
   getClassName: function() {
		return "TestConsoleRef";
	}
});

var tRef = new TestConsoleRef();
Engine.setDebugMode(true);
Console.setConsoleRef(tRef);

test("Console", function() {
	expect(5);

	Console.setDebugLevel(Console.DEBUGLEVEL_NONE);
	Console.log("foo");
	equals(tRef.getOutputLength(), 0, "Console.DEBUGLEVEL_NONE");

	Console.setDebugLevel(Console.DEBUGLEVEL_ERRORS);
	Console.debug("foo");
	equals(tRef.getOutputLength(), 0, "Console.DEBUGLEVEL_ERRORS");

	Console.setDebugLevel(Console.DEBUGLEVEL_VERBOSE);
	Console.warn("foo");
	equals(tRef.getOutputLength(), 1, "Console.DEBUGLEVEL_VERBOSE");

	Console.setDebugLevel(Console.DEBUGLEVEL_DEBUG);
	Console.log("foo");
	equals(tRef.getOutputLength(), 1, "Console.DEBUGLEVEL_DEBUG");

	Console.setDebugLevel(Console.DEBUGLEVEL_WARNINGS);
	Console.warn("foo");
	equals(tRef.getOutputLength(), 2, "Console.DEBUGLEVEL_WARNINGS");

});

test("Assert", function() {
	expect(3);

	try {
		Assert(false, "Asserting");
	} catch (ex) {
		// We should get an exception
		ok( ex, "Assert threw exception" );
	}
	ok( !Engine.started && !Engine.running, "Assert stopped engine" );

	Engine.startup();
	Engine.run();

	ok( Engine.running, "Engine started again" );

});

test("AssertWarn", function() {
	expect(1);
	AssertWarn(false, "Asserting");
	equals(tRef.getOutputLength(), 4, "AssertWarn logged a warning");
});

test("EngineSupport", function() {
	expect(12);

	var arr = ["cat", "dog", "mouse", "horse", "pig", "cow"];

	equals(EngineSupport.indexOf(arr, "mouse"), 2, "indexOf");

	EngineSupport.arrayRemove(arr, "dog");
	equals( arr.length, 5, "arrayRemove" );

	var newArr = EngineSupport.filter(arr, function(e) {
		return (e.indexOf("c") == 0);
	});
	equals( newArr.length, 2, "filter");

	var copyArr = [];
	EngineSupport.forEach(arr, function(e) {
		copyArr.push(e);
	});
	ok( copyArr.length == arr.length, "forEach");

	var fArr = [];
	var rand = [];
	for (var x = 0; x < 10; x++) {
		rand[x] = Math.floor(Math.random() * 49);
	}
	EngineSupport.fillArray(fArr, 50, "dog");
	// Test a 10-point random sampling of the array
	ok( (function(){
			for (var k = 0; k < 10; k++) {
				if (fArr[rand[k]] != "dog") {
					return false;
				}
			}
			return true;
		  })(), "fillArray");

	var path = EngineSupport.getPath("http://www.google.com/ip/index.html");
	equals( path, "http://www.google.com/ip", "getPath" );

	ok( !EngineSupport.checkBooleanParam("notExist"), "checkBooleanParam" );
	ok( !EngineSupport.checkStringParam("notExist", "STRING"), "checkStringParam" );
	ok( !EngineSupport.checkNumericParam("notExist", "NUMBER"), "checkNumericParam" );

	ok( EngineSupport.getStringParam("notExist", "COW") == "COW", "getStringParam" );
	ok( EngineSupport.getNumericParam("notExist", 42) == 42, "getNumericParam" );

	hasKey( EngineSupport.sysInfo(), "browser", "sysInfo has 'browser'" );
});

test("Engine", function() {
	expect(6);

	Engine.setDebugMode(true);
	ok( Engine.getDebugMode(), "set/getDebugMode" );
	Engine.setDebugMode(false);

	Engine.setFPS(10);
	equals( Engine.fpsClock, 100, "setFPS" );

	var dannyId = Engine.create(PooledObject.create("Danny"));
	ok( Engine.getObject(dannyId) != null, "create" );

	Engine.destroy(Engine.getObject(dannyId));
	ok( Engine.getObject(dannyId) == null, "destroy" );

	Engine.pause();
	ok( !Engine.running, "pause" );

	Engine.run();
	ok( Engine.running, "run" );


});
