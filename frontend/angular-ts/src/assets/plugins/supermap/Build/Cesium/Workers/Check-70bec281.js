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
define(['exports', './when-8d13db60'], function (exports, when) { 'use strict';

    /**
         * Constructs an exception object that is thrown due to a developer error, e.g., invalid argument,
         * argument out of range, etc.  This exception should only be thrown during development;
         * it usually indicates a bug in the calling code.  This exception should never be
         * caught; instead the calling code should strive not to generate it.
         * <br /><br />
         * On the other hand, a {@link RuntimeError} indicates an exception that may
         * be thrown at runtime, e.g., out of memory, that the calling code should be prepared
         * to catch.
         *
         * @alias DeveloperError
         * @constructor
         * @extends Error
         *
         * @param {String} [message] The error message for this exception.
         *
         * @see RuntimeError
         */
        function DeveloperError(message) {
            /**
             * 'DeveloperError' indicating that this exception was thrown due to a developer error.
             * @type {String}
             * @readonly
             */
            this.name = 'DeveloperError';

            /**
             * The explanation for why this exception was thrown.
             * @type {String}
             * @readonly
             */
            this.message = message;

            //Browsers such as IE don't have a stack property until you actually throw the error.
            var stack;
            try {
                throw new Error();
            } catch (e) {
                stack = e.stack;
            }

            /**
             * The stack trace of this exception, if available.
             * @type {String}
             * @readonly
             */
            this.stack = stack;
        }

        if (when.defined(Object.create)) {
            DeveloperError.prototype = Object.create(Error.prototype);
            DeveloperError.prototype.constructor = DeveloperError;
        }

        DeveloperError.prototype.toString = function() {
            var str = this.name + ': ' + this.message;

            if (when.defined(this.stack)) {
                str += '\n' + this.stack.toString();
            }

            return str;
        };

        /**
         * @private
         */
        DeveloperError.throwInstantiationError = function() {
            throw new DeveloperError('This function defines an interface and should not be called directly.');
        };

    /**
         * Contains functions for checking that supplied arguments are of a specified type
         * or meet specified conditions
         * @private
         */
        var Check = {};

        /**
         * Contains type checking functions, all using the typeof operator
         */
        Check.typeOf = {};

        function getUndefinedErrorMessage(name) {
            return name + ' is required, actual value was undefined';
        }

        function getFailedTypeErrorMessage(actual, expected, name) {
            return 'Expected ' + name + ' to be typeof ' + expected + ', actual typeof was ' + actual;
        }

        /**
         * Throws if test is not defined
         *
         * @param {String} name The name of the variable being tested
         * @param {*} test The value that is to be checked
         * @exception {DeveloperError} test must be defined
         */
        Check.defined = function (name, test) {
            if (!when.defined(test)) {
                throw new DeveloperError(getUndefinedErrorMessage(name));
            }
        };

        /**
         * Throws if test is not typeof 'function'
         *
         * @param {String} name The name of the variable being tested
         * @param {*} test The value to test
         * @exception {DeveloperError} test must be typeof 'function'
         */
        Check.typeOf.func = function (name, test) {
            if (typeof test !== 'function') {
                throw new DeveloperError(getFailedTypeErrorMessage(typeof test, 'function', name));
            }
        };

        /**
         * Throws if test is not typeof 'string'
         *
         * @param {String} name The name of the variable being tested
         * @param {*} test The value to test
         * @exception {DeveloperError} test must be typeof 'string'
         */
        Check.typeOf.string = function (name, test) {
            if (typeof test !== 'string') {
                throw new DeveloperError(getFailedTypeErrorMessage(typeof test, 'string', name));
            }
        };

        /**
         * Throws if test is not typeof 'number'
         *
         * @param {String} name The name of the variable being tested
         * @param {*} test The value to test
         * @exception {DeveloperError} test must be typeof 'number'
         */
        Check.typeOf.number = function (name, test) {
            if (typeof test !== 'number') {
                throw new DeveloperError(getFailedTypeErrorMessage(typeof test, 'number', name));
            }
        };

        /**
         * Throws if test is not typeof 'number' and less than limit
         *
         * @param {String} name The name of the variable being tested
         * @param {*} test The value to test
         * @param {Number} limit The limit value to compare against
         * @exception {DeveloperError} test must be typeof 'number' and less than limit
         */
        Check.typeOf.number.lessThan = function (name, test, limit) {
            Check.typeOf.number(name, test);
            if (test >= limit) {
                throw new DeveloperError('Expected ' + name + ' to be less than ' + limit + ', actual value was ' + test);
            }
        };

        /**
         * Throws if test is not typeof 'number' and less than or equal to limit
         *
         * @param {String} name The name of the variable being tested
         * @param {*} test The value to test
         * @param {Number} limit The limit value to compare against
         * @exception {DeveloperError} test must be typeof 'number' and less than or equal to limit
         */
        Check.typeOf.number.lessThanOrEquals = function (name, test, limit) {
            Check.typeOf.number(name, test);
            if (test > limit) {
                throw new DeveloperError('Expected ' + name + ' to be less than or equal to ' + limit + ', actual value was ' + test);
            }
        };

        /**
         * Throws if test is not typeof 'number' and greater than limit
         *
         * @param {String} name The name of the variable being tested
         * @param {*} test The value to test
         * @param {Number} limit The limit value to compare against
         * @exception {DeveloperError} test must be typeof 'number' and greater than limit
         */
        Check.typeOf.number.greaterThan = function (name, test, limit) {
            Check.typeOf.number(name, test);
            if (test <= limit) {
                throw new DeveloperError('Expected ' + name + ' to be greater than ' + limit + ', actual value was ' + test);
            }
        };

        /**
         * Throws if test is not typeof 'number' and greater than or equal to limit
         *
         * @param {String} name The name of the variable being tested
         * @param {*} test The value to test
         * @param {Number} limit The limit value to compare against
         * @exception {DeveloperError} test must be typeof 'number' and greater than or equal to limit
         */
        Check.typeOf.number.greaterThanOrEquals = function (name, test, limit) {
            Check.typeOf.number(name, test);
            if (test < limit) {
                throw new DeveloperError('Expected ' + name + ' to be greater than or equal to' + limit + ', actual value was ' + test);
            }
        };

        /**
         * Throws if test is not typeof 'object'
         *
         * @param {String} name The name of the variable being tested
         * @param {*} test The value to test
         * @exception {DeveloperError} test must be typeof 'object'
         */
        Check.typeOf.object = function (name, test) {
            if (typeof test !== 'object') {
                throw new DeveloperError(getFailedTypeErrorMessage(typeof test, 'object', name));
            }
        };

        /**
         * Throws if test is not typeof 'boolean'
         *
         * @param {String} name The name of the variable being tested
         * @param {*} test The value to test
         * @exception {DeveloperError} test must be typeof 'boolean'
         */
        Check.typeOf.bool = function (name, test) {
            if (typeof test !== 'boolean') {
                throw new DeveloperError(getFailedTypeErrorMessage(typeof test, 'boolean', name));
            }
        };

        /**
         * Throws if test1 and test2 is not typeof 'number' and not equal in value
         *
         * @param {String} name1 The name of the first variable being tested
         * @param {String} name2 The name of the second variable being tested against
         * @param {*} test1 The value to test
         * @param {*} test2 The value to test against
         * @exception {DeveloperError} test1 and test2 should be type of 'number' and be equal in value
         */
        Check.typeOf.number.equals = function (name1, name2, test1, test2) {
            Check.typeOf.number(name1, test1);
            Check.typeOf.number(name2, test2);
            if (test1 !== test2) {
                throw new DeveloperError(name1 + ' must be equal to ' + name2 + ', the actual values are ' + test1 + ' and ' + test2);
            }
        };

    exports.Check = Check;
    exports.DeveloperError = DeveloperError;

});
