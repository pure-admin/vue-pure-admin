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
define(['exports', './when-8d13db60', './Check-70bec281', './RuntimeError-ba10bc3e'], function (exports, when, Check, RuntimeError) { 'use strict';

	/**
	 * @license
	 *
	 * Grauw URI utilities
	 *
	 * See: http://hg.grauw.nl/grauw-lib/file/tip/src/uri.js
	 *
	 * @author Laurens Holst (http://www.grauw.nl/)
	 *
	 *   Copyright 2012 Laurens Holst
	 *
	 *   Licensed under the Apache License, Version 2.0 (the "License");
	 *   you may not use this file except in compliance with the License.
	 *   You may obtain a copy of the License at
	 *
	 *       http://www.apache.org/licenses/LICENSE-2.0
	 *
	 *   Unless required by applicable law or agreed to in writing, software
	 *   distributed under the License is distributed on an "AS IS" BASIS,
	 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 *   See the License for the specific language governing permissions and
	 *   limitations under the License.
	 *
	 */

		/**
		 * Constructs a URI object.
		 * @constructor
		 * @class Implementation of URI parsing and base URI resolving algorithm in RFC 3986.
		 * @param {string|URI} uri A string or URI object to create the object from.
		 */
		function URI(uri) {
			if (uri instanceof URI) {  // copy constructor
				this.scheme = uri.scheme;
				this.authority = uri.authority;
				this.path = uri.path;
				this.query = uri.query;
				this.fragment = uri.fragment;
			} else if (uri) {  // uri is URI string or cast to string
				var c = parseRegex.exec(uri);
				this.scheme = c[1];
				this.authority = c[2];
				this.path = c[3];
				this.query = c[4];
				this.fragment = c[5];
			}
		}
		// Initial values on the prototype
		URI.prototype.scheme    = null;
		URI.prototype.authority = null;
		URI.prototype.path      = '';
		URI.prototype.query     = null;
		URI.prototype.fragment  = null;

		// Regular expression from RFC 3986 appendix B
		var parseRegex = new RegExp('^(?:([^:/?#]+):)?(?://([^/?#]*))?([^?#]*)(?:\\?([^#]*))?(?:#(.*))?$');

		/**
		 * Returns the scheme part of the URI.
		 * In "http://example.com:80/a/b?x#y" this is "http".
		 */
		URI.prototype.getScheme = function() {
			return this.scheme;
		};

		/**
		 * Returns the authority part of the URI.
		 * In "http://example.com:80/a/b?x#y" this is "example.com:80".
		 */
		URI.prototype.getAuthority = function() {
			return this.authority;
		};

		/**
		 * Returns the path part of the URI.
		 * In "http://example.com:80/a/b?x#y" this is "/a/b".
		 * In "mailto:mike@example.com" this is "mike@example.com".
		 */
		URI.prototype.getPath = function() {
			return this.path;
		};

		/**
		 * Returns the query part of the URI.
		 * In "http://example.com:80/a/b?x#y" this is "x".
		 */
		URI.prototype.getQuery = function() {
			return this.query;
		};

		/**
		 * Returns the fragment part of the URI.
		 * In "http://example.com:80/a/b?x#y" this is "y".
		 */
		URI.prototype.getFragment = function() {
			return this.fragment;
		};

		/**
		 * Tests whether the URI is an absolute URI.
		 * See RFC 3986 section 4.3.
		 */
		URI.prototype.isAbsolute = function() {
			return !!this.scheme && !this.fragment;
		};

		///**
		//* Extensive validation of the URI against the ABNF in RFC 3986
		//*/
		//URI.prototype.validate

		/**
		 * Tests whether the URI is a same-document reference.
		 * See RFC 3986 section 4.4.
		 *
		 * To perform more thorough comparison, you can normalise the URI objects.
		 */
		URI.prototype.isSameDocumentAs = function(uri) {
			return uri.scheme == this.scheme &&
			    uri.authority == this.authority &&
			         uri.path == this.path &&
			        uri.query == this.query;
		};

		/**
		 * Simple String Comparison of two URIs.
		 * See RFC 3986 section 6.2.1.
		 *
		 * To perform more thorough comparison, you can normalise the URI objects.
		 */
		URI.prototype.equals = function(uri) {
			return this.isSameDocumentAs(uri) && uri.fragment == this.fragment;
		};

		/**
		 * Normalizes the URI using syntax-based normalization.
		 * This includes case normalization, percent-encoding normalization and path segment normalization.
		 * XXX: Percent-encoding normalization does not escape characters that need to be escaped.
		 *      (Although that would not be a valid URI in the first place. See validate().)
		 * See RFC 3986 section 6.2.2.
		 */
		URI.prototype.normalize = function() {
			this.removeDotSegments();
			if (this.scheme)
				this.scheme = this.scheme.toLowerCase();
			if (this.authority)
				this.authority = this.authority.replace(authorityRegex, replaceAuthority).
										replace(caseRegex, replaceCase);
			if (this.path)
				this.path = this.path.replace(caseRegex, replaceCase);
			if (this.query)
				this.query = this.query.replace(caseRegex, replaceCase);
			if (this.fragment)
				this.fragment = this.fragment.replace(caseRegex, replaceCase);
		};

		var caseRegex = /%[0-9a-z]{2}/gi;
		var percentRegex = /[a-zA-Z0-9\-\._~]/;
		var authorityRegex = /(.*@)?([^@:]*)(:.*)?/;

		function replaceCase(str) {
			var dec = unescape(str);
			return percentRegex.test(dec) ? dec : str.toUpperCase();
		}

		function replaceAuthority(str, p1, p2, p3) {
			return (p1 || '') + p2.toLowerCase() + (p3 || '');
		}

		/**
		 * Resolve a relative URI (this) against a base URI.
		 * The base URI must be an absolute URI.
		 * See RFC 3986 section 5.2
		 */
		URI.prototype.resolve = function(baseURI) {
			var uri = new URI();
			if (this.scheme) {
				uri.scheme = this.scheme;
				uri.authority = this.authority;
				uri.path = this.path;
				uri.query = this.query;
			} else {
				uri.scheme = baseURI.scheme;
				if (this.authority) {
					uri.authority = this.authority;
					uri.path = this.path;
					uri.query = this.query;
				} else {
					uri.authority = baseURI.authority;
					if (this.path == '') {
						uri.path = baseURI.path;
						uri.query = this.query || baseURI.query;
					} else {
						if (this.path.charAt(0) == '/') {
							uri.path = this.path;
							uri.removeDotSegments();
						} else {
							if (baseURI.authority && baseURI.path == '') {
								uri.path = '/' + this.path;
							} else {
								uri.path = baseURI.path.substring(0, baseURI.path.lastIndexOf('/') + 1) + this.path;
							}
							uri.removeDotSegments();
						}
						uri.query = this.query;
					}
				}
			}
			uri.fragment = this.fragment;
			return uri;
		};

		/**
		 * Remove dot segments from path.
		 * See RFC 3986 section 5.2.4
		 * @private
		 */
		URI.prototype.removeDotSegments = function() {
			var input = this.path.split('/'),
				output = [],
				segment,
				absPath = input[0] == '';
			if (absPath)
				input.shift();
			var sFirst = input[0] == '' ? input.shift() : null;
			while (input.length) {
				segment = input.shift();
				if (segment == '..') {
					output.pop();
				} else if (segment != '.') {
					output.push(segment);
				}
			}
			if (segment == '.' || segment == '..')
				output.push('');
			if (absPath)
				output.unshift('');
			this.path = output.join('/');
		};

		// We don't like this function because it builds up a cache that is never cleared.
	//	/**
	//	 * Resolves a relative URI against an absolute base URI.
	//	 * Convenience method.
	//	 * @param {String} uri the relative URI to resolve
	//	 * @param {String} baseURI the base URI (must be absolute) to resolve against
	//	 */
	//	URI.resolve = function(sURI, sBaseURI) {
	//		var uri = cache[sURI] || (cache[sURI] = new URI(sURI));
	//		var baseURI = cache[sBaseURI] || (cache[sBaseURI] = new URI(sBaseURI));
	//		return uri.resolve(baseURI).toString();
	//	};

	//	var cache = {};

		/**
		 * Serialises the URI to a string.
		 */
		URI.prototype.toString = function() {
			var result = '';
			if (this.scheme)
				result += this.scheme + ':';
			if (this.authority)
				result += '//' + this.authority;
			result += this.path;
			if (this.query)
				result += '?' + this.query;
			if (this.fragment)
				result += '#' + this.fragment;
			return result;
		};

	/**
	     * @private
	     */
	    function appendForwardSlash(url) {
	        if (url.length === 0 || url[url.length - 1] !== '/') {
	            url = url + '/';
	        }
	        return url;
	    }

	/**
	     * Clones an object, returning a new object containing the same properties.
	     *
	     * @exports clone
	     *
	     * @param {Object} object The object to clone.
	     * @param {Boolean} [deep=false] If true, all properties will be deep cloned recursively.
	     * @returns {Object} The cloned object.
	     */
	    function clone(object, deep) {
	        if (object === null || typeof object !== 'object') {
	            return object;
	        }

	        deep = when.defaultValue(deep, false);

	        var result = new object.constructor();
	        for ( var propertyName in object) {
	            if (object.hasOwnProperty(propertyName)) {
	                var value = object[propertyName];
	                if (deep) {
	                    value = clone(value, deep);
	                }
	                result[propertyName] = value;
	            }
	        }

	        return result;
	    }

	/**
	     * Merges two objects, copying their properties onto a new combined object. When two objects have the same
	     * property, the value of the property on the first object is used.  If either object is undefined,
	     * it will be treated as an empty object.
	     *
	     * @example
	     * var object1 = {
	     *     propOne : 1,
	     *     propTwo : {
	     *         value1 : 10
	     *     }
	     * }
	     * var object2 = {
	     *     propTwo : 2
	     * }
	     * var final = Cesium.combine(object1, object2);
	     *
	     * // final === {
	     * //     propOne : 1,
	     * //     propTwo : {
	     * //         value1 : 10
	     * //     }
	     * // }
	     *
	     * @param {Object} [object1] The first object to merge.
	     * @param {Object} [object2] The second object to merge.
	     * @param {Boolean} [deep=false] Perform a recursive merge.
	     * @returns {Object} The combined object containing all properties from both objects.
	     *
	     * @exports combine
	     */
	    function combine(object1, object2, deep) {
	        deep = when.defaultValue(deep, false);

	        var result = {};

	        var object1Defined = when.defined(object1);
	        var object2Defined = when.defined(object2);
	        var property;
	        var object1Value;
	        var object2Value;
	        if (object1Defined) {
	            for (property in object1) {
	                if (object1.hasOwnProperty(property)) {
	                    object1Value = object1[property];
	                    if (object2Defined && deep && typeof object1Value === 'object' && object2.hasOwnProperty(property)) {
	                        object2Value = object2[property];
	                        if (typeof object2Value === 'object') {
	                            result[property] = combine(object1Value, object2Value, deep);
	                        } else {
	                            result[property] = object1Value;
	                        }
	                    } else {
	                        result[property] = object1Value;
	                    }
	                }
	            }
	        }
	        if (object2Defined) {
	            for (property in object2) {
	                if (object2.hasOwnProperty(property) && !result.hasOwnProperty(property)) {
	                    object2Value = object2[property];
	                    result[property] = object2Value;
	                }
	            }
	        }
	        return result;
	    }

	/**
	     * Given a relative Uri and a base Uri, returns the absolute Uri of the relative Uri.
	     * @exports getAbsoluteUri
	     *
	     * @param {String} relative The relative Uri.
	     * @param {String} [base] The base Uri.
	     * @returns {String} The absolute Uri of the given relative Uri.
	     *
	     * @example
	     * //absolute Uri will be "https://test.com/awesome.png";
	     * var absoluteUri = Cesium.getAbsoluteUri('awesome.png', 'https://test.com');
	     */
	    function getAbsoluteUri(relative, base) {
	        var documentObject;
	        if (typeof document !== 'undefined') {
	            documentObject = document;
	        }

	        return getAbsoluteUri._implementation(relative, base, documentObject);
	    }

	    getAbsoluteUri._implementation = function(relative, base, documentObject) {
	        //>>includeStart('debug', pragmas.debug);
	        if (!when.defined(relative)) {
	            throw new Check.DeveloperError('relative uri is required.');
	        }
	        //>>includeEnd('debug');

	        if (!when.defined(base)) {
	            if (typeof documentObject === 'undefined') {
	                return relative;
	            }
	            base = when.defaultValue(documentObject.baseURI, documentObject.location.href);
	        }

	        var baseUri = new URI(base);
	        var relativeUri = new URI(relative);
	        return relativeUri.resolve(baseUri).toString();
	    };

	/**
	     * Given a URI, returns the base path of the URI.
	     * @exports getBaseUri
	     *
	     * @param {String} uri The Uri.
	     * @param {Boolean} [includeQuery = false] Whether or not to include the query string and fragment form the uri
	     * @returns {String} The base path of the Uri.
	     *
	     * @example
	     * // basePath will be "/Gallery/";
	     * var basePath = Cesium.getBaseUri('/Gallery/simple.czml?value=true&example=false');
	     *
	     * // basePath will be "/Gallery/?value=true&example=false";
	     * var basePath = Cesium.getBaseUri('/Gallery/simple.czml?value=true&example=false', true);
	     */
	    function getBaseUri(uri, includeQuery) {
	        //>>includeStart('debug', pragmas.debug);
	        if (!when.defined(uri)) {
	            throw new Check.DeveloperError('uri is required.');
	        }
	        //>>includeEnd('debug');

	        var basePath = '';
	        var i = uri.lastIndexOf('/');
	        if (i !== -1) {
	            basePath = uri.substring(0, i + 1);
	        }

	        if (!includeQuery) {
	            return basePath;
	        }

	        uri = new URI(uri);
	        if (when.defined(uri.query)) {
	            basePath += '?' + uri.query;
	        }
	        if (when.defined(uri.fragment)){
	            basePath += '#' + uri.fragment;
	        }

	        return basePath;
	    }

	/**
	     * Given a URI, returns the extension of the URI.
	     * @exports getExtensionFromUri
	     *
	     * @param {String} uri The Uri.
	     * @returns {String} The extension of the Uri.
	     *
	     * @example
	     * //extension will be "czml";
	     * var extension = Cesium.getExtensionFromUri('/Gallery/simple.czml?value=true&example=false');
	     */
	    function getExtensionFromUri(uri) {
	        //>>includeStart('debug', pragmas.debug);
	        if (!when.defined(uri)) {
	            throw new Check.DeveloperError('uri is required.');
	        }
	        //>>includeEnd('debug');

	        var uriObject = new URI(uri);
	        uriObject.normalize();
	        var path = uriObject.path;
	        var index = path.lastIndexOf('/');
	        if (index !== -1) {
	            path = path.substr(index + 1);
	        }
	        index = path.lastIndexOf('.');
	        if (index === -1) {
	            path = '';
	        } else {
	            path = path.substr(index + 1);
	        }
	        return path;
	    }

	var blobUriRegex = /^blob:/i;

	    /**
	     * Determines if the specified uri is a blob uri.
	     *
	     * @exports isBlobUri
	     *
	     * @param {String} uri The uri to test.
	     * @returns {Boolean} true when the uri is a blob uri; otherwise, false.
	     *
	     * @private
	     */
	    function isBlobUri(uri) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.Check.typeOf.string('uri', uri);
	        //>>includeEnd('debug');

	        return blobUriRegex.test(uri);
	    }

	var a;

	    /**
	     * Given a URL, determine whether that URL is considered cross-origin to the current page.
	     *
	     * @private
	     */
	    function isCrossOriginUrl(url) {
	        if (!when.defined(a)) {
	            a = document.createElement('a');
	        }

	        // copy window location into the anchor to get consistent results
	        // when the port is default for the protocol (e.g. 80 for HTTP)
	        a.href = window.location.href;

	        // host includes both hostname and port if the port is not standard
	        var host = a.host;
	        var protocol = a.protocol;

	        a.href = url;
	        // IE only absolutizes href on get, not set
	        a.href = a.href; // eslint-disable-line no-self-assign

	        return protocol !== a.protocol || host !== a.host;
	    }

	var dataUriRegex = /^data:/i;

	    /**
	     * Determines if the specified uri is a data uri.
	     *
	     * @exports isDataUri
	     *
	     * @param {String} uri The uri to test.
	     * @returns {Boolean} true when the uri is a data uri; otherwise, false.
	     *
	     * @private
	     */
	    function isDataUri(uri) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.Check.typeOf.string('uri', uri);
	        //>>includeEnd('debug');

	        return dataUriRegex.test(uri);
	    }

	/**
	     * @private
	     */
	    function loadAndExecuteScript(url) {
	        var deferred = when.when.defer();
	        var script = document.createElement('script');
	        script.async = true;
	        script.src = url;

	        var head = document.getElementsByTagName('head')[0];
	        script.onload = function() {
	            script.onload = undefined;
	            head.removeChild(script);
	            deferred.resolve();
	        };
	        script.onerror = function(e) {
	            deferred.reject(e);
	        };

	        head.appendChild(script);

	        return deferred.promise;
	    }

	/**
	     * Converts an object representing a set of name/value pairs into a query string,
	     * with names and values encoded properly for use in a URL.  Values that are arrays
	     * will produce multiple values with the same name.
	     * @exports objectToQuery
	     *
	     * @param {Object} obj The object containing data to encode.
	     * @returns {String} An encoded query string.
	     *
	     *
	     * @example
	     * var str = Cesium.objectToQuery({
	     *     key1 : 'some value',
	     *     key2 : 'a/b',
	     *     key3 : ['x', 'y']
	     * });
	     *
	     * @see queryToObject
	     * // str will be:
	     * // 'key1=some%20value&key2=a%2Fb&key3=x&key3=y'
	     */
	    function objectToQuery(obj, donotEncodeSpecialCharacters) {
	        //>>includeStart('debug', pragmas.debug);
	        if (!when.defined(obj)) {
	            throw new Check.DeveloperError('obj is required.');
	        }
	        //>>includeEnd('debug');

	        var result = '';
	        for ( var propName in obj) {
	            if (obj.hasOwnProperty(propName)) {
	                var value = obj[propName];

	                var part = encodeURIComponent(propName) + '=';
	                if (Array.isArray(value)) {
	                    for (var i = 0, len = value.length; i < len; ++i) {
	                        if (donotEncodeSpecialCharacters === true) {
	                            result += part + encodeURI(value[i]) + '&';
	                        } else {
	                            result += part + encodeURIComponent(value[i]) + '&';
	                        }
	                    }
	                } else {
	                    if (donotEncodeSpecialCharacters === true) {
	                        result += part + encodeURI(value) + '&';
	                    } else {
	                        result += part + encodeURIComponent(value) + '&';
	                    }
	                }
	            }
	        }

	        // trim last &
	        result = result.slice(0, -1);

	        // This function used to replace %20 with + which is more compact and readable.
	        // However, some servers didn't properly handle + as a space.
	        // https://github.com/CesiumGS/cesium/issues/2192

	        return result;
	    }

	/**
	     * Parses a query string into an object, where the keys and values of the object are the
	     * name/value pairs from the query string, decoded. If a name appears multiple times,
	     * the value in the object will be an array of values.
	     * @exports queryToObject
	     *
	     * @param {String} queryString The query string.
	     * @returns {Object} An object containing the parameters parsed from the query string.
	     *
	     *
	     * @example
	     * var obj = Cesium.queryToObject('key1=some%20value&key2=a%2Fb&key3=x&key3=y');
	     * // obj will be:
	     * // {
	     * //   key1 : 'some value',
	     * //   key2 : 'a/b',
	     * //   key3 : ['x', 'y']
	     * // }
	     *
	     * @see objectToQuery
	     */
	    function queryToObject(queryString) {
	        //>>includeStart('debug', pragmas.debug);
	        if (!when.defined(queryString)) {
	            throw new Check.DeveloperError('queryString is required.');
	        }
	        //>>includeEnd('debug');

	        var result = {};
	        if (queryString === '') {
	            return result;
	        }
	        var parts = queryString.replace(/\+/g, '%20').split(/[&;]/);
	        for (var i = 0, len = parts.length; i < len; ++i) {
	            var subparts = parts[i].split('=');
	            if (subparts.length > 2) {
	                var index = parts[i].indexOf("=");
	                var key = parts[i].substring(0, index);
	                var strvalue = parts[i].substring(index + 1, parts[i].length);
	                subparts = [key, strvalue];
	            }
	            var name = decodeURIComponent(subparts[0]);
	            var value = subparts[1];
	            if (when.defined(value)) {
	                value = decodeURIComponent(value);
	            } else {
	                value = '';
	            }

	            var resultValue = result[name];
	            if (typeof resultValue === 'string') {
	                // expand the single value to an array
	                result[name] = [resultValue, value];
	            } else if (Array.isArray(resultValue)) {
	                resultValue.push(value);
	            } else {
	                result[name] = value;
	            }
	        }
	        return result;
	    }

	/**
	     * State of the request.
	     *
	     * @exports RequestState
	     */
	    var RequestState = {
	        /**
	         * Initial unissued state.
	         *
	         * @type Number
	         * @constant
	         */
	        UNISSUED : 0,

	        /**
	         * Issued but not yet active. Will become active when open slots are available.
	         *
	         * @type Number
	         * @constant
	         */
	        ISSUED : 1,

	        /**
	         * Actual http request has been sent.
	         *
	         * @type Number
	         * @constant
	         */
	        ACTIVE : 2,

	        /**
	         * Request completed successfully.
	         *
	         * @type Number
	         * @constant
	         */
	        RECEIVED : 3,

	        /**
	         * Request was cancelled, either explicitly or automatically because of low priority.
	         *
	         * @type Number
	         * @constant
	         */
	        CANCELLED : 4,

	        /**
	         * Request failed.
	         *
	         * @type Number
	         * @constant
	         */
	        FAILED : 5
	    };
	var RequestState$1 = Object.freeze(RequestState);

	/**
	     * An enum identifying the type of request. Used for finer grained logging and priority sorting.
	     *
	     * @exports RequestType
	     */
	    var RequestType = {
	        /**
	         * Terrain request.
	         *
	         * @type Number
	         * @constant
	         */
	        TERRAIN : 0,

	        /**
	         * Imagery request.
	         *
	         * @type Number
	         * @constant
	         */
	        IMAGERY : 1,

	        /**
	         * 3D Tiles request.
	         *
	         * @type Number
	         * @constant
	         */
	        TILES3D : 2,

	        /**
	         * Other request.
	         *
	         * @type Number
	         * @constant
	         */
	        OTHER : 3,
	        PACK : 4,
	        BLOCK : 5,
	        BLOCKPACK : 6
	    };

	    var RequestType$1 = Object.freeze(RequestType);

	/**
	     * Stores information for making a request. In general this does not need to be constructed directly.
	     *
	     * @alias Request
	     * @constructor
	     * @namespace
	     * @exports Request
	     * @param {Object} [options] An object with the following properties:
	     * @param {String} [options.url] The url to request.
	     * @param {Request~RequestCallback} [options.requestFunction] The function that makes the actual data request.
	     * @param {Request~CancelCallback} [options.cancelFunction] The function that is called when the request is cancelled.
	     * @param {Request~PriorityCallback} [options.priorityFunction] The function that is called to update the request's priority, which occurs once per frame.
	     * @param {Number} [options.priority=0.0] The initial priority of the request.
	     * @param {Boolean} [options.throttle=false] Whether to throttle and prioritize the request. If false, the request will be sent immediately. If true, the request will be throttled and sent based on priority.
	     * @param {Boolean} [options.throttleByServer=false] Whether to throttle the request by server.
	     * @param {RequestType} [options.type=RequestType.OTHER] The type of request.
	     */
	    function Request(options) {
	        options = when.defaultValue(options, when.defaultValue.EMPTY_OBJECT);

	        var throttleByServer = when.defaultValue(options.throttleByServer, false);
	        var throttle = when.defaultValue(options.throttle, false);

	        /**
	         * The URL to request.
	         *
	         * @type {String}
	         */
	        this.url = options.url;

	        /**
	         * The function that makes the actual data request.
	         *
	         * @type {Request~RequestCallback}
	         */
	        this.requestFunction = options.requestFunction;

	        /**
	         * The function that is called when the request is cancelled.
	         *
	         * @type {Request~CancelCallback}
	         */
	        this.cancelFunction = options.cancelFunction;

	        /**
	         * The function that is called to update the request's priority, which occurs once per frame.
	         *
	         * @type {Request~PriorityCallback}
	         */
	        this.priorityFunction = options.priorityFunction;

	        /**
	         * Priority is a unit-less value where lower values represent higher priority.
	         * For world-based objects, this is usually the distance from the camera.
	         * A request that does not have a priority function defaults to a priority of 0.
	         *
	         * If priorityFunction is defined, this value is updated every frame with the result of that call.
	         *
	         * @type {Number}
	         * @default 0.0
	         */
	        this.priority = when.defaultValue(options.priority, 0.0);

	        /**
	         * Whether to throttle and prioritize the request. If false, the request will be sent immediately. If true, the
	         * request will be throttled and sent based on priority.
	         *
	         * @type {Boolean}
	         * @readonly
	         *
	         * @default false
	         */
	        this.throttle = throttle;

	        /**
	         * Whether to throttle the request by server. Browsers typically support about 6-8 parallel connections
	         * for HTTP/1 servers, and an unlimited amount of connections for HTTP/2 servers. Setting this value
	         * to <code>true</code> is preferable for requests going through HTTP/1 servers.
	         *
	         * @type {Boolean}
	         * @readonly
	         *
	         * @default false
	         */
	        this.throttleByServer = throttleByServer;

	        /**
	         * Type of request.
	         *
	         * @type {RequestType}
	         * @readonly
	         *
	         * @default RequestType.OTHER
	         */
	        this.type = when.defaultValue(options.type, RequestType$1.OTHER);

	        /**
	         * A key used to identify the server that a request is going to. It is derived from the url's authority and scheme.
	         *
	         * @type {String}
	         *
	         * @private
	         */
	        this.serverKey = undefined;

	        /**
	         * The current state of the request.
	         *
	         * @type {RequestState}
	         * @readonly
	         */
	        this.state = RequestState$1.UNISSUED;

	        /**
	         * The requests's deferred promise.
	         *
	         * @type {Object}
	         *
	         * @private
	         */
	        this.deferred = undefined;

	        /**
	         * Whether the request was explicitly cancelled.
	         *
	         * @type {Boolean}
	         *
	         * @private
	         */
	        this.cancelled = false;
	    }

	    /**
	     * Mark the request as cancelled.
	     *
	     * @private
	     */
	    Request.prototype.cancel = function() {
	        this.cancelled = true;
	    };

	    /**
	     * Duplicates a Request instance.
	     *
	     * @param {Request} [result] The object onto which to store the result.
	     *
	     * @returns {Request} The modified result parameter or a new Resource instance if one was not provided.
	     */
	    Request.prototype.clone = function(result) {
	        if (!when.defined(result)) {
	            return new Request(this);
	        }

	        result.url = this.url;
	        result.requestFunction = this.requestFunction;
	        result.cancelFunction = this.cancelFunction;
	        result.priorityFunction = this.priorityFunction;
	        result.priority = this.priority;
	        result.throttle = this.throttle;
	        result.throttleByServer = this.throttleByServer;
	        result.type = this.type;
	        result.serverKey = this.serverKey;

	        // These get defaulted because the cloned request hasn't been issued
	        result.state = this.RequestState.UNISSUED;
	        result.deferred = undefined;
	        result.cancelled = false;

	        return result;
	    };

	/**
	     * Parses the result of XMLHttpRequest's getAllResponseHeaders() method into
	     * a dictionary.
	     *
	     * @exports parseResponseHeaders
	     *
	     * @param {String} headerString The header string returned by getAllResponseHeaders().  The format is
	     *                 described here: http://www.w3.org/TR/XMLHttpRequest/#the-getallresponseheaders()-method
	     * @returns {Object} A dictionary of key/value pairs, where each key is the name of a header and the corresponding value
	     *                   is that header's value.
	     *
	     * @private
	     */
	    function parseResponseHeaders(headerString) {
	        var headers = {};

	        if (!headerString) {
	          return headers;
	        }

	        var headerPairs = headerString.split('\u000d\u000a');

	        for (var i = 0; i < headerPairs.length; ++i) {
	          var headerPair = headerPairs[i];
	          // Can't use split() here because it does the wrong thing
	          // if the header value has the string ": " in it.
	          var index = headerPair.indexOf('\u003a\u0020');
	          if (index > 0) {
	            var key = headerPair.substring(0, index);
	            var val = headerPair.substring(index + 2);
	            headers[key] = val;
	          }
	        }

	        return headers;
	    }

	/**
	     * An event that is raised when a request encounters an error.
	     *
	     * @constructor
	     * @alias RequestErrorEvent
	     *
	     * @param {Number} [statusCode] The HTTP error status code, such as 404.
	     * @param {Object} [response] The response included along with the error.
	     * @param {String|Object} [responseHeaders] The response headers, represented either as an object literal or as a
	     *                        string in the format returned by XMLHttpRequest's getAllResponseHeaders() function.
	     */
	    function RequestErrorEvent(statusCode, response, responseHeaders) {
	        /**
	         * The HTTP error status code, such as 404.  If the error does not have a particular
	         * HTTP code, this property will be undefined.
	         *
	         * @type {Number}
	         */
	        this.statusCode = statusCode;

	        /**
	         * The response included along with the error.  If the error does not include a response,
	         * this property will be undefined.
	         *
	         * @type {Object}
	         */
	        this.response = response;

	        /**
	         * The headers included in the response, represented as an object literal of key/value pairs.
	         * If the error does not include any headers, this property will be undefined.
	         *
	         * @type {Object}
	         */
	        this.responseHeaders = responseHeaders;

	        if (typeof this.responseHeaders === 'string') {
	            this.responseHeaders = parseResponseHeaders(this.responseHeaders);
	        }
	    }

	    /**
	     * Creates a string representing this RequestErrorEvent.
	     * @memberof RequestErrorEvent
	     *
	     * @returns {String} A string representing the provided RequestErrorEvent.
	     */
	    RequestErrorEvent.prototype.toString = function() {
	        var str = 'Request has failed.';
	        if (when.defined(this.statusCode)) {
	            str += ' Status Code: ' + this.statusCode;
	        }
	        return str;
	    };

	/**
	     * A generic utility class for managing subscribers for a particular event.
	     * This class is usually instantiated inside of a container class and
	     * exposed as a property for others to subscribe to.
	     *
	     * @alias Event
	     * @constructor
	     * @example
	     * MyObject.prototype.myListener = function(arg1, arg2) {
	     *     this.myArg1Copy = arg1;
	     *     this.myArg2Copy = arg2;
	     * }
	     *
	     * var myObjectInstance = new MyObject();
	     * var evt = new Cesium.Event();
	     * evt.addEventListener(MyObject.prototype.myListener, myObjectInstance);
	     * evt.raiseEvent('1', '2');
	     * evt.removeEventListener(MyObject.prototype.myListener);
	     */
	    function Event() {
	        this._listeners = [];
	        this._scopes = [];
	        this._toRemove = [];
	        this._insideRaiseEvent = false;
	    }

	    Object.defineProperties(Event.prototype, {
	        /**
	         * The number of listeners currently subscribed to the event.
	         * @memberof Event.prototype
	         * @type {Number}
	         * @readonly
	         */
	        numberOfListeners : {
	            get : function() {
	                return this._listeners.length - this._toRemove.length;
	            }
	        }
	    });

	    /**
	     * Registers a callback function to be executed whenever the event is raised.
	     * An optional scope can be provided to serve as the <code>this</code> pointer
	     * in which the function will execute.
	     *
	     * @param {Function} listener The function to be executed when the event is raised.
	     * @param {Object} [scope] An optional object scope to serve as the <code>this</code>
	     *        pointer in which the listener function will execute.
	     * @returns {Event~RemoveCallback} A function that will remove this event listener when invoked.
	     *
	     * @see Event#raiseEvent
	     * @see Event#removeEventListener
	     */
	    Event.prototype.addEventListener = function(listener, scope) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.Check.typeOf.func('listener', listener);
	        //>>includeEnd('debug');

	        this._listeners.push(listener);
	        this._scopes.push(scope);

	        var event = this;
	        return function() {
	            event.removeEventListener(listener, scope);
	        };
	    };

	    /**
	     * Unregisters a previously registered callback.
	     *
	     * @param {Function} listener The function to be unregistered.
	     * @param {Object} [scope] The scope that was originally passed to addEventListener.
	     * @returns {Boolean} <code>true</code> if the listener was removed; <code>false</code> if the listener and scope are not registered with the event.
	     *
	     * @see Event#addEventListener
	     * @see Event#raiseEvent
	     */
	    Event.prototype.removeEventListener = function(listener, scope) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.Check.typeOf.func('listener', listener);
	        //>>includeEnd('debug');

	        var listeners = this._listeners;
	        var scopes = this._scopes;

	        var index = -1;
	        for (var i = 0; i < listeners.length; i++) {
	            if (listeners[i] === listener && scopes[i] === scope) {
	                index = i;
	                break;
	            }
	        }

	        if (index !== -1) {
	            if (this._insideRaiseEvent) {
	                //In order to allow removing an event subscription from within
	                //a callback, we don't actually remove the items here.  Instead
	                //remember the index they are at and undefined their value.
	                this._toRemove.push(index);
	                listeners[index] = undefined;
	                scopes[index] = undefined;
	            } else {
	                listeners.splice(index, 1);
	                scopes.splice(index, 1);
	            }
	            return true;
	        }

	        return false;
	    };

	    function compareNumber(a,b) {
	        return b - a;
	    }

	    /**
	     * Raises the event by calling each registered listener with all supplied arguments.
	     *
	     * @param {*} arguments This method takes any number of parameters and passes them through to the listener functions.
	     *
	     * @see Event#addEventListener
	     * @see Event#removeEventListener
	     */
	    Event.prototype.raiseEvent = function() {
	        this._insideRaiseEvent = true;

	        var i;
	        var listeners = this._listeners;
	        var scopes = this._scopes;
	        var length = listeners.length;

	        for (i = 0; i < length; i++) {
	            var listener = listeners[i];
	            if (when.defined(listener)) {
	                listeners[i].apply(scopes[i], arguments);
	            }
	        }

	        //Actually remove items removed in removeEventListener.
	        var toRemove = this._toRemove;
	        length = toRemove.length;
	        if (length > 0) {
	            toRemove.sort(compareNumber);
	            for (i = 0; i < length; i++) {
	                var index = toRemove[i];
	                listeners.splice(index, 1);
	                scopes.splice(index, 1);
	            }
	            toRemove.length = 0;
	        }

	        this._insideRaiseEvent = false;
	    };

	/**
	     * Array implementation of a heap.
	     *
	     * @alias Heap
	     * @constructor
	     * @private
	     *
	     * @param {Object} options Object with the following properties:
	     * @param {Heap~ComparatorCallback} options.comparator The comparator to use for the heap. If comparator(a, b) is less than 0, sort a to a lower index than b, otherwise sort to a higher index.
	     */
	    function Heap(options) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.Check.typeOf.object('options', options);
	        Check.Check.defined('options.comparator', options.comparator);
	        //>>includeEnd('debug');

	        this._comparator = options.comparator;
	        this._array = [];
	        this._length = 0;
	        this._maximumLength = undefined;
	    }

	    Object.defineProperties(Heap.prototype, {
	        /**
	         * Gets the length of the heap.
	         *
	         * @memberof Heap.prototype
	         *
	         * @type {Number}
	         * @readonly
	         */
	        length : {
	            get : function() {
	                return this._length;
	            }
	        },

	        /**
	         * Gets the internal array.
	         *
	         * @memberof Heap.prototype
	         *
	         * @type {Array}
	         * @readonly
	         */
	        internalArray : {
	            get : function() {
	                return this._array;
	            }
	        },

	        /**
	         * Gets and sets the maximum length of the heap.
	         *
	         * @memberof Heap.prototype
	         *
	         * @type {Number}
	         */
	        maximumLength : {
	            get : function() {
	                return this._maximumLength;
	            },
	            set : function(value) {
	                this._maximumLength = value;
	                if (this._length > value && value > 0) {
	                    this._length = value;
	                    this._array.length = value;
	                }
	            }
	        },

	        /**
	         * The comparator to use for the heap. If comparator(a, b) is less than 0, sort a to a lower index than b, otherwise sort to a higher index.
	         *
	         * @memberof Heap.prototype
	         *
	         * @type {Heap~ComparatorCallback}
	         */
	        comparator : {
	            get : function() {
	                return this._comparator;
	            }
	        }
	    });

	    function swap(array, a, b) {
	        var temp = array[a];
	        array[a] = array[b];
	        array[b] = temp;
	    }

	    /**
	     * Resizes the internal array of the heap.
	     *
	     * @param {Number} [length] The length to resize internal array to. Defaults to the current length of the heap.
	     */
	    Heap.prototype.reserve = function(length) {
	        length = when.defaultValue(length, this._length);
	        this._array.length = length;
	    };

	    /**
	     * Update the heap so that index and all descendants satisfy the heap property.
	     *
	     * @param {Number} [index=0] The starting index to heapify from.
	     */
	    Heap.prototype.heapify = function(index) {
	        index = when.defaultValue(index, 0);
	        var length = this._length;
	        var comparator = this._comparator;
	        var array = this._array;
	        var candidate = -1;
	        var inserting = true;

	        while (inserting) {
	            var right = 2 * (index + 1);
	            var left = right - 1;

	            if (left < length && comparator(array[left], array[index]) < 0) {
	                candidate = left;
	            } else {
	                candidate = index;
	            }

	            if (right < length && comparator(array[right], array[candidate]) < 0) {
	                candidate = right;
	            }
	            if (candidate !== index) {
	                swap(array, candidate, index);
	                index = candidate;
	            } else {
	                inserting = false;
	            }
	        }
	    };

	    /**
	     * Resort the heap.
	     */
	    Heap.prototype.resort = function() {
	        var length = this._length;
	        for (var i = Math.ceil(length / 2); i >= 0; --i) {
	            this.heapify(i);
	        }
	    };

	    /**
	     * Insert an element into the heap. If the length would grow greater than maximumLength
	     * of the heap, extra elements are removed.
	     *
	     * @param {*} element The element to insert
	     *
	     * @return {*} The element that was removed from the heap if the heap is at full capacity.
	     */
	    Heap.prototype.insert = function(element) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.Check.defined('element', element);
	        //>>includeEnd('debug');

	        var array = this._array;
	        var comparator = this._comparator;
	        var maximumLength = this._maximumLength;

	        var index = this._length++;
	        if (index < array.length) {
	            array[index] = element;
	        } else {
	            array.push(element);
	        }

	        while (index !== 0) {
	            var parent = Math.floor((index - 1) / 2);
	            if (comparator(array[index], array[parent]) < 0) {
	                swap(array, index, parent);
	                index = parent;
	            } else {
	                break;
	            }
	        }

	        var removedElement;

	        if (when.defined(maximumLength) && (this._length > maximumLength)) {
	            removedElement = array[maximumLength];
	            this._length = maximumLength;
	        }

	        return removedElement;
	    };

	    /**
	     * Remove the element specified by index from the heap and return it.
	     *
	     * @param {Number} [index=0] The index to remove.
	     * @returns {*} The specified element of the heap.
	     */
	    Heap.prototype.pop = function(index) {
	        index = when.defaultValue(index, 0);
	        if (this._length === 0) {
	            return undefined;
	        }
	        //>>includeStart('debug', pragmas.debug);
	        Check.Check.typeOf.number.lessThan('index', index, this._length);
	        //>>includeEnd('debug');

	        var array = this._array;
	        var root = array[index];
	        swap(array, index, --this._length);
	        this.heapify(index);
	        return root;
	    };

	/**
	     * Gets a timestamp that can be used in measuring the time between events.  Timestamps
	     * are expressed in milliseconds, but it is not specified what the milliseconds are
	     * measured from.  This function uses performance.now() if it is available, or Date.now()
	     * otherwise.
	     *
	     * @exports getTimestamp
	     *
	     * @returns {Number} The timestamp in milliseconds since some unspecified reference time.
	     */
	    var getTimestamp;

	    if (typeof performance !== 'undefined' && typeof performance.now === 'function' && isFinite(performance.now())) {
	        getTimestamp = function() {
	            return performance.now();
	        };
	    } else {
	        getTimestamp = function() {
	            return Date.now();
	        };
	    }
	var getTimestamp$1 = getTimestamp;

	function sortRequests(a, b) {
	    return a.priority - b.priority;
	}

	var statistics = {
	    numberOfAttemptedRequests : 0,
	    numberOfActiveRequests : 0,
	    numberOfCancelledRequests : 0,
	    numberOfCancelledActiveRequests : 0,
	    numberOfFailedRequests : 0,
	    numberOfActiveRequestsEver : 0,
	    lastNumberOfActiveRequests : 0,
	    totalRequestTime : 0
	};

	var priorityHeapLength = 20;
	var requestHeap = new Heap({
	    comparator : sortRequests
	});
	requestHeap.maximumLength = priorityHeapLength;
	requestHeap.reserve(priorityHeapLength);

	var activeRequests = [];
	var numberOfActiveRequestsByServer = {};

	var pageUri = typeof document !== 'undefined' ? new URI(document.location.href) : new URI();

	var requestCompletedEvent = new Event();

	/**
	 * Tracks the number of active requests and prioritizes incoming requests.
	 *
	 * @exports RequestScheduler
	 *
	 * @private
	 */
	function RequestScheduler() {
	}

	/**
	 * The maximum number of simultaneous active requests. Un-throttled requests do not observe this limit.
	 * @type {Number}
	 * @default 50
	 */
	RequestScheduler.maximumRequests = 50;

	/**
	 * The maximum number of simultaneous active requests per server. Un-throttled requests or servers specifically
	 * listed in requestsByServer do not observe this limit.
	 * @type {Number}
	 * @default 6
	 */
	RequestScheduler.maximumRequestsPerServer = 6;

	RequestScheduler.perPacketCount = 20;//批量下载,每帧每个包的最大请求数限制,默认是20,不超过120


	/**
	 * A per serverKey list of overrides to use for throttling instead of maximumRequestsPerServer
	 */
	RequestScheduler.requestsByServer = {
	    'api.cesium.com:443': 18,
	    'assets.cesium.com:443': 18
	};

	/**
	 * Specifies if the request scheduler should throttle incoming requests, or let the browser queue requests under its control.
	 * @type {Boolean}
	 * @default true
	 */
	RequestScheduler.throttleRequests = true;

	/**
	 * When true, log statistics to the console every frame
	 * @type {Boolean}
	 * @default false
	 */
	RequestScheduler.debugShowStatistics = false;

	/**
	 * An event that's raised when a request is completed.  Event handlers are passed
	 * the error object if the request fails.
	 *
	 * @type {Event}
	 * @default Event()
	 */
	RequestScheduler.requestCompletedEvent = requestCompletedEvent;

	Object.defineProperties(RequestScheduler, {
	    /**
	     * Returns the statistics used by the request scheduler.
	     *
	     * @memberof RequestScheduler
	     *
	     * @type Object
	     * @readonly
	     */
	    statistics : {
	        get : function() {
	            return statistics;
	        }
	    },

	    /**
	     * The maximum size of the priority heap. This limits the number of requests that are sorted by priority. Only applies to requests that are not yet active.
	     *
	     * @memberof RequestScheduler
	     *
	     * @type {Number}
	     * @default 20
	     */
	    priorityHeapLength : {
	        get : function() {
	            return priorityHeapLength;
	        },
	        set : function(value) {
	            // If the new length shrinks the heap, need to cancel some of the requests.
	            // Since this value is not intended to be tweaked regularly it is fine to just cancel the high priority requests.
	            if (value < priorityHeapLength) {
	                while (requestHeap.length > value) {
	                    var request = requestHeap.pop();
	                    cancelRequest(request);
	                }
	            }
	            priorityHeapLength = value;
	            requestHeap.maximumLength = value;
	            requestHeap.reserve(value);
	        }
	    }
	});

	function updatePriority(request) {
	    if (when.defined(request.priorityFunction)) {
	        request.priority = request.priorityFunction();
	    }
	}

	function serverHasOpenSlots(serverKey) {
	    var maxRequests = when.defaultValue(RequestScheduler.requestsByServer[serverKey], RequestScheduler.maximumRequestsPerServer);
	    return numberOfActiveRequestsByServer[serverKey] < maxRequests;
	}


	RequestScheduler.packRequestGroup = {};//每帧的所有需要打包的请求 : (serverIP + provider name), value :[request, request,...]
	RequestScheduler.packRequestPromise = {};//每帧打包请求的promise  (serverIP + provider name) : defer
	RequestScheduler.packRequestQuadKey = {};//请求包的四叉树编码 (serverIP + provider name) : (quadkey;quadkey;...)
	RequestScheduler.quadKeyIndex = {};//记录当前四叉树编码数组的索引
	RequestScheduler.packRequestHeap = {};//每个图层对应一个二叉堆(serverIp + provider name) : heap

	RequestScheduler.blockDefer = {};
	RequestScheduler.blockRequest = {};

	function getRequestKey(request) {
	    if(when.defined(request.packKey)){
	        return request.packKey;
	    }

	    request.packKey = request.serverKey + '_' + request.providerName;
	    return request.packKey;
	}

	function getRequestBlockKey(request){
	    if(when.defined(request.blockKey)){
	        return request.blockKey;
	    }

	    request.blockKey = request.serverKey + '_' + request.providerName + '_' + request.quadKey + request.url.substring(request.url.indexOf("dataVersion"));
	    return request.blockKey;
	}

	function preparePackRequest (request) {
	    var packKey = getRequestKey(request);
	    if(!when.defined(RequestScheduler.packRequestGroup[packKey])) {
	        RequestScheduler.packRequestGroup[packKey] = [];
	    }

	    if(!when.defined(RequestScheduler.packRequestQuadKey[packKey])) {
	        RequestScheduler.packRequestQuadKey[packKey] = '';
	    }

	    if(!when.defined(RequestScheduler.packRequestPromise[packKey])) {
	        RequestScheduler.packRequestPromise[packKey] = when.when.defer();
	    }

	    if(!when.defined(RequestScheduler.quadKeyIndex[packKey])) {
	        RequestScheduler.quadKeyIndex[packKey] = 0;
	    }

	    request.quadKeyIndex = RequestScheduler.quadKeyIndex[packKey]++;
	    request.deferred = RequestScheduler.packRequestPromise[packKey];
	    request.state = RequestState$1.ISSUED;
	    RequestScheduler.packRequestGroup[packKey].push(request);
	    return request.deferred.promise;
	}

	function prepareBlockRequest(request) {
	    var key = getRequestBlockKey(request);
	    var deferred = RequestScheduler.blockDefer[key];
	    if(!when.defined(deferred)) {
	        deferred = RequestScheduler.blockDefer[key] = when.when.defer();
	        RequestScheduler.blockRequest[key] = request;
	    }

	    request.deferred = deferred;
	    request.state = RequestState$1.ISSUED;
	    return request.deferred.promise;
	}

	function clearRequestPackets() {
	    RequestScheduler.packRequestGroup = {};
	    RequestScheduler.packRequestPromise = {};
	    RequestScheduler.packRequestQuadKey = {};
	    RequestScheduler.quadKeyIndex = {};
	}

	function clearBlockRequest() {
	    RequestScheduler.blockRequest = {};
	}

	function cancelAllRequests(requests) {
	    for(var i = 0,j = requests.length;i < j;i++) {
	        var request = requests[i];
	        request.state = RequestState$1.CANCELLED;
	    }
	}

	function combineQuadkey(reqGroup) {
	    var quadkeys = [];
	    for(var i = 0,j = reqGroup.length;i < j;i++){
	        quadkeys.push(reqGroup[i].quadKey);
	    }
	    return quadkeys;
	}

	function startPackingRequest() {
	    var packRequestGroup = RequestScheduler.packRequestGroup;
	    for(var key in packRequestGroup) {
	        if(packRequestGroup.hasOwnProperty(key)) {
	            var reqGroup = packRequestGroup[key];
	            if(reqGroup.length < 1) {
	                continue ;
	            }

	            var packRequest = reqGroup[0].clone();
	            var isTileMap = packRequest.url.indexOf("rest/maps") !== -1;
	            packRequest.serverKey = reqGroup[0].serverKey;
	            packRequest.state = reqGroup[0].state;
	            var oldUrl = packRequest.url;

	            if (isTileMap) {
	                RequestScheduler.packRequestQuadKey[key] = combineQuadkey(reqGroup).join(',');
	            } else {
	                RequestScheduler.packRequestQuadKey[key] = combineQuadkey(reqGroup).join(';');
	            }
	            

	            var quadKey = RequestScheduler.packRequestQuadKey[key];
	            if (packRequest.throttleByServer && !serverHasOpenSlots(packRequest.serverKey)) {
	                cancelAllRequests(reqGroup);
	                RequestScheduler.packRequestPromise[key].reject();
	                continue;
	            }

	            packRequest.deferred = RequestScheduler.packRequestPromise[key];
	            var uri = new URI(oldUrl);
	            if (isTileMap) {
	                uri.query = when.defined(uri.query) ? uri.query + '&tiles=' + quadKey : 'tiles=' + quadKey;
	            } else {
	                uri.query = when.defined(uri.query) ? uri.query + '&extratiles=' + quadKey : 'extratiles=' + quadKey;
	            }
	            
	            packRequest.url = uri.toString();
	            startRequest(packRequest, packRequest.url);
	        }
	    }

	    clearRequestPackets();
	}

	function updateBlockRequest() {
	    var blockRequest = RequestScheduler.blockRequest;
	    for(var key in blockRequest) {
	        if(blockRequest.hasOwnProperty(key)) {
	            var request = blockRequest[key];
	            startRequest(request);
	        }
	    }

	    clearBlockRequest();
	}

	function issueRequest(request) {
	    if (request.state === RequestState$1.UNISSUED) {
	        request.state = RequestState$1.ISSUED;
	        if(request.type === RequestType$1.PACK || request.type === RequestType$1.BLOCKPACK){
	            var packKey = getRequestKey(request);
	            if(!when.defined(RequestScheduler.packRequestPromise[packKey])) {
	                RequestScheduler.packRequestPromise[packKey] = when.when.defer();
	            }

	            request.deferred = RequestScheduler.packRequestPromise[packKey];

	        }
	        else{
	            request.deferred = when.when.defer();
	        }
	    }
	    return request.deferred.promise;
	}

	function getRequestReceivedFunction(request) {
	    return function(results) {
	        if (request.state === RequestState$1.CANCELLED) {
	            // If the data request comes back but the request is cancelled, ignore it.
	            return;
	        }
	        --statistics.numberOfActiveRequests;
	        --numberOfActiveRequestsByServer[request.serverKey];
	        requestCompletedEvent.raiseEvent();
	        request.state = RequestState$1.RECEIVED;
	        request.deferred.resolve(results);
	        request.endTime = getTimestamp$1();
	        if(request.type !== RequestType$1.OTHER) {
	            statistics.totalRequestTime += request.endTime - request.startTime;
	        }

	        if(request.type === RequestType$1.BLOCK || request.type === RequestType$1.BLOCKPACK){
	            var key = getRequestBlockKey(request);
	            if(when.defined(RequestScheduler.blockDefer[key])){
	                RequestScheduler.blockDefer[key] = undefined;
	                delete RequestScheduler.blockDefer[key];
	            }

	        }
	    };
	}

	function getRequestFailedFunction(request) {
	    return function(error) {
	        if (request.state === RequestState$1.CANCELLED) {
	            // If the data request comes back but the request is cancelled, ignore it.
	            return;
	        }
	        ++statistics.numberOfFailedRequests;
	        --statistics.numberOfActiveRequests;
	        --numberOfActiveRequestsByServer[request.serverKey];
	        requestCompletedEvent.raiseEvent(error);
	        request.state = RequestState$1.FAILED;
	        request.deferred.reject(error);
	    };
	}

	function startRequest(request, url) {
	    var promise = issueRequest(request);
	    request.state = RequestState$1.ACTIVE;
	    activeRequests.push(request);
	    ++statistics.numberOfActiveRequests;
	    ++statistics.numberOfActiveRequestsEver;
	    ++numberOfActiveRequestsByServer[request.serverKey];
	    request.startTime = getTimestamp$1();
	    request.requestFunction(url).then(getRequestReceivedFunction(request)).otherwise(getRequestFailedFunction(request));
	    return promise;
	}

	function cancelRequest(request) {
	    var active = request.state === RequestState$1.ACTIVE;
	    request.state = RequestState$1.CANCELLED;
	    ++statistics.numberOfCancelledRequests;
	    request.deferred.reject();

	    if (active) {
	        --statistics.numberOfActiveRequests;
	        --numberOfActiveRequestsByServer[request.serverKey];
	        ++statistics.numberOfCancelledActiveRequests;
	    }

	    if (when.defined(request.cancelFunction)) {
	        request.cancelFunction();
	    }
	}

	function updatePackRequestHeap() {
	    for(var key in RequestScheduler.packRequestHeap) {
	        if(RequestScheduler.packRequestHeap.hasOwnProperty(key)) {
	            var heap = RequestScheduler.packRequestHeap[key];
	            var issuedRequests = heap.internalArray;
	            var issuedLength = heap.length;
	            for (var i = 0; i < issuedLength; ++i) {
	                updatePriority(issuedRequests[i]);
	            }
	            heap.resort();
	        }
	    }
	}

	function packingRequest() {
	    for(var key in RequestScheduler.packRequestHeap) {
	        if(RequestScheduler.packRequestHeap.hasOwnProperty(key)) {
	            var heap = RequestScheduler.packRequestHeap[key];
	            while(heap.length > 0) {
	                var request = heap.pop();
	                if (request.cancelled) {
	                    cancelRequest(request);
	                    continue;
	                }

	                preparePackRequest(request);
	            }
	        }
	    }

	    startPackingRequest();
	}

	/**
	 * Sort requests by priority and start requests.
	 */
	RequestScheduler.update = function() {
	    var i;
	    var request;

	    // Loop over all active requests. Cancelled, failed, or received requests are removed from the array to make room for new requests.
	    var removeCount = 0;
	    var activeLength = activeRequests.length;
	    for (i = 0; i < activeLength; ++i) {
	        request = activeRequests[i];
	        if (request.cancelled) {
	            // Request was explicitly cancelled
	            cancelRequest(request);
	        }
	        if (request.state !== RequestState$1.ACTIVE) {
	            // Request is no longer active, remove from array
	            ++removeCount;
	            continue;
	        }
	        if (removeCount > 0) {
	            // Shift back to fill in vacated slots from completed requests
	            activeRequests[i - removeCount] = request;
	        }
	    }
	    activeRequests.length -= removeCount;

	    // Update priority of issued requests and resort the heap
	    var issuedRequests = requestHeap.internalArray;
	    var issuedLength = requestHeap.length;
	    for (i = 0; i < issuedLength; ++i) {
	        updatePriority(issuedRequests[i]);
	    }
	    requestHeap.resort();

	    updatePackRequestHeap();
	    updateBlockRequest();

	    packingRequest();

	    // Get the number of open slots and fill with the highest priority requests.
	    // Un-throttled requests are automatically added to activeRequests, so activeRequests.length may exceed maximumRequests
	    var openSlots = Math.max(RequestScheduler.maximumRequests - activeRequests.length, 0);
	    var filledSlots = 0;
	    while (filledSlots < openSlots && requestHeap.length > 0) {
	        // Loop until all open slots are filled or the heap becomes empty
	        request = requestHeap.pop();
	        if (request.cancelled) {
	            // Request was explicitly cancelled
	            cancelRequest(request);
	            continue;
	        }

	        if (request.throttleByServer && !serverHasOpenSlots(request.serverKey)) {
	            // Open slots are available, but the request is throttled by its server. Cancel and try again later.
	            cancelRequest(request);
	            continue;
	        }

	        startRequest(request);

	        ++filledSlots;
	    }

	    updateStatistics();
	};

	/**
	 * Get the server key from a given url.
	 *
	 * @param {String} url The url.
	 * @returns {String} The server key.
	 */
	RequestScheduler.getServerKey = function(url) {
	    //>>includeStart('debug', pragmas.debug);
	    Check.Check.typeOf.string('url', url);
	    //>>includeEnd('debug');

	    var uri = new URI(url).resolve(pageUri);
	    uri.normalize();
	    var serverKey = uri.authority;
	    if (!/:/.test(serverKey)) {
	        // If the authority does not contain a port number, add port 443 for https or port 80 for http
	        serverKey = serverKey + ':' + (uri.scheme === 'https' ? '443' : '80');
	    }

	    var length = numberOfActiveRequestsByServer[serverKey];
	    if (!when.defined(length)) {
	        numberOfActiveRequestsByServer[serverKey] = 0;
	    }

	    return serverKey;
	};

	function getPackRequestHeap(request) {
	    var packKey = getRequestKey(request);
	    var heap = RequestScheduler.packRequestHeap[packKey];
	    if(!when.defined(heap)) {
	        heap = RequestScheduler.packRequestHeap[packKey] = new Heap({
	            comparator : sortRequests
	        });
	        heap.maximumLength = RequestScheduler.perPacketCount;
	        heap.reserve(priorityHeapLength);
	    }

	    return heap;
	}

	/**
	 * Issue a request. If request.throttle is false, the request is sent immediately. Otherwise the request will be
	 * queued and sorted by priority before being sent.
	 *
	 * @param {Request} request The request object.
	 *
	 * @returns {Promise|undefined} A Promise for the requested data, or undefined if this request does not have high enough priority to be issued.
	 */
	RequestScheduler.request = function(request) {
	    //>>includeStart('debug', pragmas.debug);
	    Check.Check.typeOf.object('request', request);
	    Check.Check.typeOf.string('request.url', request.url);
	    Check.Check.typeOf.func('request.requestFunction', request.requestFunction);
	    //>>includeEnd('debug');

	    if (isDataUri(request.url) || isBlobUri(request.url)) {
	        requestCompletedEvent.raiseEvent();
	        request.state = RequestState$1.RECEIVED;
	        return request.requestFunction();
	    }

	    ++statistics.numberOfAttemptedRequests;

	    if (!when.defined(request.serverKey)) {
	        request.serverKey = RequestScheduler.getServerKey(request.url);
	    }

	    if(request.type === RequestType$1.BLOCK) {
	        return prepareBlockRequest(request);
	    }

	    if (request.throttleByServer && !serverHasOpenSlots(request.serverKey)) {
	        // Server is saturated. Try again later.
	        return undefined;
	    }

	    if (!RequestScheduler.throttleRequests || !request.throttle) {
	        return startRequest(request);
	    }

	    if (activeRequests.length >= RequestScheduler.maximumRequests) {
	        // Active requests are saturated. Try again later.
	        return undefined;
	    }

	    // Insert into the priority heap and see if a request was bumped off. If this request is the lowest
	    // priority it will be returned.
	    updatePriority(request);
	    var removedRequest;
	    if(request.type === RequestType$1.PACK || request.type === RequestType$1.BLOCKPACK) {
	        var packRequestHeap = getPackRequestHeap(request);


	        var inset = true;
	        if(request.type === RequestType$1.BLOCKPACK){
	            for(var i=0; i<packRequestHeap.length; i++){
	                if(packRequestHeap._array[i].quadKey === request.quadKey){
	                    request.blockRequest = packRequestHeap._array[i];
	                    inset = false;
	                    break;
	                }
	            }
	        }

	        if(inset){
	            removedRequest = packRequestHeap.insert(request);
	        }

	    }
	    else{
	        removedRequest = requestHeap.insert(request);
	    }

	    if (when.defined(removedRequest)) {
	        if (removedRequest === request) {
	            // Request does not have high enough priority to be issued
	            return undefined;
	        }
	        // A previously issued request has been bumped off the priority heap, so cancel it
	        cancelRequest(removedRequest);
	    }

	    return issueRequest(request);
	};

	function updateStatistics() {
	    if (!RequestScheduler.debugShowStatistics) {
	        return;
	    }

	    if (statistics.numberOfActiveRequests === 0 && statistics.lastNumberOfActiveRequests > 0) {
	        if (statistics.numberOfAttemptedRequests > 0) {
	            console.log('Number of attempted requests: ' + statistics.numberOfAttemptedRequests);
	            statistics.numberOfAttemptedRequests = 0;
	        }

	        if (statistics.numberOfCancelledRequests > 0) {
	            console.log('Number of cancelled requests: ' + statistics.numberOfCancelledRequests);
	            statistics.numberOfCancelledRequests = 0;
	        }

	        if (statistics.numberOfCancelledActiveRequests > 0) {
	            console.log('Number of cancelled active requests: ' + statistics.numberOfCancelledActiveRequests);
	            statistics.numberOfCancelledActiveRequests = 0;
	        }

	        if (statistics.numberOfFailedRequests > 0) {
	            console.log('Number of failed requests: ' + statistics.numberOfFailedRequests);
	            statistics.numberOfFailedRequests = 0;
	        }
	    }

	    statistics.lastNumberOfActiveRequests = statistics.numberOfActiveRequests;
	}

	/**
	 * For testing only. Clears any requests that may not have completed from previous tests.
	 *
	 * @private
	 */
	RequestScheduler.clearForSpecs = function() {
	    while (requestHeap.length > 0) {
	        var request = requestHeap.pop();
	        cancelRequest(request);
	    }
	    var length = activeRequests.length;
	    for (var i = 0; i < length; ++i) {
	        cancelRequest(activeRequests[i]);
	    }
	    activeRequests.length = 0;
	    numberOfActiveRequestsByServer = {};

	    // Clear stats
	    statistics.numberOfAttemptedRequests = 0;
	    statistics.numberOfActiveRequests = 0;
	    statistics.numberOfCancelledRequests = 0;
	    statistics.numberOfCancelledActiveRequests = 0;
	    statistics.numberOfFailedRequests = 0;
	    statistics.numberOfActiveRequestsEver = 0;
	    statistics.lastNumberOfActiveRequests = 0;
	    statistics.totalRequestTime = 0;
	};

	/**
	 * For testing only.
	 *
	 * @private
	 */
	RequestScheduler.numberOfActiveRequestsByServer = function(serverKey) {
	    return numberOfActiveRequestsByServer[serverKey];
	};

	/**
	 * For testing only.
	 *
	 * @private
	 */
	RequestScheduler.requestHeap = requestHeap;

	/**
	     * A singleton that contains all of the servers that are trusted. Credentials will be sent with
	     * any requests to these servers.
	     *
	     * @exports TrustedServers
	     *
	     * @see {@link http://www.w3.org/TR/cors/|Cross-Origin Resource Sharing}
	     */
	    var TrustedServers = {};
	    var _servers = {};

	    /**
	     * Adds a trusted server to the registry
	     *
	     * @param {String} host The host to be added.
	     * @param {Number} port The port used to access the host.
	     *
	     * @example
	     * // Add a trusted server
	     * TrustedServers.add('my.server.com', 80);
	     */
	    TrustedServers.add = function(host, port) {
	        //>>includeStart('debug', pragmas.debug);
	        if (!when.defined(host)) {
	            throw new Check.DeveloperError('host is required.');
	        }
	        if (!when.defined(port) || port <= 0) {
	            throw new Check.DeveloperError('port is required to be greater than 0.');
	        }
	        //>>includeEnd('debug');

	        var authority = host.toLowerCase() + ':' + port;
	        if (!when.defined(_servers[authority])) {
	            _servers[authority] = true;
	        }
	    };

	    /**
	     * Removes a trusted server from the registry
	     *
	     * @param {String} host The host to be removed.
	     * @param {Number} port The port used to access the host.
	     *
	     * @example
	     * // Remove a trusted server
	     * TrustedServers.remove('my.server.com', 80);
	     */
	    TrustedServers.remove = function(host, port) {
	        //>>includeStart('debug', pragmas.debug);
	        if (!when.defined(host)) {
	            throw new Check.DeveloperError('host is required.');
	        }
	        if (!when.defined(port) || port <= 0) {
	            throw new Check.DeveloperError('port is required to be greater than 0.');
	        }
	        //>>includeEnd('debug');

	        var authority = host.toLowerCase() + ':' + port;
	        if (when.defined(_servers[authority])) {
	            delete _servers[authority];
	        }
	    };

	    function getAuthority(url) {
	        var uri = new URI(url);
	        uri.normalize();

	        // Removes username:password@ so we just have host[:port]
	        var authority = uri.getAuthority();
	        if (!when.defined(authority)) {
	            return undefined; // Relative URL
	        }

	        if (authority.indexOf('@') !== -1) {
	            var parts = authority.split('@');
	            authority = parts[1];
	        }

	        // If the port is missing add one based on the scheme
	        if (authority.indexOf(':') === -1) {
	            var scheme = uri.getScheme();
	            if (!when.defined(scheme)) {
	                scheme = window.location.protocol;
	                scheme = scheme.substring(0, scheme.length-1);
	            }
	            if (scheme === 'http') {
	                authority += ':80';
	            } else if (scheme === 'https') {
	                authority += ':443';
	            } else {
	                return undefined;
	            }
	        }

	        return authority;
	    }

	    /**
	     * Tests whether a server is trusted or not. The server must have been added with the port if it is included in the url.
	     *
	     * @param {String} url The url to be tested against the trusted list
	     *
	     * @returns {boolean} Returns true if url is trusted, false otherwise.
	     *
	     * @example
	     * // Add server
	     * TrustedServers.add('my.server.com', 81);
	     *
	     * // Check if server is trusted
	     * if (TrustedServers.contains('https://my.server.com:81/path/to/file.png')) {
	     *     // my.server.com:81 is trusted
	     * }
	     * if (TrustedServers.contains('https://my.server.com/path/to/file.png')) {
	     *     // my.server.com isn't trusted
	     * }
	     */
	    TrustedServers.contains = function(url) {
	        //>>includeStart('debug', pragmas.debug);
	        if (!when.defined(url)) {
	            throw new Check.DeveloperError('url is required.');
	        }
	        //>>includeEnd('debug');
	        var authority = getAuthority(url);
	        if (when.defined(authority) && when.defined(_servers[authority])) {
	            return true;
	        }

	        return false;
	    };

	    /**
	     * Clears the registry
	     *
	     * @example
	     * // Remove a trusted server
	     * TrustedServers.clear();
	     */
	    TrustedServers.clear = function() {
	        _servers = {};
	    };

	var warnings = {};

	    /**
	     * Logs a one time message to the console.  Use this function instead of
	     * <code>console.log</code> directly since this does not log duplicate messages
	     * unless it is called from multiple workers.
	     *
	     * @exports oneTimeWarning
	     *
	     * @param {String} identifier The unique identifier for this warning.
	     * @param {String} [message=identifier] The message to log to the console.
	     *
	     * @example
	     * for(var i=0;i<foo.length;++i) {
	     *    if (!defined(foo[i].bar)) {
	     *       // Something that can be recovered from but may happen a lot
	     *       oneTimeWarning('foo.bar undefined', 'foo.bar is undefined. Setting to 0.');
	     *       foo[i].bar = 0;
	     *       // ...
	     *    }
	     * }
	     *
	     * @private
	     */
	    function oneTimeWarning(identifier, message) {
	        //>>includeStart('debug', pragmas.debug);
	        if (!when.defined(identifier)) {
	            throw new Check.DeveloperError('identifier is required.');
	        }
	        //>>includeEnd('debug');

	        if (!when.defined(warnings[identifier])) {
	            warnings[identifier] = true;
	            console.warn(when.defaultValue(message, identifier));
	        }
	    }

	    oneTimeWarning.geometryOutlines = 'Entity geometry outlines are unsupported on terrain. Outlines will be disabled. To enable outlines, disable geometry terrain clamping by explicitly setting height to 0.';

	    oneTimeWarning.geometryZIndex = 'Entity geometry with zIndex are unsupported when height or extrudedHeight are defined.  zIndex will be ignored';

	    oneTimeWarning.geometryHeightReference = 'Entity corridor, ellipse, polygon or rectangle with heightReference must also have a defined height.  heightReference will be ignored';
	    oneTimeWarning.geometryExtrudedHeightReference = 'Entity corridor, ellipse, polygon or rectangle with extrudedHeightReference must also have a defined extrudedHeight.  extrudedHeightReference will be ignored';

	/**
	     * Logs a deprecation message to the console.  Use this function instead of
	     * <code>console.log</code> directly since this does not log duplicate messages
	     * unless it is called from multiple workers.
	     *
	     * @exports deprecationWarning
	     *
	     * @param {String} identifier The unique identifier for this deprecated API.
	     * @param {String} message The message to log to the console.
	     *
	     * @example
	     * // Deprecated function or class
	     * function Foo() {
	     *    deprecationWarning('Foo', 'Foo was deprecated in Cesium 1.01.  It will be removed in 1.03.  Use newFoo instead.');
	     *    // ...
	     * }
	     *
	     * // Deprecated function
	     * Bar.prototype.func = function() {
	     *    deprecationWarning('Bar.func', 'Bar.func() was deprecated in Cesium 1.01.  It will be removed in 1.03.  Use Bar.newFunc() instead.');
	     *    // ...
	     * };
	     *
	     * // Deprecated property
	     * Object.defineProperties(Bar.prototype, {
	     *     prop : {
	     *         get : function() {
	     *             deprecationWarning('Bar.prop', 'Bar.prop was deprecated in Cesium 1.01.  It will be removed in 1.03.  Use Bar.newProp instead.');
	     *             // ...
	     *         },
	     *         set : function(value) {
	     *             deprecationWarning('Bar.prop', 'Bar.prop was deprecated in Cesium 1.01.  It will be removed in 1.03.  Use Bar.newProp instead.');
	     *             // ...
	     *         }
	     *     }
	     * });
	     *
	     * @private
	     */
	    function deprecationWarning(identifier, message) {
	        //>>includeStart('debug', pragmas.debug);
	        if (!when.defined(identifier) || !when.defined(message)) {
	            throw new Check.DeveloperError('identifier and message are required.');
	        }
	        //>>includeEnd('debug');

	        oneTimeWarning(identifier, message);
	    }

	var xhrBlobSupported = (function() {
	        try {
	            var xhr = new XMLHttpRequest();
	            xhr.open('GET', '#', true);
	            xhr.responseType = 'blob';
	            return xhr.responseType === 'blob';
	        } catch (e) {
	            return false;
	        }
	    })();

	    /**
	     * Parses a query string and returns the object equivalent.
	     *
	     * @param {Uri} uri The Uri with a query object.
	     * @param {Resource} resource The Resource that will be assigned queryParameters.
	     * @param {Boolean} merge If true, we'll merge with the resource's existing queryParameters. Otherwise they will be replaced.
	     * @param {Boolean} preserveQueryParameters If true duplicate parameters will be concatenated into an array. If false, keys in uri will take precedence.
	     *
	     * @private
	     */
	    function parseQuery(uri, resource, merge, preserveQueryParameters) {
	        var queryString = uri.query;
	        if (!when.defined(queryString) || (queryString.length === 0)) {
	            return {};
	        }

	        var query;
	        // Special case we run into where the querystring is just a string, not key/value pairs
	        if (queryString.indexOf('=') === -1) {
	            var result = {};
	            result[queryString] = undefined;
	            query = result;
	        } else {
	            query = queryToObject(queryString);
	        }

	        if (merge) {
	            resource._queryParameters = combineQueryParameters(query, resource._queryParameters, preserveQueryParameters);
	        } else {
	            resource._queryParameters = query;
	        }
	        uri.query = undefined;
	    }

	    /**
	     * Converts a query object into a string.
	     *
	     * @param {Uri} uri The Uri object that will have the query object set.
	     * @param {Resource} resource The resource that has queryParameters
	     *
	     * @private
	     */
	    function stringifyQuery(uri, resource) {
	        var queryObject = resource._queryParameters;

	        var keys = Object.keys(queryObject);

	        // We have 1 key with an undefined value, so this is just a string, not key/value pairs
	        if (keys.length === 1 && !when.defined(queryObject[keys[0]])) {
	            uri.query = keys[0];
	        } else {
	            uri.query = objectToQuery(queryObject);
	        }
	    }

	    /**
	     * Clones a value if it is defined, otherwise returns the default value
	     *
	     * @param {*} [val] The value to clone.
	     * @param {*} [defaultVal] The default value.
	     *
	     * @returns {*} A clone of val or the defaultVal.
	     *
	     * @private
	     */
	    function defaultClone(val, defaultVal) {
	        if (!when.defined(val)) {
	            return defaultVal;
	        }

	        return when.defined(val.clone) ? val.clone() : clone(val);
	    }

	    /**
	     * Checks to make sure the Resource isn't already being requested.
	     *
	     * @param {Request} request The request to check.
	     *
	     * @private
	     */
	    function checkAndResetRequest(request) {
	        if (request.state === RequestState$1.ISSUED || request.state === RequestState$1.ACTIVE) {
	            throw new RuntimeError.RuntimeError('The Resource is already being fetched.');
	        }

	        request.state = RequestState$1.UNISSUED;
	        request.deferred = undefined;
	    }

	    /**
	     * This combines a map of query parameters.
	     *
	     * @param {Object} q1 The first map of query parameters. Values in this map will take precedence if preserveQueryParameters is false.
	     * @param {Object} q2 The second map of query parameters.
	     * @param {Boolean} preserveQueryParameters If true duplicate parameters will be concatenated into an array. If false, keys in q1 will take precedence.
	     *
	     * @returns {Object} The combined map of query parameters.
	     *
	     * @example
	     * var q1 = {
	     *   a: 1,
	     *   b: 2
	     * };
	     * var q2 = {
	     *   a: 3,
	     *   c: 4
	     * };
	     * var q3 = {
	     *   b: [5, 6],
	     *   d: 7
	     * }
	     *
	     * // Returns
	     * // {
	     * //   a: [1, 3],
	     * //   b: 2,
	     * //   c: 4
	     * // };
	     * combineQueryParameters(q1, q2, true);
	     *
	     * // Returns
	     * // {
	     * //   a: 1,
	     * //   b: 2,
	     * //   c: 4
	     * // };
	     * combineQueryParameters(q1, q2, false);
	     *
	     * // Returns
	     * // {
	     * //   a: 1,
	     * //   b: [2, 5, 6],
	     * //   d: 7
	     * // };
	     * combineQueryParameters(q1, q3, true);
	     *
	     * // Returns
	     * // {
	     * //   a: 1,
	     * //   b: 2,
	     * //   d: 7
	     * // };
	     * combineQueryParameters(q1, q3, false);
	     *
	     * @private
	     */
	    function combineQueryParameters(q1, q2, preserveQueryParameters) {
	        if (!preserveQueryParameters) {
	            return combine(q1, q2);
	        }

	        var result = clone(q1, true);
	        for (var param in q2) {
	            if (q2.hasOwnProperty(param)) {
	                var value = result[param];
	                var q2Value = q2[param];
	                if (when.defined(value)) {
	                    if (!Array.isArray(value)) {
	                        value = result[param] = [value];
	                    }

	                    result[param] = value.concat(q2Value);
	                } else {
	                    result[param] = Array.isArray(q2Value) ? q2Value.slice() : q2Value;
	                }
	            }
	        }

	        return result;
	    }

	    /**
	     * A resource that includes the location and any other parameters we need to retrieve it or create derived resources. It also provides the ability to retry requests.
	     *
	     * @alias Resource
	     * @constructor
	     *
	     * @param {String|Object} options A url or an object with the following properties
	     * @param {String} options.url The url of the resource.
	     * @param {Object} [options.queryParameters] An object containing query parameters that will be sent when retrieving the resource.
	     * @param {Object} [options.templateValues] Key/Value pairs that are used to replace template values (eg. {x}).
	     * @param {Object} [options.headers={}] Additional HTTP headers that will be sent.
	     * @param {DefaultProxy} [options.proxy] A proxy to be used when loading the resource.
	     * @param {Resource~RetryCallback} [options.retryCallback] The Function to call when a request for this resource fails. If it returns true, the request will be retried.
	     * @param {Number} [options.retryAttempts=0] The number of times the retryCallback should be called before giving up.
	     * @param {Request} [options.request] A Request object that will be used. Intended for internal use only.
	     *
	     * @example
	     * function refreshTokenRetryCallback(resource, error) {
	     *   if (error.statusCode === 403) {
	     *     // 403 status code means a new token should be generated
	     *     return getNewAccessToken()
	     *       .then(function(token) {
	     *         resource.queryParameters.access_token = token;
	     *         return true;
	     *       })
	     *       .otherwise(function() {
	     *         return false;
	     *       });
	     *   }
	     *
	     *   return false;
	     * }
	     *
	     * var resource = new Resource({
	     *    url: 'http://server.com/path/to/resource.json',
	     *    proxy: new DefaultProxy('/proxy/'),
	     *    headers: {
	     *      'X-My-Header': 'valueOfHeader'
	     *    },
	     *    queryParameters: {
	     *      'access_token': '123-435-456-000'
	     *    },
	     *    retryCallback: refreshTokenRetryCallback,
	     *    retryAttempts: 1
	     * });
	     */
	    function Resource(options) {
	        options = when.defaultValue(options, when.defaultValue.EMPTY_OBJECT);
	        if (typeof options === 'string') {
	            options = {
	                url: options
	            };
	        }

	        //>>includeStart('debug', pragmas.debug);
	        Check.Check.typeOf.string('options.url', options.url);
	        //>>includeEnd('debug');

	        this._url = undefined;
	        this._templateValues = defaultClone(options.templateValues, {});
	        this._queryParameters = defaultClone(options.queryParameters, {});

	        /**
	         * Additional HTTP headers that will be sent with the request.
	         *
	         * @type {Object}
	         */
	        this.headers = defaultClone(options.headers, {});

	        /**
	         * A Request object that will be used. Intended for internal use only.
	         *
	         * @type {Request}
	         */
	        this.request = when.defaultValue(options.request, new Request());

	        /**
	         * A proxy to be used when loading the resource.
	         *
	         * @type {DefaultProxy}
	         */
	        this.proxy = options.proxy;

	        /**
	         * Function to call when a request for this resource fails. If it returns true or a Promise that resolves to true, the request will be retried.
	         *
	         * @type {Function}
	         */
	        this.retryCallback = options.retryCallback;

	        /**
	         * The number of times the retryCallback should be called before giving up.
	         *
	         * @type {Number}
	         */
	        this.retryAttempts = when.defaultValue(options.retryAttempts, 0);
	        this._retryCount = 0;

	        var uri = new URI(options.url);
	        parseQuery(uri, this, true, true);

	        // Remove the fragment as it's not sent with a request
	        uri.fragment = undefined;

	        this._url = uri.toString();
	    }

	    /**
	     * A helper function to create a resource depending on whether we have a String or a Resource
	     *
	     * @param {Resource|String} resource A Resource or a String to use when creating a new Resource.
	     *
	     * @returns {Resource} If resource is a String, a Resource constructed with the url and options. Otherwise the resource parameter is returned.
	     *
	     * @private
	     */
	    Resource.createIfNeeded = function(resource) {
	        if (resource instanceof Resource) {
	            // Keep existing request object. This function is used internally to duplicate a Resource, so that it can't
	            //  be modified outside of a class that holds it (eg. an imagery or terrain provider). Since the Request objects
	            //  are managed outside of the providers, by the tile loading code, we want to keep the request property the same so if it is changed
	            //  in the underlying tiling code the requests for this resource will use it.
	            return  resource.getDerivedResource({
	                request: resource.request
	            });
	        }

	        if (typeof resource !== 'string') {
	            return resource;
	        }

	        return new Resource({
	            url: resource
	        });
	    };

	    var supportsImageBitmapOptionsPromise;
	    /**
	     * A helper function to check whether createImageBitmap supports passing ImageBitmapOptions.
	     *
	     * @returns {Promise<Boolean>} A promise that resolves to true if this browser supports creating an ImageBitmap with options.
	     *
	     * @private
	     */
	    Resource.supportsImageBitmapOptions = function() {
	        // Until the HTML folks figure out what to do about this, we need to actually try loading an image to
	        // know if this browser supports passing options to the createImageBitmap function.
	        // https://github.com/whatwg/html/pull/4248
	        if (when.defined(supportsImageBitmapOptionsPromise)) {
	            return supportsImageBitmapOptionsPromise;
	        }

	        if (typeof createImageBitmap !== 'function') {
	            supportsImageBitmapOptionsPromise = when.when.resolve(false);
	            return supportsImageBitmapOptionsPromise;
	        }

	        var imageDataUri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWP4////fwAJ+wP9CNHoHgAAAABJRU5ErkJggg==';

	        supportsImageBitmapOptionsPromise = Resource.fetchBlob({
	            url : imageDataUri
	        })
	            .then(function(blob) {
	                return createImageBitmap(blob, {
	                    imageOrientation: 'flipY',
	                    premultiplyAlpha: 'none'
	                });
	            })
	            .then(function(imageBitmap) {
	                return true;
	            })
	            .otherwise(function() {
	                return false;
	            });

	        return supportsImageBitmapOptionsPromise;
	    };

	    Object.defineProperties(Resource, {
	        /**
	         * Returns true if blobs are supported.
	         *
	         * @memberof Resource
	         * @type {Boolean}
	         *
	         * @readonly
	         */
	        isBlobSupported : {
	            get : function() {
	                return xhrBlobSupported;
	            }
	        }
	    });

	    Object.defineProperties(Resource.prototype, {
	        /**
	         * Query parameters appended to the url.
	         *
	         * @memberof Resource.prototype
	         * @type {Object}
	         *
	         * @readonly
	         */
	        queryParameters: {
	            get: function() {
	                return this._queryParameters;
	            }
	        },

	        /**
	         * The key/value pairs used to replace template parameters in the url.
	         *
	         * @memberof Resource.prototype
	         * @type {Object}
	         *
	         * @readonly
	         */
	        templateValues: {
	            get: function() {
	                return this._templateValues;
	            }
	        },

	        /**
	         * The url to the resource with template values replaced, query string appended and encoded by proxy if one was set.
	         *
	         * @memberof Resource.prototype
	         * @type {String}
	         */
	        url: {
	            get: function() {
	                return this.getUrlComponent(true, true);
	            },
	            set: function(value) {
	                var uri = new URI(value);

	                parseQuery(uri, this, false);

	                // Remove the fragment as it's not sent with a request
	                uri.fragment = undefined;

	                this._url = uri.toString();
	            }
	        },

	        /**
	         * The file extension of the resource.
	         *
	         * @memberof Resource.prototype
	         * @type {String}
	         *
	         * @readonly
	         */
	        extension: {
	            get: function() {
	                return getExtensionFromUri(this._url);
	            }
	        },

	        /**
	         * True if the Resource refers to a data URI.
	         *
	         * @memberof Resource.prototype
	         * @type {Boolean}
	         */
	        isDataUri: {
	            get: function() {
	                return isDataUri(this._url);
	            }
	        },

	        /**
	         * True if the Resource refers to a blob URI.
	         *
	         * @memberof Resource.prototype
	         * @type {Boolean}
	         */
	        isBlobUri: {
	            get: function() {
	                return isBlobUri(this._url);
	            }
	        },

	        /**
	         * True if the Resource refers to a cross origin URL.
	         *
	         * @memberof Resource.prototype
	         * @type {Boolean}
	         */
	        isCrossOriginUrl: {
	            get: function() {
	                return isCrossOriginUrl(this._url);
	            }
	        },

	        /**
	         * True if the Resource has request headers. This is equivalent to checking if the headers property has any keys.
	         *
	         * @memberof Resource.prototype
	         * @type {Boolean}
	         */
	        hasHeaders: {
	            get: function() {
	                return (Object.keys(this.headers).length > 0);
	            }
	        }
	    });

	    /**
	     * Returns the url, optional with the query string and processed by a proxy.
	     *
	     * @param {Boolean} [query=false] If true, the query string is included.
	     * @param {Boolean} [proxy=false] If true, the url is processed the proxy object if defined.
	     *
	     * @returns {String} The url with all the requested components.
	     */
	    Resource.prototype.getUrlComponent = function(query, proxy) {
	        if(this.isDataUri) {
	            return this._url;
	        }

	        var uri = new URI(this._url);

	        if (query) {
	            stringifyQuery(uri, this);
	        }

	        // objectToQuery escapes the placeholders.  Undo that.
	        var url = uri.toString().replace(/%7B/g, '{').replace(/%7D/g, '}');

	        var templateValues = this._templateValues;
	        url = url.replace(/{(.*?)}/g, function(match, key) {
	            var replacement = templateValues[key];
	            if (when.defined(replacement)) {
	                // use the replacement value from templateValues if there is one...
	                return encodeURIComponent(replacement);
	            }
	            // otherwise leave it unchanged
	            return match;
	        });

	        if (proxy && when.defined(this.proxy)) {
	            url = this.proxy.getURL(url);
	        }
	        return url;
	    };

	    /**
	     * Combines the specified object and the existing query parameters. This allows you to add many parameters at once,
	     *  as opposed to adding them one at a time to the queryParameters property. If a value is already set, it will be replaced with the new value.
	     *
	     * @param {Object} params The query parameters
	     * @param {Boolean} [useAsDefault=false] If true the params will be used as the default values, so they will only be set if they are undefined.
	     */
	    Resource.prototype.setQueryParameters = function(params, useAsDefault) {
	        if (useAsDefault) {
	            this._queryParameters = combineQueryParameters(this._queryParameters, params, false);
	        } else {
	            this._queryParameters = combineQueryParameters(params, this._queryParameters, false);
	        }
	    };

	    /**
	     * Combines the specified object and the existing query parameters. This allows you to add many parameters at once,
	     *  as opposed to adding them one at a time to the queryParameters property.
	     *
	     * @param {Object} params The query parameters
	     */
	    Resource.prototype.appendQueryParameters = function(params) {
	        this._queryParameters = combineQueryParameters(params, this._queryParameters, true);
	    };

	    /**
	     * Combines the specified object and the existing template values. This allows you to add many values at once,
	     *  as opposed to adding them one at a time to the templateValues property. If a value is already set, it will become an array and the new value will be appended.
	     *
	     * @param {Object} template The template values
	     * @param {Boolean} [useAsDefault=false] If true the values will be used as the default values, so they will only be set if they are undefined.
	     */
	    Resource.prototype.setTemplateValues = function(template, useAsDefault) {
	        if (useAsDefault) {
	            this._templateValues = combine(this._templateValues, template);
	        } else {
	            this._templateValues = combine(template, this._templateValues);
	        }
	    };

	    /**
	     * Returns a resource relative to the current instance. All properties remain the same as the current instance unless overridden in options.
	     *
	     * @param {Object} options An object with the following properties
	     * @param {String} [options.url]  The url that will be resolved relative to the url of the current instance.
	     * @param {Object} [options.queryParameters] An object containing query parameters that will be combined with those of the current instance.
	     * @param {Object} [options.templateValues] Key/Value pairs that are used to replace template values (eg. {x}). These will be combined with those of the current instance.
	     * @param {Object} [options.headers={}] Additional HTTP headers that will be sent.
	     * @param {DefaultProxy} [options.proxy] A proxy to be used when loading the resource.
	     * @param {Resource~RetryCallback} [options.retryCallback] The function to call when loading the resource fails.
	     * @param {Number} [options.retryAttempts] The number of times the retryCallback should be called before giving up.
	     * @param {Request} [options.request] A Request object that will be used. Intended for internal use only.
	     * @param {Boolean} [options.preserveQueryParameters=false] If true, this will keep all query parameters from the current resource and derived resource. If false, derived parameters will replace those of the current resource.
	     *
	     * @returns {Resource} The resource derived from the current one.
	     */
	    Resource.prototype.getDerivedResource = function(options) {
	        var resource = this.clone();
	        resource._retryCount = 0;

	        if (when.defined(options.url)) {
	            var uri = new URI(options.url);

	            var preserveQueryParameters = when.defaultValue(options.preserveQueryParameters, false);
	            parseQuery(uri, resource, true, preserveQueryParameters);

	            // Remove the fragment as it's not sent with a request
	            uri.fragment = undefined;

	            resource._url = uri.resolve(new URI(getAbsoluteUri(this._url))).toString();
	        }

	        if (when.defined(options.queryParameters)) {
	            resource._queryParameters = combine(options.queryParameters, resource._queryParameters);
	        }
	        if (when.defined(options.templateValues)) {
	            resource._templateValues = combine(options.templateValues, resource.templateValues);
	        }
	        if (when.defined(options.headers)) {
	            resource.headers = combine(options.headers, resource.headers);
	        }
	        if (when.defined(options.proxy)) {
	            resource.proxy = options.proxy;
	        }
	        if (when.defined(options.request)) {
	            resource.request = options.request;
	        }
	        if (when.defined(options.retryCallback)) {
	            resource.retryCallback = options.retryCallback;
	        }
	        if (when.defined(options.retryAttempts)) {
	            resource.retryAttempts = options.retryAttempts;
	        }

	        return resource;
	    };

	    /**
	     * Called when a resource fails to load. This will call the retryCallback function if defined until retryAttempts is reached.
	     *
	     * @param {Error} [error] The error that was encountered.
	     *
	     * @returns {Promise<Boolean>} A promise to a boolean, that if true will cause the resource request to be retried.
	     *
	     * @private
	     */
	    Resource.prototype.retryOnError = function(error) {
	        var retryCallback = this.retryCallback;
	        if ((typeof retryCallback !== 'function') || (this._retryCount >= this.retryAttempts)) {
	            return when.when(false);
	        }

	        var that = this;
	        return when.when(retryCallback(this, error))
	            .then(function(result) {
	                ++that._retryCount;

	                return result;
	            });
	    };

	    /**
	     * Duplicates a Resource instance.
	     *
	     * @param {Resource} [result] The object onto which to store the result.
	     *
	     * @returns {Resource} The modified result parameter or a new Resource instance if one was not provided.
	     */
	    Resource.prototype.clone = function(result) {
	        if (!when.defined(result)) {
	            result = new Resource({
	                url : this._url
	            });
	        }

	        result._url = this._url;
	        result._queryParameters = clone(this._queryParameters);
	        result._templateValues = clone(this._templateValues);
	        result.headers = clone(this.headers);
	        result.proxy = this.proxy;
	        result.retryCallback = this.retryCallback;
	        result.retryAttempts = this.retryAttempts;
	        result._retryCount = 0;
	        result.request = this.request.clone();

	        return result;
	    };

	    /**
	     * Returns the base path of the Resource.
	     *
	     * @param {Boolean} [includeQuery = false] Whether or not to include the query string and fragment form the uri
	     *
	     * @returns {String} The base URI of the resource
	     */
	    Resource.prototype.getBaseUri = function(includeQuery) {
	        return getBaseUri(this.getUrlComponent(includeQuery), includeQuery);
	    };

	    /**
	     * Appends a forward slash to the URL.
	     */
	    Resource.prototype.appendForwardSlash = function() {
	        this._url = appendForwardSlash(this._url);
	    };

	    /**
	     * Asynchronously loads the resource as raw binary data.  Returns a promise that will resolve to
	     * an ArrayBuffer once loaded, or reject if the resource failed to load.  The data is loaded
	     * using XMLHttpRequest, which means that in order to make requests to another origin,
	     * the server must have Cross-Origin Resource Sharing (CORS) headers enabled.
	     *
	     * @returns {Promise.<ArrayBuffer>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	     *
	     * @example
	     * // load a single URL asynchronously
	     * resource.fetchArrayBuffer().then(function(arrayBuffer) {
	     *     // use the data
	     * }).otherwise(function(error) {
	     *     // an error occurred
	     * });
	     *
	     * @see {@link http://www.w3.org/TR/cors/|Cross-Origin Resource Sharing}
	     * @see {@link http://wiki.commonjs.org/wiki/Promises/A|CommonJS Promises/A}
	     */
	    Resource.prototype.fetchArrayBuffer = function () {
	        return this.fetch({
	            responseType : 'arraybuffer'
	        });
	    };

	    /**
	     * Creates a Resource and calls fetchArrayBuffer() on it.
	     *
	     * @param {String|Object} options A url or an object with the following properties
	     * @param {String} options.url The url of the resource.
	     * @param {Object} [options.queryParameters] An object containing query parameters that will be sent when retrieving the resource.
	     * @param {Object} [options.templateValues] Key/Value pairs that are used to replace template values (eg. {x}).
	     * @param {Object} [options.headers={}] Additional HTTP headers that will be sent.
	     * @param {DefaultProxy} [options.proxy] A proxy to be used when loading the resource.
	     * @param {Resource~RetryCallback} [options.retryCallback] The Function to call when a request for this resource fails. If it returns true, the request will be retried.
	     * @param {Number} [options.retryAttempts=0] The number of times the retryCallback should be called before giving up.
	     * @param {Request} [options.request] A Request object that will be used. Intended for internal use only.
	     * @returns {Promise.<ArrayBuffer>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	     */
	    Resource.fetchArrayBuffer = function (options) {
	        var resource = new Resource(options);
	        return resource.fetchArrayBuffer();
	    };

	    /**
	     * Asynchronously loads the given resource as a blob.  Returns a promise that will resolve to
	     * a Blob once loaded, or reject if the resource failed to load.  The data is loaded
	     * using XMLHttpRequest, which means that in order to make requests to another origin,
	     * the server must have Cross-Origin Resource Sharing (CORS) headers enabled.
	     *
	     * @returns {Promise.<Blob>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	     *
	     * @example
	     * // load a single URL asynchronously
	     * resource.fetchBlob().then(function(blob) {
	     *     // use the data
	     * }).otherwise(function(error) {
	     *     // an error occurred
	     * });
	     *
	     * @see {@link http://www.w3.org/TR/cors/|Cross-Origin Resource Sharing}
	     * @see {@link http://wiki.commonjs.org/wiki/Promises/A|CommonJS Promises/A}
	     */
	    Resource.prototype.fetchBlob = function () {
	        return this.fetch({
	            responseType : 'blob'
	        });
	    };

	    /**
	     * Creates a Resource and calls fetchBlob() on it.
	     *
	     * @param {String|Object} options A url or an object with the following properties
	     * @param {String} options.url The url of the resource.
	     * @param {Object} [options.queryParameters] An object containing query parameters that will be sent when retrieving the resource.
	     * @param {Object} [options.templateValues] Key/Value pairs that are used to replace template values (eg. {x}).
	     * @param {Object} [options.headers={}] Additional HTTP headers that will be sent.
	     * @param {DefaultProxy} [options.proxy] A proxy to be used when loading the resource.
	     * @param {Resource~RetryCallback} [options.retryCallback] The Function to call when a request for this resource fails. If it returns true, the request will be retried.
	     * @param {Number} [options.retryAttempts=0] The number of times the retryCallback should be called before giving up.
	     * @param {Request} [options.request] A Request object that will be used. Intended for internal use only.
	     * @returns {Promise.<Blob>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	     */
	    Resource.fetchBlob = function (options) {
	        var resource = new Resource(options);
	        return resource.fetchBlob();
	    };

	    /**
	     * Asynchronously loads the given image resource.  Returns a promise that will resolve to
	     * an {@link https://developer.mozilla.org/en-US/docs/Web/API/ImageBitmap|ImageBitmap} if <code>preferImageBitmap</code> is true and the browser supports <code>createImageBitmap</code> or otherwise an
	     * {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement|Image} once loaded, or reject if the image failed to load.
	     *
	     * @param {Object} [options] An object with the following properties.
	     * @param {Boolean} [options.preferBlob=false] If true, we will load the image via a blob.
	     * @param {Boolean} [options.preferImageBitmap=false] If true, image will be decoded during fetch and an <code>ImageBitmap</code> is returned.
	     * @param {Boolean} [options.flipY=false] If true, image will be vertically flipped during decode. Only applies if the browser supports <code>createImageBitmap</code>.
	     * @returns {Promise.<ImageBitmap>|Promise.<Image>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	     *
	     *
	     * @example
	     * // load a single image asynchronously
	     * resource.fetchImage().then(function(image) {
	     *     // use the loaded image
	     * }).otherwise(function(error) {
	     *     // an error occurred
	     * });
	     *
	     * // load several images in parallel
	     * when.all([resource1.fetchImage(), resource2.fetchImage()]).then(function(images) {
	     *     // images is an array containing all the loaded images
	     * });
	     *
	     * @see {@link http://www.w3.org/TR/cors/|Cross-Origin Resource Sharing}
	     * @see {@link http://wiki.commonjs.org/wiki/Promises/A|CommonJS Promises/A}
	     */
	    Resource.prototype.fetchImage = function (options) {
	        options = when.defaultValue(options, when.defaultValue.EMPTY_OBJECT);
	        var preferImageBitmap = when.defaultValue(options.preferImageBitmap, false);
	        var preferBlob = when.defaultValue(options.preferBlob, false);
	        var flipY = when.defaultValue(options.flipY, false);

	        checkAndResetRequest(this.request);

	        // We try to load the image normally if
	        // 1. Blobs aren't supported
	        // 2. It's a data URI
	        // 3. It's a blob URI
	        // 4. It doesn't have request headers and we preferBlob is false
	        if (!xhrBlobSupported || this.isDataUri || this.isBlobUri || (!this.hasHeaders && !preferBlob)) {
	            return fetchImage({
	                resource: this,
	                flipY: flipY,
	                preferImageBitmap: preferImageBitmap
	            });
	        }

	        var blobPromise = this.fetchBlob();
	        if (!when.defined(blobPromise)) {
	            return;
	        }

	        var supportsImageBitmap;
	        var useImageBitmap;
	        var generatedBlobResource;
	        var generatedBlob;
	        return Resource.supportsImageBitmapOptions()
	            .then(function(result) {
	                supportsImageBitmap = result;
	                useImageBitmap = supportsImageBitmap && preferImageBitmap;
	                return blobPromise;
	            })
	            .then(function(blob) {
	                if (!when.defined(blob)) {
	                    return;
	                }
	                generatedBlob = blob;
	                if (useImageBitmap) {
	                    return Resource.createImageBitmapFromBlob(blob, {
	                        flipY: flipY,
	                        premultiplyAlpha: false
	                    });
	                }
	                var blobUrl = window.URL.createObjectURL(blob);
	                generatedBlobResource = new Resource({
	                    url: blobUrl
	                });

	                return fetchImage({
	                    resource: generatedBlobResource,
	                    flipY: flipY,
	                    preferImageBitmap: false
	                });
	            })
	            .then(function(image) {
	                if (!when.defined(image)) {
	                    return;
	                }

	                // The blob object may be needed for use by a TileDiscardPolicy,
	                // so attach it to the image.
	                image.blob = generatedBlob;

	                if (useImageBitmap) {
	                    return image;
	                }

	                window.URL.revokeObjectURL(generatedBlobResource.url);
	                return image;
	            })
	            .otherwise(function(error) {
	                if (when.defined(generatedBlobResource)) {
	                    window.URL.revokeObjectURL(generatedBlobResource.url);
	                }

	                // If the blob load succeeded but the image decode failed, attach the blob
	                // to the error object for use by a TileDiscardPolicy.
	                // In particular, BingMapsImageryProvider uses this to detect the
	                // zero-length response that is returned when a tile is not available.
	                error.blob = generatedBlob;

	                return when.when.reject(error);
	            });
	    };

	    /**
	     * Fetches an image and returns a promise to it.
	     *
	     * @param {Object} [options] An object with the following properties.
	     * @param {Resource} [options.resource] Resource object that points to an image to fetch.
	     * @param {Boolean} [options.preferImageBitmap] If true, image will be decoded during fetch and an <code>ImageBitmap</code> is returned.
	     * @param {Boolean} [options.flipY] If true, image will be vertically flipped during decode. Only applies if the browser supports <code>createImageBitmap</code>.
	     *
	     * @private
	     */
	    function fetchImage(options) {
	        var resource = options.resource;
	        var flipY = options.flipY;
	        var preferImageBitmap = options.preferImageBitmap;

	        var request = resource.request;
	        request.url = resource.url;
	        request.requestFunction = function() {
	            var crossOrigin = false;

	            // data URIs can't have crossorigin set.
	            if (!resource.isDataUri && !resource.isBlobUri) {
	                crossOrigin = resource.isCrossOriginUrl;
	            }

	            var deferred = when.when.defer();
	            Resource._Implementations.createImage(request, crossOrigin, deferred, flipY, preferImageBitmap);

	            return deferred.promise;
	        };

	        var promise = RequestScheduler.request(request);
	        if (!when.defined(promise)) {
	            return;
	        }

	        return promise
	            .otherwise(function(e) {
	                // Don't retry cancelled or otherwise aborted requests
	                if (request.state !== RequestState$1.FAILED) {
	                    return when.when.reject(e);
	                }

	                return resource.retryOnError(e)
	                    .then(function(retry) {
	                        if (retry) {
	                            // Reset request so it can try again
	                            request.state = RequestState$1.UNISSUED;
	                            request.deferred = undefined;

	                            return fetchImage({
	                                resource: resource,
	                                flipY: flipY,
	                                preferImageBitmap: preferImageBitmap
	                            });
	                        }

	                        return when.when.reject(e);
	                    });
	            });
	    }

	    /**
	     * Creates a Resource and calls fetchImage() on it.
	     *
	     * @param {String|Object} options A url or an object with the following properties
	     * @param {String} options.url The url of the resource.
	     * @param {Object} [options.queryParameters] An object containing query parameters that will be sent when retrieving the resource.
	     * @param {Object} [options.templateValues] Key/Value pairs that are used to replace template values (eg. {x}).
	     * @param {Object} [options.headers={}] Additional HTTP headers that will be sent.
	     * @param {DefaultProxy} [options.proxy] A proxy to be used when loading the resource.
	     * @param {Boolean} [options.flipY=false] Whether to vertically flip the image during fetch and decode. Only applies when requesting an image and the browser supports <code>createImageBitmap</code>.
	     * @param {Resource~RetryCallback} [options.retryCallback] The Function to call when a request for this resource fails. If it returns true, the request will be retried.
	     * @param {Number} [options.retryAttempts=0] The number of times the retryCallback should be called before giving up.
	     * @param {Request} [options.request] A Request object that will be used. Intended for internal use only.
	     * @param {Boolean} [options.preferBlob=false]  If true, we will load the image via a blob.
	     * @param {Boolean} [options.preferImageBitmap=false] If true, image will be decoded during fetch and an <code>ImageBitmap</code> is returned.
	     * @returns {Promise.<ImageBitmap>|Promise.<Image>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	     */
	    Resource.fetchImage = function (options) {
	        var resource = new Resource(options);
	        return resource.fetchImage({
	            flipY: options.flipY,
	            preferBlob: options.preferBlob,
	            preferImageBitmap: options.preferImageBitmap
	        });
	    };

	    /**
	     * Asynchronously loads the given resource as text.  Returns a promise that will resolve to
	     * a String once loaded, or reject if the resource failed to load.  The data is loaded
	     * using XMLHttpRequest, which means that in order to make requests to another origin,
	     * the server must have Cross-Origin Resource Sharing (CORS) headers enabled.
	     *
	     * @returns {Promise.<String>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	     *
	     * @example
	     * // load text from a URL, setting a custom header
	     * var resource = new Resource({
	     *   url: 'http://someUrl.com/someJson.txt',
	     *   headers: {
	     *     'X-Custom-Header' : 'some value'
	     *   }
	     * });
	     * resource.fetchText().then(function(text) {
	     *     // Do something with the text
	     * }).otherwise(function(error) {
	     *     // an error occurred
	     * });
	     *
	     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest|XMLHttpRequest}
	     * @see {@link http://www.w3.org/TR/cors/|Cross-Origin Resource Sharing}
	     * @see {@link http://wiki.commonjs.org/wiki/Promises/A|CommonJS Promises/A}
	     */
	    Resource.prototype.fetchText = function() {
	        return this.fetch({
	            responseType : 'text'
	        });
	    };

	    /**
	     * Creates a Resource and calls fetchText() on it.
	     *
	     * @param {String|Object} options A url or an object with the following properties
	     * @param {String} options.url The url of the resource.
	     * @param {Object} [options.queryParameters] An object containing query parameters that will be sent when retrieving the resource.
	     * @param {Object} [options.templateValues] Key/Value pairs that are used to replace template values (eg. {x}).
	     * @param {Object} [options.headers={}] Additional HTTP headers that will be sent.
	     * @param {DefaultProxy} [options.proxy] A proxy to be used when loading the resource.
	     * @param {Resource~RetryCallback} [options.retryCallback] The Function to call when a request for this resource fails. If it returns true, the request will be retried.
	     * @param {Number} [options.retryAttempts=0] The number of times the retryCallback should be called before giving up.
	     * @param {Request} [options.request] A Request object that will be used. Intended for internal use only.
	     * @returns {Promise.<String>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	     */
	    Resource.fetchText = function (options) {
	        var resource = new Resource(options);
	        return resource.fetchText();
	    };

	    // note: &#42;&#47;&#42; below is */* but that ends the comment block early
	    /**
	     * Asynchronously loads the given resource as JSON.  Returns a promise that will resolve to
	     * a JSON object once loaded, or reject if the resource failed to load.  The data is loaded
	     * using XMLHttpRequest, which means that in order to make requests to another origin,
	     * the server must have Cross-Origin Resource Sharing (CORS) headers enabled. This function
	     * adds 'Accept: application/json,&#42;&#47;&#42;;q=0.01' to the request headers, if not
	     * already specified.
	     *
	     * @returns {Promise.<Object>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	     *
	     *
	     * @example
	     * resource.fetchJson().then(function(jsonData) {
	     *     // Do something with the JSON object
	     * }).otherwise(function(error) {
	     *     // an error occurred
	     * });
	     *
	     * @see {@link http://www.w3.org/TR/cors/|Cross-Origin Resource Sharing}
	     * @see {@link http://wiki.commonjs.org/wiki/Promises/A|CommonJS Promises/A}
	     */
	    Resource.prototype.fetchJson = function() {
	        var promise = this.fetch({
	            responseType : 'text',
	            headers: {
	                Accept : 'application/json,*/*;q=0.01'
	            }
	        });

	        if (!when.defined(promise)) {
	            return undefined;
	        }

	        return promise
	            .then(function(value) {
	                if (!when.defined(value)) {
	                    return;
	                }
	                return JSON.parse(value);
	            });
	    };

	    /**
	     * Creates a Resource and calls fetchJson() on it.
	     *
	     * @param {String|Object} options A url or an object with the following properties
	     * @param {String} options.url The url of the resource.
	     * @param {Object} [options.queryParameters] An object containing query parameters that will be sent when retrieving the resource.
	     * @param {Object} [options.templateValues] Key/Value pairs that are used to replace template values (eg. {x}).
	     * @param {Object} [options.headers={}] Additional HTTP headers that will be sent.
	     * @param {DefaultProxy} [options.proxy] A proxy to be used when loading the resource.
	     * @param {Resource~RetryCallback} [options.retryCallback] The Function to call when a request for this resource fails. If it returns true, the request will be retried.
	     * @param {Number} [options.retryAttempts=0] The number of times the retryCallback should be called before giving up.
	     * @param {Request} [options.request] A Request object that will be used. Intended for internal use only.
	     * @returns {Promise.<Object>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	     */
	    Resource.fetchJson = function (options) {
	        var resource = new Resource(options);
	        return resource.fetchJson();
	    };

	    /**
	     * Asynchronously loads the given resource as XML.  Returns a promise that will resolve to
	     * an XML Document once loaded, or reject if the resource failed to load.  The data is loaded
	     * using XMLHttpRequest, which means that in order to make requests to another origin,
	     * the server must have Cross-Origin Resource Sharing (CORS) headers enabled.
	     *
	     * @returns {Promise.<XMLDocument>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	     *
	     *
	     * @example
	     * // load XML from a URL, setting a custom header
	     * Cesium.loadXML('http://someUrl.com/someXML.xml', {
	     *   'X-Custom-Header' : 'some value'
	     * }).then(function(document) {
	     *     // Do something with the document
	     * }).otherwise(function(error) {
	     *     // an error occurred
	     * });
	     *
	     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest|XMLHttpRequest}
	     * @see {@link http://www.w3.org/TR/cors/|Cross-Origin Resource Sharing}
	     * @see {@link http://wiki.commonjs.org/wiki/Promises/A|CommonJS Promises/A}
	     */
	    Resource.prototype.fetchXML = function() {
	        return this.fetch({
	            responseType : 'document',
	            overrideMimeType : 'text/xml'
	        });
	    };

	    /**
	     * Creates a Resource and calls fetchXML() on it.
	     *
	     * @param {String|Object} options A url or an object with the following properties
	     * @param {String} options.url The url of the resource.
	     * @param {Object} [options.queryParameters] An object containing query parameters that will be sent when retrieving the resource.
	     * @param {Object} [options.templateValues] Key/Value pairs that are used to replace template values (eg. {x}).
	     * @param {Object} [options.headers={}] Additional HTTP headers that will be sent.
	     * @param {DefaultProxy} [options.proxy] A proxy to be used when loading the resource.
	     * @param {Resource~RetryCallback} [options.retryCallback] The Function to call when a request for this resource fails. If it returns true, the request will be retried.
	     * @param {Number} [options.retryAttempts=0] The number of times the retryCallback should be called before giving up.
	     * @param {Request} [options.request] A Request object that will be used. Intended for internal use only.
	     * @returns {Promise.<XMLDocument>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	     */
	    Resource.fetchXML = function (options) {
	        var resource = new Resource(options);
	        return resource.fetchXML();
	    };

	    /**
	     * Requests a resource using JSONP.
	     *
	     * @param {String} [callbackParameterName='callback'] The callback parameter name that the server expects.
	     * @returns {Promise.<Object>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	     *
	     *
	     * @example
	     * // load a data asynchronously
	     * resource.fetchJsonp().then(function(data) {
	     *     // use the loaded data
	     * }).otherwise(function(error) {
	     *     // an error occurred
	     * });
	     *
	     * @see {@link http://wiki.commonjs.org/wiki/Promises/A|CommonJS Promises/A}
	     */
	    Resource.prototype.fetchJsonp = function(callbackParameterName) {
	        callbackParameterName = when.defaultValue(callbackParameterName, 'callback');

	        checkAndResetRequest(this.request);

	        //generate a unique function name
	        var functionName;
	        do {
	            functionName = 'loadJsonp' + Math.random().toString().substring(2, 8);
	        } while (when.defined(window[functionName]));

	        return fetchJsonp(this, callbackParameterName, functionName);
	    };

	    function fetchJsonp(resource, callbackParameterName, functionName) {
	        var callbackQuery = {};
	        callbackQuery[callbackParameterName] = functionName;
	        resource.setQueryParameters(callbackQuery);

	        var request = resource.request;
	        request.url = resource.url;
	        request.requestFunction = function() {
	            var deferred = when.when.defer();

	            //assign a function with that name in the global scope
	            window[functionName] = function(data) {
	                deferred.resolve(data);

	                try {
	                    delete window[functionName];
	                } catch (e) {
	                    window[functionName] = undefined;
	                }
	            };

	            Resource._Implementations.loadAndExecuteScript(resource.url, functionName, deferred);
	            return deferred.promise;
	        };

	        var promise = RequestScheduler.request(request);
	        if (!when.defined(promise)) {
	            return;
	        }

	        return promise
	            .otherwise(function(e) {
	                if (request.state !== RequestState$1.FAILED) {
	                    return when.when.reject(e);
	                }

	                return resource.retryOnError(e)
	                    .then(function(retry) {
	                        if (retry) {
	                            // Reset request so it can try again
	                            request.state = RequestState$1.UNISSUED;
	                            request.deferred = undefined;

	                            return fetchJsonp(resource, callbackParameterName, functionName);
	                        }

	                        return when.when.reject(e);
	                    });
	            });
	    }

	    /**
	     * Creates a Resource from a URL and calls fetchJsonp() on it.
	     *
	     * @param {String|Object} options A url or an object with the following properties
	     * @param {String} options.url The url of the resource.
	     * @param {Object} [options.queryParameters] An object containing query parameters that will be sent when retrieving the resource.
	     * @param {Object} [options.templateValues] Key/Value pairs that are used to replace template values (eg. {x}).
	     * @param {Object} [options.headers={}] Additional HTTP headers that will be sent.
	     * @param {DefaultProxy} [options.proxy] A proxy to be used when loading the resource.
	     * @param {Resource~RetryCallback} [options.retryCallback] The Function to call when a request for this resource fails. If it returns true, the request will be retried.
	     * @param {Number} [options.retryAttempts=0] The number of times the retryCallback should be called before giving up.
	     * @param {Request} [options.request] A Request object that will be used. Intended for internal use only.
	     * @param {String} [options.callbackParameterName='callback'] The callback parameter name that the server expects.
	     * @returns {Promise.<Object>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	     */
	    Resource.fetchJsonp = function (options) {
	        var resource = new Resource(options);
	        return resource.fetchJsonp(options.callbackParameterName);
	    };

	    /**
	     * @private
	     */
	    Resource.prototype._makeRequest = function(options) {
	        var resource = this;
	        checkAndResetRequest(resource.request);

	        var request = resource.request;
	        request.url = resource.url;

	        request.requestFunction = function(url) {
	            var responseType = options.responseType;
	            var headers = combine(options.headers, resource.headers);
	            var overrideMimeType = options.overrideMimeType;
	            var method = options.method;
	            var data = options.data;
	            var deferred = when.when.defer();
	            var newUrl = when.defined(url) ? url : resource.url;
	            var xhr = Resource._Implementations.loadWithXhr(newUrl, responseType, method, data, headers, deferred, overrideMimeType);
	            if (when.defined(xhr) && when.defined(xhr.abort)) {
	                request.cancelFunction = function() {
	                    xhr.abort();
	                };
	            }
	            return deferred.promise;
	        };

	        var promise = RequestScheduler.request(request);
	        if (!when.defined(promise)) {
	            return;
	        }

	        return promise
	            .then(function(data) {
	                return data;
	            })
	            .otherwise(function(e) {
	                if (request.state !== RequestState$1.FAILED) {
	                    return when.when.reject(e);
	                }

	                return resource.retryOnError(e)
	                    .then(function(retry) {
	                        if (retry) {
	                            // Reset request so it can try again
	                            request.state = RequestState$1.UNISSUED;
	                            request.deferred = undefined;

	                            return resource.fetch(options);
	                        }

	                        return when.when.reject(e);
	                    });
	            });
	    };

	    var dataUriRegex$1 = /^data:(.*?)(;base64)?,(.*)$/;

	    function decodeDataUriText(isBase64, data) {
	        var result = decodeURIComponent(data);
	        if (isBase64) {
	            return atob(result);
	        }
	        return result;
	    }

	    function decodeDataUriArrayBuffer(isBase64, data) {
	        var byteString = decodeDataUriText(isBase64, data);
	        var buffer = new ArrayBuffer(byteString.length);
	        var view = new Uint8Array(buffer);
	        for (var i = 0; i < byteString.length; i++) {
	            view[i] = byteString.charCodeAt(i);
	        }
	        return buffer;
	    }

	    function decodeDataUri(dataUriRegexResult, responseType) {
	        responseType = when.defaultValue(responseType, '');
	        var mimeType = dataUriRegexResult[1];
	        var isBase64 = !!dataUriRegexResult[2];
	        var data = dataUriRegexResult[3];

	        switch (responseType) {
	            case '':
	            case 'text':
	                return decodeDataUriText(isBase64, data);
	            case 'arraybuffer':
	                return decodeDataUriArrayBuffer(isBase64, data);
	            case 'blob':
	                var buffer = decodeDataUriArrayBuffer(isBase64, data);
	                return new Blob([buffer], {
	                    type : mimeType
	                });
	            case 'document':
	                var parser = new DOMParser();
	                return parser.parseFromString(decodeDataUriText(isBase64, data), mimeType);
	            case 'json':
	                return JSON.parse(decodeDataUriText(isBase64, data));
	            default:
	                //>>includeStart('debug', pragmas.debug);
	                throw new Check.DeveloperError('Unhandled responseType: ' + responseType);
	            //>>includeEnd('debug');
	        }
	    }

	    /**
	     * Asynchronously loads the given resource.  Returns a promise that will resolve to
	     * the result once loaded, or reject if the resource failed to load.  The data is loaded
	     * using XMLHttpRequest, which means that in order to make requests to another origin,
	     * the server must have Cross-Origin Resource Sharing (CORS) headers enabled. It's recommended that you use
	     * the more specific functions eg. fetchJson, fetchBlob, etc.
	     *
	     * @param {Object} [options] Object with the following properties:
	     * @param {String} [options.responseType] The type of response.  This controls the type of item returned.
	     * @param {Object} [options.headers] Additional HTTP headers to send with the request, if any.
	     * @param {String} [options.overrideMimeType] Overrides the MIME type returned by the server.
	     * @returns {Promise.<Object>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	     *
	     *
	     * @example
	     * resource.fetch()
	     *   .then(function(body) {
	     *       // use the data
	     *   }).otherwise(function(error) {
	     *       // an error occurred
	     *   });
	     *
	     * @see {@link http://www.w3.org/TR/cors/|Cross-Origin Resource Sharing}
	     * @see {@link http://wiki.commonjs.org/wiki/Promises/A|CommonJS Promises/A}
	     */
	    Resource.prototype.fetch = function(options) {
	        options = defaultClone(options, {});
	        options.method = 'GET';

	        return this._makeRequest(options);
	    };

	    /**
	     * Creates a Resource from a URL and calls fetch() on it.
	     *
	     * @param {String|Object} options A url or an object with the following properties
	     * @param {String} options.url The url of the resource.
	     * @param {Object} [options.queryParameters] An object containing query parameters that will be sent when retrieving the resource.
	     * @param {Object} [options.templateValues] Key/Value pairs that are used to replace template values (eg. {x}).
	     * @param {Object} [options.headers={}] Additional HTTP headers that will be sent.
	     * @param {DefaultProxy} [options.proxy] A proxy to be used when loading the resource.
	     * @param {Resource~RetryCallback} [options.retryCallback] The Function to call when a request for this resource fails. If it returns true, the request will be retried.
	     * @param {Number} [options.retryAttempts=0] The number of times the retryCallback should be called before giving up.
	     * @param {Request} [options.request] A Request object that will be used. Intended for internal use only.
	     * @param {String} [options.responseType] The type of response.  This controls the type of item returned.
	     * @param {String} [options.overrideMimeType] Overrides the MIME type returned by the server.
	     * @returns {Promise.<Object>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	     */
	    Resource.fetch = function (options) {
	        var resource = new Resource(options);
	        return resource.fetch({
	            // Make copy of just the needed fields because headers can be passed to both the constructor and to fetch
	            responseType: options.responseType,
	            overrideMimeType: options.overrideMimeType
	        });
	    };

	    /**
	     * Asynchronously deletes the given resource.  Returns a promise that will resolve to
	     * the result once loaded, or reject if the resource failed to load.  The data is loaded
	     * using XMLHttpRequest, which means that in order to make requests to another origin,
	     * the server must have Cross-Origin Resource Sharing (CORS) headers enabled.
	     *
	     * @param {Object} [options] Object with the following properties:
	     * @param {String} [options.responseType] The type of response.  This controls the type of item returned.
	     * @param {Object} [options.headers] Additional HTTP headers to send with the request, if any.
	     * @param {String} [options.overrideMimeType] Overrides the MIME type returned by the server.
	     * @returns {Promise.<Object>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	     *
	     *
	     * @example
	     * resource.delete()
	     *   .then(function(body) {
	     *       // use the data
	     *   }).otherwise(function(error) {
	     *       // an error occurred
	     *   });
	     *
	     * @see {@link http://www.w3.org/TR/cors/|Cross-Origin Resource Sharing}
	     * @see {@link http://wiki.commonjs.org/wiki/Promises/A|CommonJS Promises/A}
	     */
	    Resource.prototype.delete = function(options) {
	        options = defaultClone(options, {});
	        options.method = 'DELETE';

	        return this._makeRequest(options);
	    };

	    /**
	     * Creates a Resource from a URL and calls delete() on it.
	     *
	     * @param {String|Object} options A url or an object with the following properties
	     * @param {String} options.url The url of the resource.
	     * @param {Object} [options.data] Data that is posted with the resource.
	     * @param {Object} [options.queryParameters] An object containing query parameters that will be sent when retrieving the resource.
	     * @param {Object} [options.templateValues] Key/Value pairs that are used to replace template values (eg. {x}).
	     * @param {Object} [options.headers={}] Additional HTTP headers that will be sent.
	     * @param {DefaultProxy} [options.proxy] A proxy to be used when loading the resource.
	     * @param {Resource~RetryCallback} [options.retryCallback] The Function to call when a request for this resource fails. If it returns true, the request will be retried.
	     * @param {Number} [options.retryAttempts=0] The number of times the retryCallback should be called before giving up.
	     * @param {Request} [options.request] A Request object that will be used. Intended for internal use only.
	     * @param {String} [options.responseType] The type of response.  This controls the type of item returned.
	     * @param {String} [options.overrideMimeType] Overrides the MIME type returned by the server.
	     * @returns {Promise.<Object>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	     */
	    Resource.delete = function (options) {
	        var resource = new Resource(options);
	        return resource.delete({
	            // Make copy of just the needed fields because headers can be passed to both the constructor and to fetch
	            responseType: options.responseType,
	            overrideMimeType: options.overrideMimeType,
	            data: options.data
	        });
	    };

	    /**
	     * Asynchronously gets headers the given resource.  Returns a promise that will resolve to
	     * the result once loaded, or reject if the resource failed to load.  The data is loaded
	     * using XMLHttpRequest, which means that in order to make requests to another origin,
	     * the server must have Cross-Origin Resource Sharing (CORS) headers enabled.
	     *
	     * @param {Object} [options] Object with the following properties:
	     * @param {String} [options.responseType] The type of response.  This controls the type of item returned.
	     * @param {Object} [options.headers] Additional HTTP headers to send with the request, if any.
	     * @param {String} [options.overrideMimeType] Overrides the MIME type returned by the server.
	     * @returns {Promise.<Object>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	     *
	     *
	     * @example
	     * resource.head()
	     *   .then(function(headers) {
	     *       // use the data
	     *   }).otherwise(function(error) {
	     *       // an error occurred
	     *   });
	     *
	     * @see {@link http://www.w3.org/TR/cors/|Cross-Origin Resource Sharing}
	     * @see {@link http://wiki.commonjs.org/wiki/Promises/A|CommonJS Promises/A}
	     */
	    Resource.prototype.head = function(options) {
	        options = defaultClone(options, {});
	        options.method = 'HEAD';

	        return this._makeRequest(options);
	    };

	    /**
	     * Creates a Resource from a URL and calls head() on it.
	     *
	     * @param {String|Object} options A url or an object with the following properties
	     * @param {String} options.url The url of the resource.
	     * @param {Object} [options.queryParameters] An object containing query parameters that will be sent when retrieving the resource.
	     * @param {Object} [options.templateValues] Key/Value pairs that are used to replace template values (eg. {x}).
	     * @param {Object} [options.headers={}] Additional HTTP headers that will be sent.
	     * @param {DefaultProxy} [options.proxy] A proxy to be used when loading the resource.
	     * @param {Resource~RetryCallback} [options.retryCallback] The Function to call when a request for this resource fails. If it returns true, the request will be retried.
	     * @param {Number} [options.retryAttempts=0] The number of times the retryCallback should be called before giving up.
	     * @param {Request} [options.request] A Request object that will be used. Intended for internal use only.
	     * @param {String} [options.responseType] The type of response.  This controls the type of item returned.
	     * @param {String} [options.overrideMimeType] Overrides the MIME type returned by the server.
	     * @returns {Promise.<Object>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	     */
	    Resource.head = function (options) {
	        var resource = new Resource(options);
	        return resource.head({
	            // Make copy of just the needed fields because headers can be passed to both the constructor and to fetch
	            responseType: options.responseType,
	            overrideMimeType: options.overrideMimeType
	        });
	    };

	    /**
	     * Asynchronously gets options the given resource.  Returns a promise that will resolve to
	     * the result once loaded, or reject if the resource failed to load.  The data is loaded
	     * using XMLHttpRequest, which means that in order to make requests to another origin,
	     * the server must have Cross-Origin Resource Sharing (CORS) headers enabled.
	     *
	     * @param {Object} [options] Object with the following properties:
	     * @param {String} [options.responseType] The type of response.  This controls the type of item returned.
	     * @param {Object} [options.headers] Additional HTTP headers to send with the request, if any.
	     * @param {String} [options.overrideMimeType] Overrides the MIME type returned by the server.
	     * @returns {Promise.<Object>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	     *
	     *
	     * @example
	     * resource.options()
	     *   .then(function(headers) {
	     *       // use the data
	     *   }).otherwise(function(error) {
	     *       // an error occurred
	     *   });
	     *
	     * @see {@link http://www.w3.org/TR/cors/|Cross-Origin Resource Sharing}
	     * @see {@link http://wiki.commonjs.org/wiki/Promises/A|CommonJS Promises/A}
	     */
	    Resource.prototype.options = function(options) {
	        options = defaultClone(options, {});
	        options.method = 'OPTIONS';

	        return this._makeRequest(options);
	    };

	    /**
	     * Creates a Resource from a URL and calls options() on it.
	     *
	     * @param {String|Object} options A url or an object with the following properties
	     * @param {String} options.url The url of the resource.
	     * @param {Object} [options.queryParameters] An object containing query parameters that will be sent when retrieving the resource.
	     * @param {Object} [options.templateValues] Key/Value pairs that are used to replace template values (eg. {x}).
	     * @param {Object} [options.headers={}] Additional HTTP headers that will be sent.
	     * @param {DefaultProxy} [options.proxy] A proxy to be used when loading the resource.
	     * @param {Resource~RetryCallback} [options.retryCallback] The Function to call when a request for this resource fails. If it returns true, the request will be retried.
	     * @param {Number} [options.retryAttempts=0] The number of times the retryCallback should be called before giving up.
	     * @param {Request} [options.request] A Request object that will be used. Intended for internal use only.
	     * @param {String} [options.responseType] The type of response.  This controls the type of item returned.
	     * @param {String} [options.overrideMimeType] Overrides the MIME type returned by the server.
	     * @returns {Promise.<Object>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	     */
	    Resource.options = function (options) {
	        var resource = new Resource(options);
	        return resource.options({
	            // Make copy of just the needed fields because headers can be passed to both the constructor and to fetch
	            responseType: options.responseType,
	            overrideMimeType: options.overrideMimeType
	        });
	    };

	    /**
	     * Asynchronously posts data to the given resource.  Returns a promise that will resolve to
	     * the result once loaded, or reject if the resource failed to load.  The data is loaded
	     * using XMLHttpRequest, which means that in order to make requests to another origin,
	     * the server must have Cross-Origin Resource Sharing (CORS) headers enabled.
	     *
	     * @param {Object} data Data that is posted with the resource.
	     * @param {Object} [options] Object with the following properties:
	     * @param {Object} [options.data] Data that is posted with the resource.
	     * @param {String} [options.responseType] The type of response.  This controls the type of item returned.
	     * @param {Object} [options.headers] Additional HTTP headers to send with the request, if any.
	     * @param {String} [options.overrideMimeType] Overrides the MIME type returned by the server.
	     * @returns {Promise.<Object>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	     *
	     *
	     * @example
	     * resource.post(data)
	     *   .then(function(result) {
	     *       // use the result
	     *   }).otherwise(function(error) {
	     *       // an error occurred
	     *   });
	     *
	     * @see {@link http://www.w3.org/TR/cors/|Cross-Origin Resource Sharing}
	     * @see {@link http://wiki.commonjs.org/wiki/Promises/A|CommonJS Promises/A}
	     */
	    Resource.prototype.post = function(data, options) {
	        Check.Check.defined('data', data);

	        options = defaultClone(options, {});
	        options.method = 'POST';
	        options.data = data;

	        return this._makeRequest(options);
	    };

	    /**
	     * Creates a Resource from a URL and calls post() on it.
	     *
	     * @param {Object} options A url or an object with the following properties
	     * @param {String} options.url The url of the resource.
	     * @param {Object} options.data Data that is posted with the resource.
	     * @param {Object} [options.queryParameters] An object containing query parameters that will be sent when retrieving the resource.
	     * @param {Object} [options.templateValues] Key/Value pairs that are used to replace template values (eg. {x}).
	     * @param {Object} [options.headers={}] Additional HTTP headers that will be sent.
	     * @param {DefaultProxy} [options.proxy] A proxy to be used when loading the resource.
	     * @param {Resource~RetryCallback} [options.retryCallback] The Function to call when a request for this resource fails. If it returns true, the request will be retried.
	     * @param {Number} [options.retryAttempts=0] The number of times the retryCallback should be called before giving up.
	     * @param {Request} [options.request] A Request object that will be used. Intended for internal use only.
	     * @param {String} [options.responseType] The type of response.  This controls the type of item returned.
	     * @param {String} [options.overrideMimeType] Overrides the MIME type returned by the server.
	     * @returns {Promise.<Object>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	     */
	    Resource.post = function (options) {
	        var resource = new Resource(options);
	        return resource.post(options.data, {
	            // Make copy of just the needed fields because headers can be passed to both the constructor and to post
	            responseType: options.responseType,
	            overrideMimeType: options.overrideMimeType
	        });
	    };

	    /**
	     * Asynchronously puts data to the given resource.  Returns a promise that will resolve to
	     * the result once loaded, or reject if the resource failed to load.  The data is loaded
	     * using XMLHttpRequest, which means that in order to make requests to another origin,
	     * the server must have Cross-Origin Resource Sharing (CORS) headers enabled.
	     *
	     * @param {Object} data Data that is posted with the resource.
	     * @param {Object} [options] Object with the following properties:
	     * @param {String} [options.responseType] The type of response.  This controls the type of item returned.
	     * @param {Object} [options.headers] Additional HTTP headers to send with the request, if any.
	     * @param {String} [options.overrideMimeType] Overrides the MIME type returned by the server.
	     * @returns {Promise.<Object>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	     *
	     *
	     * @example
	     * resource.put(data)
	     *   .then(function(result) {
	     *       // use the result
	     *   }).otherwise(function(error) {
	     *       // an error occurred
	     *   });
	     *
	     * @see {@link http://www.w3.org/TR/cors/|Cross-Origin Resource Sharing}
	     * @see {@link http://wiki.commonjs.org/wiki/Promises/A|CommonJS Promises/A}
	     */
	    Resource.prototype.put = function(data, options) {
	        Check.Check.defined('data', data);

	        options = defaultClone(options, {});
	        options.method = 'PUT';
	        options.data = data;

	        return this._makeRequest(options);
	    };

	    /**
	     * Creates a Resource from a URL and calls put() on it.
	     *
	     * @param {Object} options A url or an object with the following properties
	     * @param {String} options.url The url of the resource.
	     * @param {Object} options.data Data that is posted with the resource.
	     * @param {Object} [options.queryParameters] An object containing query parameters that will be sent when retrieving the resource.
	     * @param {Object} [options.templateValues] Key/Value pairs that are used to replace template values (eg. {x}).
	     * @param {Object} [options.headers={}] Additional HTTP headers that will be sent.
	     * @param {DefaultProxy} [options.proxy] A proxy to be used when loading the resource.
	     * @param {Resource~RetryCallback} [options.retryCallback] The Function to call when a request for this resource fails. If it returns true, the request will be retried.
	     * @param {Number} [options.retryAttempts=0] The number of times the retryCallback should be called before giving up.
	     * @param {Request} [options.request] A Request object that will be used. Intended for internal use only.
	     * @param {String} [options.responseType] The type of response.  This controls the type of item returned.
	     * @param {String} [options.overrideMimeType] Overrides the MIME type returned by the server.
	     * @returns {Promise.<Object>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	     */
	    Resource.put = function (options) {
	        var resource = new Resource(options);
	        return resource.put(options.data, {
	            // Make copy of just the needed fields because headers can be passed to both the constructor and to post
	            responseType: options.responseType,
	            overrideMimeType: options.overrideMimeType
	        });
	    };

	    /**
	     * Asynchronously patches data to the given resource.  Returns a promise that will resolve to
	     * the result once loaded, or reject if the resource failed to load.  The data is loaded
	     * using XMLHttpRequest, which means that in order to make requests to another origin,
	     * the server must have Cross-Origin Resource Sharing (CORS) headers enabled.
	     *
	     * @param {Object} data Data that is posted with the resource.
	     * @param {Object} [options] Object with the following properties:
	     * @param {String} [options.responseType] The type of response.  This controls the type of item returned.
	     * @param {Object} [options.headers] Additional HTTP headers to send with the request, if any.
	     * @param {String} [options.overrideMimeType] Overrides the MIME type returned by the server.
	     * @returns {Promise.<Object>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	     *
	     *
	     * @example
	     * resource.patch(data)
	     *   .then(function(result) {
	     *       // use the result
	     *   }).otherwise(function(error) {
	     *       // an error occurred
	     *   });
	     *
	     * @see {@link http://www.w3.org/TR/cors/|Cross-Origin Resource Sharing}
	     * @see {@link http://wiki.commonjs.org/wiki/Promises/A|CommonJS Promises/A}
	     */
	    Resource.prototype.patch = function(data, options) {
	        Check.Check.defined('data', data);

	        options = defaultClone(options, {});
	        options.method = 'PATCH';
	        options.data = data;

	        return this._makeRequest(options);
	    };

	    /**
	     * Creates a Resource from a URL and calls patch() on it.
	     *
	     * @param {Object} options A url or an object with the following properties
	     * @param {String} options.url The url of the resource.
	     * @param {Object} options.data Data that is posted with the resource.
	     * @param {Object} [options.queryParameters] An object containing query parameters that will be sent when retrieving the resource.
	     * @param {Object} [options.templateValues] Key/Value pairs that are used to replace template values (eg. {x}).
	     * @param {Object} [options.headers={}] Additional HTTP headers that will be sent.
	     * @param {DefaultProxy} [options.proxy] A proxy to be used when loading the resource.
	     * @param {Resource~RetryCallback} [options.retryCallback] The Function to call when a request for this resource fails. If it returns true, the request will be retried.
	     * @param {Number} [options.retryAttempts=0] The number of times the retryCallback should be called before giving up.
	     * @param {Request} [options.request] A Request object that will be used. Intended for internal use only.
	     * @param {String} [options.responseType] The type of response.  This controls the type of item returned.
	     * @param {String} [options.overrideMimeType] Overrides the MIME type returned by the server.
	     * @returns {Promise.<Object>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	     */
	    Resource.patch = function (options) {
	        var resource = new Resource(options);
	        return resource.patch(options.data, {
	            // Make copy of just the needed fields because headers can be passed to both the constructor and to post
	            responseType: options.responseType,
	            overrideMimeType: options.overrideMimeType
	        });
	    };

	    /**
	     * Contains implementations of functions that can be replaced for testing
	     *
	     * @private
	     */
	    Resource._Implementations = {};

	    function loadImageElement(url, crossOrigin, deferred) {
	        var image = new Image();

	        image.onload = function() {
	            deferred.resolve(image);
	        };

	        image.onerror = function(e) {
	            deferred.reject(e);
	        };

	        if (crossOrigin) {
	            if (TrustedServers.contains(url)) {
	                image.crossOrigin = 'use-credentials';
	            } else {
	                image.crossOrigin = '';
	            }
	        }

	        image.src = url;
	    }

	    Resource._Implementations.createImage = function(request, crossOrigin, deferred, flipY, preferImageBitmap) {
	        var url = request.url;
	        // Passing an Image to createImageBitmap will force it to run on the main thread
	        // since DOM elements don't exist on workers. We convert it to a blob so it's non-blocking.
	        // See:
	        //    https://bugzilla.mozilla.org/show_bug.cgi?id=1044102#c38
	        //    https://bugs.chromium.org/p/chromium/issues/detail?id=580202#c10
	        Resource.supportsImageBitmapOptions()
	            .then(function(supportsImageBitmap) {
	                // We can only use ImageBitmap if we can flip on decode.
	                // See: https://github.com/CesiumGS/cesium/pull/7579#issuecomment-466146898
	                if (!(supportsImageBitmap && preferImageBitmap)) {
	                    loadImageElement(url, crossOrigin, deferred);
	                    return;
	                }
	                var responseType = 'blob';
	                var method = 'GET';
	                var xhrDeferred = when.when.defer();
	                var xhr = Resource._Implementations.loadWithXhr(
	                    url,
	                    responseType,
	                    method,
	                    undefined,
	                    undefined,
	                    xhrDeferred,
	                    undefined,
	                    undefined,
	                    undefined
	                );

	                if (when.defined(xhr) && when.defined(xhr.abort)) {
	                    request.cancelFunction = function() {
	                        xhr.abort();
	                    };
	                }
	                return xhrDeferred.promise.then(function(blob) {
	                    if (!when.defined(blob)) {
	                        deferred.reject(new RuntimeError.RuntimeError('Successfully retrieved ' + url + ' but it contained no content.'));
	                        return;
	                    }

	                    return Resource.createImageBitmapFromBlob(blob, {
	                        flipY: flipY,
	                        premultiplyAlpha: false
	                    });
	                }).then(deferred.resolve);
	            })
	            .otherwise(deferred.reject);
	    };

	    /**
	     * Wrapper for createImageBitmap
	     *
	     * @private
	     */
	    Resource.createImageBitmapFromBlob = function(blob, options) {
	        Check.Check.defined('options', options);
	        Check.Check.typeOf.bool('options.flipY', options.flipY);
	        Check.Check.typeOf.bool('options.premultiplyAlpha', options.premultiplyAlpha);

	        return createImageBitmap(blob, {
	            imageOrientation: options.flipY ? 'flipY' : 'none',
	            premultiplyAlpha: options.premultiplyAlpha ? 'premultiply' : 'none'
	        });
	    };

	    function decodeResponse(loadWithHttpResponse, responseType) {
	        switch (responseType) {
	          case 'text':
	              return loadWithHttpResponse.toString('utf8');
	          case 'json':
	              return JSON.parse(loadWithHttpResponse.toString('utf8'));
	          default:
	              return new Uint8Array(loadWithHttpResponse).buffer;
	        }
	    }

	    function loadWithHttpRequest(url, responseType, method, data, headers, deferred, overrideMimeType) {
	        // Note: only the 'json' and 'text' responseTypes transforms the loaded buffer
	        var URL = require('url').parse(url); // eslint-disable-line
	        var http = URL.protocol === 'https:' ? require('https') : require('http'); // eslint-disable-line
	        var zlib = require('zlib'); // eslint-disable-line
	        var options = {
	            protocol : URL.protocol,
	            hostname : URL.hostname,
	            port : URL.port,
	            path : URL.path,
	            query : URL.query,
	            method : method,
	            headers : headers
	        };

	        http.request(options)
	            .on('response', function(res) {
	                if (res.statusCode < 200 || res.statusCode >= 300) {
	                    deferred.reject(new RequestErrorEvent(res.statusCode, res, res.headers));
	                    return;
	                }

	                var chunkArray = [];
	                res.on('data', function(chunk) {
	                    chunkArray.push(chunk);
	                });

	                res.on('end', function() {
	                    var result = Buffer.concat(chunkArray); // eslint-disable-line
	                    if (res.headers['content-encoding'] === 'gzip') {
	                        zlib.gunzip(result, function(error, resultUnzipped) {
	                            if (error) {
	                                deferred.reject(new RuntimeError.RuntimeError('Error decompressing response.'));
	                            } else {
	                                deferred.resolve(decodeResponse(resultUnzipped, responseType));
	                            }
	                        });
	                    } else {
	                        deferred.resolve(decodeResponse(result, responseType));
	                    }
	                });
	            }).on('error', function(e) {
	                deferred.reject(new RequestErrorEvent());
	            }).end();
	    }

	    var noXMLHttpRequest = typeof XMLHttpRequest === 'undefined';
	    Resource._Implementations.loadWithXhr = function(url, responseType, method, data, headers, deferred, overrideMimeType) {
	        var dataUriRegexResult = dataUriRegex$1.exec(url);
	        if (dataUriRegexResult !== null) {
	            deferred.resolve(decodeDataUri(dataUriRegexResult, responseType));
	            return;
	        }

	        if (noXMLHttpRequest) {
	            loadWithHttpRequest(url, responseType, method, data, headers, deferred);
	            return;
	        }

	        var xhr = new XMLHttpRequest();

	        if (TrustedServers.contains(url)) {
	            xhr.withCredentials = true;
	        }

	        url = url.replace(/{/g, '%7B').replace(/}/g, '%7D');
	        xhr.open(method, url, true);

	        if (when.defined(overrideMimeType) && when.defined(xhr.overrideMimeType)) {
	            xhr.overrideMimeType(overrideMimeType);
	        }

	        if (when.defined(headers)) {
	            for (var key in headers) {
	                if (headers.hasOwnProperty(key)) {
	                    xhr.setRequestHeader(key, headers[key]);
	                }
	            }
	        }

	        if (when.defined(responseType)) {
	            xhr.responseType = responseType;
	        }

	        // While non-standard, file protocol always returns a status of 0 on success
	        var localFile = false;
	        if (typeof url === 'string') {
	            localFile = (url.indexOf('file://') === 0) || (typeof window !== 'undefined' && window.location.origin === 'file://');
	        }

	        xhr.onload = function() {
	            if ((xhr.status < 200 || xhr.status >= 300) && !(localFile && xhr.status === 0)) {
	                deferred.reject(new RequestErrorEvent(xhr.status, xhr.response, xhr.getAllResponseHeaders()));
	                return;
	            }

	            var response = xhr.response;
	            var browserResponseType = xhr.responseType;

	            if (method === 'HEAD' || method === 'OPTIONS') {
	                var responseHeaderString = xhr.getAllResponseHeaders();
	                var splitHeaders = responseHeaderString.trim().split(/[\r\n]+/);

	                var responseHeaders = {};
	                splitHeaders.forEach(function (line) {
	                    var parts = line.split(': ');
	                    var header = parts.shift();
	                    responseHeaders[header] = parts.join(': ');
	                });

	                deferred.resolve(responseHeaders);
	                return;
	            }

	            //All modern browsers will go into either the first or second if block or last else block.
	            //Other code paths support older browsers that either do not support the supplied responseType
	            //or do not support the xhr.response property.
	            if (xhr.status === 204) {
	                // accept no content
	                deferred.resolve();
	            } else if (when.defined(response) && (!when.defined(responseType) || (browserResponseType === responseType))) {
	                deferred.resolve(response);
	            } else if ((responseType === 'json') && typeof response === 'string') {
	                try {
	                    deferred.resolve(JSON.parse(response));
	                } catch (e) {
	                    deferred.reject(e);
	                }
	            } else if ((browserResponseType === '' || browserResponseType === 'document') && when.defined(xhr.responseXML) && xhr.responseXML.hasChildNodes()) {
	                deferred.resolve(xhr.responseXML);
	            } else if ((browserResponseType === '' || browserResponseType === 'text') && when.defined(xhr.responseText)) {
	                deferred.resolve(xhr.responseText);
	            } else {
	                deferred.reject(new RuntimeError.RuntimeError('Invalid XMLHttpRequest response type.'));
	            }
	        };

	        xhr.onerror = function(e) {
	            deferred.reject(new RequestErrorEvent());
	        };

	        xhr.send(data);

	        return xhr;
	    };

	    Resource._Implementations.loadAndExecuteScript = function(url, functionName, deferred) {
	        return loadAndExecuteScript(url).otherwise(deferred.reject);
	    };

	    /**
	     * The default implementations
	     *
	     * @private
	     */
	    Resource._DefaultImplementations = {};
	    Resource._DefaultImplementations.createImage = Resource._Implementations.createImage;
	    Resource._DefaultImplementations.loadWithXhr = Resource._Implementations.loadWithXhr;
	    Resource._DefaultImplementations.loadAndExecuteScript = Resource._Implementations.loadAndExecuteScript;

	    /**
	     * A resource instance initialized to the current browser location
	     *
	     * @type {Resource}
	     * @constant
	     */
	    Resource.DEFAULT = Object.freeze(new Resource({
	        url: (typeof document === 'undefined') ? '' : document.location.href.split('?')[0]
	    }));

	/*global CESIUM_BASE_URL*/

	    var cesiumScriptRegex = /((?:.*\/)|^)Cesium\.js$/;
	    function getBaseUrlFromCesiumScript() {
	        var scripts = document.getElementsByTagName('script');
	        for ( var i = 0, len = scripts.length; i < len; ++i) {
	            var src = scripts[i].getAttribute('src');
	            var result = cesiumScriptRegex.exec(src);
	            if (result !== null) {
	                return result[1];
	            }
	        }
	        return undefined;
	    }

	    var a$1;
	    function tryMakeAbsolute(url) {
	        if (typeof document === 'undefined') {
	            //Node.js and Web Workers. In both cases, the URL will already be absolute.
	            return url;
	        }

	        if (!when.defined(a$1)) {
	            a$1 = document.createElement('a');
	        }
	        a$1.href = url;

	        // IE only absolutizes href on get, not set
	        a$1.href = a$1.href; // eslint-disable-line no-self-assign
	        return a$1.href;
	    }

	    var baseResource;
	    function getCesiumBaseUrl() {
	        if (when.defined(baseResource)) {
	            return baseResource;
	        }

	        var baseUrlString;
	        if (typeof CESIUM_BASE_URL !== 'undefined') {
	            baseUrlString = CESIUM_BASE_URL;
	        } else if (typeof define === 'object' && when.defined(define.amd) && !define.amd.toUrlUndefined && when.defined(require.toUrl)) {
	            baseUrlString = getAbsoluteUri('..', buildModuleUrl('Core/buildModuleUrl.js'));
	        } else {
	            baseUrlString = getBaseUrlFromCesiumScript();
	        }

	        //>>includeStart('debug', pragmas.debug);
	        if (!when.defined(baseUrlString)) {
	            throw new Check.DeveloperError('Unable to determine Cesium base URL automatically, try defining a global variable called CESIUM_BASE_URL.');
	        }
	        //>>includeEnd('debug');

	        baseResource = new Resource({
	            url: tryMakeAbsolute(baseUrlString)
	        });
	        baseResource.appendForwardSlash();

	        return baseResource;
	    }

	    function buildModuleUrlFromRequireToUrl(moduleID) {
	        //moduleID will be non-relative, so require it relative to this module, in Core.
	        return tryMakeAbsolute(require.toUrl('../' + moduleID));
	    }

	    function buildModuleUrlFromBaseUrl(moduleID) {
	        var resource = getCesiumBaseUrl().getDerivedResource({
	            url: moduleID
	        });
	        return resource.url;
	    }

	    var implementation;

	    /**
	     * Given a non-relative moduleID, returns an absolute URL to the file represented by that module ID,
	     * using, in order of preference, require.toUrl, the value of a global CESIUM_BASE_URL, or
	     * the base URL of the Cesium.js script.
	     *
	     * @private
	     */
	    function buildModuleUrl(moduleID) {
	        if (!when.defined(implementation)) {
	            //select implementation
	            if (typeof define === 'object' && when.defined(define.amd) && !define.amd.toUrlUndefined && when.defined(require.toUrl)) {
	                implementation = buildModuleUrlFromRequireToUrl;
	            } else {
	                implementation = buildModuleUrlFromBaseUrl;
	            }
	        }

	        var url = implementation(moduleID);
	        return url;
	    }

	    // exposed for testing
	    buildModuleUrl._cesiumScriptRegex = cesiumScriptRegex;
	    buildModuleUrl._buildModuleUrlFromBaseUrl = buildModuleUrlFromBaseUrl;
	    buildModuleUrl._clearBaseResource = function() {
	        baseResource = undefined;
	    };

	    /**
	     * Sets the base URL for resolving modules.
	     * @param {String} value The new base URL.
	     */
	    buildModuleUrl.setBaseUrl = function(value) {
	        baseResource = Resource.DEFAULT.getDerivedResource({
	            url: value
	        });
	    };

	    /**
	     * Gets the base URL for resolving modules.
	     */
	    buildModuleUrl.getCesiumBaseUrl = getCesiumBaseUrl;

	exports.Resource = Resource;
	exports.buildModuleUrl = buildModuleUrl;
	exports.deprecationWarning = deprecationWarning;
	exports.oneTimeWarning = oneTimeWarning;

});
