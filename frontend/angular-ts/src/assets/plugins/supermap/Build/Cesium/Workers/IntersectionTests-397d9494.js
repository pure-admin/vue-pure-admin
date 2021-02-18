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
define(['exports', './when-8d13db60', './Check-70bec281', './Math-61ede240', './Cartographic-fe4be337', './BoundingSphere-775c5788'], function (exports, when, Check, _Math, Cartographic, BoundingSphere) { 'use strict';

    /**
         * Defines functions for 2nd order polynomial functions of one variable with only real coefficients.
         *
         * @exports QuadraticRealPolynomial
         */
        var QuadraticRealPolynomial = {};

        /**
         * Provides the discriminant of the quadratic equation from the supplied coefficients.
         *
         * @param {Number} a The coefficient of the 2nd order monomial.
         * @param {Number} b The coefficient of the 1st order monomial.
         * @param {Number} c The coefficient of the 0th order monomial.
         * @returns {Number} The value of the discriminant.
         */
        QuadraticRealPolynomial.computeDiscriminant = function(a, b, c) {
            //>>includeStart('debug', pragmas.debug);
            if (typeof a !== 'number') {
                throw new Check.DeveloperError('a is a required number.');
            }
            if (typeof b !== 'number') {
                throw new Check.DeveloperError('b is a required number.');
            }
            if (typeof c !== 'number') {
                throw new Check.DeveloperError('c is a required number.');
            }
            //>>includeEnd('debug');

            var discriminant = b * b - 4.0 * a * c;
            return discriminant;
        };

        function addWithCancellationCheck(left, right, tolerance) {
            var difference = left + right;
            if ((_Math.CesiumMath.sign(left) !== _Math.CesiumMath.sign(right)) &&
                    Math.abs(difference / Math.max(Math.abs(left), Math.abs(right))) < tolerance) {
                return 0.0;
            }

            return difference;
        }

        /**
         * Provides the real valued roots of the quadratic polynomial with the provided coefficients.
         *
         * @param {Number} a The coefficient of the 2nd order monomial.
         * @param {Number} b The coefficient of the 1st order monomial.
         * @param {Number} c The coefficient of the 0th order monomial.
         * @returns {Number[]} The real valued roots.
         */
        QuadraticRealPolynomial.computeRealRoots = function(a, b, c) {
            //>>includeStart('debug', pragmas.debug);
            if (typeof a !== 'number') {
                throw new Check.DeveloperError('a is a required number.');
            }
            if (typeof b !== 'number') {
                throw new Check.DeveloperError('b is a required number.');
            }
            if (typeof c !== 'number') {
                throw new Check.DeveloperError('c is a required number.');
            }
            //>>includeEnd('debug');

            var ratio;
            if (a === 0.0) {
                if (b === 0.0) {
                    // Constant function: c = 0.
                    return [];
                }

                // Linear function: b * x + c = 0.
                return [-c / b];
            } else if (b === 0.0) {
                if (c === 0.0) {
                    // 2nd order monomial: a * x^2 = 0.
                    return [0.0, 0.0];
                }

                var cMagnitude = Math.abs(c);
                var aMagnitude = Math.abs(a);

                if ((cMagnitude < aMagnitude) && (cMagnitude / aMagnitude < _Math.CesiumMath.EPSILON14)) { // c ~= 0.0.
                    // 2nd order monomial: a * x^2 = 0.
                    return [0.0, 0.0];
                } else if ((cMagnitude > aMagnitude) && (aMagnitude / cMagnitude < _Math.CesiumMath.EPSILON14)) { // a ~= 0.0.
                    // Constant function: c = 0.
                    return [];
                }

                // a * x^2 + c = 0
                ratio = -c / a;

                if (ratio < 0.0) {
                    // Both roots are complex.
                    return [];
                }

                // Both roots are real.
                var root = Math.sqrt(ratio);
                return [-root, root];
            } else if (c === 0.0) {
                // a * x^2 + b * x = 0
                ratio = -b / a;
                if (ratio < 0.0) {
                    return [ratio, 0.0];
                }

                return [0.0, ratio];
            }

            // a * x^2 + b * x + c = 0
            var b2 = b * b;
            var four_ac = 4.0 * a * c;
            var radicand = addWithCancellationCheck(b2, -four_ac, _Math.CesiumMath.EPSILON14);

            if (radicand < 0.0) {
                // Both roots are complex.
                return [];
            }

            var q = -0.5 * addWithCancellationCheck(b, _Math.CesiumMath.sign(b) * Math.sqrt(radicand), _Math.CesiumMath.EPSILON14);
            if (b > 0.0) {
                return [q / a, c / q];
            }

            return [c / q, q / a];
        };

    /**
         * Defines functions for 3rd order polynomial functions of one variable with only real coefficients.
         *
         * @exports CubicRealPolynomial
         */
        var CubicRealPolynomial = {};

        /**
         * Provides the discriminant of the cubic equation from the supplied coefficients.
         *
         * @param {Number} a The coefficient of the 3rd order monomial.
         * @param {Number} b The coefficient of the 2nd order monomial.
         * @param {Number} c The coefficient of the 1st order monomial.
         * @param {Number} d The coefficient of the 0th order monomial.
         * @returns {Number} The value of the discriminant.
         */
        CubicRealPolynomial.computeDiscriminant = function(a, b, c, d) {
            //>>includeStart('debug', pragmas.debug);
            if (typeof a !== 'number') {
                throw new Check.DeveloperError('a is a required number.');
            }
            if (typeof b !== 'number') {
                throw new Check.DeveloperError('b is a required number.');
            }
            if (typeof c !== 'number') {
                throw new Check.DeveloperError('c is a required number.');
            }
            if (typeof d !== 'number') {
                throw new Check.DeveloperError('d is a required number.');
            }
            //>>includeEnd('debug');

            var a2 = a * a;
            var b2 = b * b;
            var c2 = c * c;
            var d2 = d * d;

            var discriminant = 18.0 * a * b * c * d + b2 * c2 - 27.0 * a2 * d2 - 4.0 * (a * c2 * c + b2 * b * d);
            return discriminant;
        };

        function computeRealRoots(a, b, c, d) {
            var A = a;
            var B = b / 3.0;
            var C = c / 3.0;
            var D = d;

            var AC = A * C;
            var BD = B * D;
            var B2 = B * B;
            var C2 = C * C;
            var delta1 = A * C - B2;
            var delta2 = A * D - B * C;
            var delta3 = B * D - C2;

            var discriminant = 4.0 * delta1 * delta3 - delta2 * delta2;
            var temp;
            var temp1;

            if (discriminant < 0.0) {
                var ABar;
                var CBar;
                var DBar;

                if (B2 * BD >= AC * C2) {
                    ABar = A;
                    CBar = delta1;
                    DBar = -2.0 * B * delta1 + A * delta2;
                } else {
                    ABar = D;
                    CBar = delta3;
                    DBar = -D * delta2 + 2.0 * C * delta3;
                }

                var s = (DBar < 0.0) ? -1.0 : 1.0; // This is not Math.Sign()!
                var temp0 = -s * Math.abs(ABar) * Math.sqrt(-discriminant);
                temp1 = -DBar + temp0;

                var x = temp1 / 2.0;
                var p = x < 0.0 ? -Math.pow(-x, 1.0 / 3.0) : Math.pow(x, 1.0 / 3.0);
                var q = (temp1 === temp0) ? -p : -CBar / p;

                temp = (CBar <= 0.0) ? p + q : -DBar / (p * p + q * q + CBar);

                if (B2 * BD >= AC * C2) {
                    return [(temp - B) / A];
                }

                return [-D / (temp + C)];
            }

            var CBarA = delta1;
            var DBarA = -2.0 * B * delta1 + A * delta2;

            var CBarD = delta3;
            var DBarD = -D * delta2 + 2.0 * C * delta3;

            var squareRootOfDiscriminant = Math.sqrt(discriminant);
            var halfSquareRootOf3 = Math.sqrt(3.0) / 2.0;

            var theta = Math.abs(Math.atan2(A * squareRootOfDiscriminant, -DBarA) / 3.0);
            temp = 2.0 * Math.sqrt(-CBarA);
            var cosine = Math.cos(theta);
            temp1 = temp * cosine;
            var temp3 = temp * (-cosine / 2.0 - halfSquareRootOf3 * Math.sin(theta));

            var numeratorLarge = (temp1 + temp3 > 2.0 * B) ? temp1 - B : temp3 - B;
            var denominatorLarge = A;

            var root1 = numeratorLarge / denominatorLarge;

            theta = Math.abs(Math.atan2(D * squareRootOfDiscriminant, -DBarD) / 3.0);
            temp = 2.0 * Math.sqrt(-CBarD);
            cosine = Math.cos(theta);
            temp1 = temp * cosine;
            temp3 = temp * (-cosine / 2.0 - halfSquareRootOf3 * Math.sin(theta));

            var numeratorSmall = -D;
            var denominatorSmall = (temp1 + temp3 < 2.0 * C) ? temp1 + C : temp3 + C;

            var root3 = numeratorSmall / denominatorSmall;

            var E = denominatorLarge * denominatorSmall;
            var F = -numeratorLarge * denominatorSmall - denominatorLarge * numeratorSmall;
            var G = numeratorLarge * numeratorSmall;

            var root2 = (C * F - B * G) / (-B * F + C * E);

            if (root1 <= root2) {
                if (root1 <= root3) {
                    if (root2 <= root3) {
                        return [root1, root2, root3];
                    }
                    return [root1, root3, root2];
                }
                return [root3, root1, root2];
            }
            if (root1 <= root3) {
                return [root2, root1, root3];
            }
            if (root2 <= root3) {
                return [root2, root3, root1];
            }
            return [root3, root2, root1];
        }

        /**
         * Provides the real valued roots of the cubic polynomial with the provided coefficients.
         *
         * @param {Number} a The coefficient of the 3rd order monomial.
         * @param {Number} b The coefficient of the 2nd order monomial.
         * @param {Number} c The coefficient of the 1st order monomial.
         * @param {Number} d The coefficient of the 0th order monomial.
         * @returns {Number[]} The real valued roots.
         */
        CubicRealPolynomial.computeRealRoots = function(a, b, c, d) {
            //>>includeStart('debug', pragmas.debug);
            if (typeof a !== 'number') {
                throw new Check.DeveloperError('a is a required number.');
            }
            if (typeof b !== 'number') {
                throw new Check.DeveloperError('b is a required number.');
            }
            if (typeof c !== 'number') {
                throw new Check.DeveloperError('c is a required number.');
            }
            if (typeof d !== 'number') {
                throw new Check.DeveloperError('d is a required number.');
            }
            //>>includeEnd('debug');

            var roots;
            var ratio;
            if (a === 0.0) {
                // Quadratic function: b * x^2 + c * x + d = 0.
                return QuadraticRealPolynomial.computeRealRoots(b, c, d);
            } else if (b === 0.0) {
                if (c === 0.0) {
                    if (d === 0.0) {
                        // 3rd order monomial: a * x^3 = 0.
                        return [0.0, 0.0, 0.0];
                    }

                    // a * x^3 + d = 0
                    ratio = -d / a;
                    var root = (ratio < 0.0) ? -Math.pow(-ratio, 1.0 / 3.0) : Math.pow(ratio, 1.0 / 3.0);
                    return [root, root, root];
                } else if (d === 0.0) {
                    // x * (a * x^2 + c) = 0.
                    roots = QuadraticRealPolynomial.computeRealRoots(a, 0, c);

                    // Return the roots in ascending order.
                    if (roots.Length === 0) {
                        return [0.0];
                    }
                    return [roots[0], 0.0, roots[1]];
                }

                // Deflated cubic polynomial: a * x^3 + c * x + d= 0.
                return computeRealRoots(a, 0, c, d);
            } else if (c === 0.0) {
                if (d === 0.0) {
                    // x^2 * (a * x + b) = 0.
                    ratio = -b / a;
                    if (ratio < 0.0) {
                        return [ratio, 0.0, 0.0];
                    }
                    return [0.0, 0.0, ratio];
                }
                // a * x^3 + b * x^2 + d = 0.
                return computeRealRoots(a, b, 0, d);
            } else if (d === 0.0) {
                // x * (a * x^2 + b * x + c) = 0
                roots = QuadraticRealPolynomial.computeRealRoots(a, b, c);

                // Return the roots in ascending order.
                if (roots.length === 0) {
                    return [0.0];
                } else if (roots[1] <= 0.0) {
                    return [roots[0], roots[1], 0.0];
                } else if (roots[0] >= 0.0) {
                    return [0.0, roots[0], roots[1]];
                }
                return [roots[0], 0.0, roots[1]];
            }

            return computeRealRoots(a, b, c, d);
        };

    /**
         * Defines functions for 4th order polynomial functions of one variable with only real coefficients.
         *
         * @exports QuarticRealPolynomial
         */
        var QuarticRealPolynomial = {};

        /**
         * Provides the discriminant of the quartic equation from the supplied coefficients.
         *
         * @param {Number} a The coefficient of the 4th order monomial.
         * @param {Number} b The coefficient of the 3rd order monomial.
         * @param {Number} c The coefficient of the 2nd order monomial.
         * @param {Number} d The coefficient of the 1st order monomial.
         * @param {Number} e The coefficient of the 0th order monomial.
         * @returns {Number} The value of the discriminant.
         */
        QuarticRealPolynomial.computeDiscriminant = function(a, b, c, d, e) {
            //>>includeStart('debug', pragmas.debug);
            if (typeof a !== 'number') {
                throw new Check.DeveloperError('a is a required number.');
            }
            if (typeof b !== 'number') {
                throw new Check.DeveloperError('b is a required number.');
            }
            if (typeof c !== 'number') {
                throw new Check.DeveloperError('c is a required number.');
            }
            if (typeof d !== 'number') {
                throw new Check.DeveloperError('d is a required number.');
            }
            if (typeof e !== 'number') {
                throw new Check.DeveloperError('e is a required number.');
            }
            //>>includeEnd('debug');

            var a2 = a * a;
            var a3 = a2 * a;
            var b2 = b * b;
            var b3 = b2 * b;
            var c2 = c * c;
            var c3 = c2 * c;
            var d2 = d * d;
            var d3 = d2 * d;
            var e2 = e * e;
            var e3 = e2 * e;

            var discriminant = (b2 * c2 * d2 - 4.0 * b3 * d3 - 4.0 * a * c3 * d2 + 18 * a * b * c * d3 - 27.0 * a2 * d2 * d2 + 256.0 * a3 * e3) +
                e * (18.0 * b3 * c * d - 4.0 * b2 * c3 + 16.0 * a * c2 * c2 - 80.0 * a * b * c2 * d - 6.0 * a * b2 * d2 + 144.0 * a2 * c * d2) +
                e2 * (144.0 * a * b2 * c - 27.0 * b2 * b2 - 128.0 * a2 * c2 - 192.0 * a2 * b * d);
            return discriminant;
        };

        function original(a3, a2, a1, a0) {
            var a3Squared = a3 * a3;

            var p = a2 - 3.0 * a3Squared / 8.0;
            var q = a1 - a2 * a3 / 2.0 + a3Squared * a3 / 8.0;
            var r = a0 - a1 * a3 / 4.0 + a2 * a3Squared / 16.0 - 3.0 * a3Squared * a3Squared / 256.0;

            // Find the roots of the cubic equations:  h^6 + 2 p h^4 + (p^2 - 4 r) h^2 - q^2 = 0.
            var cubicRoots = CubicRealPolynomial.computeRealRoots(1.0, 2.0 * p, p * p - 4.0 * r, -q * q);

            if (cubicRoots.length > 0) {
                var temp = -a3 / 4.0;

                // Use the largest positive root.
                var hSquared = cubicRoots[cubicRoots.length - 1];

                if (Math.abs(hSquared) < _Math.CesiumMath.EPSILON14) {
                    // y^4 + p y^2 + r = 0.
                    var roots = QuadraticRealPolynomial.computeRealRoots(1.0, p, r);

                    if (roots.length === 2) {
                        var root0 = roots[0];
                        var root1 = roots[1];

                        var y;
                        if (root0 >= 0.0 && root1 >= 0.0) {
                            var y0 = Math.sqrt(root0);
                            var y1 = Math.sqrt(root1);

                            return [temp - y1, temp - y0, temp + y0, temp + y1];
                        } else if (root0 >= 0.0 && root1 < 0.0) {
                            y = Math.sqrt(root0);
                            return [temp - y, temp + y];
                        } else if (root0 < 0.0 && root1 >= 0.0) {
                            y = Math.sqrt(root1);
                            return [temp - y, temp + y];
                        }
                    }
                    return [];
                } else if (hSquared > 0.0) {
                    var h = Math.sqrt(hSquared);

                    var m = (p + hSquared - q / h) / 2.0;
                    var n = (p + hSquared + q / h) / 2.0;

                    // Now solve the two quadratic factors:  (y^2 + h y + m)(y^2 - h y + n);
                    var roots1 = QuadraticRealPolynomial.computeRealRoots(1.0, h, m);
                    var roots2 = QuadraticRealPolynomial.computeRealRoots(1.0, -h, n);

                    if (roots1.length !== 0) {
                        roots1[0] += temp;
                        roots1[1] += temp;

                        if (roots2.length !== 0) {
                            roots2[0] += temp;
                            roots2[1] += temp;

                            if (roots1[1] <= roots2[0]) {
                                return [roots1[0], roots1[1], roots2[0], roots2[1]];
                            } else if (roots2[1] <= roots1[0]) {
                                return [roots2[0], roots2[1], roots1[0], roots1[1]];
                            } else if (roots1[0] >= roots2[0] && roots1[1] <= roots2[1]) {
                                return [roots2[0], roots1[0], roots1[1], roots2[1]];
                            } else if (roots2[0] >= roots1[0] && roots2[1] <= roots1[1]) {
                                return [roots1[0], roots2[0], roots2[1], roots1[1]];
                            } else if (roots1[0] > roots2[0] && roots1[0] < roots2[1]) {
                                return [roots2[0], roots1[0], roots2[1], roots1[1]];
                            }
                            return [roots1[0], roots2[0], roots1[1], roots2[1]];
                        }
                        return roots1;
                    }

                    if (roots2.length !== 0) {
                        roots2[0] += temp;
                        roots2[1] += temp;

                        return roots2;
                    }
                    return [];
                }
            }
            return [];
        }

        function neumark(a3, a2, a1, a0) {
            var a1Squared = a1 * a1;
            var a2Squared = a2 * a2;
            var a3Squared = a3 * a3;

            var p = -2.0 * a2;
            var q = a1 * a3 + a2Squared - 4.0 * a0;
            var r = a3Squared * a0 - a1 * a2 * a3 + a1Squared;

            var cubicRoots = CubicRealPolynomial.computeRealRoots(1.0, p, q, r);

            if (cubicRoots.length > 0) {
                // Use the most positive root
                var y = cubicRoots[0];

                var temp = (a2 - y);
                var tempSquared = temp * temp;

                var g1 = a3 / 2.0;
                var h1 = temp / 2.0;

                var m = tempSquared - 4.0 * a0;
                var mError = tempSquared + 4.0 * Math.abs(a0);

                var n = a3Squared - 4.0 * y;
                var nError = a3Squared + 4.0 * Math.abs(y);

                var g2;
                var h2;

                if (y < 0.0 || (m * nError < n * mError)) {
                    var squareRootOfN = Math.sqrt(n);
                    g2 = squareRootOfN / 2.0;
                    h2 = squareRootOfN === 0.0 ? 0.0 : (a3 * h1 - a1) / squareRootOfN;
                } else {
                    var squareRootOfM = Math.sqrt(m);
                    g2 = squareRootOfM === 0.0 ? 0.0 : (a3 * h1 - a1) / squareRootOfM;
                    h2 = squareRootOfM / 2.0;
                }

                var G;
                var g;
                if (g1 === 0.0 && g2 === 0.0) {
                    G = 0.0;
                    g = 0.0;
                } else if (_Math.CesiumMath.sign(g1) === _Math.CesiumMath.sign(g2)) {
                    G = g1 + g2;
                    g = y / G;
                } else {
                    g = g1 - g2;
                    G = y / g;
                }

                var H;
                var h;
                if (h1 === 0.0 && h2 === 0.0) {
                    H = 0.0;
                    h = 0.0;
                } else if (_Math.CesiumMath.sign(h1) === _Math.CesiumMath.sign(h2)) {
                    H = h1 + h2;
                    h = a0 / H;
                } else {
                    h = h1 - h2;
                    H = a0 / h;
                }

                // Now solve the two quadratic factors:  (y^2 + G y + H)(y^2 + g y + h);
                var roots1 = QuadraticRealPolynomial.computeRealRoots(1.0, G, H);
                var roots2 = QuadraticRealPolynomial.computeRealRoots(1.0, g, h);

                if (roots1.length !== 0) {
                    if (roots2.length !== 0) {
                        if (roots1[1] <= roots2[0]) {
                            return [roots1[0], roots1[1], roots2[0], roots2[1]];
                        } else if (roots2[1] <= roots1[0]) {
                            return [roots2[0], roots2[1], roots1[0], roots1[1]];
                        } else if (roots1[0] >= roots2[0] && roots1[1] <= roots2[1]) {
                            return [roots2[0], roots1[0], roots1[1], roots2[1]];
                        } else if (roots2[0] >= roots1[0] && roots2[1] <= roots1[1]) {
                            return [roots1[0], roots2[0], roots2[1], roots1[1]];
                        } else if (roots1[0] > roots2[0] && roots1[0] < roots2[1]) {
                            return [roots2[0], roots1[0], roots2[1], roots1[1]];
                        }
                        return [roots1[0], roots2[0], roots1[1], roots2[1]];
                    }
                    return roots1;
                }
                if (roots2.length !== 0) {
                    return roots2;
                }
            }
            return [];
        }

        /**
         * Provides the real valued roots of the quartic polynomial with the provided coefficients.
         *
         * @param {Number} a The coefficient of the 4th order monomial.
         * @param {Number} b The coefficient of the 3rd order monomial.
         * @param {Number} c The coefficient of the 2nd order monomial.
         * @param {Number} d The coefficient of the 1st order monomial.
         * @param {Number} e The coefficient of the 0th order monomial.
         * @returns {Number[]} The real valued roots.
         */
        QuarticRealPolynomial.computeRealRoots = function(a, b, c, d, e) {
            //>>includeStart('debug', pragmas.debug);
            if (typeof a !== 'number') {
                throw new Check.DeveloperError('a is a required number.');
            }
            if (typeof b !== 'number') {
                throw new Check.DeveloperError('b is a required number.');
            }
            if (typeof c !== 'number') {
                throw new Check.DeveloperError('c is a required number.');
            }
            if (typeof d !== 'number') {
                throw new Check.DeveloperError('d is a required number.');
            }
            if (typeof e !== 'number') {
                throw new Check.DeveloperError('e is a required number.');
            }
            //>>includeEnd('debug');

            if (Math.abs(a) < _Math.CesiumMath.EPSILON15) {
                return CubicRealPolynomial.computeRealRoots(b, c, d, e);
            }
            var a3 = b / a;
            var a2 = c / a;
            var a1 = d / a;
            var a0 = e / a;

            var k = (a3 < 0.0) ? 1 : 0;
            k += (a2 < 0.0) ? k + 1 : k;
            k += (a1 < 0.0) ? k + 1 : k;
            k += (a0 < 0.0) ? k + 1 : k;

            switch (k) {
            case 0:
                return original(a3, a2, a1, a0);
            case 1:
                return neumark(a3, a2, a1, a0);
            case 2:
                return neumark(a3, a2, a1, a0);
            case 3:
                return original(a3, a2, a1, a0);
            case 4:
                return original(a3, a2, a1, a0);
            case 5:
                return neumark(a3, a2, a1, a0);
            case 6:
                return original(a3, a2, a1, a0);
            case 7:
                return original(a3, a2, a1, a0);
            case 8:
                return neumark(a3, a2, a1, a0);
            case 9:
                return original(a3, a2, a1, a0);
            case 10:
                return original(a3, a2, a1, a0);
            case 11:
                return neumark(a3, a2, a1, a0);
            case 12:
                return original(a3, a2, a1, a0);
            case 13:
                return original(a3, a2, a1, a0);
            case 14:
                return original(a3, a2, a1, a0);
            case 15:
                return original(a3, a2, a1, a0);
            default:
                return undefined;
            }
        };

    /**
         * Represents a ray that extends infinitely from the provided origin in the provided direction.
         * @alias Ray
         * @constructor
         *
         * @param {Cartesian3} [origin=Cartesian3.ZERO] The origin of the ray.
         * @param {Cartesian3} [direction=Cartesian3.ZERO] The direction of the ray.
         */
        function Ray(origin, direction) {
            direction = Cartographic.Cartesian3.clone(when.defaultValue(direction, Cartographic.Cartesian3.ZERO));
            if (!Cartographic.Cartesian3.equals(direction, Cartographic.Cartesian3.ZERO)) {
                Cartographic.Cartesian3.normalize(direction, direction);
            }

            /**
             * The origin of the ray.
             * @type {Cartesian3}
             * @default {@link Cartesian3.ZERO}
             */
            this.origin = Cartographic.Cartesian3.clone(when.defaultValue(origin, Cartographic.Cartesian3.ZERO));

            /**
             * The direction of the ray.
             * @type {Cartesian3}
             */
            this.direction = direction;
        }

        /**
         * Duplicates a Ray instance.
         *
         * @param {Ray} ray The ray to duplicate.
         * @param {Ray} [result] The object onto which to store the result.
         * @returns {Ray} The modified result parameter or a new Ray instance if one was not provided. (Returns undefined if ray is undefined)
         */
        Ray.clone = function(ray, result) {
            if (!when.defined(ray)) {
                return undefined;
            }
            if (!when.defined(result)) {
                return new Ray(ray.origin, ray.direction);
            }
            result.origin = Cartographic.Cartesian3.clone(ray.origin);
            result.direction = Cartographic.Cartesian3.clone(ray.direction);
            return result;
        };

        /**
         * Computes the point along the ray given by r(t) = o + t*d,
         * where o is the origin of the ray and d is the direction.
         *
         * @param {Ray} ray The ray.
         * @param {Number} t A scalar value.
         * @param {Cartesian3} [result] The object in which the result will be stored.
         * @returns {Cartesian3} The modified result parameter, or a new instance if none was provided.
         *
         * @example
         * //Get the first intersection point of a ray and an ellipsoid.
         * var intersection = Cesium.IntersectionTests.rayEllipsoid(ray, ellipsoid);
         * var point = Cesium.Ray.getPoint(ray, intersection.start);
         */
        Ray.getPoint = function(ray, t, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('ray', ray);
            Check.Check.typeOf.number('t', t);
            //>>includeEnd('debug');

            if (!when.defined(result)) {
                result = new Cartographic.Cartesian3();
            }

            result = Cartographic.Cartesian3.multiplyByScalar(ray.direction, t, result);
            return Cartographic.Cartesian3.add(ray.origin, result, result);
        };

    /**
         * Functions for computing the intersection between geometries such as rays, planes, triangles, and ellipsoids.
         *
         * @exports IntersectionTests
         * @namespace
         */
        var IntersectionTests = {};

        /**
         * Computes the intersection of a ray and a plane.
         *
         * @param {Ray} ray The ray.
         * @param {Plane} plane The plane.
         * @param {Cartesian3} [result] The object onto which to store the result.
         * @returns {Cartesian3} The intersection point or undefined if there is no intersections.
         */
        IntersectionTests.rayPlane = function(ray, plane, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(ray)) {
                throw new Check.DeveloperError('ray is required.');
            }
            if (!when.defined(plane)) {
                throw new Check.DeveloperError('plane is required.');
            }
            //>>includeEnd('debug');

            if (!when.defined(result)) {
                result = new Cartographic.Cartesian3();
            }

            var origin = ray.origin;
            var direction = ray.direction;
            var normal = plane.normal;
            var denominator = Cartographic.Cartesian3.dot(normal, direction);

            if (Math.abs(denominator) < _Math.CesiumMath.EPSILON15) {
                // Ray is parallel to plane.  The ray may be in the polygon's plane.
                return undefined;
            }

            var t = (-plane.distance - Cartographic.Cartesian3.dot(normal, origin)) / denominator;

            if (t < 0) {
                return undefined;
            }

            result = Cartographic.Cartesian3.multiplyByScalar(direction, t, result);
            return Cartographic.Cartesian3.add(origin, result, result);
        };

        var scratchEdge0 = new Cartographic.Cartesian3();
        var scratchEdge1 = new Cartographic.Cartesian3();
        var scratchPVec = new Cartographic.Cartesian3();
        var scratchTVec = new Cartographic.Cartesian3();
        var scratchQVec = new Cartographic.Cartesian3();

        /**
         * Computes the intersection of a ray and a triangle as a parametric distance along the input ray. The result is negative when the triangle is behind the ray.
         *
         * Implements {@link https://cadxfem.org/inf/Fast%20MinimumStorage%20RayTriangle%20Intersection.pdf|
         * Fast Minimum Storage Ray/Triangle Intersection} by Tomas Moller and Ben Trumbore.
         *
         * @memberof IntersectionTests
         *
         * @param {Ray} ray The ray.
         * @param {Cartesian3} p0 The first vertex of the triangle.
         * @param {Cartesian3} p1 The second vertex of the triangle.
         * @param {Cartesian3} p2 The third vertex of the triangle.
         * @param {Boolean} [cullBackFaces=false] If <code>true</code>, will only compute an intersection with the front face of the triangle
         *                  and return undefined for intersections with the back face.
         * @returns {Number} The intersection as a parametric distance along the ray, or undefined if there is no intersection.
         */
        IntersectionTests.rayTriangleParametric  = function(ray, p0, p1, p2, cullBackFaces) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(ray)) {
                throw new Check.DeveloperError('ray is required.');
            }
            if (!when.defined(p0)) {
                throw new Check.DeveloperError('p0 is required.');
            }
            if (!when.defined(p1)) {
                throw new Check.DeveloperError('p1 is required.');
            }
            if (!when.defined(p2)) {
                throw new Check.DeveloperError('p2 is required.');
            }
            //>>includeEnd('debug');

            cullBackFaces = when.defaultValue(cullBackFaces, false);

            var origin = ray.origin;
            var direction = ray.direction;

            var edge0 = Cartographic.Cartesian3.subtract(p1, p0, scratchEdge0);
            var edge1 = Cartographic.Cartesian3.subtract(p2, p0, scratchEdge1);

            var p = Cartographic.Cartesian3.cross(direction, edge1, scratchPVec);
            var det = Cartographic.Cartesian3.dot(edge0, p);

            var tvec;
            var q;

            var u;
            var v;
            var t;

            if (cullBackFaces) {
                if (det < _Math.CesiumMath.EPSILON6) {
                    return undefined;
                }

                tvec = Cartographic.Cartesian3.subtract(origin, p0, scratchTVec);
                u = Cartographic.Cartesian3.dot(tvec, p);
                if (u < 0.0 || u > det) {
                    return undefined;
                }

                q = Cartographic.Cartesian3.cross(tvec, edge0, scratchQVec);

                v = Cartographic.Cartesian3.dot(direction, q);
                if (v < 0.0 || u + v > det) {
                    return undefined;
                }

                t = Cartographic.Cartesian3.dot(edge1, q) / det;
            } else {
                if (Math.abs(det) < _Math.CesiumMath.EPSILON6) {
                    return undefined;
                }
                var invDet = 1.0 / det;

                tvec = Cartographic.Cartesian3.subtract(origin, p0, scratchTVec);
                u = Cartographic.Cartesian3.dot(tvec, p) * invDet;
                if (u < 0.0 || u > 1.0) {
                    return undefined;
                }

                q = Cartographic.Cartesian3.cross(tvec, edge0, scratchQVec);

                v = Cartographic.Cartesian3.dot(direction, q) * invDet;
                if (v < 0.0 || u + v > 1.0) {
                    return undefined;
                }

                t = Cartographic.Cartesian3.dot(edge1, q) * invDet;
            }

            return t;
        };

        /**
         * Computes the intersection of a ray and a triangle as a Cartesian3 coordinate.
         *
         * Implements {@link https://cadxfem.org/inf/Fast%20MinimumStorage%20RayTriangle%20Intersection.pdf|
         * Fast Minimum Storage Ray/Triangle Intersection} by Tomas Moller and Ben Trumbore.
         *
         * @memberof IntersectionTests
         *
         * @param {Ray} ray The ray.
         * @param {Cartesian3} p0 The first vertex of the triangle.
         * @param {Cartesian3} p1 The second vertex of the triangle.
         * @param {Cartesian3} p2 The third vertex of the triangle.
         * @param {Boolean} [cullBackFaces=false] If <code>true</code>, will only compute an intersection with the front face of the triangle
         *                  and return undefined for intersections with the back face.
         * @param {Cartesian3} [result] The <code>Cartesian3</code> onto which to store the result.
         * @returns {Cartesian3} The intersection point or undefined if there is no intersections.
         */
        IntersectionTests.rayTriangle = function(ray, p0, p1, p2, cullBackFaces, result) {
            var t = IntersectionTests.rayTriangleParametric(ray, p0, p1, p2, cullBackFaces);
            if (!when.defined(t) || t < 0.0) {
                return undefined;
            }

            if (!when.defined(result)) {
                result = new Cartographic.Cartesian3();
            }

            Cartographic.Cartesian3.multiplyByScalar(ray.direction, t, result);
            return Cartographic.Cartesian3.add(ray.origin, result, result);
        };

        var scratchLineSegmentTriangleRay = new Ray();

        /**
         * Computes the intersection of a line segment and a triangle.
         * @memberof IntersectionTests
         *
         * @param {Cartesian3} v0 The an end point of the line segment.
         * @param {Cartesian3} v1 The other end point of the line segment.
         * @param {Cartesian3} p0 The first vertex of the triangle.
         * @param {Cartesian3} p1 The second vertex of the triangle.
         * @param {Cartesian3} p2 The third vertex of the triangle.
         * @param {Boolean} [cullBackFaces=false] If <code>true</code>, will only compute an intersection with the front face of the triangle
         *                  and return undefined for intersections with the back face.
         * @param {Cartesian3} [result] The <code>Cartesian3</code> onto which to store the result.
         * @returns {Cartesian3} The intersection point or undefined if there is no intersections.
         */
        IntersectionTests.lineSegmentTriangle = function(v0, v1, p0, p1, p2, cullBackFaces, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(v0)) {
                throw new Check.DeveloperError('v0 is required.');
            }
            if (!when.defined(v1)) {
                throw new Check.DeveloperError('v1 is required.');
            }
            if (!when.defined(p0)) {
                throw new Check.DeveloperError('p0 is required.');
            }
            if (!when.defined(p1)) {
                throw new Check.DeveloperError('p1 is required.');
            }
            if (!when.defined(p2)) {
                throw new Check.DeveloperError('p2 is required.');
            }
            //>>includeEnd('debug');

            var ray = scratchLineSegmentTriangleRay;
            Cartographic.Cartesian3.clone(v0, ray.origin);
            Cartographic.Cartesian3.subtract(v1, v0, ray.direction);
            Cartographic.Cartesian3.normalize(ray.direction, ray.direction);

            var t = IntersectionTests.rayTriangleParametric(ray, p0, p1, p2, cullBackFaces);
            if (!when.defined(t) || t < 0.0 || t > Cartographic.Cartesian3.distance(v0, v1)) {
                return undefined;
            }

            if (!when.defined(result)) {
                result = new Cartographic.Cartesian3();
            }

            Cartographic.Cartesian3.multiplyByScalar(ray.direction, t, result);
            return Cartographic.Cartesian3.add(ray.origin, result, result);
        };

        function solveQuadratic(a, b, c, result) {
            var det = b * b - 4.0 * a * c;
            if (det < 0.0) {
                return undefined;
            } else if (det > 0.0) {
                var denom = 1.0 / (2.0 * a);
                var disc = Math.sqrt(det);
                var root0 = (-b + disc) * denom;
                var root1 = (-b - disc) * denom;

                if (root0 < root1) {
                    result.root0 = root0;
                    result.root1 = root1;
                } else {
                    result.root0 = root1;
                    result.root1 = root0;
                }

                return result;
            }

            var root = -b / (2.0 * a);
            if (root === 0.0) {
                return undefined;
            }

            result.root0 = result.root1 = root;
            return result;
        }

        var raySphereRoots = {
            root0 : 0.0,
            root1 : 0.0
        };

        function raySphere(ray, sphere, result) {
            if (!when.defined(result)) {
                result = new BoundingSphere.Interval();
            }

            var origin = ray.origin;
            var direction = ray.direction;

            var center = sphere.center;
            var radiusSquared = sphere.radius * sphere.radius;

            var diff = Cartographic.Cartesian3.subtract(origin, center, scratchPVec);

            var a = Cartographic.Cartesian3.dot(direction, direction);
            var b = 2.0 * Cartographic.Cartesian3.dot(direction, diff);
            var c = Cartographic.Cartesian3.magnitudeSquared(diff) - radiusSquared;

            var roots = solveQuadratic(a, b, c, raySphereRoots);
            if (!when.defined(roots)) {
                return undefined;
            }

            result.start = roots.root0;
            result.stop = roots.root1;
            return result;
        }

        /**
         * Computes the intersection points of a ray with a sphere.
         * @memberof IntersectionTests
         *
         * @param {Ray} ray The ray.
         * @param {BoundingSphere} sphere The sphere.
         * @param {Interval} [result] The result onto which to store the result.
         * @returns {Interval} The interval containing scalar points along the ray or undefined if there are no intersections.
         */
        IntersectionTests.raySphere = function(ray, sphere, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(ray)) {
                throw new Check.DeveloperError('ray is required.');
            }
            if (!when.defined(sphere)) {
                throw new Check.DeveloperError('sphere is required.');
            }
            //>>includeEnd('debug');

            result = raySphere(ray, sphere, result);
            if (!when.defined(result) || result.stop < 0.0) {
                return undefined;
            }

            result.start = Math.max(result.start, 0.0);
            return result;
        };

        var scratchLineSegmentRay = new Ray();

        /**
         * Computes the intersection points of a line segment with a sphere.
         * @memberof IntersectionTests
         *
         * @param {Cartesian3} p0 An end point of the line segment.
         * @param {Cartesian3} p1 The other end point of the line segment.
         * @param {BoundingSphere} sphere The sphere.
         * @param {Interval} [result] The result onto which to store the result.
         * @returns {Interval} The interval containing scalar points along the ray or undefined if there are no intersections.
         */
        IntersectionTests.lineSegmentSphere = function(p0, p1, sphere, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(p0)) {
                throw new Check.DeveloperError('p0 is required.');
            }
            if (!when.defined(p1)) {
                throw new Check.DeveloperError('p1 is required.');
            }
            if (!when.defined(sphere)) {
                throw new Check.DeveloperError('sphere is required.');
            }
            //>>includeEnd('debug');

            var ray = scratchLineSegmentRay;
            Cartographic.Cartesian3.clone(p0, ray.origin);
            var direction = Cartographic.Cartesian3.subtract(p1, p0, ray.direction);

            var maxT = Cartographic.Cartesian3.magnitude(direction);
            Cartographic.Cartesian3.normalize(direction, direction);

            result = raySphere(ray, sphere, result);
            if (!when.defined(result) || result.stop < 0.0 || result.start > maxT) {
                return undefined;
            }

            result.start = Math.max(result.start, 0.0);
            result.stop = Math.min(result.stop, maxT);
            return result;
        };

        var scratchQ = new Cartographic.Cartesian3();
        var scratchW = new Cartographic.Cartesian3();

        /**
         * Computes the intersection points of a ray with an ellipsoid.
         *
         * @param {Ray} ray The ray.
         * @param {Ellipsoid} ellipsoid The ellipsoid.
         * @returns {Interval} The interval containing scalar points along the ray or undefined if there are no intersections.
         */
        IntersectionTests.rayEllipsoid = function(ray, ellipsoid) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(ray)) {
                throw new Check.DeveloperError('ray is required.');
            }
            if (!when.defined(ellipsoid)) {
                throw new Check.DeveloperError('ellipsoid is required.');
            }
            //>>includeEnd('debug');

            var inverseRadii = ellipsoid.oneOverRadii;
            var q = Cartographic.Cartesian3.multiplyComponents(inverseRadii, ray.origin, scratchQ);
            var w = Cartographic.Cartesian3.multiplyComponents(inverseRadii, ray.direction, scratchW);

            var q2 = Cartographic.Cartesian3.magnitudeSquared(q);
            var qw = Cartographic.Cartesian3.dot(q, w);

            var difference, w2, product, discriminant, temp;

            if (q2 > 1.0) {
                // Outside ellipsoid.
                if (qw >= 0.0) {
                    // Looking outward or tangent (0 intersections).
                    return undefined;
                }

                // qw < 0.0.
                var qw2 = qw * qw;
                difference = q2 - 1.0; // Positively valued.
                w2 = Cartographic.Cartesian3.magnitudeSquared(w);
                product = w2 * difference;

                if (qw2 < product) {
                    // Imaginary roots (0 intersections).
                    return undefined;
                } else if (qw2 > product) {
                    // Distinct roots (2 intersections).
                    discriminant = qw * qw - product;
                    temp = -qw + Math.sqrt(discriminant); // Avoid cancellation.
                    var root0 = temp / w2;
                    var root1 = difference / temp;
                    if (root0 < root1) {
                        return new BoundingSphere.Interval(root0, root1);
                    }

                    return {
                        start : root1,
                        stop : root0
                    };
                }
                // qw2 == product.  Repeated roots (2 intersections).
                var root = Math.sqrt(difference / w2);
                return new BoundingSphere.Interval(root, root);
            } else if (q2 < 1.0) {
                // Inside ellipsoid (2 intersections).
                difference = q2 - 1.0; // Negatively valued.
                w2 = Cartographic.Cartesian3.magnitudeSquared(w);
                product = w2 * difference; // Negatively valued.

                discriminant = qw * qw - product;
                temp = -qw + Math.sqrt(discriminant); // Positively valued.
                return new BoundingSphere.Interval(0.0, temp / w2);
            }
            // q2 == 1.0. On ellipsoid.
            if (qw < 0.0) {
                // Looking inward.
                w2 = Cartographic.Cartesian3.magnitudeSquared(w);
                return new BoundingSphere.Interval(0.0, -qw / w2);
            }

            // qw >= 0.0.  Looking outward or tangent.
            return undefined;
        };

        function addWithCancellationCheck$1(left, right, tolerance) {
            var difference = left + right;
            if ((_Math.CesiumMath.sign(left) !== _Math.CesiumMath.sign(right)) &&
                    Math.abs(difference / Math.max(Math.abs(left), Math.abs(right))) < tolerance) {
                return 0.0;
            }

            return difference;
        }

        function quadraticVectorExpression(A, b, c, x, w) {
            var xSquared = x * x;
            var wSquared = w * w;

            var l2 = (A[BoundingSphere.Matrix3.COLUMN1ROW1] - A[BoundingSphere.Matrix3.COLUMN2ROW2]) * wSquared;
            var l1 = w * (x * addWithCancellationCheck$1(A[BoundingSphere.Matrix3.COLUMN1ROW0], A[BoundingSphere.Matrix3.COLUMN0ROW1], _Math.CesiumMath.EPSILON15) + b.y);
            var l0 = (A[BoundingSphere.Matrix3.COLUMN0ROW0] * xSquared + A[BoundingSphere.Matrix3.COLUMN2ROW2] * wSquared) + x * b.x + c;

            var r1 = wSquared * addWithCancellationCheck$1(A[BoundingSphere.Matrix3.COLUMN2ROW1], A[BoundingSphere.Matrix3.COLUMN1ROW2], _Math.CesiumMath.EPSILON15);
            var r0 = w * (x * addWithCancellationCheck$1(A[BoundingSphere.Matrix3.COLUMN2ROW0], A[BoundingSphere.Matrix3.COLUMN0ROW2]) + b.z);

            var cosines;
            var solutions = [];
            if (r0 === 0.0 && r1 === 0.0) {
                cosines = QuadraticRealPolynomial.computeRealRoots(l2, l1, l0);
                if (cosines.length === 0) {
                    return solutions;
                }

                var cosine0 = cosines[0];
                var sine0 = Math.sqrt(Math.max(1.0 - cosine0 * cosine0, 0.0));
                solutions.push(new Cartographic.Cartesian3(x, w * cosine0, w * -sine0));
                solutions.push(new Cartographic.Cartesian3(x, w * cosine0, w * sine0));

                if (cosines.length === 2) {
                    var cosine1 = cosines[1];
                    var sine1 = Math.sqrt(Math.max(1.0 - cosine1 * cosine1, 0.0));
                    solutions.push(new Cartographic.Cartesian3(x, w * cosine1, w * -sine1));
                    solutions.push(new Cartographic.Cartesian3(x, w * cosine1, w * sine1));
                }

                return solutions;
            }

            var r0Squared = r0 * r0;
            var r1Squared = r1 * r1;
            var l2Squared = l2 * l2;
            var r0r1 = r0 * r1;

            var c4 = l2Squared + r1Squared;
            var c3 = 2.0 * (l1 * l2 + r0r1);
            var c2 = 2.0 * l0 * l2 + l1 * l1 - r1Squared + r0Squared;
            var c1 = 2.0 * (l0 * l1 - r0r1);
            var c0 = l0 * l0 - r0Squared;

            if (c4 === 0.0 && c3 === 0.0 && c2 === 0.0 && c1 === 0.0) {
                return solutions;
            }

            cosines = QuarticRealPolynomial.computeRealRoots(c4, c3, c2, c1, c0);
            var length = cosines.length;
            if (length === 0) {
                return solutions;
            }

            for ( var i = 0; i < length; ++i) {
                var cosine = cosines[i];
                var cosineSquared = cosine * cosine;
                var sineSquared = Math.max(1.0 - cosineSquared, 0.0);
                var sine = Math.sqrt(sineSquared);

                //var left = l2 * cosineSquared + l1 * cosine + l0;
                var left;
                if (_Math.CesiumMath.sign(l2) === _Math.CesiumMath.sign(l0)) {
                    left = addWithCancellationCheck$1(l2 * cosineSquared + l0, l1 * cosine, _Math.CesiumMath.EPSILON12);
                } else if (_Math.CesiumMath.sign(l0) === _Math.CesiumMath.sign(l1 * cosine)) {
                    left = addWithCancellationCheck$1(l2 * cosineSquared, l1 * cosine + l0, _Math.CesiumMath.EPSILON12);
                } else {
                    left = addWithCancellationCheck$1(l2 * cosineSquared + l1 * cosine, l0, _Math.CesiumMath.EPSILON12);
                }

                var right = addWithCancellationCheck$1(r1 * cosine, r0, _Math.CesiumMath.EPSILON15);
                var product = left * right;

                if (product < 0.0) {
                    solutions.push(new Cartographic.Cartesian3(x, w * cosine, w * sine));
                } else if (product > 0.0) {
                    solutions.push(new Cartographic.Cartesian3(x, w * cosine, w * -sine));
                } else if (sine !== 0.0) {
                    solutions.push(new Cartographic.Cartesian3(x, w * cosine, w * -sine));
                    solutions.push(new Cartographic.Cartesian3(x, w * cosine, w * sine));
                    ++i;
                } else {
                    solutions.push(new Cartographic.Cartesian3(x, w * cosine, w * sine));
                }
            }

            return solutions;
        }

        var firstAxisScratch = new Cartographic.Cartesian3();
        var secondAxisScratch = new Cartographic.Cartesian3();
        var thirdAxisScratch = new Cartographic.Cartesian3();
        var referenceScratch = new Cartographic.Cartesian3();
        var bCart = new Cartographic.Cartesian3();
        var bScratch = new BoundingSphere.Matrix3();
        var btScratch = new BoundingSphere.Matrix3();
        var diScratch = new BoundingSphere.Matrix3();
        var dScratch = new BoundingSphere.Matrix3();
        var cScratch = new BoundingSphere.Matrix3();
        var tempMatrix = new BoundingSphere.Matrix3();
        var aScratch = new BoundingSphere.Matrix3();
        var sScratch = new Cartographic.Cartesian3();
        var closestScratch = new Cartographic.Cartesian3();
        var surfPointScratch = new Cartographic.Cartographic();

        /**
         * Provides the point along the ray which is nearest to the ellipsoid.
         *
         * @param {Ray} ray The ray.
         * @param {Ellipsoid} ellipsoid The ellipsoid.
         * @returns {Cartesian3} The nearest planetodetic point on the ray.
         */
        IntersectionTests.grazingAltitudeLocation = function(ray, ellipsoid) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(ray)) {
                throw new Check.DeveloperError('ray is required.');
            }
            if (!when.defined(ellipsoid)) {
                throw new Check.DeveloperError('ellipsoid is required.');
            }
            //>>includeEnd('debug');

            var position = ray.origin;
            var direction = ray.direction;

            if (!Cartographic.Cartesian3.equals(position, Cartographic.Cartesian3.ZERO)) {
                var normal = ellipsoid.geodeticSurfaceNormal(position, firstAxisScratch);
                if (Cartographic.Cartesian3.dot(direction, normal) >= 0.0) { // The location provided is the closest point in altitude
                    return position;
                }
            }

            var intersects = when.defined(this.rayEllipsoid(ray, ellipsoid));

            // Compute the scaled direction vector.
            var f = ellipsoid.transformPositionToScaledSpace(direction, firstAxisScratch);

            // Constructs a basis from the unit scaled direction vector. Construct its rotation and transpose.
            var firstAxis = Cartographic.Cartesian3.normalize(f, f);
            var reference = Cartographic.Cartesian3.mostOrthogonalAxis(f, referenceScratch);
            var secondAxis = Cartographic.Cartesian3.normalize(Cartographic.Cartesian3.cross(reference, firstAxis, secondAxisScratch), secondAxisScratch);
            var thirdAxis  = Cartographic.Cartesian3.normalize(Cartographic.Cartesian3.cross(firstAxis, secondAxis, thirdAxisScratch), thirdAxisScratch);
            var B = bScratch;
            B[0] = firstAxis.x;
            B[1] = firstAxis.y;
            B[2] = firstAxis.z;
            B[3] = secondAxis.x;
            B[4] = secondAxis.y;
            B[5] = secondAxis.z;
            B[6] = thirdAxis.x;
            B[7] = thirdAxis.y;
            B[8] = thirdAxis.z;

            var B_T = BoundingSphere.Matrix3.transpose(B, btScratch);

            // Get the scaling matrix and its inverse.
            var D_I = BoundingSphere.Matrix3.fromScale(ellipsoid.radii, diScratch);
            var D = BoundingSphere.Matrix3.fromScale(ellipsoid.oneOverRadii, dScratch);

            var C = cScratch;
            C[0] = 0.0;
            C[1] = -direction.z;
            C[2] = direction.y;
            C[3] = direction.z;
            C[4] = 0.0;
            C[5] = -direction.x;
            C[6] = -direction.y;
            C[7] = direction.x;
            C[8] = 0.0;

            var temp = BoundingSphere.Matrix3.multiply(BoundingSphere.Matrix3.multiply(B_T, D, tempMatrix), C, tempMatrix);
            var A = BoundingSphere.Matrix3.multiply(BoundingSphere.Matrix3.multiply(temp, D_I, aScratch), B, aScratch);
            var b = BoundingSphere.Matrix3.multiplyByVector(temp, position, bCart);

            // Solve for the solutions to the expression in standard form:
            var solutions = quadraticVectorExpression(A, Cartographic.Cartesian3.negate(b, firstAxisScratch), 0.0, 0.0, 1.0);

            var s;
            var altitude;
            var length = solutions.length;
            if (length > 0) {
                var closest = Cartographic.Cartesian3.clone(Cartographic.Cartesian3.ZERO, closestScratch);
                var maximumValue = Number.NEGATIVE_INFINITY;

                for ( var i = 0; i < length; ++i) {
                    s = BoundingSphere.Matrix3.multiplyByVector(D_I, BoundingSphere.Matrix3.multiplyByVector(B, solutions[i], sScratch), sScratch);
                    var v = Cartographic.Cartesian3.normalize(Cartographic.Cartesian3.subtract(s, position, referenceScratch), referenceScratch);
                    var dotProduct = Cartographic.Cartesian3.dot(v, direction);

                    if (dotProduct > maximumValue) {
                        maximumValue = dotProduct;
                        closest = Cartographic.Cartesian3.clone(s, closest);
                    }
                }

                var surfacePoint = ellipsoid.cartesianToCartographic(closest, surfPointScratch);
                maximumValue = _Math.CesiumMath.clamp(maximumValue, 0.0, 1.0);
                altitude = Cartographic.Cartesian3.magnitude(Cartographic.Cartesian3.subtract(closest, position, referenceScratch)) * Math.sqrt(1.0 - maximumValue * maximumValue);
                altitude = intersects ? -altitude : altitude;
                surfacePoint.height = altitude;
                return ellipsoid.cartographicToCartesian(surfacePoint, new Cartographic.Cartesian3());
            }

            return undefined;
        };

        var lineSegmentPlaneDifference = new Cartographic.Cartesian3();

        /**
         * Computes the intersection of a line segment and a plane.
         *
         * @param {Cartesian3} endPoint0 An end point of the line segment.
         * @param {Cartesian3} endPoint1 The other end point of the line segment.
         * @param {Plane} plane The plane.
         * @param {Cartesian3} [result] The object onto which to store the result.
         * @returns {Cartesian3} The intersection point or undefined if there is no intersection.
         *
         * @example
         * var origin = Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883);
         * var normal = ellipsoid.geodeticSurfaceNormal(origin);
         * var plane = Cesium.Plane.fromPointNormal(origin, normal);
         *
         * var p0 = new Cesium.Cartesian3(...);
         * var p1 = new Cesium.Cartesian3(...);
         *
         * // find the intersection of the line segment from p0 to p1 and the tangent plane at origin.
         * var intersection = Cesium.IntersectionTests.lineSegmentPlane(p0, p1, plane);
         */
        IntersectionTests.lineSegmentPlane = function(endPoint0, endPoint1, plane, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(endPoint0)) {
                throw new Check.DeveloperError('endPoint0 is required.');
            }
            if (!when.defined(endPoint1)) {
                throw new Check.DeveloperError('endPoint1 is required.');
            }
            if (!when.defined(plane)) {
                throw new Check.DeveloperError('plane is required.');
            }
            //>>includeEnd('debug');

            if (!when.defined(result)) {
                result = new Cartographic.Cartesian3();
            }

            var difference = Cartographic.Cartesian3.subtract(endPoint1, endPoint0, lineSegmentPlaneDifference);
            var normal = plane.normal;
            var nDotDiff = Cartographic.Cartesian3.dot(normal, difference);

            // check if the segment and plane are parallel
            if (Math.abs(nDotDiff) < _Math.CesiumMath.EPSILON6) {
                return undefined;
            }

            var nDotP0 = Cartographic.Cartesian3.dot(normal, endPoint0);
            var t = -(plane.distance + nDotP0) / nDotDiff;

            // intersection only if t is in [0, 1]
            if (t < 0.0 || t > 1.0) {
                return undefined;
            }

            // intersection is endPoint0 + t * (endPoint1 - endPoint0)
            Cartographic.Cartesian3.multiplyByScalar(difference, t, result);
            Cartographic.Cartesian3.add(endPoint0, result, result);
            return result;
        };

        /**
         * Computes the intersection of a triangle and a plane
         *
         * @param {Cartesian3} p0 First point of the triangle
         * @param {Cartesian3} p1 Second point of the triangle
         * @param {Cartesian3} p2 Third point of the triangle
         * @param {Plane} plane Intersection plane
         * @returns {Object} An object with properties <code>positions</code> and <code>indices</code>, which are arrays that represent three triangles that do not cross the plane. (Undefined if no intersection exists)
         *
         * @example
         * var origin = Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883);
         * var normal = ellipsoid.geodeticSurfaceNormal(origin);
         * var plane = Cesium.Plane.fromPointNormal(origin, normal);
         *
         * var p0 = new Cesium.Cartesian3(...);
         * var p1 = new Cesium.Cartesian3(...);
         * var p2 = new Cesium.Cartesian3(...);
         *
         * // convert the triangle composed of points (p0, p1, p2) to three triangles that don't cross the plane
         * var triangles = Cesium.IntersectionTests.trianglePlaneIntersection(p0, p1, p2, plane);
         */
        IntersectionTests.trianglePlaneIntersection = function(p0, p1, p2, plane) {
            //>>includeStart('debug', pragmas.debug);
            if ((!when.defined(p0)) ||
                (!when.defined(p1)) ||
                (!when.defined(p2)) ||
                (!when.defined(plane))) {
                throw new Check.DeveloperError('p0, p1, p2, and plane are required.');
            }
            //>>includeEnd('debug');

            var planeNormal = plane.normal;
            var planeD = plane.distance;
            var p0Behind = (Cartographic.Cartesian3.dot(planeNormal, p0) + planeD) < 0.0;
            var p1Behind = (Cartographic.Cartesian3.dot(planeNormal, p1) + planeD) < 0.0;
            var p2Behind = (Cartographic.Cartesian3.dot(planeNormal, p2) + planeD) < 0.0;
            // Given these dots products, the calls to lineSegmentPlaneIntersection
            // always have defined results.

            var numBehind = 0;
            numBehind += p0Behind ? 1 : 0;
            numBehind += p1Behind ? 1 : 0;
            numBehind += p2Behind ? 1 : 0;

            var u1, u2;
            if (numBehind === 1 || numBehind === 2) {
                u1 = new Cartographic.Cartesian3();
                u2 = new Cartographic.Cartesian3();
            }

            if (numBehind === 1) {
                if (p0Behind) {
                    IntersectionTests.lineSegmentPlane(p0, p1, plane, u1);
                    IntersectionTests.lineSegmentPlane(p0, p2, plane, u2);

                    return {
                        positions : [p0, p1, p2, u1, u2 ],
                        indices : [
                            // Behind
                            0, 3, 4,

                            // In front
                            1, 2, 4,
                            1, 4, 3
                        ]
                    };
                } else if (p1Behind) {
                    IntersectionTests.lineSegmentPlane(p1, p2, plane, u1);
                    IntersectionTests.lineSegmentPlane(p1, p0, plane, u2);

                    return {
                        positions : [p0, p1, p2, u1, u2 ],
                        indices : [
                            // Behind
                            1, 3, 4,

                            // In front
                            2, 0, 4,
                            2, 4, 3
                        ]
                    };
                } else if (p2Behind) {
                    IntersectionTests.lineSegmentPlane(p2, p0, plane, u1);
                    IntersectionTests.lineSegmentPlane(p2, p1, plane, u2);

                    return {
                        positions : [p0, p1, p2, u1, u2 ],
                        indices : [
                            // Behind
                            2, 3, 4,

                            // In front
                            0, 1, 4,
                            0, 4, 3
                        ]
                    };
                }
            } else if (numBehind === 2) {
                if (!p0Behind) {
                    IntersectionTests.lineSegmentPlane(p1, p0, plane, u1);
                    IntersectionTests.lineSegmentPlane(p2, p0, plane, u2);

                    return {
                        positions : [p0, p1, p2, u1, u2 ],
                        indices : [
                            // Behind
                            1, 2, 4,
                            1, 4, 3,

                            // In front
                            0, 3, 4
                        ]
                    };
                } else if (!p1Behind) {
                    IntersectionTests.lineSegmentPlane(p2, p1, plane, u1);
                    IntersectionTests.lineSegmentPlane(p0, p1, plane, u2);

                    return {
                        positions : [p0, p1, p2, u1, u2 ],
                        indices : [
                            // Behind
                            2, 0, 4,
                            2, 4, 3,

                            // In front
                            1, 3, 4
                        ]
                    };
                } else if (!p2Behind) {
                    IntersectionTests.lineSegmentPlane(p0, p2, plane, u1);
                    IntersectionTests.lineSegmentPlane(p1, p2, plane, u2);

                    return {
                        positions : [p0, p1, p2, u1, u2 ],
                        indices : [
                            // Behind
                            0, 1, 4,
                            0, 4, 3,

                            // In front
                            2, 3, 4
                        ]
                    };
                }
            }

            // if numBehind is 3, the triangle is completely behind the plane;
            // otherwise, it is completely in front (numBehind is 0).
            return undefined;
        };

    exports.IntersectionTests = IntersectionTests;
    exports.Ray = Ray;

});
