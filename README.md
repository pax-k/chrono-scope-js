## 🔎 ChronoScopeJS - JavaScript Function Execution Profiler

![ChronoScopeJS](/assets/logo.png "ChronoScopeJS")

This JavaScript module provides a profiling proxy utility 🛠️ to help you monitor and log ⏱️ the execution time of your functions, including async functions and iterators. It is designed to wrap around your existing functions and objects to measure their performance with high precision using the `performance.now()` method. It is especially useful for developers who want to debug 🔧 and optimize 🚀 their code by identifying bottlenecks in function executions.

#### 🔑 Key Features
- 📚 Deep Call Stack Profiling: The profiler is capable of tracking function performance throughout the entire call stack. When a function is wrapped with `createProfilingProxy`, not only is its direct execution time logged, but the module also delves into any subsequent function calls made within it - going "all the way down" the call stack. This allows for a comprehensive understanding of performance and potential bottlenecks that occur at any level of the stack during the execution flow.
- 📦 **Easy Integration:** Simply import and wrap your functions or objects with `createProfilingProxy`. 
- ⏩ **Async Support:** Handles and logs async function executions seamlessly.
- ➿ **Iterator Support:** Profiles iterator `next` calls and supports both synchronous and asynchronous iterators.
- 🛡️ **Native Object Safeguard:** Avoids profiling native objects like `Promise`, `Map`, `Set`, etc., to prevent unnecessary overhead.
- 🔁 **Circular Call Prevention:** Detects and skips profiling for already profiled objects to avoid maximum call stack size errors.
- 🖨️ **Informative Logging:** Provides clear console logs indicating the duration of each function call.

#### 📖 How to Use

1. 📥 **Import the Profiler:**
   Import the `createProfilingProxy` function from the module into your JavaScript codebase.

2. 🎁 **Wrap Functions or Objects:**
   Wrap any function or object with `createProfilingProxy` to start profiling. If the target is a function, it will be directly profiled. If it's an object, all enumerable properties that are functions will be profiled recursively.

3. 🕵️‍♂️ **Review Logs:**
   Execute your code as usual. Check the console for logs indicating how long each function takes to execute. Asynchronous functions will log the time upon resolution or rejection.

#### 🧪 Example Usage

#### In Javascript:

```javascript
import { createProfilingProxy } from 'chrono-scope-js';

// Your original function
function myFunction() {
  // function body
}

// Wrap your function
const profiledMyFunction = createProfilingProxy(myFunction);

// Use the profiled version
profiledMyFunction();
```

#### Logging the output:

`./run-your-script > log.txt`

### 🪵 Example Output

**Simple Function Execution:**
   When a regular (synchronous) function is executed, you would see:
   ```
   Function library.myFunction took 15.00 ms.
   ```

**Async Function Execution:**
   For an asynchronous function that resolves successfully, you would see:
   ```
   Async function library.myAsyncFunction took 47.00 ms.
   ```
   If the asynchronous function fails (i.e., rejects), then the output would be:
   ```
   Async function library.myAsyncFunction failed after 47.00 ms with error: Error: Something went wrong
   ```

**Iterator `next` Call:**
   Every time the `next` method of an iterator is called, the console would log:
   ```
   Iterator next took 2.00 ms.
   ```

**Function Throwing an Error:**
   If a profiled function throws an error, you would see:
   ```
   Function library.myFaultyFunction failed after 10.00 ms with error: Error: I always throw
   ```

**Profiling a Nested Function:**
   When profiling an object with nested functions, the output will show the path to the nested function:
   ```
   Function library.myObject.myNestedFunction took 5.00 ms.
   ```

### 🪵 Real-world Output

See `assets/write_log.txt`

