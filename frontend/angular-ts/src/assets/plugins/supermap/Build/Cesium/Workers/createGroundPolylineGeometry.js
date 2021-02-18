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
define(['./when-8d13db60', './Check-70bec281', './Math-61ede240', './Cartographic-fe4be337', './Cartesian2-85064f09', './BoundingSphere-775c5788', './Cartesian4-5af5bb24', './RuntimeError-ba10bc3e', './WebGLConstants-4c11ee5f', './ComponentDatatype-5862616f', './GeometryAttribute-06d31d45', './PrimitiveType-97893bc7', './FeatureDetection-7bd32c34', './Transforms-913163ed', './buildModuleUrl-9d43158d', './EncodedCartesian3-a569cba8', './IntersectionTests-397d9494', './Plane-8390418f', './WebMercatorProjection-80c70558', './arrayRemoveDuplicates-f0b089b1', './ArcType-66bc286a', './EllipsoidRhumbLine-f161e674', './EllipsoidGeodesic-84507801'], function (when, Check, _Math, Cartographic, Cartesian2, BoundingSphere, Cartesian4, RuntimeError, WebGLConstants, ComponentDatatype, GeometryAttribute, PrimitiveType, FeatureDetection, Transforms, buildModuleUrl, EncodedCartesian3, IntersectionTests, Plane, WebMercatorProjection, arrayRemoveDuplicates, ArcType, EllipsoidRhumbLine, EllipsoidGeodesic) { 'use strict';

    /**
     * A tiling scheme for geometry referenced to a simple {@link GeographicProjection} where
     * longitude and latitude are directly mapped to X and Y.  This projection is commonly
     * known as geographic, equirectangular, equidistant cylindrical, or plate carrée.
     *
     * @alias GeographicTilingScheme
     * @constructor
     *
     * @param {Object} [options] Object with the following properties:
     * @param {Ellipsoid} [options.ellipsoid=Ellipsoid.WGS84] The ellipsoid whose surface is being tiled. Defaults to
     * the WGS84 ellipsoid.
     * @param {Rectangle} [options.rectangle=Rectangle.MAX_VALUE] The rectangle, in radians, covered by the tiling scheme.
     * @param {Number} [options.numberOfLevelZeroTilesX=2] The number of tiles in the X direction at level zero of
     * the tile tree.
     * @param {Number} [options.numberOfLevelZeroTilesY=1] The number of tiles in the Y direction at level zero of
     * the tile tree.
     */
    function GeographicTilingScheme(options) {
        options = when.defaultValue(options, {});

        this._ellipsoid = when.defaultValue(options.ellipsoid, Cartesian2.Ellipsoid.WGS84);
        this._rectangle = when.defaultValue(options.rectangle, Cartesian2.Rectangle.MAX_VALUE);
        this._projection = new BoundingSphere.GeographicProjection(this._ellipsoid);
        this._numberOfLevelZeroTilesX = when.defaultValue(options.numberOfLevelZeroTilesX, 2);
        this._numberOfLevelZeroTilesY = when.defaultValue(options.numberOfLevelZeroTilesY, 1);


        this._customDPI = options.customDPI;
        this._scaleDenominators = options.scaleDenominators;

        this._tileWidth = when.defaultValue(options.tileWidth, 256);
        this._tileHeight = when.defaultValue(options.tileHeight, 256);

        this._beginLevel = when.defaultValue(options.beginLevel, 0);
    }

    Object.defineProperties(GeographicTilingScheme.prototype, {
        /**
         * Gets the ellipsoid that is tiled by this tiling scheme.
         * @memberof GeographicTilingScheme.prototype
         * @type {Ellipsoid}
         */
        ellipsoid : {
            get : function() {
                return this._ellipsoid;
            }
        },

        /**
         * Gets the rectangle, in radians, covered by this tiling scheme.
         * @memberof GeographicTilingScheme.prototype
         * @type {Rectangle}
         */
        rectangle : {
            get : function() {
                return this._rectangle;
            }
        },

        /**
         * Gets the map projection used by this tiling scheme.
         * @memberof GeographicTilingScheme.prototype
         * @type {MapProjection}
         */
        projection : {
            get : function() {
                return this._projection;
            }
        },
        beginLevel : {
            get : function() {
                return this._beginLevel;
            }
        }
    });

    /**
     * Gets the total number of tiles in the X direction at a specified level-of-detail.
     *
     * @param {Number} level The level-of-detail.
     * @returns {Number} The number of tiles in the X direction at the given level.
     */
    GeographicTilingScheme.prototype.getNumberOfXTilesAtLevel = function(level) {
        return this._numberOfLevelZeroTilesX << (level - this._beginLevel);
    };

    /**
     * Gets the total number of tiles in the Y direction at a specified level-of-detail.
     *
     * @param {Number} level The level-of-detail.
     * @returns {Number} The number of tiles in the Y direction at the given level.
     */
    GeographicTilingScheme.prototype.getNumberOfYTilesAtLevel = function(level) {
        return this._numberOfLevelZeroTilesY << (level - this._beginLevel);
    };

    /**
     * Transforms a rectangle specified in geodetic radians to the native coordinate system
     * of this tiling scheme.
     *
     * @param {Rectangle} rectangle The rectangle to transform.
     * @param {Rectangle} [result] The instance to which to copy the result, or undefined if a new instance
     *        should be created.
     * @returns {Rectangle} The specified 'result', or a new object containing the native rectangle if 'result'
     *          is undefined.
     */
    GeographicTilingScheme.prototype.rectangleToNativeRectangle = function(rectangle, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.defined('rectangle', rectangle);
        //>>includeEnd('debug');

        var west = _Math.CesiumMath.toDegrees(rectangle.west);
        var south = _Math.CesiumMath.toDegrees(rectangle.south);
        var east = _Math.CesiumMath.toDegrees(rectangle.east);
        var north = _Math.CesiumMath.toDegrees(rectangle.north);

        if (!when.defined(result)) {
            return new Cartesian2.Rectangle(west, south, east, north);
        }

        result.west = west;
        result.south = south;
        result.east = east;
        result.north = north;
        return result;
    };

    /**
     * Converts tile x, y coordinates and level to a rectangle expressed in the native coordinates
     * of the tiling scheme.
     *
     * @param {Number} x The integer x coordinate of the tile.
     * @param {Number} y The integer y coordinate of the tile.
     * @param {Number} level The tile level-of-detail.  Zero is the least detailed.
     * @param {Object} [result] The instance to which to copy the result, or undefined if a new instance
     *        should be created.
     * @returns {Rectangle} The specified 'result', or a new object containing the rectangle
     *          if 'result' is undefined.
     */
    GeographicTilingScheme.prototype.tileXYToNativeRectangle = function(x, y, level, result) {
        var rectangleRadians = this.tileXYToRectangle(x, y, level, result);
        rectangleRadians.west = _Math.CesiumMath.toDegrees(rectangleRadians.west);
        rectangleRadians.south = _Math.CesiumMath.toDegrees(rectangleRadians.south);
        rectangleRadians.east = _Math.CesiumMath.toDegrees(rectangleRadians.east);
        rectangleRadians.north = _Math.CesiumMath.toDegrees(rectangleRadians.north);
        return rectangleRadians;
    };

    /**
     * Converts tile x, y coordinates and level to a cartographic rectangle in radians.
     *
     * @param {Number} x The integer x coordinate of the tile.
     * @param {Number} y The integer y coordinate of the tile.
     * @param {Number} level The tile level-of-detail.  Zero is the least detailed.
     * @param {Object} [result] The instance to which to copy the result, or undefined if a new instance
     *        should be created.
     * @returns {Rectangle} The specified 'result', or a new object containing the rectangle
     *          if 'result' is undefined.
     */
    GeographicTilingScheme.prototype.tileXYToRectangle = function(x, y, level, result) {
        var rectangle = this._rectangle;

        if(when.defined(this._customDPI) && when.defined(this._scaleDenominators)){

            var resolution = this.calculateResolution(level);

            var west = -_Math.CesiumMath.PI + x * this._tileWidth * resolution.x;
            var east = -_Math.CesiumMath.PI + (x + 1) * this._tileWidth * resolution.x;

            var north = _Math.CesiumMath.PI_OVER_TWO - y * this._tileHeight * resolution.y;
            var south = _Math.CesiumMath.PI_OVER_TWO - (y + 1) * this._tileHeight * resolution.y;

            if (!when.defined(result)) {
                return new Cartesian2.Rectangle(west, south, east, north);
            }

            result.west = west;
            result.south = south;
            result.east = east;
            result.north = north;
            return result;
        }


        var xTiles = this.getNumberOfXTilesAtLevel(level);
        var yTiles = this.getNumberOfYTilesAtLevel(level);

        var xTileWidth = rectangle.width / xTiles;
        var west = x * xTileWidth + rectangle.west;
        var east = (x + 1) * xTileWidth + rectangle.west;

        var yTileHeight = rectangle.height / yTiles;
        var north = rectangle.north - y * yTileHeight;
        var south = rectangle.north - (y + 1) * yTileHeight;

        if (!when.defined(result)) {
            result = new Cartesian2.Rectangle(west, south, east, north);
        }

        result.west = west;
        result.south = south;
        result.east = east;
        result.north = north;
        return result;
    };

    /**
     * Calculates the tile x, y coordinates of the tile containing
     * a given cartographic position.
     *
     * @param {Cartographic} position The position.
     * @param {Number} level The tile level-of-detail.  Zero is the least detailed.
     * @param {Cartesian2} [result] The instance to which to copy the result, or undefined if a new instance
     *        should be created.
     * @returns {Cartesian2} The specified 'result', or a new object containing the tile x, y coordinates
     *          if 'result' is undefined.
     */
    GeographicTilingScheme.prototype.positionToTileXY = function(position, level, result) {
        var rectangle = this._rectangle;
        if (!Cartesian2.Rectangle.contains(rectangle, position)) {
            // outside the bounds of the tiling scheme
            return undefined;
        }

        var xTiles = this.getNumberOfXTilesAtLevel(level);
        var yTiles = this.getNumberOfYTilesAtLevel(level);

        var xTileWidth = rectangle.width / xTiles;
        var yTileHeight = rectangle.height / yTiles;

        if(when.defined(this._customDPI) && when.defined(this._scaleDenominators)) {
            var resolution = this.calculateResolution(level);
            xTileWidth = this._tileWidth * resolution.x;
            yTileHeight = this._tileHeight * resolution.y;
        }

        var longitude = position.longitude;
        if (rectangle.east < rectangle.west) {
            longitude += _Math.CesiumMath.TWO_PI;
        }

        var xTileCoordinate = (longitude - rectangle.west) / xTileWidth | 0;
        if (xTileCoordinate >= xTiles) {
            xTileCoordinate = xTiles - 1;
        }

        var yTileCoordinate = (rectangle.north - position.latitude) / yTileHeight | 0;
        if (yTileCoordinate >= yTiles) {
            yTileCoordinate = yTiles - 1;
        }

        if (!when.defined(result)) {
            return new Cartesian2.Cartesian2(xTileCoordinate, yTileCoordinate);
        }

        result.x = xTileCoordinate;
        result.y = yTileCoordinate;
        return result;
    };

    GeographicTilingScheme.prototype.calculateResolution = function(level) {

        var xResolution = this._scaleDenominators[level - this._beginLevel] * 0.0254 / this._customDPI.x;
        var yResolution = this._scaleDenominators[level - this._beginLevel] * 0.0254 / this._customDPI.y;

        var meterPerDegreeInEquator = Cartesian2.Ellipsoid.WGS84.maximumRadius/* * CesiumMath.TWO_PI / 360.0*/;

        return new Cartesian2.Cartesian2(xResolution / meterPerDegreeInEquator, yResolution / meterPerDegreeInEquator);
    };

    var scratchDiagonalCartesianNE = new Cartographic.Cartesian3();
        var scratchDiagonalCartesianSW = new Cartographic.Cartesian3();
        var scratchDiagonalCartographic = new Cartographic.Cartographic();
        var scratchCenterCartesian = new Cartographic.Cartesian3();
        var scratchSurfaceCartesian = new Cartographic.Cartesian3();

        var scratchBoundingSphere = new BoundingSphere.BoundingSphere();
        var tilingScheme = new GeographicTilingScheme();
        var scratchCorners = [new Cartographic.Cartographic(), new Cartographic.Cartographic(), new Cartographic.Cartographic(), new Cartographic.Cartographic()];
        var scratchTileXY = new Cartesian2.Cartesian2();

        /**
         * A collection of functions for approximating terrain height
         * @private
         */
        var ApproximateTerrainHeights = {};

        /**
         * Initializes the minimum and maximum terrain heights
         * @return {Promise}
         */
        ApproximateTerrainHeights.initialize = function() {
            var initPromise = ApproximateTerrainHeights._initPromise;
            if (when.defined(initPromise)) {
                return initPromise;
            }

            initPromise = buildModuleUrl.Resource.fetchJson(buildModuleUrl.buildModuleUrl('Assets/approximateTerrainHeights.json'))
                .then(function(json) {
                    ApproximateTerrainHeights._terrainHeights = json;
                });
            ApproximateTerrainHeights._initPromise = initPromise;

            return initPromise;
        };

        /**
         * Computes the minimum and maximum terrain heights for a given rectangle
         * @param {Rectangle} rectangle The bounding rectangle
         * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid
         * @return {{minimumTerrainHeight: Number, maximumTerrainHeight: Number}}
         */
        ApproximateTerrainHeights.getMinimumMaximumHeights = function(rectangle, ellipsoid) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('rectangle', rectangle);
            if (!when.defined(ApproximateTerrainHeights._terrainHeights)) {
                throw new Check.DeveloperError('You must call ApproximateTerrainHeights.initialize and wait for the promise to resolve before using this function');
            }
            //>>includeEnd('debug');
            ellipsoid = when.defaultValue(ellipsoid, Cartesian2.Ellipsoid.WGS84);

            var xyLevel = getTileXYLevel(rectangle);

            // Get the terrain min/max for that tile
            var minTerrainHeight = ApproximateTerrainHeights._defaultMinTerrainHeight;
            var maxTerrainHeight = ApproximateTerrainHeights._defaultMaxTerrainHeight;
            if (when.defined(xyLevel)) {
                var key = xyLevel.level + '-' + xyLevel.x + '-' + xyLevel.y;
                var heights = ApproximateTerrainHeights._terrainHeights[key];
                if (when.defined(heights)) {
                    minTerrainHeight = heights[0];
                    maxTerrainHeight = heights[1];
                }

                // Compute min by taking the center of the NE->SW diagonal and finding distance to the surface
                ellipsoid.cartographicToCartesian(Cartesian2.Rectangle.northeast(rectangle, scratchDiagonalCartographic),
                    scratchDiagonalCartesianNE);
                ellipsoid.cartographicToCartesian(Cartesian2.Rectangle.southwest(rectangle, scratchDiagonalCartographic),
                    scratchDiagonalCartesianSW);

                Cartographic.Cartesian3.midpoint(scratchDiagonalCartesianSW, scratchDiagonalCartesianNE, scratchCenterCartesian);
                var surfacePosition = ellipsoid.scaleToGeodeticSurface(scratchCenterCartesian, scratchSurfaceCartesian);
                if (when.defined(surfacePosition)) {
                    var distance = Cartographic.Cartesian3.distance(scratchCenterCartesian, surfacePosition);
                    minTerrainHeight = Math.min(minTerrainHeight, -distance);
                } else {
                    minTerrainHeight = ApproximateTerrainHeights._defaultMinTerrainHeight;
                }
            }

            minTerrainHeight = Math.max(ApproximateTerrainHeights._defaultMinTerrainHeight, minTerrainHeight);

            return {
                minimumTerrainHeight: minTerrainHeight,
                maximumTerrainHeight: maxTerrainHeight
            };
        };

        /**
         * Computes the bounding sphere based on the tile heights in the rectangle
         * @param {Rectangle} rectangle The bounding rectangle
         * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid
         * @return {BoundingSphere} The result bounding sphere
         */
        ApproximateTerrainHeights.getBoundingSphere = function(rectangle, ellipsoid) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('rectangle', rectangle);
            if (!when.defined(ApproximateTerrainHeights._terrainHeights)) {
                throw new Check.DeveloperError('You must call ApproximateTerrainHeights.initialize and wait for the promise to resolve before using this function');
            }
            //>>includeEnd('debug');
            ellipsoid = when.defaultValue(ellipsoid, Cartesian2.Ellipsoid.WGS84);

            var xyLevel = getTileXYLevel(rectangle);

            // Get the terrain max for that tile
            var maxTerrainHeight = ApproximateTerrainHeights._defaultMaxTerrainHeight;
            if (when.defined(xyLevel)) {
                var key = xyLevel.level + '-' + xyLevel.x + '-' + xyLevel.y;
                var heights = ApproximateTerrainHeights._terrainHeights[key];
                if (when.defined(heights)) {
                    maxTerrainHeight = heights[1];
                }
            }

            var result = BoundingSphere.BoundingSphere.fromRectangle3D(rectangle, ellipsoid, 0.0);
            BoundingSphere.BoundingSphere.fromRectangle3D(rectangle, ellipsoid, maxTerrainHeight, scratchBoundingSphere);

            return BoundingSphere.BoundingSphere.union(result, scratchBoundingSphere, result);
        };

        function getTileXYLevel(rectangle) {
            Cartographic.Cartographic.fromRadians(rectangle.east, rectangle.north, 0.0, scratchCorners[0]);
            Cartographic.Cartographic.fromRadians(rectangle.west, rectangle.north, 0.0, scratchCorners[1]);
            Cartographic.Cartographic.fromRadians(rectangle.east, rectangle.south, 0.0, scratchCorners[2]);
            Cartographic.Cartographic.fromRadians(rectangle.west, rectangle.south, 0.0, scratchCorners[3]);

            // Determine which tile the bounding rectangle is in
            var lastLevelX = 0, lastLevelY = 0;
            var currentX = 0, currentY = 0;
            var maxLevel = ApproximateTerrainHeights._terrainHeightsMaxLevel;
            var i;
            for(i = 0; i <= maxLevel; ++i) {
                var failed = false;
                for(var j = 0; j < 4; ++j) {
                    var corner = scratchCorners[j];
                    tilingScheme.positionToTileXY(corner, i, scratchTileXY);
                    if (j === 0) {
                        currentX = scratchTileXY.x;
                        currentY = scratchTileXY.y;
                    } else if(currentX !== scratchTileXY.x || currentY !== scratchTileXY.y) {
                        failed = true;
                        break;
                    }
                }

                if (failed) {
                    break;
                }

                lastLevelX = currentX;
                lastLevelY = currentY;
            }

            if (i === 0) {
                return undefined;
            }

            return {
                x : lastLevelX,
                y : lastLevelY,
                level : (i > maxLevel) ? maxLevel : (i - 1)
            };
        }

        ApproximateTerrainHeights._terrainHeightsMaxLevel = 6;
        ApproximateTerrainHeights._defaultMaxTerrainHeight = 9000.0;
        ApproximateTerrainHeights._defaultMinTerrainHeight = -100000.0;
        ApproximateTerrainHeights._terrainHeights = undefined;
        ApproximateTerrainHeights._initPromise = undefined;

        Object.defineProperties(ApproximateTerrainHeights, {
            /**
             * Determines if the terrain heights are initialized and ready to use. To initialize the terrain heights,
             * call {@link ApproximateTerrainHeights#initialize} and wait for the returned promise to resolve.
             * @type {Boolean}
             * @readonly
             * @memberof ApproximateTerrainHeights
             */
            initialized: {
                get: function() {
                    return when.defined(ApproximateTerrainHeights._terrainHeights);
                }
            }
        });

    var PROJECTIONS = [BoundingSphere.GeographicProjection, WebMercatorProjection.WebMercatorProjection];
    var PROJECTION_COUNT = PROJECTIONS.length;

    var MITER_BREAK_SMALL = Math.cos(_Math.CesiumMath.toRadians(30.0));
    var MITER_BREAK_LARGE = Math.cos(_Math.CesiumMath.toRadians(150.0));

    // Initial heights for constructing the wall.
    // Keeping WALL_INITIAL_MIN_HEIGHT near the ellipsoid surface helps
    // prevent precision problems with planes in the shader.
    // Putting the start point of a plane at ApproximateTerrainHeights._defaultMinTerrainHeight,
    // which is a highly conservative bound, usually puts the plane origin several thousands
    // of meters away from the actual terrain, causing floating point problems when checking
    // fragments on terrain against the plane.
    // Ellipsoid height is generally much closer.
    // The initial max height is arbitrary.
    // Both heights are corrected using ApproximateTerrainHeights for computing the actual volume geometry.
    var WALL_INITIAL_MIN_HEIGHT = 0.0;
    var WALL_INITIAL_MAX_HEIGHT = 1000.0;

    /**
     * A description of a polyline on terrain or 3D Tiles. Only to be used with {@link GroundPolylinePrimitive}.
     *
     * @alias GroundPolylineGeometry
     * @constructor
     *
     * @param {Object} options Options with the following properties:
     * @param {Cartesian3[]} options.positions An array of {@link Cartesian3} defining the polyline's points. Heights above the ellipsoid will be ignored.
     * @param {Number} [options.width=1.0] The screen space width in pixels.
     * @param {Number} [options.granularity=9999.0] The distance interval in meters used for interpolating options.points. Defaults to 9999.0 meters. Zero indicates no interpolation.
     * @param {Boolean} [options.loop=false] Whether during geometry creation a line segment will be added between the last and first line positions to make this Polyline a loop.
     * @param {ArcType} [options.arcType=ArcType.GEODESIC] The type of line the polyline segments must follow. Valid options are {@link ArcType.GEODESIC} and {@link ArcType.RHUMB}.
     *
     * @exception {DeveloperError} At least two positions are required.
     *
     * @see GroundPolylinePrimitive
     *
     * @example
     * var positions = Cesium.Cartesian3.fromDegreesArray([
     *   -112.1340164450331, 36.05494287836128,
     *   -112.08821010582645, 36.097804071380715,
     *   -112.13296079730024, 36.168769146801104
     * ]);
     *
     * var geometry = new Cesium.GroundPolylineGeometry({
     *   positions : positions
     * });
     */
    function GroundPolylineGeometry(options) {
        options = when.defaultValue(options, when.defaultValue.EMPTY_OBJECT);
        var positions = options.positions;

        //>>includeStart('debug', pragmas.debug);
        if ((!when.defined(positions)) || (positions.length < 2)) {
            throw new Check.DeveloperError('At least two positions are required.');
        }
        if (when.defined(options.arcType) && options.arcType !== ArcType.ArcType.GEODESIC && options.arcType !== ArcType.ArcType.RHUMB) {
            throw new Check.DeveloperError('Valid options for arcType are ArcType.GEODESIC and ArcType.RHUMB.');
        }
        //>>includeEnd('debug');

        /**
         * The screen space width in pixels.
         * @type {Number}
         */
        this.width = when.defaultValue(options.width, 1.0); // Doesn't get packed, not necessary for computing geometry.

        this._positions = positions;

        /**
         * The distance interval used for interpolating options.points. Zero indicates no interpolation.
         * Default of 9999.0 allows centimeter accuracy with 32 bit floating point.
         * @type {Boolean}
         * @default 9999.0
         */
        this.granularity = when.defaultValue(options.granularity, 9999.0);

        /**
         * Whether during geometry creation a line segment will be added between the last and first line positions to make this Polyline a loop.
         * If the geometry has two positions this parameter will be ignored.
         * @type {Boolean}
         * @default false
         */
        this.loop = when.defaultValue(options.loop, false);

        /**
         * The type of path the polyline must follow. Valid options are {@link ArcType.GEODESIC} and {@link ArcType.RHUMB}.
         * @type {ArcType}
         * @default ArcType.GEODESIC
         */
        this.arcType = when.defaultValue(options.arcType, ArcType.ArcType.GEODESIC);

        this._ellipsoid = when.defaultValue(options.ellipsoid, Cartesian2.Ellipsoid.WGS84);

        // MapProjections can't be packed, so store the index to a known MapProjection.
        this._projectionIndex = 0;
        this._workerName = 'createGroundPolylineGeometry';

        // Used by GroundPolylinePrimitive to signal worker that scenemode is 3D only.
        this._scene3DOnly = false;
    }

    Object.defineProperties(GroundPolylineGeometry.prototype, {
        /**
         * The number of elements used to pack the object into an array.
         * @memberof GroundPolylineGeometry.prototype
         * @type {Number}
         * @readonly
         * @private
         */
        packedLength: {
            get: function() {
                return 1.0 + this._positions.length * 3 + 1.0 + 1.0 + 1.0 + Cartesian2.Ellipsoid.packedLength + 1.0 + 1.0;
            }
        }
    });

    /**
     * Set the GroundPolylineGeometry's projection and ellipsoid.
     * Used by GroundPolylinePrimitive to signal scene information to the geometry for generating 2D attributes.
     *
     * @param {GroundPolylineGeometry} groundPolylineGeometry GroundPolylinGeometry describing a polyline on terrain or 3D Tiles.
     * @param {Projection} mapProjection A MapProjection used for projecting cartographic coordinates to 2D.
     * @private
     */
    GroundPolylineGeometry.setProjectionAndEllipsoid = function(groundPolylineGeometry, mapProjection) {
        var projectionIndex = 0;
        for (var i = 0; i < PROJECTION_COUNT; i++) {
            if (mapProjection instanceof PROJECTIONS[i]) {
                projectionIndex = i;
                break;
            }
        }

        groundPolylineGeometry._projectionIndex = projectionIndex;
        groundPolylineGeometry._ellipsoid = mapProjection.ellipsoid;
    };

    var cart3Scratch1 = new Cartographic.Cartesian3();
    var cart3Scratch2 = new Cartographic.Cartesian3();
    var cart3Scratch3 = new Cartographic.Cartesian3();
    function computeRightNormal(start, end, maxHeight, ellipsoid, result) {
        var startBottom = getPosition(ellipsoid, start, 0.0, cart3Scratch1);
        var startTop = getPosition(ellipsoid, start, maxHeight, cart3Scratch2);
        var endBottom = getPosition(ellipsoid, end, 0.0, cart3Scratch3);

        var up = direction(startTop, startBottom, cart3Scratch2);
        var forward = direction(endBottom, startBottom, cart3Scratch3);

        Cartographic.Cartesian3.cross(forward, up, result);
        return Cartographic.Cartesian3.normalize(result, result);
    }

    var interpolatedCartographicScratch = new Cartographic.Cartographic();
    var interpolatedBottomScratch = new Cartographic.Cartesian3();
    var interpolatedTopScratch = new Cartographic.Cartesian3();
    var interpolatedNormalScratch = new Cartographic.Cartesian3();
    function interpolateSegment(start, end, minHeight, maxHeight, granularity, arcType, ellipsoid, normalsArray, bottomPositionsArray, topPositionsArray, cartographicsArray) {
        if (granularity === 0.0) {
            return;
        }

        var ellipsoidLine;
        if (arcType === ArcType.ArcType.GEODESIC) {
            ellipsoidLine = new EllipsoidGeodesic.EllipsoidGeodesic(start, end, ellipsoid);
        } else if (arcType === ArcType.ArcType.RHUMB) {
            ellipsoidLine = new EllipsoidRhumbLine.EllipsoidRhumbLine(start, end, ellipsoid);
        }

        var surfaceDistance = ellipsoidLine.surfaceDistance;
        if (surfaceDistance < granularity) {
            return;
        }

        // Compute rightwards normal applicable at all interpolated points
        var interpolatedNormal = computeRightNormal(start, end, maxHeight, ellipsoid, interpolatedNormalScratch);

        var segments = Math.ceil(surfaceDistance / granularity);
        var interpointDistance = surfaceDistance / segments;
        var distanceFromStart = interpointDistance;
        var pointsToAdd = segments - 1;
        var packIndex = normalsArray.length;
        for (var i = 0; i < pointsToAdd; i++) {
            var interpolatedCartographic = ellipsoidLine.interpolateUsingSurfaceDistance(distanceFromStart, interpolatedCartographicScratch);
            var interpolatedBottom = getPosition(ellipsoid, interpolatedCartographic, minHeight, interpolatedBottomScratch);
            var interpolatedTop = getPosition(ellipsoid, interpolatedCartographic, maxHeight, interpolatedTopScratch);

            Cartographic.Cartesian3.pack(interpolatedNormal, normalsArray, packIndex);
            Cartographic.Cartesian3.pack(interpolatedBottom, bottomPositionsArray, packIndex);
            Cartographic.Cartesian3.pack(interpolatedTop, topPositionsArray, packIndex);
            cartographicsArray.push(interpolatedCartographic.latitude);
            cartographicsArray.push(interpolatedCartographic.longitude);

            packIndex += 3;
            distanceFromStart += interpointDistance;
        }
    }

    var heightlessCartographicScratch = new Cartographic.Cartographic();
    function getPosition(ellipsoid, cartographic, height, result) {
        Cartographic.Cartographic.clone(cartographic, heightlessCartographicScratch);
        heightlessCartographicScratch.height = height;
        return Cartographic.Cartographic.toCartesian(heightlessCartographicScratch, ellipsoid, result);
    }

    /**
     * Stores the provided instance into the provided array.
     *
     * @param {PolygonGeometry} value The value to pack.
     * @param {Number[]} array The array to pack into.
     * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
     *
     * @returns {Number[]} The array that was packed into
     */
    GroundPolylineGeometry.pack = function(value, array, startingIndex) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.object('value', value);
        Check.Check.defined('array', array);
        //>>includeEnd('debug');

        var index = when.defaultValue(startingIndex, 0);

        var positions = value._positions;
        var positionsLength = positions.length;

        array[index++] = positionsLength;

        for (var i = 0; i < positionsLength; ++i) {
            var cartesian = positions[i];
            Cartographic.Cartesian3.pack(cartesian, array, index);
            index += 3;
        }

        array[index++] = value.granularity;
        array[index++] = value.loop ? 1.0 : 0.0;
        array[index++] = value.arcType;

        Cartesian2.Ellipsoid.pack(value._ellipsoid, array, index);
        index += Cartesian2.Ellipsoid.packedLength;

        array[index++] = value._projectionIndex;
        array[index++] = value._scene3DOnly ? 1.0 : 0.0;

        return array;
    };

    /**
     * Retrieves an instance from a packed array.
     *
     * @param {Number[]} array The packed array.
     * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
     * @param {PolygonGeometry} [result] The object into which to store the result.
     */
    GroundPolylineGeometry.unpack = function(array, startingIndex, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.defined('array', array);
        //>>includeEnd('debug');

        var index = when.defaultValue(startingIndex, 0);
        var positionsLength = array[index++];
        var positions = new Array(positionsLength);

        for (var i = 0; i < positionsLength; i++) {
            positions[i] = Cartographic.Cartesian3.unpack(array, index);
            index += 3;
        }

        var granularity = array[index++];
        var loop = array[index++] === 1.0;
        var arcType = array[index++];

        var ellipsoid = Cartesian2.Ellipsoid.unpack(array, index);
        index += Cartesian2.Ellipsoid.packedLength;

        var projectionIndex = array[index++];
        var scene3DOnly = (array[index++] === 1.0);

        if (!when.defined(result)) {
            var geometry = new GroundPolylineGeometry({
                positions : positions,
                granularity : granularity,
                loop : loop,
                arcType : arcType,
                ellipsoid : ellipsoid
            });
            geometry._projectionIndex = projectionIndex;
            geometry._scene3DOnly = scene3DOnly;
            return geometry;
        }

        result._positions = positions;
        result.granularity = granularity;
        result.loop = loop;
        result.arcType = arcType;
        result._ellipsoid = ellipsoid;
        result._projectionIndex = projectionIndex;
        result._scene3DOnly = scene3DOnly;

        return result;
    };

    function direction(target, origin, result) {
        Cartographic.Cartesian3.subtract(target, origin, result);
        Cartographic.Cartesian3.normalize(result, result);
        return result;
    }

    var toPreviousScratch = new Cartographic.Cartesian3();
    var toNextScratch = new Cartographic.Cartesian3();
    var forwardScratch = new Cartographic.Cartesian3();
    var coplanarNormalScratch = new Cartographic.Cartesian3();
    var coplanarPlaneScratch = new Plane.Plane(Cartographic.Cartesian3.UNIT_X, 0.0);
    var vertexUpScratch = new Cartographic.Cartesian3();
    var cosine90 = 0.0;
    function computeVertexMiterNormal(previousBottom, vertexBottom, vertexTop, nextBottom, result) {
        var up = direction(vertexTop, vertexBottom, vertexUpScratch);
        var toPrevious = direction(previousBottom, vertexBottom, toPreviousScratch);
        var toNext = direction(nextBottom, vertexBottom, toNextScratch);

        // Check if points are coplanar in a right-side-pointing plane that contains "up."
        // This is roughly equivalent to the points being colinear in cartographic space.
        var coplanarNormal = Cartographic.Cartesian3.cross(up, toPrevious, coplanarNormalScratch);
        coplanarNormal = Cartographic.Cartesian3.normalize(coplanarNormal, coplanarNormal);
        var coplanarPlane = Plane.Plane.fromPointNormal(vertexBottom, coplanarNormal, coplanarPlaneScratch);
        var nextBottomDistance = Plane.Plane.getPointDistance(coplanarPlane, nextBottom);
        if (_Math.CesiumMath.equalsEpsilon(nextBottomDistance, 0.0, _Math.CesiumMath.EPSILON7)) {
            // If the points are coplanar, point the normal in the direction of the plane
            Cartographic.Cartesian3.clone(coplanarNormal, result);
            return result;
        }

        // Average directions to previous and to next
        result = Cartographic.Cartesian3.add(toNext, toPrevious, result);
        result = Cartographic.Cartesian3.normalize(result, result);

        // Rotate this direction to be orthogonal to up
        var forward = Cartographic.Cartesian3.cross(up, result, forwardScratch);
        Cartographic.Cartesian3.normalize(forward, forward);
        Cartographic.Cartesian3.cross(forward, up, result);
        Cartographic.Cartesian3.normalize(result, result);

        // Flip the normal if it isn't pointing roughly bound right (aka if forward is pointing more "backwards")
        if (Cartographic.Cartesian3.dot(toNext, forward) < cosine90) {
            result = Cartographic.Cartesian3.negate(result, result);
        }

        return result;
    }

    var XZ_PLANE = Plane.Plane.fromPointNormal(Cartographic.Cartesian3.ZERO, Cartographic.Cartesian3.UNIT_Y);

    var previousBottomScratch = new Cartographic.Cartesian3();
    var vertexBottomScratch = new Cartographic.Cartesian3();
    var vertexTopScratch = new Cartographic.Cartesian3();
    var nextBottomScratch = new Cartographic.Cartesian3();
    var vertexNormalScratch = new Cartographic.Cartesian3();
    var intersectionScratch = new Cartographic.Cartesian3();
    var cartographicScratch0 = new Cartographic.Cartographic();
    var cartographicScratch1 = new Cartographic.Cartographic();
    var cartographicIntersectionScratch = new Cartographic.Cartographic();
    /**
     * Computes shadow volumes for the ground polyline, consisting of its vertices, indices, and a bounding sphere.
     * Vertices are "fat," packing all the data needed in each volume to describe a line on terrain or 3D Tiles.
     * Should not be called independent of {@link GroundPolylinePrimitive}.
     *
     * @param {GroundPolylineGeometry} groundPolylineGeometry
     * @private
     */
    GroundPolylineGeometry.createGeometry = function(groundPolylineGeometry) {
        var compute2dAttributes = !groundPolylineGeometry._scene3DOnly;
        var loop = groundPolylineGeometry.loop;
        var ellipsoid = groundPolylineGeometry._ellipsoid;
        var granularity = groundPolylineGeometry.granularity;
        var arcType = groundPolylineGeometry.arcType;
        var projection = new PROJECTIONS[groundPolylineGeometry._projectionIndex](ellipsoid);

        var minHeight = WALL_INITIAL_MIN_HEIGHT;
        var maxHeight = WALL_INITIAL_MAX_HEIGHT;

        var index;
        var i;

        var positions = groundPolylineGeometry._positions;
        var positionsLength = positions.length;

        if (positionsLength === 2) {
            loop = false;
        }

        // Split positions across the IDL and the Prime Meridian as well.
        // Split across prime meridian because very large geometries crossing the Prime Meridian but not the IDL
        // may get split by the plane of IDL + Prime Meridian.
        var p0;
        var p1;
        var c0;
        var c1;
        var rhumbLine = new EllipsoidRhumbLine.EllipsoidRhumbLine(undefined, undefined, ellipsoid);
        var intersection;
        var intersectionCartographic;
        var intersectionLongitude;
        var splitPositions = [positions[0]];
        for (i = 0; i < positionsLength - 1; i++) {
            p0 = positions[i];
            p1 = positions[i + 1];
            intersection = IntersectionTests.IntersectionTests.lineSegmentPlane(p0, p1, XZ_PLANE, intersectionScratch);
            if (when.defined(intersection) &&
                !Cartographic.Cartesian3.equalsEpsilon(intersection, p0, _Math.CesiumMath.EPSILON7) &&
                !Cartographic.Cartesian3.equalsEpsilon(intersection, p1, _Math.CesiumMath.EPSILON7)) {
                if (groundPolylineGeometry.arcType === ArcType.ArcType.GEODESIC) {
                    splitPositions.push(Cartographic.Cartesian3.clone(intersection));
                } else if (groundPolylineGeometry.arcType === ArcType.ArcType.RHUMB) {
                    intersectionLongitude = ellipsoid.cartesianToCartographic(intersection, cartographicScratch0).longitude;
                    c0 = ellipsoid.cartesianToCartographic(p0, cartographicScratch0);
                    c1 = ellipsoid.cartesianToCartographic(p1, cartographicScratch1);
                    rhumbLine.setEndPoints(c0, c1);
                    intersectionCartographic = rhumbLine.findIntersectionWithLongitude(intersectionLongitude, cartographicIntersectionScratch);
                    intersection = ellipsoid.cartographicToCartesian(intersectionCartographic, intersectionScratch);
                    if (when.defined(intersection) &&
                        !Cartographic.Cartesian3.equalsEpsilon(intersection, p0, _Math.CesiumMath.EPSILON7) &&
                        !Cartographic.Cartesian3.equalsEpsilon(intersection, p1, _Math.CesiumMath.EPSILON7)) {
                        splitPositions.push(Cartographic.Cartesian3.clone(intersection));
                    }
                }
            }
            splitPositions.push(p1);
        }

        if (loop) {
            p0 = positions[positionsLength - 1];
            p1 = positions[0];
            intersection = IntersectionTests.IntersectionTests.lineSegmentPlane(p0, p1, XZ_PLANE, intersectionScratch);
            if (when.defined(intersection) &&
                !Cartographic.Cartesian3.equalsEpsilon(intersection, p0, _Math.CesiumMath.EPSILON7) &&
                !Cartographic.Cartesian3.equalsEpsilon(intersection, p1, _Math.CesiumMath.EPSILON7)) {
                if (groundPolylineGeometry.arcType === ArcType.ArcType.GEODESIC) {
                    splitPositions.push(Cartographic.Cartesian3.clone(intersection));
                } else if (groundPolylineGeometry.arcType === ArcType.ArcType.RHUMB) {
                    intersectionLongitude = ellipsoid.cartesianToCartographic(intersection, cartographicScratch0).longitude;
                    c0 = ellipsoid.cartesianToCartographic(p0, cartographicScratch0);
                    c1 = ellipsoid.cartesianToCartographic(p1, cartographicScratch1);
                    rhumbLine.setEndPoints(c0, c1);
                    intersectionCartographic = rhumbLine.findIntersectionWithLongitude(intersectionLongitude, cartographicIntersectionScratch);
                    intersection = ellipsoid.cartographicToCartesian(intersectionCartographic, intersectionScratch);
                    if (when.defined(intersection) &&
                        !Cartographic.Cartesian3.equalsEpsilon(intersection, p0, _Math.CesiumMath.EPSILON7) &&
                        !Cartographic.Cartesian3.equalsEpsilon(intersection, p1, _Math.CesiumMath.EPSILON7)) {
                        splitPositions.push(Cartographic.Cartesian3.clone(intersection));
                    }
                }
            }
        }
        var cartographicsLength = splitPositions.length;

        var cartographics = new Array(cartographicsLength);
        for (i = 0; i < cartographicsLength; i++) {
            var cartographic = Cartographic.Cartographic.fromCartesian(splitPositions[i], ellipsoid);
            cartographic.height = 0.0;
            cartographics[i] = cartographic;
        }

        cartographics = arrayRemoveDuplicates.arrayRemoveDuplicates(cartographics, Cartographic.Cartographic.equalsEpsilon);
        cartographicsLength = cartographics.length;

        if (cartographicsLength < 2) {
            return undefined;
        }

        /**** Build heap-side arrays for positions, interpolated cartographics, and normals from which to compute vertices ****/
        // We build a "wall" and then decompose it into separately connected component "volumes" because we need a lot
        // of information about the wall. Also, this simplifies interpolation.
        // Convention: "next" and "end" are locally forward to each segment of the wall,
        // and we are computing normals pointing towards the local right side of the vertices in each segment.
        var cartographicsArray = [];
        var normalsArray = [];
        var bottomPositionsArray = [];
        var topPositionsArray = [];

        var previousBottom = previousBottomScratch;
        var vertexBottom = vertexBottomScratch;
        var vertexTop = vertexTopScratch;
        var nextBottom = nextBottomScratch;
        var vertexNormal = vertexNormalScratch;

        // First point - either loop or attach a "perpendicular" normal
        var startCartographic = cartographics[0];
        var nextCartographic = cartographics[1];

        var prestartCartographic = cartographics[cartographicsLength - 1];
        previousBottom = getPosition(ellipsoid, prestartCartographic, minHeight, previousBottom);
        nextBottom = getPosition(ellipsoid, nextCartographic, minHeight, nextBottom);
        vertexBottom = getPosition(ellipsoid, startCartographic, minHeight, vertexBottom);
        vertexTop = getPosition(ellipsoid, startCartographic, maxHeight, vertexTop);

        if (loop) {
            vertexNormal = computeVertexMiterNormal(previousBottom, vertexBottom, vertexTop, nextBottom, vertexNormal);
        } else {
            vertexNormal = computeRightNormal(startCartographic, nextCartographic, maxHeight, ellipsoid, vertexNormal);
        }

        Cartographic.Cartesian3.pack(vertexNormal, normalsArray, 0);
        Cartographic.Cartesian3.pack(vertexBottom, bottomPositionsArray, 0);
        Cartographic.Cartesian3.pack(vertexTop, topPositionsArray, 0);
        cartographicsArray.push(startCartographic.latitude);
        cartographicsArray.push(startCartographic.longitude);

        interpolateSegment(startCartographic, nextCartographic, minHeight, maxHeight, granularity, arcType, ellipsoid, normalsArray, bottomPositionsArray, topPositionsArray, cartographicsArray);

        // All inbetween points
        for (i = 1; i < cartographicsLength - 1; ++i) {
            previousBottom = Cartographic.Cartesian3.clone(vertexBottom, previousBottom);
            vertexBottom = Cartographic.Cartesian3.clone(nextBottom, vertexBottom);
            var vertexCartographic = cartographics[i];
            getPosition(ellipsoid, vertexCartographic, maxHeight, vertexTop);
            getPosition(ellipsoid, cartographics[i + 1], minHeight, nextBottom);

            computeVertexMiterNormal(previousBottom, vertexBottom, vertexTop, nextBottom, vertexNormal);

            index = normalsArray.length;
            Cartographic.Cartesian3.pack(vertexNormal, normalsArray, index);
            Cartographic.Cartesian3.pack(vertexBottom, bottomPositionsArray, index);
            Cartographic.Cartesian3.pack(vertexTop, topPositionsArray, index);
            cartographicsArray.push(vertexCartographic.latitude);
            cartographicsArray.push(vertexCartographic.longitude);

            interpolateSegment(cartographics[i], cartographics[i + 1], minHeight, maxHeight, granularity, arcType, ellipsoid, normalsArray, bottomPositionsArray, topPositionsArray, cartographicsArray);
        }

        // Last point - either loop or attach a normal "perpendicular" to the wall.
        var endCartographic = cartographics[cartographicsLength - 1];
        var preEndCartographic = cartographics[cartographicsLength - 2];

        vertexBottom = getPosition(ellipsoid, endCartographic, minHeight, vertexBottom);
        vertexTop = getPosition(ellipsoid, endCartographic, maxHeight, vertexTop);

        if (loop) {
            var postEndCartographic = cartographics[0];
            previousBottom = getPosition(ellipsoid, preEndCartographic, minHeight, previousBottom);
            nextBottom = getPosition(ellipsoid, postEndCartographic, minHeight, nextBottom);

            vertexNormal = computeVertexMiterNormal(previousBottom, vertexBottom, vertexTop, nextBottom, vertexNormal);
        } else {
            vertexNormal = computeRightNormal(preEndCartographic, endCartographic, maxHeight, ellipsoid, vertexNormal);
        }

        index = normalsArray.length;
        Cartographic.Cartesian3.pack(vertexNormal, normalsArray, index);
        Cartographic.Cartesian3.pack(vertexBottom, bottomPositionsArray, index);
        Cartographic.Cartesian3.pack(vertexTop, topPositionsArray, index);
        cartographicsArray.push(endCartographic.latitude);
        cartographicsArray.push(endCartographic.longitude);

        if (loop) {
            interpolateSegment(endCartographic, startCartographic, minHeight, maxHeight, granularity, arcType, ellipsoid, normalsArray, bottomPositionsArray, topPositionsArray, cartographicsArray);
            index = normalsArray.length;
            for (i = 0; i < 3; ++i) {
                normalsArray[index + i] = normalsArray[i];
                bottomPositionsArray[index + i] = bottomPositionsArray[i];
                topPositionsArray[index + i] = topPositionsArray[i];
            }
            cartographicsArray.push(startCartographic.latitude);
            cartographicsArray.push(startCartographic.longitude);
        }

        return generateGeometryAttributes(loop, projection, bottomPositionsArray, topPositionsArray, normalsArray, cartographicsArray, compute2dAttributes);
    };

    // If the end normal angle is too steep compared to the direction of the line segment,
    // "break" the miter by rotating the normal 90 degrees around the "up" direction at the point
    // For ultra precision we would want to project into a plane, but in practice this is sufficient.
    var lineDirectionScratch = new Cartographic.Cartesian3();
    var matrix3Scratch = new BoundingSphere.Matrix3();
    var quaternionScratch = new Transforms.Quaternion();
    function breakMiter(endGeometryNormal, startBottom, endBottom, endTop) {
        var lineDirection = direction(endBottom, startBottom, lineDirectionScratch);

        var dot = Cartographic.Cartesian3.dot(lineDirection, endGeometryNormal);
        if (dot > MITER_BREAK_SMALL || dot < MITER_BREAK_LARGE) {
            var vertexUp = direction(endTop, endBottom, vertexUpScratch);
            var angle = dot < MITER_BREAK_LARGE ? _Math.CesiumMath.PI_OVER_TWO : -_Math.CesiumMath.PI_OVER_TWO;
            var quaternion = Transforms.Quaternion.fromAxisAngle(vertexUp, angle, quaternionScratch);
            var rotationMatrix = BoundingSphere.Matrix3.fromQuaternion(quaternion, matrix3Scratch);
            BoundingSphere.Matrix3.multiplyByVector(rotationMatrix, endGeometryNormal, endGeometryNormal);
            return true;
        }
        return false;
    }

    var endPosCartographicScratch = new Cartographic.Cartographic();
    var normalStartpointScratch = new Cartographic.Cartesian3();
    var normalEndpointScratch = new Cartographic.Cartesian3();
    function projectNormal(projection, cartographic, normal, projectedPosition, result) {
        var position = Cartographic.Cartographic.toCartesian(cartographic, projection._ellipsoid, normalStartpointScratch);
        var normalEndpoint = Cartographic.Cartesian3.add(position, normal, normalEndpointScratch);
        var flipNormal = false;

        var ellipsoid = projection._ellipsoid;
        var normalEndpointCartographic = ellipsoid.cartesianToCartographic(normalEndpoint, endPosCartographicScratch);
        // If normal crosses the IDL, go the other way and flip the result.
        // In practice this almost never happens because the cartographic start
        // and end points of each segment are "nudged" to be on the same side
        // of the IDL and slightly away from the IDL.
        if (Math.abs(cartographic.longitude - normalEndpointCartographic.longitude) > _Math.CesiumMath.PI_OVER_TWO) {
            flipNormal = true;
            normalEndpoint = Cartographic.Cartesian3.subtract(position, normal, normalEndpointScratch);
            normalEndpointCartographic = ellipsoid.cartesianToCartographic(normalEndpoint, endPosCartographicScratch);
        }

        normalEndpointCartographic.height = 0.0;
        var normalEndpointProjected = projection.project(normalEndpointCartographic, result);
        result = Cartographic.Cartesian3.subtract(normalEndpointProjected, projectedPosition, result);
        result.z = 0.0;
        result = Cartographic.Cartesian3.normalize(result, result);
        if (flipNormal) {
            Cartographic.Cartesian3.negate(result, result);
        }
        return result;
    }

    var adjustHeightNormalScratch = new Cartographic.Cartesian3();
    var adjustHeightOffsetScratch = new Cartographic.Cartesian3();
    function adjustHeights(bottom, top, minHeight, maxHeight, adjustHeightBottom, adjustHeightTop) {
        // bottom and top should be at WALL_INITIAL_MIN_HEIGHT and WALL_INITIAL_MAX_HEIGHT, respectively
        var adjustHeightNormal = Cartographic.Cartesian3.subtract(top, bottom, adjustHeightNormalScratch);
        Cartographic.Cartesian3.normalize(adjustHeightNormal, adjustHeightNormal);

        var distanceForBottom = minHeight - WALL_INITIAL_MIN_HEIGHT;
        var adjustHeightOffset = Cartographic.Cartesian3.multiplyByScalar(adjustHeightNormal, distanceForBottom, adjustHeightOffsetScratch);
        Cartographic.Cartesian3.add(bottom, adjustHeightOffset, adjustHeightBottom);

        var distanceForTop = maxHeight - WALL_INITIAL_MAX_HEIGHT;
        adjustHeightOffset = Cartographic.Cartesian3.multiplyByScalar(adjustHeightNormal, distanceForTop, adjustHeightOffsetScratch);
        Cartographic.Cartesian3.add(top, adjustHeightOffset, adjustHeightTop);
    }

    var nudgeDirectionScratch = new Cartographic.Cartesian3();
    function nudgeXZ(start, end) {
        var startToXZdistance = Plane.Plane.getPointDistance(XZ_PLANE, start);
        var endToXZdistance = Plane.Plane.getPointDistance(XZ_PLANE, end);
        var offset = nudgeDirectionScratch;
        // Larger epsilon than what's used in GeometryPipeline, a centimeter in world space
        if (_Math.CesiumMath.equalsEpsilon(startToXZdistance, 0.0, _Math.CesiumMath.EPSILON2)) {
            offset = direction(end, start, offset);
            Cartographic.Cartesian3.multiplyByScalar(offset, _Math.CesiumMath.EPSILON2, offset);
            Cartographic.Cartesian3.add(start, offset, start);
        } else if (_Math.CesiumMath.equalsEpsilon(endToXZdistance, 0.0, _Math.CesiumMath.EPSILON2)) {
            offset = direction(start, end, offset);
            Cartographic.Cartesian3.multiplyByScalar(offset, _Math.CesiumMath.EPSILON2, offset);
            Cartographic.Cartesian3.add(end, offset, end);
        }
    }

    // "Nudge" cartographic coordinates so start and end are on the same side of the IDL.
    // Nudge amounts are tiny, basically just an IDL flip.
    // Only used for 2D/CV.
    function nudgeCartographic(start, end) {
        var absStartLon = Math.abs(start.longitude);
        var absEndLon = Math.abs(end.longitude);
        if (_Math.CesiumMath.equalsEpsilon(absStartLon, _Math.CesiumMath.PI, _Math.CesiumMath.EPSILON11)) {
            var endSign = _Math.CesiumMath.sign(end.longitude);
            start.longitude = endSign * (absStartLon - _Math.CesiumMath.EPSILON11);
            return 1;
        } else if (_Math.CesiumMath.equalsEpsilon(absEndLon, _Math.CesiumMath.PI, _Math.CesiumMath.EPSILON11)) {
            var startSign = _Math.CesiumMath.sign(start.longitude);
            end.longitude = startSign * (absEndLon - _Math.CesiumMath.EPSILON11);
            return 2;
        }
        return 0;
    }

    var startCartographicScratch = new Cartographic.Cartographic();
    var endCartographicScratch = new Cartographic.Cartographic();

    var segmentStartTopScratch = new Cartographic.Cartesian3();
    var segmentEndTopScratch = new Cartographic.Cartesian3();
    var segmentStartBottomScratch = new Cartographic.Cartesian3();
    var segmentEndBottomScratch = new Cartographic.Cartesian3();
    var segmentStartNormalScratch = new Cartographic.Cartesian3();
    var segmentEndNormalScratch = new Cartographic.Cartesian3();

    var getHeightCartographics = [startCartographicScratch, endCartographicScratch];
    var getHeightRectangleScratch = new Cartesian2.Rectangle();

    var adjustHeightStartTopScratch = new Cartographic.Cartesian3();
    var adjustHeightEndTopScratch = new Cartographic.Cartesian3();
    var adjustHeightStartBottomScratch = new Cartographic.Cartesian3();
    var adjustHeightEndBottomScratch = new Cartographic.Cartesian3();

    var segmentStart2DScratch = new Cartographic.Cartesian3();
    var segmentEnd2DScratch = new Cartographic.Cartesian3();
    var segmentStartNormal2DScratch = new Cartographic.Cartesian3();
    var segmentEndNormal2DScratch = new Cartographic.Cartesian3();

    var offsetScratch = new Cartographic.Cartesian3();
    var startUpScratch = new Cartographic.Cartesian3();
    var endUpScratch = new Cartographic.Cartesian3();
    var rightScratch = new Cartographic.Cartesian3();
    var startPlaneNormalScratch = new Cartographic.Cartesian3();
    var endPlaneNormalScratch = new Cartographic.Cartesian3();
    var encodeScratch = new EncodedCartesian3.EncodedCartesian3();

    var encodeScratch2D = new EncodedCartesian3.EncodedCartesian3();
    var forwardOffset2DScratch = new Cartographic.Cartesian3();
    var right2DScratch = new Cartographic.Cartesian3();

    var normalNudgeScratch = new Cartographic.Cartesian3();

    var scratchBoundingSpheres = [new BoundingSphere.BoundingSphere(), new BoundingSphere.BoundingSphere()];

    // Winding order is reversed so each segment's volume is inside-out
    var REFERENCE_INDICES = [
        0, 2, 1, 0, 3, 2, // right
        0, 7, 3, 0, 4, 7, // start
        0, 5, 4, 0, 1, 5, // bottom
        5, 7, 4, 5, 6, 7, // left
        5, 2, 6, 5, 1, 2, // end
        3, 6, 2, 3, 7, 6 // top
    ];
    var REFERENCE_INDICES_LENGTH = REFERENCE_INDICES.length;

    // Decompose the "wall" into a series of shadow volumes.
    // Each shadow volume's vertices encode a description of the line it contains,
    // including mitering planes at the end points, a plane along the line itself,
    // and attributes for computing length-wise texture coordinates.
    function generateGeometryAttributes(loop, projection, bottomPositionsArray, topPositionsArray, normalsArray, cartographicsArray, compute2dAttributes) {
        var i;
        var index;
        var ellipsoid = projection._ellipsoid;

        // Each segment will have 8 vertices
        var segmentCount = (bottomPositionsArray.length / 3) - 1;
        var vertexCount = segmentCount * 8;
        var arraySizeVec4 = vertexCount * 4;
        var indexCount = segmentCount * 36;

        var indices = vertexCount > 65535 ? new Uint32Array(indexCount) : new Uint16Array(indexCount);
        var positionsArray = new Float64Array(vertexCount * 3);

        var startHiAndForwardOffsetX = new Float32Array(arraySizeVec4);
        var startLoAndForwardOffsetY = new Float32Array(arraySizeVec4);
        var startNormalAndForwardOffsetZ = new Float32Array(arraySizeVec4);
        var endNormalAndTextureCoordinateNormalizationX = new Float32Array(arraySizeVec4);
        var rightNormalAndTextureCoordinateNormalizationY = new Float32Array(arraySizeVec4);

        var startHiLo2D;
        var offsetAndRight2D;
        var startEndNormals2D;
        var texcoordNormalization2D;

        if (compute2dAttributes) {
            startHiLo2D = new Float32Array(arraySizeVec4);
            offsetAndRight2D = new Float32Array(arraySizeVec4);
            startEndNormals2D = new Float32Array(arraySizeVec4);
            texcoordNormalization2D = new Float32Array(vertexCount * 2);
        }

        /*** Compute total lengths for texture coordinate normalization ***/
        // 2D
        var cartographicsLength = cartographicsArray.length / 2;
        var length2D = 0.0;

        var startCartographic = startCartographicScratch;
        startCartographic.height = 0.0;
        var endCartographic = endCartographicScratch;
        endCartographic.height = 0.0;

        var segmentStartCartesian = segmentStartTopScratch;
        var segmentEndCartesian = segmentEndTopScratch;

        if (compute2dAttributes) {
            index = 0;
            for (i = 1; i < cartographicsLength; i++) {
                // Don't clone anything from previous segment b/c possible IDL touch
                startCartographic.latitude = cartographicsArray[index];
                startCartographic.longitude = cartographicsArray[index + 1];
                endCartographic.latitude = cartographicsArray[index + 2];
                endCartographic.longitude = cartographicsArray[index + 3];

                segmentStartCartesian = projection.project(startCartographic, segmentStartCartesian);
                segmentEndCartesian = projection.project(endCartographic, segmentEndCartesian);
                length2D += Cartographic.Cartesian3.distance(segmentStartCartesian, segmentEndCartesian);
                index += 2;
            }
        }

        // 3D
        var positionsLength = topPositionsArray.length / 3;
        segmentEndCartesian = Cartographic.Cartesian3.unpack(topPositionsArray, 0, segmentEndCartesian);
        var length3D = 0.0;

        index = 3;
        for (i = 1; i < positionsLength; i++) {
            segmentStartCartesian = Cartographic.Cartesian3.clone(segmentEndCartesian, segmentStartCartesian);
            segmentEndCartesian = Cartographic.Cartesian3.unpack(topPositionsArray, index, segmentEndCartesian);
            length3D += Cartographic.Cartesian3.distance(segmentStartCartesian, segmentEndCartesian);
            index += 3;
        }

        /*** Generate segments ***/
        var j;
        index = 3;
        var cartographicsIndex = 0;
        var vec2sWriteIndex = 0;
        var vec3sWriteIndex = 0;
        var vec4sWriteIndex = 0;
        var miterBroken = false;

        var endBottom = Cartographic.Cartesian3.unpack(bottomPositionsArray, 0, segmentEndBottomScratch);
        var endTop = Cartographic.Cartesian3.unpack(topPositionsArray, 0, segmentEndTopScratch);
        var endGeometryNormal = Cartographic.Cartesian3.unpack(normalsArray, 0, segmentEndNormalScratch);

        if (loop) {
            var preEndBottom = Cartographic.Cartesian3.unpack(bottomPositionsArray, bottomPositionsArray.length - 6, segmentStartBottomScratch);
            if (breakMiter(endGeometryNormal, preEndBottom, endBottom, endTop)) {
                // Miter broken as if for the last point in the loop, needs to be inverted for first point (clone of endBottom)
                endGeometryNormal = Cartographic.Cartesian3.negate(endGeometryNormal, endGeometryNormal);
            }
        }

        var lengthSoFar3D = 0.0;
        var lengthSoFar2D = 0.0;

        // For translating bounding volume
        var sumHeights = 0.0;

        for (i = 0; i < segmentCount; i++) {
            var startBottom = Cartographic.Cartesian3.clone(endBottom, segmentStartBottomScratch);
            var startTop = Cartographic.Cartesian3.clone(endTop, segmentStartTopScratch);
            var startGeometryNormal = Cartographic.Cartesian3.clone(endGeometryNormal, segmentStartNormalScratch);

            if (miterBroken) {
                startGeometryNormal = Cartographic.Cartesian3.negate(startGeometryNormal, startGeometryNormal);
            }

            endBottom = Cartographic.Cartesian3.unpack(bottomPositionsArray, index, segmentEndBottomScratch);
            endTop = Cartographic.Cartesian3.unpack(topPositionsArray, index, segmentEndTopScratch);
            endGeometryNormal = Cartographic.Cartesian3.unpack(normalsArray, index, segmentEndNormalScratch);

            miterBroken = breakMiter(endGeometryNormal, startBottom, endBottom, endTop);

            // 2D - don't clone anything from previous segment b/c possible IDL touch
            startCartographic.latitude = cartographicsArray[cartographicsIndex];
            startCartographic.longitude = cartographicsArray[cartographicsIndex + 1];
            endCartographic.latitude = cartographicsArray[cartographicsIndex + 2];
            endCartographic.longitude = cartographicsArray[cartographicsIndex + 3];
            var start2D;
            var end2D;
            var startGeometryNormal2D;
            var endGeometryNormal2D;

            if (compute2dAttributes) {
                var nudgeResult = nudgeCartographic(startCartographic, endCartographic);
                start2D = projection.project(startCartographic, segmentStart2DScratch);
                end2D = projection.project(endCartographic, segmentEnd2DScratch);
                var direction2D = direction(end2D, start2D, forwardOffset2DScratch);
                direction2D.y = Math.abs(direction2D.y);

                startGeometryNormal2D = segmentStartNormal2DScratch;
                endGeometryNormal2D = segmentEndNormal2DScratch;
                if (nudgeResult === 0 || Cartographic.Cartesian3.dot(direction2D, Cartographic.Cartesian3.UNIT_Y) > MITER_BREAK_SMALL) {
                    // No nudge - project the original normal
                    // Or, if the line's angle relative to the IDL is very acute,
                    // in which case snapping will produce oddly shaped volumes.
                    startGeometryNormal2D = projectNormal(projection, startCartographic, startGeometryNormal, start2D, segmentStartNormal2DScratch);
                    endGeometryNormal2D = projectNormal(projection, endCartographic, endGeometryNormal, end2D, segmentEndNormal2DScratch);
                } else if (nudgeResult === 1) {
                    // Start is close to IDL - snap start normal to align with IDL
                    endGeometryNormal2D = projectNormal(projection, endCartographic, endGeometryNormal, end2D, segmentEndNormal2DScratch);
                    startGeometryNormal2D.x = 0.0;
                    // If start longitude is negative and end longitude is less negative, relative right is unit -Y
                    // If start longitude is positive and end longitude is less positive, relative right is unit +Y
                    startGeometryNormal2D.y = _Math.CesiumMath.sign(startCartographic.longitude - Math.abs(endCartographic.longitude));
                    startGeometryNormal2D.z = 0.0;
                } else {
                    // End is close to IDL - snap end normal to align with IDL
                    startGeometryNormal2D = projectNormal(projection, startCartographic, startGeometryNormal, start2D, segmentStartNormal2DScratch);
                    endGeometryNormal2D.x = 0.0;
                    // If end longitude is negative and start longitude is less negative, relative right is unit Y
                    // If end longitude is positive and start longitude is less positive, relative right is unit -Y
                    endGeometryNormal2D.y = _Math.CesiumMath.sign(startCartographic.longitude - endCartographic.longitude);
                    endGeometryNormal2D.z = 0.0;
                }
            }

            /****************************************
             * Geometry descriptors of a "line on terrain,"
             * as opposed to the "shadow volume used to draw
             * the line on terrain":
             * - position of start + offset to end
             * - start, end, and right-facing planes
             * - encoded texture coordinate offsets
             ****************************************/

             /** 3D **/
            var segmentLength3D = Cartographic.Cartesian3.distance(startTop, endTop);

            var encodedStart = EncodedCartesian3.EncodedCartesian3.fromCartesian(startBottom, encodeScratch);
            var forwardOffset = Cartographic.Cartesian3.subtract(endBottom, startBottom, offsetScratch);
            var forward = Cartographic.Cartesian3.normalize(forwardOffset, rightScratch);

            var startUp = Cartographic.Cartesian3.subtract(startTop, startBottom, startUpScratch);
            startUp = Cartographic.Cartesian3.normalize(startUp, startUp);
            var rightNormal = Cartographic.Cartesian3.cross(forward, startUp, rightScratch);
            rightNormal = Cartographic.Cartesian3.normalize(rightNormal, rightNormal);

            var startPlaneNormal = Cartographic.Cartesian3.cross(startUp, startGeometryNormal, startPlaneNormalScratch);
            startPlaneNormal = Cartographic.Cartesian3.normalize(startPlaneNormal, startPlaneNormal);

            var endUp = Cartographic.Cartesian3.subtract(endTop, endBottom, endUpScratch);
            endUp = Cartographic.Cartesian3.normalize(endUp, endUp);
            var endPlaneNormal = Cartographic.Cartesian3.cross(endGeometryNormal, endUp, endPlaneNormalScratch);
            endPlaneNormal = Cartographic.Cartesian3.normalize(endPlaneNormal, endPlaneNormal);

            var texcoordNormalization3DX = segmentLength3D / length3D;
            var texcoordNormalization3DY = lengthSoFar3D / length3D;

            /** 2D **/
            var segmentLength2D = 0.0;
            var encodedStart2D;
            var forwardOffset2D;
            var right2D;
            var texcoordNormalization2DX = 0.0;
            var texcoordNormalization2DY = 0.0;
            if (compute2dAttributes) {
                segmentLength2D = Cartographic.Cartesian3.distance(start2D, end2D);

                encodedStart2D = EncodedCartesian3.EncodedCartesian3.fromCartesian(start2D, encodeScratch2D);
                forwardOffset2D = Cartographic.Cartesian3.subtract(end2D, start2D, forwardOffset2DScratch);

                // Right direction is just forward direction rotated by -90 degrees around Z
                // Similarly with plane normals
                right2D = Cartographic.Cartesian3.normalize(forwardOffset2D, right2DScratch);
                var swap = right2D.x;
                right2D.x = right2D.y;
                right2D.y = -swap;

                texcoordNormalization2DX = segmentLength2D / length2D;
                texcoordNormalization2DY = lengthSoFar2D / length2D;
            }
            /** Pack **/
            for (j = 0; j < 8; j++) {
                var vec4Index = vec4sWriteIndex + j * 4;
                var vec2Index = vec2sWriteIndex + j * 2;
                var wIndex = vec4Index + 3;

                // Encode sidedness of vertex relative to right plane in texture coordinate normalization X,
                // whether vertex is top or bottom of volume in sign/magnitude of normalization Y.
                var rightPlaneSide = j < 4 ? 1.0 : -1.0;
                var topBottomSide = (j === 2 || j === 3 || j === 6 || j === 7) ? 1.0 : -1.0;

                // 3D
                Cartographic.Cartesian3.pack(encodedStart.high, startHiAndForwardOffsetX, vec4Index);
                startHiAndForwardOffsetX[wIndex] = forwardOffset.x;

                Cartographic.Cartesian3.pack(encodedStart.low, startLoAndForwardOffsetY, vec4Index);
                startLoAndForwardOffsetY[wIndex] = forwardOffset.y;

                Cartographic.Cartesian3.pack(startPlaneNormal, startNormalAndForwardOffsetZ, vec4Index);
                startNormalAndForwardOffsetZ[wIndex] = forwardOffset.z;

                Cartographic.Cartesian3.pack(endPlaneNormal, endNormalAndTextureCoordinateNormalizationX, vec4Index);
                endNormalAndTextureCoordinateNormalizationX[wIndex] = texcoordNormalization3DX * rightPlaneSide;

                Cartographic.Cartesian3.pack(rightNormal, rightNormalAndTextureCoordinateNormalizationY, vec4Index);

                var texcoordNormalization = texcoordNormalization3DY * topBottomSide;
                if (texcoordNormalization === 0.0 && topBottomSide < 0.0) {
                    texcoordNormalization = Number.POSITIVE_INFINITY;
                }
                rightNormalAndTextureCoordinateNormalizationY[wIndex] = texcoordNormalization;

                // 2D
                if (compute2dAttributes) {
                    startHiLo2D[vec4Index] = encodedStart2D.high.x;
                    startHiLo2D[vec4Index + 1] = encodedStart2D.high.y;
                    startHiLo2D[vec4Index + 2] = encodedStart2D.low.x;
                    startHiLo2D[vec4Index + 3] = encodedStart2D.low.y;

                    startEndNormals2D[vec4Index] = -startGeometryNormal2D.y;
                    startEndNormals2D[vec4Index + 1] = startGeometryNormal2D.x;
                    startEndNormals2D[vec4Index + 2] = endGeometryNormal2D.y;
                    startEndNormals2D[vec4Index + 3] = -endGeometryNormal2D.x;

                    offsetAndRight2D[vec4Index] = forwardOffset2D.x;
                    offsetAndRight2D[vec4Index + 1] = forwardOffset2D.y;
                    offsetAndRight2D[vec4Index + 2] = right2D.x;
                    offsetAndRight2D[vec4Index + 3] = right2D.y;

                    texcoordNormalization2D[vec2Index] = texcoordNormalization2DX * rightPlaneSide;

                    texcoordNormalization = texcoordNormalization2DY * topBottomSide;
                    if (texcoordNormalization === 0.0 && topBottomSide < 0.0) {
                        texcoordNormalization = Number.POSITIVE_INFINITY;
                    }
                    texcoordNormalization2D[vec2Index + 1] = texcoordNormalization;
                }
            }

            // Adjust height of volume in 3D
            var adjustHeightStartBottom = adjustHeightStartBottomScratch;
            var adjustHeightEndBottom = adjustHeightEndBottomScratch;
            var adjustHeightStartTop = adjustHeightStartTopScratch;
            var adjustHeightEndTop = adjustHeightEndTopScratch;

            var getHeightsRectangle = Cartesian2.Rectangle.fromCartographicArray(getHeightCartographics, getHeightRectangleScratch);
            var minMaxHeights = ApproximateTerrainHeights.getMinimumMaximumHeights(getHeightsRectangle, ellipsoid);
            var minHeight = minMaxHeights.minimumTerrainHeight;
            var maxHeight = minMaxHeights.maximumTerrainHeight;

            sumHeights += minHeight;
            sumHeights += maxHeight;

            adjustHeights(startBottom, startTop, minHeight, maxHeight, adjustHeightStartBottom, adjustHeightStartTop);
            adjustHeights(endBottom, endTop, minHeight, maxHeight, adjustHeightEndBottom, adjustHeightEndTop);

            // Nudge the positions away from the "polyline" a little bit to prevent errors in GeometryPipeline
            var normalNudge = Cartographic.Cartesian3.multiplyByScalar(rightNormal, _Math.CesiumMath.EPSILON5, normalNudgeScratch);
            Cartographic.Cartesian3.add(adjustHeightStartBottom, normalNudge, adjustHeightStartBottom);
            Cartographic.Cartesian3.add(adjustHeightEndBottom, normalNudge, adjustHeightEndBottom);
            Cartographic.Cartesian3.add(adjustHeightStartTop, normalNudge, adjustHeightStartTop);
            Cartographic.Cartesian3.add(adjustHeightEndTop, normalNudge, adjustHeightEndTop);

            // If the segment is very close to the XZ plane, nudge the vertices slightly to avoid touching it.
            nudgeXZ(adjustHeightStartBottom, adjustHeightEndBottom);
            nudgeXZ(adjustHeightStartTop, adjustHeightEndTop);

            Cartographic.Cartesian3.pack(adjustHeightStartBottom, positionsArray, vec3sWriteIndex);
            Cartographic.Cartesian3.pack(adjustHeightEndBottom, positionsArray, vec3sWriteIndex + 3);
            Cartographic.Cartesian3.pack(adjustHeightEndTop, positionsArray, vec3sWriteIndex + 6);
            Cartographic.Cartesian3.pack(adjustHeightStartTop, positionsArray, vec3sWriteIndex + 9);

            normalNudge = Cartographic.Cartesian3.multiplyByScalar(rightNormal, -2.0 * _Math.CesiumMath.EPSILON5, normalNudgeScratch);
            Cartographic.Cartesian3.add(adjustHeightStartBottom, normalNudge, adjustHeightStartBottom);
            Cartographic.Cartesian3.add(adjustHeightEndBottom, normalNudge, adjustHeightEndBottom);
            Cartographic.Cartesian3.add(adjustHeightStartTop, normalNudge, adjustHeightStartTop);
            Cartographic.Cartesian3.add(adjustHeightEndTop, normalNudge, adjustHeightEndTop);

            nudgeXZ(adjustHeightStartBottom, adjustHeightEndBottom);
            nudgeXZ(adjustHeightStartTop, adjustHeightEndTop);

            Cartographic.Cartesian3.pack(adjustHeightStartBottom, positionsArray, vec3sWriteIndex + 12);
            Cartographic.Cartesian3.pack(adjustHeightEndBottom, positionsArray, vec3sWriteIndex + 15);
            Cartographic.Cartesian3.pack(adjustHeightEndTop, positionsArray, vec3sWriteIndex + 18);
            Cartographic.Cartesian3.pack(adjustHeightStartTop, positionsArray, vec3sWriteIndex + 21);

            cartographicsIndex += 2;
            index += 3;

            vec2sWriteIndex += 16;
            vec3sWriteIndex += 24;
            vec4sWriteIndex += 32;

            lengthSoFar3D += segmentLength3D;
            lengthSoFar2D += segmentLength2D;
        }

        index = 0;
        var indexOffset = 0;
        for (i = 0; i < segmentCount; i++) {
            for (j = 0; j < REFERENCE_INDICES_LENGTH; j++) {
                indices[index + j] = REFERENCE_INDICES[j] + indexOffset;
            }
            indexOffset += 8;
            index += REFERENCE_INDICES_LENGTH;
        }

        var boundingSpheres = scratchBoundingSpheres;
        BoundingSphere.BoundingSphere.fromVertices(bottomPositionsArray, Cartographic.Cartesian3.ZERO, 3, boundingSpheres[0]);
        BoundingSphere.BoundingSphere.fromVertices(topPositionsArray, Cartographic.Cartesian3.ZERO, 3, boundingSpheres[1]);
        var boundingSphere = BoundingSphere.BoundingSphere.fromBoundingSpheres(boundingSpheres);

        // Adjust bounding sphere height and radius to cover more of the volume
        boundingSphere.radius += sumHeights / (segmentCount * 2.0);

        var attributes = {
            position : new GeometryAttribute.GeometryAttribute({
                componentDatatype : ComponentDatatype.ComponentDatatype.DOUBLE,
                componentsPerAttribute : 3,
                normalize : false,
                values : positionsArray
            }),
            startHiAndForwardOffsetX : getVec4GeometryAttribute(startHiAndForwardOffsetX),
            startLoAndForwardOffsetY : getVec4GeometryAttribute(startLoAndForwardOffsetY),
            startNormalAndForwardOffsetZ : getVec4GeometryAttribute(startNormalAndForwardOffsetZ),
            endNormalAndTextureCoordinateNormalizationX : getVec4GeometryAttribute(endNormalAndTextureCoordinateNormalizationX),
            rightNormalAndTextureCoordinateNormalizationY : getVec4GeometryAttribute(rightNormalAndTextureCoordinateNormalizationY)
        };

        if (compute2dAttributes) {
            attributes.startHiLo2D = getVec4GeometryAttribute(startHiLo2D);
            attributes.offsetAndRight2D = getVec4GeometryAttribute(offsetAndRight2D);
            attributes.startEndNormals2D = getVec4GeometryAttribute(startEndNormals2D);
            attributes.texcoordNormalization2D = new GeometryAttribute.GeometryAttribute({
                componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
                componentsPerAttribute : 2,
                normalize : false,
                values : texcoordNormalization2D
            });
        }

        return new GeometryAttribute.Geometry({
            attributes : attributes,
            indices : indices,
            boundingSphere : boundingSphere
        });
    }

    function getVec4GeometryAttribute(typedArray) {
        return new GeometryAttribute.GeometryAttribute({
            componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
            componentsPerAttribute : 4,
            normalize : false,
            values : typedArray
        });
    }

    /**
     * Approximates an ellipsoid-tangent vector in 2D by projecting the end point into 2D.
     * Exposed for testing.
     *
     * @param {MapProjection} projection Map Projection for projecting coordinates to 2D.
     * @param {Cartographic} cartographic The cartographic origin point of the normal.
     *   Used to check if the normal crosses the IDL during projection.
     * @param {Cartesian3} normal The normal in 3D.
     * @param {Cartesian3} projectedPosition The projected origin point of the normal in 2D.
     * @param {Cartesian3} result Result parameter on which to store the projected normal.
     * @private
     */
    GroundPolylineGeometry._projectNormal = projectNormal;

    function createGroundPolylineGeometry(groundPolylineGeometry, offset) {
        return ApproximateTerrainHeights.initialize()
            .then(function() {
                if (when.defined(offset)) {
                    groundPolylineGeometry = GroundPolylineGeometry.unpack(groundPolylineGeometry, offset);
                }
                return GroundPolylineGeometry.createGeometry(groundPolylineGeometry);
            });
    }

    return createGroundPolylineGeometry;

});
