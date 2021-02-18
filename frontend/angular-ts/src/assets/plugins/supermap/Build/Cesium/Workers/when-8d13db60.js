/**
 * Cesium - https://github.com/AnalyticalGraphicsInc/cesium
 *
 * Copyright 2011-2017 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/AnalyticalGraphicsInc/cesium/blob/master/LICENSE.md for full licensing details.
 */
define(['exports'], function (exports) { 'use strict';

    /**
         * @exports defined
         *
         * @param {*} value The object.
         * @returns {Boolean} Returns true if the object is defined, returns false otherwise.
         *
         * @example
         * if (Cesium.defined(positions)) {
         *      doSomething();
         * } else {
         *      doSomethingElse();
         * }
         */
        function defined(value) {
            return value !== undefined && value !== null;
        }

    /**
         * Returns the first parameter if not undefined, otherwise the second parameter.
         * Useful for setting a default value for a parameter.
         *
         * @exports defaultValue
         *
         * @param {*} a
         * @param {*} b
         * @returns {*} Returns the first parameter if not undefined, otherwise the second parameter.
         *
         * @example
         * param = Cesium.defaultValue(param, 'default');
         */
        function defaultValue(a, b) {
            if (a !== undefined && a !== null) {
                return a;
            }
            return b;
        }

        /**
         * A frozen empty object that can be used as the default value for options passed as
         * an object literal.
         * @type {Object}
         */
        defaultValue.EMPTY_OBJECT = Object.freeze({});

    /**
      @license
      when.js - https://github.com/cujojs/when

      MIT License (c) copyright B Cavalier & J Hann

     * A lightweight CommonJS Promises/A and when() implementation
     * when is part of the cujo.js family of libraries (http://cujojs.com/)
     *
     * Licensed under the MIT License at:
     * http://www.opensource.org/licenses/mit-license.php
     *
     * @version 1.7.1
     */

    	var reduceArray, slice, undef;

    	//
    	// Public API
    	//

    	when.defer     = defer;     // Create a deferred
    	when.resolve   = resolve;   // Create a resolved promise
    	when.reject    = reject;    // Create a rejected promise

    	when.join      = join;      // Join 2 or more promises

    	when.all       = all;       // Resolve a list of promises
    	when.map       = map;       // Array.map() for promises
    	when.reduce    = reduce;    // Array.reduce() for promises

    	when.any       = any;       // One-winner race
    	when.some      = some;      // Multi-winner race

    	when.allSettled = allSettled; // Resolve a list of promises no reject

    	when.chain     = chain;     // Make a promise trigger another resolver

    	when.isPromise = isPromise; // Determine if a thing is a promise

    	/**
    	 * Register an observer for a promise or immediate value.
    	 *
    	 * @param {*} promiseOrValue
    	 * @param {function?} [onFulfilled] callback to be called when promiseOrValue is
    	 *   successfully fulfilled.  If promiseOrValue is an immediate value, callback
    	 *   will be invoked immediately.
    	 * @param {function?} [onRejected] callback to be called when promiseOrValue is
    	 *   rejected.
    	 * @param {function?} [onProgress] callback to be called when progress updates
    	 *   are issued for promiseOrValue.
    	 * @returns {Promise} a new {@link Promise} that will complete with the return
    	 *   value of callback or errback or the completion value of promiseOrValue if
    	 *   callback and/or errback is not supplied.
    	 */
    	function when(promiseOrValue, onFulfilled, onRejected, onProgress) {
    		// Get a trusted promise for the input promiseOrValue, and then
    		// register promise handlers
    		return resolve(promiseOrValue).then(onFulfilled, onRejected, onProgress);
    	}

    	/**
    	 * Returns promiseOrValue if promiseOrValue is a {@link Promise}, a new Promise if
    	 * promiseOrValue is a foreign promise, or a new, already-fulfilled {@link Promise}
    	 * whose value is promiseOrValue if promiseOrValue is an immediate value.
    	 *
    	 * @param {*} promiseOrValue
    	 * @returns Guaranteed to return a trusted Promise.  If promiseOrValue is a when.js {@link Promise}
    	 *   returns promiseOrValue, otherwise, returns a new, already-resolved, when.js {@link Promise}
    	 *   whose resolution value is:
    	 *   * the resolution value of promiseOrValue if it's a foreign promise, or
    	 *   * promiseOrValue if it's a value
    	 */
    	function resolve(promiseOrValue) {
    		var promise, deferred;

    		if(promiseOrValue instanceof Promise) {
    			// It's a when.js promise, so we trust it
    			promise = promiseOrValue;

    		} else {
    			// It's not a when.js promise. See if it's a foreign promise or a value.
    			if(isPromise(promiseOrValue)) {
    				// It's a thenable, but we don't know where it came from, so don't trust
    				// its implementation entirely.  Introduce a trusted middleman when.js promise
    				deferred = defer();

    				// IMPORTANT: This is the only place when.js should ever call .then() on an
    				// untrusted promise. Don't expose the return value to the untrusted promise
    				promiseOrValue.then(
    					function(value)  { deferred.resolve(value); },
    					function(reason) { deferred.reject(reason); },
    					function(update) { deferred.progress(update); }
    				);

    				promise = deferred.promise;

    			} else {
    				// It's a value, not a promise.  Create a resolved promise for it.
    				promise = fulfilled(promiseOrValue);
    			}
    		}

    		return promise;
    	}

    	/**
    	 * Returns a rejected promise for the supplied promiseOrValue.  The returned
    	 * promise will be rejected with:
    	 * - promiseOrValue, if it is a value, or
    	 * - if promiseOrValue is a promise
    	 *   - promiseOrValue's value after it is fulfilled
    	 *   - promiseOrValue's reason after it is rejected
    	 * @param {*} promiseOrValue the rejected value of the returned {@link Promise}
    	 * @returns {Promise} rejected {@link Promise}
    	 */
    	function reject(promiseOrValue) {
    		return when(promiseOrValue, rejected);
    	}

    	/**
    	 * Trusted Promise constructor.  A Promise created from this constructor is
    	 * a trusted when.js promise.  Any other duck-typed promise is considered
    	 * untrusted.
    	 * @constructor
    	 * @name Promise
    	 */
    	function Promise(then) {
    		this.then = then;
    	}

    	Promise.prototype = {
    		/**
    		 * Register a callback that will be called when a promise is
    		 * fulfilled or rejected.  Optionally also register a progress handler.
    		 * Shortcut for .then(onFulfilledOrRejected, onFulfilledOrRejected, onProgress)
    		 * @param {function?} [onFulfilledOrRejected]
    		 * @param {function?} [onProgress]
    		 * @returns {Promise}
    		 */
    		always: function(onFulfilledOrRejected, onProgress) {
    			return this.then(onFulfilledOrRejected, onFulfilledOrRejected, onProgress);
    		},

    		/**
    		 * Register a rejection handler.  Shortcut for .then(undefined, onRejected)
    		 * @param {function?} onRejected
    		 * @returns {Promise}
    		 */
    		otherwise: function(onRejected) {
    			return this.then(undef, onRejected);
    		},

    		/**
    		 * Shortcut for .then(function() { return value; })
    		 * @param  {*} value
    		 * @returns {Promise} a promise that:
    		 *  - is fulfilled if value is not a promise, or
    		 *  - if value is a promise, will fulfill with its value, or reject
    		 *    with its reason.
    		 */
    		yield: function(value) {
    			return this.then(function() {
    				return value;
    			});
    		},

    		/**
    		 * Assumes that this promise will fulfill with an array, and arranges
    		 * for the onFulfilled to be called with the array as its argument list
    		 * i.e. onFulfilled.spread(undefined, array).
    		 * @param {function} onFulfilled function to receive spread arguments
    		 * @returns {Promise}
    		 */
    		spread: function(onFulfilled) {
    			return this.then(function(array) {
    				// array may contain promises, so resolve its contents.
    				return all(array, function(array) {
    					return onFulfilled.apply(undef, array);
    				});
    			});
    		}
    	};

    	/**
    	 * Create an already-resolved promise for the supplied value
    	 * @private
    	 *
    	 * @param {*} value
    	 * @returns {Promise} fulfilled promise
    	 */
    	function fulfilled(value) {
    		var p = new Promise(function(onFulfilled) {
    			// TODO: Promises/A+ check typeof onFulfilled
    			try {
    				return resolve(onFulfilled ? onFulfilled(value) : value);
    			} catch(e) {
    				return rejected(e);
    			}
    		});

    		return p;
    	}

    	/**
    	 * Create an already-rejected {@link Promise} with the supplied
    	 * rejection reason.
    	 * @private
    	 *
    	 * @param {*} reason
    	 * @returns {Promise} rejected promise
    	 */
    	function rejected(reason) {
    		var p = new Promise(function(_, onRejected) {
    			// TODO: Promises/A+ check typeof onRejected
    			try {
    				return onRejected ? resolve(onRejected(reason)) : rejected(reason);
    			} catch(e) {
    				return rejected(e);
    			}
    		});

    		return p;
    	}

    	/**
    	 * Creates a new, Deferred with fully isolated resolver and promise parts,
    	 * either or both of which may be given out safely to consumers.
    	 * The Deferred itself has the full API: resolve, reject, progress, and
    	 * then. The resolver has resolve, reject, and progress.  The promise
    	 * only has then.
    	 *
    	 * @returns {Deferred}
    	 */
    	function defer() {
    		var deferred, promise, handlers, progressHandlers,
    			_then, _progress, _resolve;

    		/**
    		 * The promise for the new deferred
    		 * @type {Promise}
    		 */
    		promise = new Promise(then);

    		/**
    		 * The full Deferred object, with {@link Promise} and {@link Resolver} parts
    		 * @class Deferred
    		 * @name Deferred
    		 */
    		deferred = {
    			then:     then, // DEPRECATED: use deferred.promise.then
    			resolve:  promiseResolve,
    			reject:   promiseReject,
    			// TODO: Consider renaming progress() to notify()
    			progress: promiseProgress,

    			promise:  promise,

    			resolver: {
    				resolve:  promiseResolve,
    				reject:   promiseReject,
    				progress: promiseProgress
    			}
    		};

    		handlers = [];
    		progressHandlers = [];

    		/**
    		 * Pre-resolution then() that adds the supplied callback, errback, and progback
    		 * functions to the registered listeners
    		 * @private
    		 *
    		 * @param {function?} [onFulfilled] resolution handler
    		 * @param {function?} [onRejected] rejection handler
    		 * @param {function?} [onProgress] progress handler
    		 */
    		_then = function(onFulfilled, onRejected, onProgress) {
    			// TODO: Promises/A+ check typeof onFulfilled, onRejected, onProgress
    			var deferred, progressHandler;

    			deferred = defer();

    			progressHandler = typeof onProgress === 'function'
    				? function(update) {
    					try {
    						// Allow progress handler to transform progress event
    						deferred.progress(onProgress(update));
    					} catch(e) {
    						// Use caught value as progress
    						deferred.progress(e);
    					}
    				}
    				: function(update) { deferred.progress(update); };

    			handlers.push(function(promise) {
    				promise.then(onFulfilled, onRejected)
    					.then(deferred.resolve, deferred.reject, progressHandler);
    			});

    			progressHandlers.push(progressHandler);

    			return deferred.promise;
    		};

    		/**
    		 * Issue a progress event, notifying all progress listeners
    		 * @private
    		 * @param {*} update progress event payload to pass to all listeners
    		 */
    		_progress = function(update) {
    			processQueue(progressHandlers, update);
    			return update;
    		};

    		/**
    		 * Transition from pre-resolution state to post-resolution state, notifying
    		 * all listeners of the resolution or rejection
    		 * @private
    		 * @param {*} value the value of this deferred
    		 */
    		_resolve = function(value) {
    			value = resolve(value);

    			// Replace _then with one that directly notifies with the result.
    			_then = value.then;
    			// Replace _resolve so that this Deferred can only be resolved once
    			_resolve = resolve;
    			// Make _progress a noop, to disallow progress for the resolved promise.
    			_progress = noop;

    			// Notify handlers
    			processQueue(handlers, value);

    			// Free progressHandlers array since we'll never issue progress events
    			progressHandlers = handlers = undef;

    			return value;
    		};

    		return deferred;

    		/**
    		 * Wrapper to allow _then to be replaced safely
    		 * @param {function?} [onFulfilled] resolution handler
    		 * @param {function?} [onRejected] rejection handler
    		 * @param {function?} [onProgress] progress handler
    		 * @returns {Promise} new promise
    		 */
    		function then(onFulfilled, onRejected, onProgress) {
    			// TODO: Promises/A+ check typeof onFulfilled, onRejected, onProgress
    			return _then(onFulfilled, onRejected, onProgress);
    		}

    		/**
    		 * Wrapper to allow _resolve to be replaced
    		 */
    		function promiseResolve(val) {
    			return _resolve(val);
    		}

    		/**
    		 * Wrapper to allow _reject to be replaced
    		 */
    		function promiseReject(err) {
    			return _resolve(rejected(err));
    		}

    		/**
    		 * Wrapper to allow _progress to be replaced
    		 */
    		function promiseProgress(update) {
    			return _progress(update);
    		}
    	}

    	/**
    	 * Determines if promiseOrValue is a promise or not.  Uses the feature
    	 * test from http://wiki.commonjs.org/wiki/Promises/A to determine if
    	 * promiseOrValue is a promise.
    	 *
    	 * @param {*} promiseOrValue anything
    	 * @returns {boolean} true if promiseOrValue is a {@link Promise}
    	 */
    	function isPromise(promiseOrValue) {
    		return promiseOrValue && typeof promiseOrValue.then === 'function';
    	}

    	/**
    	 * Initiates a competitive race, returning a promise that will resolve when
    	 * howMany of the supplied promisesOrValues have resolved, or will reject when
    	 * it becomes impossible for howMany to resolve, for example, when
    	 * (promisesOrValues.length - howMany) + 1 input promises reject.
    	 *
    	 * @param {Array} promisesOrValues array of anything, may contain a mix
    	 *      of promises and values
    	 * @param howMany {number} number of promisesOrValues to resolve
    	 * @param {function?} [onFulfilled] resolution handler
    	 * @param {function?} [onRejected] rejection handler
    	 * @param {function?} [onProgress] progress handler
    	 * @returns {Promise} promise that will resolve to an array of howMany values that
    	 * resolved first, or will reject with an array of (promisesOrValues.length - howMany) + 1
    	 * rejection reasons.
    	 */
    	function some(promisesOrValues, howMany, onFulfilled, onRejected, onProgress) {

    		checkCallbacks(2, arguments);

    		return when(promisesOrValues, function(promisesOrValues) {

    			var toResolve, toReject, values, reasons, deferred, fulfillOne, rejectOne, progress, len, i;

    			len = promisesOrValues.length >>> 0;

    			toResolve = Math.max(0, Math.min(howMany, len));
    			values = [];

    			toReject = (len - toResolve) + 1;
    			reasons = [];

    			deferred = defer();

    			// No items in the input, resolve immediately
    			if (!toResolve) {
    				deferred.resolve(values);

    			} else {
    				progress = deferred.progress;

    				rejectOne = function(reason) {
    					reasons.push(reason);
    					if(!--toReject) {
    						fulfillOne = rejectOne = noop;
    						deferred.reject(reasons);
    					}
    				};

    				fulfillOne = function(val) {
    					// This orders the values based on promise resolution order
    					// Another strategy would be to use the original position of
    					// the corresponding promise.
    					values.push(val);

    					if (!--toResolve) {
    						fulfillOne = rejectOne = noop;
    						deferred.resolve(values);
    					}
    				};

    				for(i = 0; i < len; ++i) {
    					if(i in promisesOrValues) {
    						when(promisesOrValues[i], fulfiller, rejecter, progress);
    					}
    				}
    			}

    			return deferred.then(onFulfilled, onRejected, onProgress);

    			function rejecter(reason) {
    				rejectOne(reason);
    			}

    			function fulfiller(val) {
    				fulfillOne(val);
    			}

    		});
    	}


    function allSettled(promisesOrValues, onFulfilled, onRejected, onProgress) {

        checkCallbacks(1, arguments);

        return when(promisesOrValues, function(promisesOrValues) {

            var values, reasons, deferred, fulfillOne, rejectOne, progress, len, dealLen, i;

            len = promisesOrValues.length >>> 0;

            dealLen = promisesOrValues.length >>> 0;


            values = [];

            reasons = [];

            deferred = defer();

            progress = deferred.progress;

            rejectOne = function(reason) {
                reasons.push(reason);

                if(!--dealLen) {
                    fulfillOne = rejectOne = noop;
                    deferred.resolve(values);
                }
            };

            fulfillOne = function(val, index) {
                // This orders the values based on promise resolution order
                // Another strategy would be to use the original position of
                // the corresponding promise.

                values[index] = val;

                if(!--dealLen) {
                    fulfillOne = rejectOne = noop;
                    deferred.resolve(values);
                }
            };

            for(i = 0; i < len; ++i) {

                switch (i) {
                    case 0:
                        when(promisesOrValues[i], fulfiller0, rejecter, progress);
                        break;
                    case 1:
                        when(promisesOrValues[i], fulfiller1, rejecter, progress);
                        break;
                    case 2:
                        when(promisesOrValues[i], fulfiller2, rejecter, progress);
                        break;
                    case 3:
                        when(promisesOrValues[i], fulfiller3, rejecter, progress);
                        break;
                    case 4:
                        when(promisesOrValues[i], fulfiller4, rejecter, progress);
                        break;
                    default:
                        when(promisesOrValues[i], fulfiller, rejecter, progress);
                        break;
                }
            }


            return deferred.then(onFulfilled, onRejected, onProgress);

            function rejecter(reason) {
                rejectOne(reason);
            }

            function fulfiller(val) {
                fulfillOne(val,0);
            }

            function fulfiller0(val) {
                fulfillOne(val,0);
            }

            function fulfiller1(val) {
                fulfillOne(val,1);
            }

            function fulfiller2(val) {
                fulfillOne(val,2);
            }

            function fulfiller3(val) {
                fulfillOne(val,3);
            }

            function fulfiller4(val) {
                fulfillOne(val,4);
            }

        });
    }

    	/**
    	 * Initiates a competitive race, returning a promise that will resolve when
    	 * any one of the supplied promisesOrValues has resolved or will reject when
    	 * *all* promisesOrValues have rejected.
    	 *
    	 * @param {Array|Promise} promisesOrValues array of anything, may contain a mix
    	 *      of {@link Promise}s and values
    	 * @param {function?} [onFulfilled] resolution handler
    	 * @param {function?} [onRejected] rejection handler
    	 * @param {function?} [onProgress] progress handler
    	 * @returns {Promise} promise that will resolve to the value that resolved first, or
    	 * will reject with an array of all rejected inputs.
    	 */
    	function any(promisesOrValues, onFulfilled, onRejected, onProgress) {

    		function unwrapSingleResult(val) {
    			return onFulfilled ? onFulfilled(val[0]) : val[0];
    		}

    		return some(promisesOrValues, 1, unwrapSingleResult, onRejected, onProgress);
    	}

    	/**
    	 * Return a promise that will resolve only once all the supplied promisesOrValues
    	 * have resolved. The resolution value of the returned promise will be an array
    	 * containing the resolution values of each of the promisesOrValues.
    	 * @memberOf when
    	 *
    	 * @param {Array|Promise} promisesOrValues array of anything, may contain a mix
    	 *      of {@link Promise}s and values
    	 * @param {function?} [onFulfilled] resolution handler
    	 * @param {function?} [onRejected] rejection handler
    	 * @param {function?} [onProgress] progress handler
    	 * @returns {Promise}
    	 */
    	function all(promisesOrValues, onFulfilled, onRejected, onProgress) {
    		checkCallbacks(1, arguments);
    		return map(promisesOrValues, identity).then(onFulfilled, onRejected, onProgress);
    	}

    	/**
    	 * Joins multiple promises into a single returned promise.
    	 * @returns {Promise} a promise that will fulfill when *all* the input promises
    	 * have fulfilled, or will reject when *any one* of the input promises rejects.
    	 */
    	function join(/* ...promises */) {
    		return map(arguments, identity);
    	}

    	/**
    	 * Traditional map function, similar to `Array.prototype.map()`, but allows
    	 * input to contain {@link Promise}s and/or values, and mapFunc may return
    	 * either a value or a {@link Promise}
    	 *
    	 * @param {Array|Promise} promise array of anything, may contain a mix
    	 *      of {@link Promise}s and values
    	 * @param {function} mapFunc mapping function mapFunc(value) which may return
    	 *      either a {@link Promise} or value
    	 * @returns {Promise} a {@link Promise} that will resolve to an array containing
    	 *      the mapped output values.
    	 */
    	function map(promise, mapFunc) {
    		return when(promise, function(array) {
    			var results, len, toResolve, resolve, i, d;

    			// Since we know the resulting length, we can preallocate the results
    			// array to avoid array expansions.
    			toResolve = len = array.length >>> 0;
    			results = [];
    			d = defer();

    			if(!toResolve) {
    				d.resolve(results);
    			} else {

    				resolve = function resolveOne(item, i) {
    					when(item, mapFunc).then(function(mapped) {
    						results[i] = mapped;

    						if(!--toResolve) {
    							d.resolve(results);
    						}
    					}, d.reject);
    				};

    				// Since mapFunc may be async, get all invocations of it into flight
    				for(i = 0; i < len; i++) {
    					if(i in array) {
    						resolve(array[i], i);
    					} else {
    						--toResolve;
    					}
    				}

    			}

    			return d.promise;

    		});
    	}

    	/**
    	 * Traditional reduce function, similar to `Array.prototype.reduce()`, but
    	 * input may contain promises and/or values, and reduceFunc
    	 * may return either a value or a promise, *and* initialValue may
    	 * be a promise for the starting value.
    	 *
    	 * @param {Array|Promise} promise array or promise for an array of anything,
    	 *      may contain a mix of promises and values.
    	 * @param {function} reduceFunc reduce function reduce(currentValue, nextValue, index, total),
    	 *      where total is the total number of items being reduced, and will be the same
    	 *      in each call to reduceFunc.
    	 * @returns {Promise} that will resolve to the final reduced value
    	 */
    	function reduce(promise, reduceFunc /*, initialValue */) {
    		var args = slice.call(arguments, 1);

    		return when(promise, function(array) {
    			var total;

    			total = array.length;

    			// Wrap the supplied reduceFunc with one that handles promises and then
    			// delegates to the supplied.
    			args[0] = function (current, val, i) {
    				return when(current, function (c) {
    					return when(val, function (value) {
    						return reduceFunc(c, value, i, total);
    					});
    				});
    			};

    			return reduceArray.apply(array, args);
    		});
    	}

    	/**
    	 * Ensure that resolution of promiseOrValue will trigger resolver with the
    	 * value or reason of promiseOrValue, or instead with resolveValue if it is provided.
    	 *
    	 * @param promiseOrValue
    	 * @param {Object} resolver
    	 * @param {function} resolver.resolve
    	 * @param {function} resolver.reject
    	 * @param {*} [resolveValue]
    	 * @returns {Promise}
    	 */
    	function chain(promiseOrValue, resolver, resolveValue) {
    		var useResolveValue = arguments.length > 2;

    		return when(promiseOrValue,
    			function(val) {
    				val = useResolveValue ? resolveValue : val;
    				resolver.resolve(val);
    				return val;
    			},
    			function(reason) {
    				resolver.reject(reason);
    				return rejected(reason);
    			},
    			resolver.progress
    		);
    	}

    	//
    	// Utility functions
    	//

    	/**
    	 * Apply all functions in queue to value
    	 * @param {Array} queue array of functions to execute
    	 * @param {*} value argument passed to each function
    	 */
    	function processQueue(queue, value) {
    		var handler, i = 0;

    		while (handler = queue[i++]) {
    			handler(value);
    		}
    	}

    	/**
    	 * Helper that checks arrayOfCallbacks to ensure that each element is either
    	 * a function, or null or undefined.
    	 * @private
    	 * @param {number} start index at which to start checking items in arrayOfCallbacks
    	 * @param {Array} arrayOfCallbacks array to check
    	 * @throws {Error} if any element of arrayOfCallbacks is something other than
    	 * a functions, null, or undefined.
    	 */
    	function checkCallbacks(start, arrayOfCallbacks) {
    		// TODO: Promises/A+ update type checking and docs
    		var arg, i = arrayOfCallbacks.length;

    		while(i > start) {
    			arg = arrayOfCallbacks[--i];

    			if (arg != null && typeof arg != 'function') {
    				throw new Error('arg '+i+' must be a function');
    			}
    		}
    	}

    	/**
    	 * No-Op function used in method replacement
    	 * @private
    	 */
    	function noop() {}

    	slice = [].slice;

    	// ES5 reduce implementation if native not available
    	// See: http://es5.github.com/#x15.4.4.21 as there are many
    	// specifics and edge cases.
    	reduceArray = [].reduce ||
    		function(reduceFunc /*, initialValue */) {
    			/*jshint maxcomplexity: 7*/

    			// ES5 dictates that reduce.length === 1

    			// This implementation deviates from ES5 spec in the following ways:
    			// 1. It does not check if reduceFunc is a Callable

    			var arr, args, reduced, len, i;

    			i = 0;
    			// This generates a jshint warning, despite being valid
    			// "Missing 'new' prefix when invoking a constructor."
    			// See https://github.com/jshint/jshint/issues/392
    			arr = Object(this);
    			len = arr.length >>> 0;
    			args = arguments;

    			// If no initialValue, use first item of array (we know length !== 0 here)
    			// and adjust i to start at second item
    			if(args.length <= 1) {
    				// Skip to the first real element in the array
    				for(;;) {
    					if(i in arr) {
    						reduced = arr[i++];
    						break;
    					}

    					// If we reached the end of the array without finding any real
    					// elements, it's a TypeError
    					if(++i >= len) {
    						throw new TypeError();
    					}
    				}
    			} else {
    				// If initialValue provided, use it
    				reduced = args[1];
    			}

    			// Do the actual reduce
    			for(;i < len; ++i) {
    				// Skip holes
    				if(i in arr) {
    					reduced = reduceFunc(reduced, arr[i], i, arr);
    				}
    			}

    			return reduced;
    		};

    	function identity(x) {
    		return x;
    	}

    exports.defaultValue = defaultValue;
    exports.defined = defined;
    exports.when = when;

});
