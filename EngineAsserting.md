# Assert and AssertWarn #

Two methods are provided to allow you to perform assertions when the engine is running.  Assertions are helpful ways to quickly test a condition and output a message if the test fails.  There are two assertions you can perform: `Assert` and `AssertWarn`.  `Assert` will cause the engine to shutdown if it fails.  This is to prevent a pile up in the engine if something goes horribly wrong.  `AssertWarn` will not stop the engine, it will only print a warning to the EngineConsole.

```
   Assert((size != 0), "Size is zero! Divide by zero is imminent!");
   var mag = div / size;
```

In the case where you just want to have the engine warn you that something is wrong, the following would be better:

```
   livesRemaining--;
   AssertWarn((livesRemaining > 0), "Why are we still playing?");
```

For `AssertWarn` to function, your debug level must be at 0,1, or 2.  Asserts are a little easier to use than having to write out a complete `if/then` check each time you want to test a condition.