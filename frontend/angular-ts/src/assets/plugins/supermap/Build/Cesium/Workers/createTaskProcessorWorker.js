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
define(['./when-8d13db60'], function (when) { 'use strict';

    /**
         * Formats an error object into a String.  If available, uses name, message, and stack
         * properties, otherwise, falls back on toString().
         *
         * @exports formatError
         *
         * @param {*} object The item to find in the array.
         * @returns {String} A string containing the formatted error.
         */
        function formatError(object) {
            var result;

            var name = object.name;
            var message = object.message;
            if (when.defined(name) && when.defined(message)) {
                result = name + ': ' + message;
            } else {
                result = object.toString();
            }

            var stack = object.stack;
            if (when.defined(stack)) {
                result += '\n' + stack;
            }

            return result;
        }

    // createXXXGeometry functions may return Geometry or a Promise that resolves to Geometry
        // if the function requires access to ApproximateTerrainHeights.
        // For fully synchronous functions, just wrapping the function call in a `when` Promise doesn't
        // handle errors correctly, hence try-catch
        function callAndWrap(workerFunction, parameters, transferableObjects) {
            var resultOrPromise;
            try {
                resultOrPromise = workerFunction(parameters, transferableObjects);
                return resultOrPromise; // errors handled by Promise
            } catch (e) {
                return when.when.reject(e);
            }
        }

        /**
         * Creates an adapter function to allow a calculation function to operate as a Web Worker,
         * paired with TaskProcessor, to receive tasks and return results.
         *
         * @exports createTaskProcessorWorker
         *
         * @param {createTaskProcessorWorker~WorkerFunction} workerFunction The calculation function,
         *        which takes parameters and returns a result.
         * @returns {createTaskProcessorWorker~TaskProcessorWorkerFunction} A function that adapts the
         *          calculation function to work as a Web Worker onmessage listener with TaskProcessor.
         *
         *
         * @example
         * function doCalculation(parameters, transferableObjects) {
         *   // calculate some result using the inputs in parameters
         *   return result;
         * }
         *
         * return Cesium.createTaskProcessorWorker(doCalculation);
         * // the resulting function is compatible with TaskProcessor
         *
         * @see TaskProcessor
         * @see {@link http://www.w3.org/TR/workers/|Web Workers}
         * @see {@link http://www.w3.org/TR/html5/common-dom-interfaces.html#transferable-objects|Transferable objects}
         */
        function createTaskProcessorWorker(workerFunction) {
            var postMessage;

            return function(event) {
                var data = event.data;

                var transferableObjects = [];
                var responseMessage = {
                    id : data.id,
                    result : undefined,
                    error : undefined
                };

                return when.when(callAndWrap(workerFunction, data.parameters, transferableObjects))
                    .then(function(result) {
                        responseMessage.result = result;
                    })
                    .otherwise(function(e) {
                        if (e instanceof Error) {
                            // Errors can't be posted in a message, copy the properties
                            responseMessage.error = {
                                name : e.name,
                                message : e.message,
                                stack : e.stack
                            };
                        } else {
                            responseMessage.error = e;
                        }
                    })
                    .always(function() {
                        if (!when.defined(postMessage)) {
                            postMessage = when.defaultValue(self.webkitPostMessage, self.postMessage);
                        }

                        if (!data.canTransferArrayBuffer) {
                            transferableObjects.length = 0;
                        }

                        try {
                            postMessage(responseMessage, transferableObjects);
                        } catch (e) {
                            // something went wrong trying to post the message, post a simpler
                            // error that we can be sure will be cloneable
                            responseMessage.result = undefined;
                            responseMessage.error = 'postMessage failed with error: ' + formatError(e) + '\n  with responseMessage: ' + JSON.stringify(responseMessage);
                            postMessage(responseMessage);
                        }
                    });
            };
        }

    return createTaskProcessorWorker;

});