```
Function library.dwn.agent.dwnManager._agent.didManager._agent.didResolver.cache.get took 0.00 ms.
Function library.dwn.agent.dwnManager.agent.didManager._agent.didResolver.cache.get took 0.15 ms.
Function library.dwn.agent.dwnManager._agent.didManager.agent.didResolver.cache.get took 0.21 ms.
Function library.dwn.agent.dwnManager.agent.didManager.agent.didResolver.cache.get took 0.26 ms.
Function library.dwn.agent.dwnManager._agent.didManager._agent.didResolver.cache.set took 0.00 ms.
Function library.dwn.agent.dwnManager.agent.didManager._agent.didResolver.cache.set took 0.13 ms.
Function library.dwn.agent.dwnManager._agent.didManager.agent.didResolver.cache.set took 0.20 ms.
Function library.dwn.agent.dwnManager.agent.didManager.agent.didResolver.cache.set took 0.25 ms.
Async function library.dwn.agent.dwnManager._agent.didManager._agent.didResolver.resolve took 0.47 ms.
Async function library.dwn.agent.dwnManager.agent.didManager._agent.didResolver.resolve took 0.48 ms.
Async function library.dwn.agent.dwnManager._agent.didManager.agent.didResolver.resolve took 0.48 ms.
Async function library.dwn.agent.dwnManager.agent.didManager.agent.didResolver.resolve took 0.48 ms.
Function library.dwn.agent.dwnManager._agent.didManager.getMethod took 0.01 ms.
Function library.dwn.agent.dwnManager.agent.didManager.getMethod took 0.07 ms.
Async function library.dwn.agent.dwnManager._agent.didManager.getDefaultSigningKey took 0.55 ms.
Async function library.dwn.agent.dwnManager.agent.didManager.getDefaultSigningKey took 0.55 ms.
Async function library.dwn.agent.dwnManager.getAuthorSigningKeyId took 0.59 ms.
Async function library.dwn.agent.dwnManager._agent.keyManager._store.getAuthor took 0.01 ms.
Async function library.dwn.agent.dwnManager.agent.keyManager._store.getAuthor took 0.02 ms.
Function library.dwn.agent.dwnManager._agent.keyManager._agent.dwnManager._agent.didManager._agent.didResolver.cache.get took 0.00 ms.
Function library.dwn.agent.dwnManager.agent.keyManager._agent.dwnManager._agent.didManager._agent.didResolver.cache.get took 0.06 ms.
....
```


The times (in milliseconds) are examples and will vary based on the actual execution time of the function. The profiler logs are formatted to two decimal places for precision and readability.

#### 🔄 Note on Profiling Iterators

For iterators, the `next` method is wrapped only once to avoid excessive performance overhead. It logs the time taken for each iteration. ⏲️

#### ⚠️ Potential Error Prevention

`RangeError: Maximum call stack size exceeded` error typically occurs when there is an uncontrolled recursion or a circular reference. This module implements checks to prevent profiling already profiled objects, which should mitigate such issues when using iterators or recursive functions.

### 📊 Log Aggregation

After running your JavaScript code with the profiling proxy enabled, you can aggregate and analyze the logged performance data using a Python script. The provided script `aggregate_log.py` reads the execution logs and outputs a summary of the total execution time and call count for each profiled function or method.

#### 📝 Requirements for Aggregation Script

- **Python:** Ensure you have Python installed on your machine. The script is compatible with Python 3.x.
- **Log File:** The script expects a log file generated by the profiling proxy. This file should contain lines logged by `console.log()` or `console.error()` calls in the format used by the profiler.

#### 🏃‍♀️ Running the Aggregation Script

1. **Save Logs to a File:**
   Direct the console output from your browser or Node.js to a text file. For example, in a UNIX-like terminal, you might use `node myScript.js > logs.txt` to run your script and save the logs.

2. **Run the Script:**
   Use the command line to run the Python script with the path to the log file as an argument. Replace `<path_to_log_file>` with the actual path to your log file:

   ```bash
   python aggregate_log.py <path_to_log_file>
   ```

   If successful, the script will print a markdown-formatted table to the console, summarizing the total calls and execution time for each profiled function or method.

#### 📤 Script Output

