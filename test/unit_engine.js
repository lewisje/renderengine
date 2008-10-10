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
   constructor: function() { this.output = []; },
   info: function() { TestConsoleRef.output.push({"i", this.fixArgs(arguments)}) },
   debug: function() { TestConsoleRef.output.push({"d", this.fixArgs(arguments)}) },
   warn: function() { TestConsoleRef.output.push({"w", this.fixArgs(arguments)}) },
   error: function() { TestConsoleRef.output.push({"e", this.fixArgs(arguments)}) },
   getClassName: function() { return "TestConsoleRef"; }
});

test("Console", function() {
	expect(5);

	var tRef = new TestConsoleRef();
	Console.setConsoleRef(tRef);

	Console.setDebugLevel(Console.DEBUGLEVEL_NONE);
	Console.log("foo");
	equals(tRef.output.length, 0, "Console.DEBUGLEVEL_NONE");

	Console.setDebugLevel(Console.DEBUGLEVEL_ERRORS);
	Console.debug("foo");
	equals(tRef.output.length, 0, "Console.DEBUGLEVEL_ERRORS");

	Console.setDebugLevel(Console.DEBUGLEVEL_VERBOSE);
	Console.warn("foo");
	equals(tRef.output.length, 1, "Console.DEBUGLEVEL_VERBOSE");

	Console.setDebugLevel(Console.DEBUGLEVEL_DEBUG);
	Console.log("foo");
	equals(tRef.output.length, 1, "Console.DEBUGLEVEL_DEBUG");

	Console.setDebugLevel(Console.DEBUGLEVEL_WARN);
	Console.warn("foo");
	equals(tRef.output.length, 2, "Console.DEBUGLEVEL_WARN");

});

test("Assert", function() {
	expect(1);

	Assert(false, "Asserting");
	ok( !Engine.started && !Engine.running, "Assert" );

	Engine.startup();
});

test("AssertWarn", function() {
	expect(1);

	AssertWarn(false, "Asserting");
	ok( Engine.running, "AssertWarn" );
});
