// Utility to check if a given value is a typed array
function isTypedArray(value) {
  return ArrayBuffer.isView(value) && !(value instanceof DataView);
}

// Utility to check if a value is an object
function isObject(value) {
  return typeof value === "object" && value !== null;
}

// Utility to check if a value is a function
function isFunction(value) {
  return typeof value === "function";
}

// Utility to check if a value is an instance of a native JS object
function isNativeObject(value) {
  // List of JavaScript's native object constructors
  const nativeObjects = [
    Promise,
    Map,
    Set,
    WeakMap,
    WeakSet,
    Date,
    RegExp,
    ArrayBuffer,
    Error,
  ];
  // Check if value is an instance of any native object
  return nativeObjects.some((nativeObject) => value instanceof nativeObject);
}

// Wraps a function to profile its execution time
function profileFunction(originalFunction, currentPath) {
  // Return a new function that wraps the original
  return function (...args) {
    const start = performance.now(); // Start the performance timer
    try {
      // Invoke the original function with the current context and arguments
      const result = originalFunction.apply(this, args);
      const end = performance.now(); // End the performance timer

      // If the original function returns a promise, handle it
      if (result instanceof Promise) {
        return result
          .then((res) => {
            // Log the time taken for async function upon resolution
            console.log(
              `Async function ${currentPath} took ${(end - start).toFixed(
                2
              )} ms.`
            );
            return res;
          })
          .catch((err) => {
            // Log any errors and the time taken for async function upon rejection
            console.error(
              `Async function ${currentPath} failed after ${(
                end - start
              ).toFixed(2)} ms with error: ${err}`
            );
            throw err;
          });
      }

      // Log the time taken for synchronous function execution
      console.log(
        `Function ${currentPath} took ${(end - start).toFixed(2)} ms.`
      );
      // If result is an object and not a native one, return its profiling proxy
      if (isObject(result) && !isNativeObject(result)) {
        return createProfilingProxy(result, currentPath);
      }
      return result; // Otherwise, return the result directly
    } catch (error) {
      const end = performance.now(); // End the performance timer
      // Log the error and time taken if the function throws
      console.error(
        `Function ${currentPath} failed after ${(end - start).toFixed(
          2
        )} ms with error: ${error}`
      );
      throw error; // Rethrow the error for external handling
    }
  };
}

// Creates a proxy to profile function or object method calls
export function createProfilingProxy(target, path = "library") {
  // Define the handler for the proxy
  const handler = {
    // Trap to intercept property access
    get(target, property, receiver) {
      // Special handling for iterator symbols
      if (property === Symbol.iterator || property === Symbol.asyncIterator) {
        const originalIterator = Reflect.get(target, property, receiver);
        if (isFunction(originalIterator)) {
          // Return a wrapped iterator
          return (...args) => {
            const iterator = originalIterator.apply(target, args);
            if (iterator && isFunction(iterator.next)) {
              const originalNext = iterator.next;
              // Only wrap the `next` method if not already profiled
              if (!iterator.__isProfiled) {
                iterator.next = function () {
                  const start = performance.now(); // Start timing the iteration
                  const result = originalNext.apply(this, arguments);
                  const end = performance.now(); // End timing the iteration
                  // Log the time taken for `next` method call
                  console.log(
                    `Iterator next took ${(end - start).toFixed(2)} ms.`
                  );
                  return result; // Return the iterator result
                };
                // Mark the iterator as profiled to prevent double-wrapping
                iterator.__isProfiled = true;
              }
              return iterator; // Return the potentially wrapped iterator
            }
            return iterator; // Return the original iterator if not a function
          };
        }
      }

      // Handle non-configurable and non-writable properties by defaulting to the original behavior
      const descriptor = Object.getOwnPropertyDescriptor(target, property);
      if (descriptor && !descriptor.configurable && !descriptor.writable) {
        return Reflect.get(target, property, receiver);
      }

      // Retrieve the property value
      const value = Reflect.get(target, property, receiver);
      // Skip profiling for typed arrays and iterators
      if (isTypedArray(value) || property === Symbol.iterator) {
        return value;
      }
      // If the property is a function, return a profiled version
      if (isFunction(value)) {
        return (...args) => {
          const currentPath = `${path}.${String(property)}`;
          return profileFunction(value, currentPath).apply(receiver, args);
        };
      }
      // If the property is an object and not a native object, return a proxy
      if (isObject(value) && !isNativeObject(value)) {
        return createProfilingProxy(value, `${path}.${String(property)}`);
      }
      return value; // Otherwise, return the property value directly
    },
    // other traps would go here...
  };

  // If the target is a function, return a profiled function
  if (isFunction(target)) {
    console.log(`Profiling function at ${path}`);
    return profileFunction(target, path);
  }

  // Otherwise, return a proxy to profile method calls on objects
  return new Proxy(target, handler);
}