The `aggregate_log.py` script prints the aggregated data in a table format. Here's an example of what the output might look like:

```
| Function/Method | Total Calls | Total Execution Time (ms) |
| --- | --- | --- |
| library.myFunction | 3 | 150.75 |
| library.myAsyncFunction | 2 | 312.60 |
```

#### 📤 Real-world Output

See `assets/write_aggregated_log.txt`

```
| Function/Method | Total Calls | Total Execution Time (ms) |
| --- | --- | --- |
| next | 1710 | 2856.950000000003 |
| library.dwn.agent.dwnManager.agent.keyManager.agent.dwnManager._dwn.methodHandlers.RecordsQuery.messageStore.index.db.db.keyEncoding.decode | 556 | 417.7499999999996 |
| library.dwn.agent.dwnManager._agent.keyManager.agent.dwnManager._dwn.methodHandlers.RecordsQuery.messageStore.index.db.db.keyEncoding.decode | 556 | 387.59000000000066 |
| library.dwn.agent.dwnManager.agent.keyManager._agent.dwnManager._dwn.methodHandlers.RecordsQuery.messageStore.index.db.db.keyEncoding.decode | 556 | 358.52000000000027 |
| library.dwn.agent.dwnManager.agent.keyManager.agent.dwnManager._dwn.methodHandlers.RecordsQuery.messageStore.index.db.db.valueEncoding.decode | 556 | 357.94999999999965 |
| library.dwn.agent.dwnManager._agent.keyManager.agent.dwnManager._dwn.methodHandlers.RecordsQuery.messageStore.index.db.db.valueEncoding.decode | 556 | 325.91000000000014 |
| library.dwn.agent.dwnManager._agent.keyManager._agent.dwnManager._dwn.methodHandlers.RecordsQuery.messageStore.index.db.db.keyEncoding.decode | 556 | 322.85999999999893 |
| library.dwn.agent.dwnManager.agent.keyManager._agent.dwnManager._dwn.methodHandlers.RecordsQuery.messageStore.index.db.db.valueEncoding.decode | 556 | 292.78999999999996 |
| library.dwn.agent.dwnManager._agent.keyManager._agent.dwnManager._dwn.methodHandlers.RecordsQuery.messageStore.index.db.db.valueEncoding.decode | 556 | 258.2699999999995 |
| library.dwn.agent.dwnManager.agent.keyManager.agent.dwnManager._dwn.methodHandlers.RecordsQuery.messageStore.index.db.db._db.newIterator.valid | 1144 | 243.2599999999978 |
| library.dwn.agent.dwnManager.agent.keyManager.agent.dwnManager._dwn.methodHandlers.RecordsQuery.messageStore.blockstore.db.db.sublevel.get | 16 | 230.73000000000005 |
| library.dwn.agent.dwnManager._agent.keyManager.agent.dwnManager._dwn.methodHandlers.RecordsQuery.messageStore.blockstore.db.db.sublevel.get | 16 | 230.66 |
```
Each row represents a profiled function, showing how many times it was called and the total time spent executing it.

### 🌎  Real-world Usage
1. Wrap your code: `const profiledMyLibrary = createProfilingProxy(myLibrary);`
2. `./run-your-startup-script > log.txt`
3. `python aggregate_log.py log.txt > aggregated_log.md`
4. `open aggregated_log.md`

#### 🚨 Troubleshooting Script Errors

If you encounter errors while running the script, ensure that:
- The log file path is correct and the file exists.
- Your Python environment is correctly set up.
- The log file format matches the expected pattern used by the script.

####  🤝 Contribution

The aggregation script is part of the open-source effort. If you have improvements or encounter issues with the script, please contribute by opening an issue or pull request on GitHub, just as with the JavaScript module.

#### 🤔 TODO

- rewrite the aggregating Pyhton script to JS
- trigger automatic aggregation when the profiler reaches the end of the call stack
- pretty-print and open the full call stack log and aggregation log in your default browser

---

**Start profiling and get insights into your function performance now!** 🚀