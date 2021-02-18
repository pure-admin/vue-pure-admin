deps = {
    "common": {
        "core": [
            "./src/common/SuperMap.js",
            "./src/common/REST.js"
        ],
        "util": [
            "./src/common/util/FetchRequest.js"
        ],
        "format": [
            "./src/common/format/GeoJSON.js"
        ],
        "style": [
            "./src/common/style/CartoCSS.js"
        ],
        "security": [
            "./src/common/security/SecurityManager.js"
        ],
        "iManager": [
            "./src/common/iManager/iManager.js"
        ],
        "online": [
            "./src/common/online/Online.js"
        ],
        "iPortal": [
            "./src/common/iPortal/iPortal.js"
        ],
        "iServer": [
            //Data
            "./src/common/iServer/FieldStatisticService.js",
            "./src/common/iServer/GetFeaturesByBoundsService.js",
            "./src/common/iServer/GetFeaturesByBufferService.js",
            "./src/common/iServer/GetFeaturesByGeometryService.js",
            "./src/common/iServer/GetFeaturesByIDsService.js",
            "./src/common/iServer/GetFeaturesBySQLService.js",
            "./src/common/iServer/GetFieldsService.js",
            "./src/common/iServer/GetGridCellInfosService.js",
            "./src/common/iServer/EditFeaturesService.js",
            //Map
            "./src/common/iServer/GetLayersInfoService.js",
            "./src/common/iServer/MapService.js",
            "./src/common/iServer/ChartQueryService.js",
            "./src/common/iServer/QueryByDistanceService.js",
            "./src/common/iServer/QueryByGeometryService.js",
            "./src/common/iServer/QueryBySQLService.js",
            "./src/common/iServer/QueryByBoundsService.js",
            "./src/common/iServer/TilesetsService.js",
            "./src/common/iServer/MeasureService.js",
            "./src/common/iServer/ChartFeatureInfoSpecsService.js",
            "./src/common/iServer/SetLayerInfoService.js",
            "./src/common/iServer/SetLayersInfoService.js",
            "./src/common/iServer/SetLayerStatusService.js",
            //ThemeService
            "./src/common/iServer/ThemeService.js",
            //NetworkAnalyst
            "./src/common/iServer/BurstPipelineAnalystService.js",
            "./src/common/iServer/ComputeWeightMatrixService.js",
            "./src/common/iServer/FacilityAnalystStreamService.js",
            "./src/common/iServer/FindClosestFacilitiesService.js",
            "./src/common/iServer/FindLocationService.js",
            "./src/common/iServer/FindMTSPPathsService.js",
            "./src/common/iServer/FindPathService.js",
            "./src/common/iServer/FindServiceAreasService.js",
            "./src/common/iServer/FindTSPPathsService.js",
            "./src/common/iServer/UpdateEdgeWeightService.js",
            "./src/common/iServer/UpdateTurnNodeWeightService.js",
            //NetworkAnalyst3D
            "./src/common/iServer/FacilityAnalystSinks3DService.js",
            "./src/common/iServer/FacilityAnalystSources3DService.js",
            "./src/common/iServer/FacilityAnalystTracedown3DService.js",
            "./src/common/iServer/FacilityAnalystTraceup3DService.js",
            "./src/common/iServer/FacilityAnalystUpstream3DService.js",
            //TrafficTransferAnalyst
            "./src/common/iServer/StopQueryService.js",
            "./src/common/iServer/TransferPathService.js",
            "./src/common/iServer/TransferSolutionService.js",
            //SpatialAnalyst
            "./src/common/iServer/AreaSolarRadiationService.js",
            "./src/common/iServer/BufferAnalystService.js",
            "./src/common/iServer/DensityAnalystService.js",
            "./src/common/iServer/GenerateSpatialDataService.js",
            "./src/common/iServer/GeoRelationAnalystService.js",
            "./src/common/iServer/InterpolationAnalystService.js",
            "./src/common/iServer/MathExpressionAnalysisService.js",
            "./src/common/iServer/OverlayAnalystService.js",
            "./src/common/iServer/RouteCalculateMeasureService.js",
            "./src/common/iServer/RouteLocatorService.js",
            "./src/common/iServer/SurfaceAnalystService.js",
            "./src/common/iServer/TerrainCurvatureCalculationService.js",
            "./src/common/iServer/ThiessenAnalystService.js",
            "./src/common/iServer/GeometryBatchAnalystService.js",
            //ProcessingService
            "./src/common/iServer/BuffersAnalystJobsService",
            "./src/common/iServer/KernelDensityJobsService.js",
            "./src/common/iServer/OverlayGeoJobsService.js",
            "./src/common/iServer/SingleObjectQueryJobsService.js",
            "./src/common/iServer/SummaryMeshJobsService.js",
            "./src/common/iServer/SummaryRegionJobsService.js",
            "./src/common/iServer/TopologyValidatorJobsService",
            "./src/common/iServer/VectorClipJobsService.js",
            "./src/common/iServer/SummaryAttributesJobsService.js",
            //AddressService
            "./src/common/iServer/AddressMatchService.js",
            //DataFlowService
            "./src/common/iServer/DataFlowService.js"
        ],
        "graph": [
            "./src/common/overlay/Bar.js",
            "./src/common/overlay/Bar3D.js",
            "./src/common/overlay/Circle.js",
            "./src/common/overlay/Line.js",
            "./src/common/overlay/Pie.js",
            "./src/common/overlay/Point.js",
            "./src/common/overlay/Ring.js"
        ]

    },

    "openlayers": {

        "Mapping": {
            "title": "地图",
            "description": "基础地图模块",
            "description_en": "Basic map module",

            "RESTMAP": {
                "name": "iServer 地图图层",
                "src": ["./src/openlayers/mapping/TileSuperMapRest.js",
                    "./src/openlayers/mapping/ImageSuperMapRest.js"
                ],
                "modules": [{
                    "name": "ol.source.TileSuperMapRest",
                    "des": "iServer tileImage 地图",
                    "des_en": "iServer tileImage resources tile layer"
                }, {
                    "name": "ol.source.ImageSuperMapRest",
                    "des": "iServer image 地图",
                    "des_en": "iServer image resources tile layer"
                }]
            },

            "Baidu": {
                // "name": "百度图层",
                // "src": ['./src/openlayers/mapping/BaiduMap.js'],
                "modules": [{
                    "name": "ol.source.BaiduMap",
                    "des": "百度地图",
                    // "des_en": "Baidu map tile layer"
                }]
            },
            "Tianditu": {
                "name": "天地图图层",
                "src": ['./src/openlayers/mapping/Tianditu.js'],
                "modules": [{
                    "name": "ol.source.Tianditu",
                    "des": "天地图",
                    "des_en": "Tianditu map tile layer"
                }]
            },
            "SuperMapCloud": {
                "name": "超图云图层",
                "src": ['./src/openlayers/mapping/SuperMapCloud.js'],
                "modules": [{
                    "name": "ol.source.SuperMapCloud",
                    "des": "超图云地图",
                    "des_en": "SuperMap cloud map tile layer"
                }]
            },
            "iPortal": {
                "name": "iPortal webmap",
                "src": ["./src/openlayers/mapping/WebMap.js"],
                "modules": [{
                    "name": "ol.supermap.WebMap",
                    "des": "iPortal、Online 地图",
                    "des_en": "SuperMap iPortal and Online tile layer"
                }]
            }
        },
        "Services": {
            "title": "服务",
            "description": "服务模块",
            "description_en": "Service module",

            "Map": {
                "name": "地图服务",
                "src": [
                    "./src/openlayers/services/MapService.js",
                    "./src/openlayers/services/QueryService.js",
                    "./src/openlayers/services/LayerInfoService.js",
                    "./src/openlayers/services/MeasureService.js",
                    "./src/openlayers/services/ChartService.js"
                ],
                "modules": [{
                    "name": "ol.supermap.MapService",
                    "des": "地图信息服务",
                    "des_en": "iServer map service"
                }, {
                    "name": "ol.supermap.QueryService",
                    "des": "地图查询服务",
                    "des_en": "iServer map query service"
                }, {
                    "name": "ol.supermap.LayerInfoService",
                    "des": "图层信息服务",
                    "des_en": "iServer layer information service"
                }, {
                    "name": "ol.supermap.MeasureService",
                    "des": "测量服务",
                    "des_en": "iServer measure service"
                }, {
                    "name": "ol.supermap.ChartService",
                    "des": "海图服务",
                    "des_en": "iServer chart service"
                }]
            },
            "Data": {
                "name": "数据服务",
                "src": [
                    "./src/openlayers/services/FeatureService.js",
                    "./src/openlayers/services/FieldService.js",
                    "./src/openlayers/services/GridCellInfosService.js"
                ],
                "modules": [{
                    "name": "ol.supermap.FeatureService",
                    "des": "数据集服务",
                    "des_en": "iServer feature service"
                }, {
                    "name": "ol.supermap.FieldService",
                    "des": "字段服务",
                    "des_en": "iServer field service"
                }, {
                    "name": "ol.supermap.GridCellInfosService",
                    "des": "数据栅格查询服务",
                    "des_en": "iServer data grid cell information service"
                }]
            },
            "Theme": {
                "name": "服务器专题图服务",
                "src": [
                    "./src/openlayers/services/ThemeService.js"
                ],
                "modules": [{
                    "name": "ol.supermap.ThemeService",
                    "des": "专题图服务",
                    "des_en": "iServer thematic service"
                }]
            },
            "NetworkAnalyst": {
                "name": "网络分析服务",
                "src": [
                    "./src/openlayers/services/NetworkAnalystService.js"
                ],
                "modules": [{
                    "name": "ol.supermap.NetworkAnalystService",
                    "des": "网络分析服务",
                    "des_en": "iServer network analyst service"
                }]
            },
            "NetworkAnalyst3D": {
                "name": "3D网络分析服务",
                "src": [
                    "./src/openlayers/services/NetworkAnalyst3DService.js"
                ],
                "modules": [{
                    "name": "ol.supermap.NetworkAnalyst3DService",
                    "des": "3D 网络分析服务",
                    "des_en": "iServer 3D network analyst service"
                }]
            },
            "SpatialAnalyst": {
                "name": "空间分析服务",
                "src": [
                    "./src/openlayers/services/SpatialAnalystService.js"
                ],
                "modules": [{
                    "name": "ol.supermap.SpatialAnalystService",
                    "des": "空间分析服务",
                    "des_en": "iServer spatial analyst service"
                }]
            },
            "TrafficTransferAnalyst": {
                "name": "交通换乘分析服务",
                "src": [
                    "./src/openlayers/services/TrafficTransferAnalystService.js"
                ],
                "modules": [{
                    "name": "ol.supermap.TrafficTransferAnalystService",
                    "des": "交通换乘服务",
                    "des_en": "iServer traffic transfer analyst service"
                }]
            },
            "iPortal": {
                "name": "iPortal服务",
                "src": [
                    "./src/common/iPortal/iPortal.js"
                ],
                "modules": [{
                    "name": "SuperMap.iPortal",
                    "des": "iPortal 服务",
                    "des_en": "SuperMap iPortal service"
                }]
            },
            "Online": {
                "name": "Online服务",
                "src": [
                    "./src/common/online/Online.js"
                ],
                "modules": [{
                    "name": "SuperMap.Online",
                    "des": "Online 服务",
                    "des_en": "SuperMap Online service"
                }]
            },
            "iManager": {
                "name": "iManager服务",
                "src": [
                    "./src/common/iManager/iManager.js"
                ], "modules": [{
                    "name": "SuperMap.iManager",
                    "des": "iManager 服务",
                    "des_en": "SuperMap iManager service"
                }]
            },
            "ProcessingService": {
                "name": "分布式分析服务",
                "src": [
                    "./src/openlayers/services/ProcessingService.js"
                ],
                "modules": [{
                    "name": "ol.supermap.ProcessingService",
                    "des": "分布式分析服务",
                    "des_en": "iServer distributed analyst service"
                }]
            },
            "AddressMatch": {
                "name": "地址匹配服务",
                "src": [
                    "./src/openlayers/services/AddressMatchService.js"
                ],
                "modules": [{
                    "name": "ol.supermap.AddressMatchService",
                    "des": "地址匹配服务",
                    "des_en": "iServer address match service"
                }]
            },
            "ElasticSearch": {
                "name": "ElasticSearch",
                "src": [
                    "./src/common/control/TimeFlowControl.js",
                    "./src/common/thirdparty/elasticsearch/ElasticSearch.js"
                ],
                "modules": [{
                    "name": "SuperMap.ElasticSearch",
                    "des": "ElasticSearch 服务",
                    "des_en": "ElasticSearch service"
                }]
            },
            "DataFlow": {
                "name": "数据流服务",
                "src": [
                    "./src/openlayers/services/DataFlowService.js",
                    "./src/openlayers/overlay/DataFlow.js"
                ],
                "modules": [{
                    "name": "ol.supermap.DataFlowService",
                    "des": "数据流服务",
                    "des_en": "iServer data flow service"
                }, {
                    "name": "ol.source.DataFlow",
                    "des": "数据流源",
                    "des_en": "iServer data flow layer"
                }]
            }
        },
        "Overlay": {
            "title": "可视化",
            "description": "可视化与计算模块",
            "description_en": "Visualization and calculation module",

            "HeatMap": {
                "name": "热力图图层源",
                "src": [
                    "./src/openlayers/overlay/HeatMap.js"
                ],
                "modules": [{
                    "name": "ol.source.HeatMap",
                    "des": "热力图图层源",
                    "des_en": "Heatmap source"
                }]
            },
            "Graphic": {
                "name": "高效率点图层源",
                "src": [
                    "./src/openlayers/overlay/Graphic.js",
                    "./src/openlayers/overlay/graphic/CloverShape.js"
                ],
                "modules": [{
                    "name": "ol.source.Graphic",
                    "des": "高效率点图层源",
                    "des_en": "High efficiency point source"
                }, {
                    "name": "ol.style.CloverShape ",
                    "des": "高效率点图层源三叶草风格",
                    "des_en": "Clover style of graphic source"
                }]
            },
            "VectorTile": {
                "name": "矢量瓦片图层源",
                "src": [
                    "./src/openlayers/overlay/VectorTileSuperMapRest.js",
                    "./src/openlayers/overlay/vectortile/MapboxStyles.js",
                    "./src/openlayers/overlay/vectortile/VectorTileStyles.js"
                ],
                "modules": [{
                    "name": "ol.source.VectorTileSuperMapRest",
                    "des": "矢量瓦片图层源",
                    "des_en": "Vector tile source"
                }, {
                    "name": "ol.supermap.MapboxStyles",
                    "des": "Mapbox 矢量瓦片风格",
                    "des_en": "Mapbox vector tile style"
                }, {
                    "name": "ol.supermap.VectorTileStyles",
                    "des": "矢量瓦片风格",
                    "des_en": "Vector tile style"
                }]
            },
            "Theme": {
                "name": "专题图图层源",
                "src": [
                    "./src/openlayers/overlay/Unique.js",
                    "./src/openlayers/overlay/Range.js",
                    "./src/openlayers/overlay/RankSymbol.js",
                    "./src/openlayers/overlay/Graph.js",
                    "./src/openlayers/overlay/Label.js"
                ],
                "modules": [{
                    "name": "ol.source.Unique",
                    "des": "单值专题图图层源",
                    "des_en": "Unique thematic map source"
                }, {
                    "name": "ol.source.RankSymbol",
                    "des": "符号等级专题图图层源",
                    "des_en": "Rank symbol thematic map source"
                }, {
                    "name": "ol.source.Range",
                    "des": "分段专题图图层源",
                    "des_en": "Range thematic map source"
                }, {
                    "name": "ol.source.Graph",
                    "des": "统计专题图图层源",
                    "des_en": "Statistical thematic map source"
                }, {
                    "name": "ol.source.Label",
                    "des": "标签专题图图层源",
                    "des_en": "Label thematic map source"
                }]
            },
            "MapV": {
                "name": "MapV source",
                "src": [
                    "./src/openlayers/overlay/Mapv.js"
                ],
                "modules": [{
                    "name": "ol.source.Mapv",
                    "des": "MapV 图层源",
                    "des_en": "MapV source"
                }]
            },
            "Turf": {
                "name": "Turf source",
                "src": [
                    "./src/openlayers/overlay/Turf.js"
                ],
                "modules": [{
                    "name": "ol.source.Turf",
                    "des": "Turf 图层源",
                    "des_en": "Turf source"
                }]
            }
        },
        "Control": {
            "title": "控件",
            "description": "功能控件模块",
            "description_en": "Control module",

            "ChangeTileVersion": {
                "name": "多版本缓存切换",
                "src": [
                    "./src/openlayers/control/ChangeTileVersion.js"
                ],
                "modules": [{
                    "name": "ol.supermap.control.ChangeTileVersion",
                    "des": "瓦片版本切换控件",
                    "des_en": "Tile version switch control"
                }]
            },
            "Logo": {
                "name": "logo控件",
                "src": [
                    "./src/openlayers/control/Logo.js"
                ],
                "modules": [{
                    "name": "ol.supermap.control.Logo",
                    "des": "Logo 控件",
                    "des_en": "Logo control"
                }]
            }
        }
    },

    "Documentation": {
        "Core": {
            "title": "核心",
            "description": "核心模块",
            "description_en": "Core module",

            "SCTTerrainProvider": {
                "name": "SCT地形服务提供者",
                "src": [
                    "../docs/Documentation/SCTTerrainProvider.html"
                ],
                "modules": [{
                    "name": "SCTTerrainProvider",
                    "des": "SCT地形服务提供者",
                    "des_en": "Open file components"
                }]
            },
            "WebMercatorTilingScheme": {
                "name": "打开文件组件",
                "src": [
                    "./src/leaflet/components/openfile/OpenFileView.js"
                ],
                "modules": [{
                    "name": "WebMercatorTilingScheme",
                    "des": "wmts投影",
                    "des_en": "WebMercatorTilingScheme"
                }]
            },
            "Cartographic": {
                "name": "打开文件组件",
                "src": [
                    "./src/leaflet/components/openfile/OpenFileView.js"
                ],
                "modules": [{
                    "name": "Cartographic",
                    "des": "空间位置",
                    "des_en": "Cartographic"
                }]
            },
            "HypsometricSetting": {
                "name": "打开文件组件",
                "src": [
                    "./src/leaflet/components/openfile/OpenFileView.js"
                ],
                "modules": [{
                    "name": "HypsometricSetting",
                    "des": "分层设色",
                    "des_en": "Cartographic"
                }]
            },
            "Credential": {
                "name": "打开文件组件",
                "src": [
                    "./src/leaflet/components/openfile/OpenFileView.js"
                ],
                "modules": [{
                    "name": "Credential",
                    "des": "SuperMap地图服务安全验证类",
                    "des_en": "Cartographic"
                }]
            },
            "Ellipsoid": {
                "name": "打开文件组件",
                "src": [
                    "./src/leaflet/components/openfile/OpenFileView.js"
                ],
                "modules": [{
                    "name": "Ellipsoid",
                    "des": "椭球体类",
                    "des_en": "Cartographic"
                }]
            },
            "ColorTable": {
                "name": "打开文件组件",
                "src": [
                    "./src/leaflet/components/openfile/OpenFileView.js"
                ],
                "modules": [{
                    "name": "ColorTable",
                    "des": "颜色表类",
                    "des_en": "Cartographic"
                }]
            },
            "CesiumTerrainProvider": {
                "name": "打开文件组件",
                "src": [
                    "./src/leaflet/components/openfile/OpenFileView.js"
                ],
                "modules": [{
                    "name": "CesiumTerrainProvider",
                    "des": "Cesium地形服务提供者类",
                    "des_en": "CesiumTerrainProvider"
                }]
            },
            "Cartesian3": {
                "name": "打开文件组件",
                "src": [
                    "./src/leaflet/components/openfile/OpenFileView.js"
                ],
                "modules": [{
                    "name": "Cartesian3",
                    "des": "三维笛卡尔坐标点类",
                    "des_en": "Cartesian3"
                }]
            },
            "PackingRequest": {
                "name": "打开文件组件",
                "src": [
                    "./src/leaflet/components/openfile/OpenFileView.js"
                ],
                "modules": [{
                    "name": "PackingRequest",
                    "des": "打包请求编码方式类",
                    "des_en": "Cartesian3"
                }]
            }
        },
        "DataSources": {
            "title": "数据源",
            "description": "数据源",
            "description_en": "DataSources",

            "PolylineTrailMaterialProperty": {
                "name": "尾迹线材质类",
                "src": [
                    "../docs/Documentation/SCTTerrainProvider.html"
                ],
                "modules": [{
                    "name": "PolylineTrailMaterialProperty",
                    "des": "尾迹线材质类",
                    "des_en": "Open file components"
                }]
            },
            "EntityCollection ": {
                "name": "实体对象集合类",
                "src": [
                    "../docs/Documentation/SCTTerrainProvider.html"
                ],
                "modules": [{
                    "name": "EntityCollection ",
                    "des": "实体对象集合类",
                    "des_en": "Open file components"
                }]
            },
            "DataSource": {
                "name": "定义数据源的接口类",
                "src": [
                    "../docs/Documentation/SCTTerrainProvider.html"
                ],
                "modules": [{
                    "name": "DataSource ",
                    "des": "定义数据源的接口类",
                    "des_en": "Open file components"
                }]
            },
            "DataSourceCollection": {
                "name": "数据源实例集合类",
                "src": [
                    "../docs/Documentation/SCTTerrainProvider.html"
                ],
                "modules": [{
                    "name": "DataSourceCollection  ",
                    "des": "数据源实例集合类",
                    "des_en": "Open file components"
                }]
            },
            "Entity": {
                "name": "实体实例类",
                "src": [
                    "../docs/Documentation/SCTTerrainProvider.html"
                ],
                "modules": [{
                    "name": "Entity",
                    "des": "实体实例类",
                    "des_en": "Open file components"
                }]
            }
        },
        "Fly": {
            "title": "飞行管理",
            "description": "飞行管理",
            "description_en": "Fly",

            "FlyManager": {
                "name": "飞行管理类",
                "src": [
                    "../docs/Documentation/SCTTerrainProvider.html"
                ],
                "modules": [{
                    "name": "FlyManager",
                    "des": "飞行管理类",
                    "des_en": "Open file components"
                }]
            },
            "FlyInterpolationMode": {
                "name": "相机飞行插值模式",
                "src": [
                    "../docs/Documentation/SCTTerrainProvider.html"
                ],
                "modules": [{
                    "name": "FlyInterpolationMode",
                    "des": "相机飞行插值模式",
                    "des_en": "Open file components"
                }]
            },
            "StopPlayMode": {
                "name": "站点模式",
                "src": [
                    "../docs/Documentation/SCTTerrainProvider.html"
                ],
                "modules": [{
                    "name": "StopPlayMode",
                    "des": "站点模式",
                    "des_en": "Open file components"
                }]
            },
            "Route": {
                "name": "飞行路线对象类",
                "src": [
                    "../docs/Documentation/SCTTerrainProvider.html"
                ],
                "modules": [{
                    "name": "Route",
                    "des": "飞行路线对象类",
                    "des_en": "Open file components"
                }]
            },
            "RouteCollection": {
                "name": "飞行路线集合对象类",
                "src": [
                    "../docs/Documentation/SCTTerrainProvider.html"
                ],
                "modules": [{
                    "name": "RouteCollection",
                    "des": "飞行路线集合对象类",
                    "des_en": "Open file components"
                }]
            },
            "RouteStop": {
                "name": "飞行站点对象类",
                "src": [
                    "../docs/Documentation/SCTTerrainProvider.html"
                ],
                "modules": [{
                    "name": "RouteStop",
                    "des": "飞行站点对象类",
                    "des_en": "Open file components"
                }]
            }
        },
        "Geometry3D": {
            "title": "三维几何体",
            "description": "三维几何体",
            "description_en": "Geometry3D",

            "Point3Ds": {
                "name": "三维点集合对象类",
                "src": [
                    "../docs/Documentation/SCTTerrainProvider.html"
                ],
                "modules": [{
                    "name": "Point3Ds",
                    "des": "三维点集合对象类",
                    "des_en": "Open file components"
                }]
            },
            "Catenaryline": {
                "name": "垂线类",
                "src": [
                    "../docs/Documentation/SCTTerrainProvider.html"
                ],
                "modules": [{
                    "name": "Catenaryline",
                    "des": "垂线类",
                    "des_en": "Open file components"
                }]
            },
            "GeoLine3D": {
                "name": "三维线对象类",
                "src": [
                    "../docs/Documentation/SCTTerrainProvider.html"
                ],
                "modules": [{
                    "name": "GeoLine3D",
                    "des": "三维线对象类",
                    "des_en": "Open file components"
                }]
            },
            "GeoBillboard": {
                "name": "三维布告板对象类",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "GeoBillboard",
                    "des": "三维布告板对象类",
                    "des_en": "GeoBillboard"
                }]
            },
            "Geometry3D": {
                "name": "三维几何对象抽象类",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "Geometry3D",
                    "des": "三维几何对象抽象类",
                    "des_en": "GeoBillboard"
                }]
            },
            "GeoPoint3D": {
                "name": "三维地理点几何对象类",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "GeoPoint3D",
                    "des": "三维地理点几何对象类",
                    "des_en": "GeoBillboard"
                }]
            },
            "GeoCone": {
                "name": "三维椎体几何对象类",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "GeoCone",
                    "des": "三维椎体几何对象类",
                    "des_en": "GeoBillboard"
                }]
            },
            "GeoRegion3D": {
                "name": "三维面对象类",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "GeoRegion3D",
                    "des": "三维面对象类",
                    "des_en": "GeoBillboard"
                }]
            },
            "GeoEllipsoid": {
                "name": "三维椭球体几何对象类",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "GeoEllipsoid",
                    "des": "三维椭球体几何对象类",
                    "des_en": "GeoBillboard"
                }]
            },
            "GeoBox": {
                "name": "三维长方体几何对象类",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "GeoBox",
                    "des": "三维长方体几何对象类",
                    "des_en": "GeoBillboard"
                }]
            },
            "GeoSphere": {
                "name": "三维球体几何对象类",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "GeoSphere",
                    "des": "三维球体几何对象类",
                    "des_en": "GeoBillboard"
                }]
            },
            "GeoCylinder": {
                "name": "三维圆柱体几何对象类",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "GeoCylinder",
                    "des": "三维圆柱体几何对象类",
                    "des_en": "GeoBillboard"
                }]
            },
            "GeoModel3D": {
                "name": "三维模型对象类",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "GeoModel3D",
                    "des": "三维模型对象类",
                    "des_en": "GeoBillboard"
                }]
            }
        },
        "Handler": {
            "title": "交互处理模块",
            "description": "交互处理模块",
            "description_en": "Geometry3D",

            "BoxEditor": {
                "name": "Box编辑器类",
                "src": [
                    "../docs/Documentation/SCTTerrainProvider.html"
                ],
                "modules": [{
                    "name": "BoxEditor",
                    "des": "Box编辑器类",
                    "des_en": "Open file components"
                }]
            },
            "EditHandler": {
                "name": "对象编辑类",
                "src": [
                    "../docs/Documentation/SCTTerrainProvider.html"
                ],
                "modules": [{
                    "name": "EditHandler",
                    "des": "对象编辑类",
                    "des_en": "Open file components"
                }]
            },
            "MeasureMode": {
                "name": "量算模式类",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "MeasureMode",
                    "des": "量算模式类",
                    "des_en": "Open file components"
                }]
            },
            "DrawHandler": {
                "name": "绘制处理器对象类",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "DrawHandler",
                    "des": "绘制处理器对象类",
                    "des_en": "Open file components"
                }]
            },
            "MeasureHandler": {
                "name": "量测处理器类",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "MeasureHandler",
                    "des": "量测处理器类",
                    "des_en": "Open file components"
                }]
            },
            "DrawMode": {
                "name": "绘制模式类",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "DrawMode",
                    "des": "绘制模式类",
                    "des_en": "Open file components"
                }]
            },

        },
        "Renderer": {
            "title": "渲染",
            "description": "渲染",
            "description_en": "Renderer",

            "ProjectionImage": {
                "name": "视频投放类",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "ProjectionImage",
                    "des": "视频投放类",
                    "des_en": "Open file components"
                }]
            },
            "BillboardMode": {
                "name": "布告板模式",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "BillboardMode",
                    "des": "布告板模式",
                    "des_en": "Open file components"
                }]
            },
            "SpatialQuery3D": {
                "name": "GPU空间分析类",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "SpatialQuery3D",
                    "des": "GPU空间分析类",
                    "des_en": "Open file components"
                }]
            },
            "ViewDome": {
                "name": "开敞度分析类",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "ViewDome",
                    "des": "开敞度分析类",
                    "des_en": "Open file components"
                }]
            },
            "ViewDomeType": {
                "name": "开敞度显示类型 ",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "ViewDomeType",
                    "des": "开敞度显示类型",
                    "des_en": "Open file components"
                }]
            },
            "MultiViewShed3D": {
                "name": "多可视域分析",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "MultiViewShed3D",
                    "des": "多可视域分析",
                    "des_en": "Open file components"
                }]
            }
        },
        "Spatial Analysis": {
            "title": "空间分析",
            "description": "空间分析",
            "description_en": "Spatial Analysis",

            "Sightline": {
                "name": "通视分析",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "Sightline",
                    "des": "通视分析",
                    "des_en": "Open file components"
                }]
            },
            "Style3D": {
                "name": "三维对象风格",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "Style3D",
                    "des": "三维对象风格",
                    "des_en": "Open file components"
                }]
            },
            "Profile": {
                "name": "剖面线分析类",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "Profile",
                    "des": "剖面线分析类",
                    "des_en": "Open file components"
                }]
            },
            "ViewShed3D": {
                "name": "可视域分析",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "ViewShed3D",
                    "des": "可视域分析",
                    "des_en": "Open file components"
                }]
            },
            "Skyline": {
                "name": "天际线分析",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "Skyline",
                    "des": "天际线分析",
                    "des_en": "Open file components"
                }]
            },
            "ShadowQueryPoints": {
                "name": "阴影率分析类",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "ShadowQueryPoints",
                    "des": "阴影率分析类",
                    "des_en": "Open file components"
                }]
            }
        },
        "S3MTiles": {
            "title": "S3M瓦片",
            "description": "S3M瓦片",
            "description_en": "S3MTiles",

            "SelectColorType": {
                "name": "选取对象的显示风格",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "SelectColorType",
                    "des": "选取对象的显示风格",
                    "des_en": "Open file components"
                }]
            },
            "InstanceLayer": {
                "name": "实例化图层类",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "InstanceLayer",
                    "des": "实例化图层类",
                    "des_en": "Open file components"
                }]
            },
            "S3MTilesLabelStyle": {
                "name": "S3M标签风格类",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "S3MTilesLabelStyle",
                    "des": "S3M标签风格类",
                    "des_en": "Open file components"
                }]
            },
            "DynamicLayer3D": {
                "name": "三维动态图层类",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "DynamicLayer3D",
                    "des": "三维动态图层类",
                    "des_en": "Open file components"
                }]
            },
            "DDSTexture": {
                "name": "DDS纹理对象",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "DDSTexture",
                    "des": "DDS纹理对象",
                    "des_en": "Open file components"
                }]
            },
            "DDSTextureManager": {
                "name": "DDS纹理管理器类",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "DDSTextureManager",
                    "des": "DDS纹理管理器类",
                    "des_en": "Open file components"
                }]
            },
            "DynamicObjectState": {
                "name": "动态实例对象状态信息类",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "DynamicObjectState",
                    "des": "动态实例对象状态信息类",
                    "des_en": "Open file components"
                }]
            },
            "S3MInstance": {
                "name": "S3M模型实例对象",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "S3MInstance",
                    "des": "S3M模型实例对象",
                    "des_en": "Open file components"
                }]
            },
            "S3MInstanceCollection": {
                "name": "S3M实例化模型集合类",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "S3MInstanceCollection",
                    "des": "S3M实例化模型集合类",
                    "des_en": "Open file components"
                }]
            },
            "S3MTilesLayer": {
                "name": "S3M(Spatial 3D Model)图层类",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "S3MTilesLayer",
                    "des": "S3M(Spatial 3D Model)图层类",
                    "des_en": "Open file components"
                }]
            },
            "SplitDirection": {
                "name": "卷帘方向模式",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "SplitDirection",
                    "des": "卷帘方向模式",
                    "des_en": "Open file components"
                }]
            },
            "BufferManager": {
                "name": "缓存管理类",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "BufferManager",
                    "des": "缓存管理类",
                    "des_en": "Open file components"
                }]
            },
            "S3MPixelFormat": {
                "name": "S3M纹理像素格式",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "S3MPixelFormat",
                    "des": "S3M纹理像素格式",
                    "des_en": "Open file components"
                }]
            },
            "S3MBloomEffect": {
                "name": "S3M图层垂直方向泛光效果类",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "S3MBloomEffect",
                    "des": "S3M图层垂直方向泛光效果类",
                    "des_en": "Open file components"
                }]
            },
            "SHADOWTYPE": {
                "name": "阴影显示范围类",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "SHADOWTYPE",
                    "des": "阴影显示范围类",
                    "des_en": "Open file components"
                }]
            },
            "ModifyRegionMode": {
                "name": "多边形对象裁剪S3M图层的裁剪模式",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "ModifyRegionMode",
                    "des": "多边形对象裁剪S3M图层的裁剪模式",
                    "des_en": "Open file components"
                }]
            },
            "UrlType": {
                "name": "S3M图层数据请求形式",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "UrlType",
                    "des": "S3M图层数据请求形式",
                    "des_en": "Open file components"
                }]
            },
            "ObjsOperationType": {
                "name": "功能操作类型",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "ObjsOperationType",
                    "des": "功能操作类型",
                    "des_en": "Open file components"
                }]
            },
            "S3MCompressType": {
                "name": "S3M纹理压缩类型",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "S3MCompressType",
                    "des": "S3M纹理压缩类型",
                    "des_en": "Open file components"
                }]
            },
            "InstancedType": {
                "name": "实例化类型",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "InstancedType",
                    "des": "实例化类型",
                    "des_en": "Open file components"
                }]
            }
        },
        "Scene": {
            "title": "三维场景模块",
            "description": "三维场景模块",
            "description_en": "Scene ",

            "Scene ": {
                "name": "三维场景类",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "Scene ",
                    "des": "三维场景类",
                    "des_en": "Open file components"
                }]
            },
            "Quality": {
                "name": "热力图的质量",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "Quality",
                    "des": "热力图的质量",
                    "des_en": "Open file components"
                }]
            },
            "HeatMap": {
                "name": "热力图类",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "HeatMap",
                    "des": "热力图类",
                    "des_en": "Open file components"
                }]
            },
            "RasterVectorCollection": {
                "name": "实时栅格化类",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "RasterVectorCollection",
                    "des": "实时栅格化类",
                    "des_en": "Open file components"
                }]
            },
            "RasterGeometryType": {
                "name": "实时栅格化的几何对象类型",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "RasterVectorCollection",
                    "des": "实时栅格化的几何对象类型",
                    "des_en": "Open file components"
                }]
            },
            "VectorTilesMap": {
                "name": "矢量瓦片地图类",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "VectorTilesMap",
                    "des": "矢量瓦片地图类",
                    "des_en": "Open file components"
                }]
            },
            "SolidModelsProfile":{
                "name":"实体模型剖面类",
                "src":"",
                "modules":[{
                    "name":"SolidModelsProfile",
                    "des":"实体模型剖面类",
                    "des_en":"SolidModelsProfile"
                }]
            },
            "CGCS2000MapServerImageryProvider":{
                "name":"CGCS2000地图服务影像提供类",
                "src":"",
                "modules":[{
                    "name":"CGCS2000MapServerImageryProvider",
                    "des":"CGCS2000地图服务影像提供类",
                    "des_en":"SolidModelsProfile"
                }]
            },
            "ScreenSpaceCameraController":{
                "name":"相机方位类",
                "src":"",
                "modules":[{
                    "name":"ScreenSpaceCameraController",
                    "des":"相机方位类",
                    "des_en":"SolidModelsProfile"
                }]
            },
            "GridProvider":{
                "name":"栅格切片服务提供者类",
                "src":"",
                "modules":[{
                    "name":"GridProvider",
                    "des":"栅格切片服务提供者类",
                    "des_en":"SolidModelsProfile"
                }]
            },
            "WalkingMode":{
                "name":"相机模式",
                "src":"",
                "modules":[{
                    "name":"WalkingMode",
                    "des":"相机模式",
                    "des_en":"SolidModelsProfile"
                }]
            },
            "GridImageryProvider":{
                "name":"网格影像服务提供者",
                "src":"",
                "modules":[{
                    "name":"GridImageryProvider ",
                    "des":"网格影像服务提供者",
                    "des_en":"SolidModelsProfile"
                }]
            },
            "GridLayer":{
                "name":"网格影像服务提供者",
                "src":"",
                "modules":[{
                    "name":"GridLayer",
                    "des":"网格影像服务提供者",
                    "des_en":"SolidModelsProfile"
                }]
            },
            "ScanEffectMode":{
                "name":"扫描线效果模式",
                "src":"",
                "modules":[{
                    "name":"ScanEffectMode",
                    "des":"扫描线效果模式",
                    "des_en":"SolidModelsProfile"
                }]
            },
            "FieldLayer3D":{
                "name":"场数据图层类",
                "src":"",
                "modules":[{
                    "name":"FieldLayer3D",
                    "des":"场数据图层类",
                    "des_en":"SolidModelsProfile"
                }]
            },
            "ColorCorrection":{
                "name":"颜色校正类",
                "src":"",
                "modules":[{
                    "name":"ColorCorrection",
                    "des":"颜色校正类",
                    "des_en":"SolidModelsProfile"
                }]
            },
            "DepthOfFieldEffect":{
                "name":"景深效果类",
                "src":"",
                "modules":[{
                    "name":"DepthOfFieldEffect",
                    "des":"景深效果类",
                    "des_en":"SolidModelsProfile"
                }]
            },
            "ScanEffect":{
                "name":"扫描线效果类",
                "src":"",
                "modules":[{
                    "name":"ScanEffect",
                    "des":"扫描线效果类",
                    "des_en":"SolidModelsProfile"
                }]
            },
            "BloomEffect":{
                "name":"泛光效果类",
                "src":"",
                "modules":[{
                    "name":"BloomEffect",
                    "des":"泛光效果类",
                    "des_en":"SolidModelsProfile"
                }]
            },
            "ParticleVelocityFieldEffect":{
                "name":"场数据图层粒子效果渲染器类",
                "src":"",
                "modules":[{
                    "name":"ParticleVelocityFieldEffect",
                    "des":"场数据图层粒子效果渲染器类",
                    "des_en":"SolidModelsProfile"
                }]
            },
            "MultiViewportMode ":{
                "name":"多视口模式类",
                "src":"",
                "modules":[{
                    "name":"MultiViewportMode",
                    "des":"多视口模式类",
                    "des_en":"SolidModelsProfile"
                }]
            },
            "SuperMapImageryProvider":{
                "name":"影像切片提供者类",
                "src":"",
                "modules":[{
                    "name":"SuperMapImageryProvider",
                    "des":"影像切片提供者类",
                    "des_en":"SolidModelsProfile"
                }]
            },
            "TiandituImageryProvider":{
                "name":"天地图影像服务提供者类",
                "src":"",
                "modules":[{
                    "name":"TiandituImageryProvider",
                    "des":"天地图影像服务提供者类",
                    "des_en":"SolidModelsProfile"
                }]
            },
            "TiandituMapsStyle":{
                "name":"天地图服务类型常量",
                "src":"",
                "modules":[{
                    "name":"TiandituMapsStyle",
                    "des":"天地图服务类型常量",
                    "des_en":"SolidModelsProfile"
                }]
            },
            "Camera":{
                "name":"相机类",
                "src":"",
                "modules":[{
                    "name":"Camera",
                    "des":"相机类",
                    "des_en":"SolidModelsProfile"
                }]
            },
            "Globe":{
                "name":"场景中的球体类",
                "src":"",
                "modules":[{
                    "name":"Globe",
                    "des":"场景中的球体类",
                    "des_en":"SolidModelsProfile"
                }]
            },
            "ImageryLayer":{
                "name":"影像图层类",
                "src":"",
                "modules":[{
                    "name":"ImageryLayer",
                    "des":"影像图层类",
                    "des_en":"SolidModelsProfile"
                }]
            },
            "ImageryLayerCollection":{
                "name":"影像图层集合类",
                "src":"",
                "modules":[{
                    "name":"ImageryLayerCollection",
                    "des":"影像图层集合类",
                    "des_en":"SolidModelsProfile"
                }]
            },
            "Layers":{
                "name":"图层集合类",
                "src":"",
                "modules":[{
                    "name":"Layers",
                    "des":"图层集合类",
                    "des_en":"SolidModelsProfile"
                }]
            },
            "WireFrameType":{
                "name":"S3M图层模型线框模式",
                "src":"",
                "modules":[{
                    "name":"WireFrameType",
                    "des":"S3M图层模型线框模式",
                    "des_en":"SolidModelsProfile"
                }]
            },
        },
        "Widgets": {
            "title": "部件",
            "description": "部件",
            "description_en": "Widgets",

            "Viewer": {
                "name": "Viewer基础部件",
                "src": ["../docs/Documentation/SCTTerrainProvider.html"],
                "modules": [{
                    "name": "Viewer",
                    "des": "Viewer基础部件",
                    "des_en": "Viewer"
                }]
            }
        }
    }
};