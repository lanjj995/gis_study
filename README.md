# 地理坐标系统

## EPSG:3857

EPSG:3857（别名 Web Mercator） 是一个投影坐标系统，基于墨卡托投影，但进行了修改以使用球体（而非椭球体）来近似地球表面。

## EPSG:4326

EPSG:4326（别名 WGS84）球面坐标系统，它使用经度和纬度来表示空间坐标。

## EPSG:4490

EPSG:4490（别名 CGCS2000）与 EPSG:4326 非常相似，是中国大地测量系统 2000 的坐标系统。针对中国区域优化过，更符合中国国内的使用标准

# Web Map Service

WMS(Web Map Service) 是地理空间网格服务标准的一种，用于提供地图数据。标准定义了一种HTTP接口，用于从一个或者多个分布式地理空间数据库请求地理注册地图图像。WMS 服务通常用于生成静态地图图片，它可以根据用户的请求动态创建地图。

## WMTS

WMTS(Web Map Tile Service) 是地理空间网格服务标准的一种，用于提供地图数据。WMTS 是 OGC 针对预渲染地图瓦片提供的服务标准。与 WMS 不同，WMTS 服务提供的是预先切割并存储为瓦片（tile）的地图图像，这些瓦片通常在多个缩放级别上可用。

# OpenLayers API 模块

主要模块：

- Map 地图的核心容器，管理所有图层、视图、控件等。
- View 地图的视图，管理地图的缩放级别、中心点、旋转角度等。
- Layer 图层，管理地图上所有要素的绘制。
- Source 图层的数据源，负责从服务器获取数据或以其他方式生成数据。
- Feature 地图要素，通常用于矢量数据
- Geometry 描述地图要素的地图几何，例如点、线、面等。
- Interaction 提供用户与地图交互的功能，如鼠标点击、拖动、缩放等。
- Control 地图控件，用于在图上添加交互控件，例如缩放控件、平移控件等。

模块之间的协作：

- Map 与 View: Map 使用 View 来确定地图的显示状态。当用户进行交互（如平移或缩放）时，Map 会更新 View 的属性，并且 View 会相应地通知图层重新渲染。
- Map 与 Layer: Map 管理着多个 Layer 对象。每个 Layer 都有一个 Source，它决定了图层的数据来源。Map 在渲染时会遍历所有图层并调用它们的渲染方法。
- Layer 与 Source: Layer 从其 Source 获取数据。例如，一个 TileLayer 可能有一个 TileWMS 或 OSM 类型的 Source，该 Source 负责请求和提供地图瓦片。
- Layer 与 Feature: 对于矢量图层（VectorLayer），Layer 包含多个 Feature 对象。每个 Feature 有一个 Geometry，定义了它在地图上的形状。
- Interaction 与 Map: Interaction 模块定义了用户与地图交互的方式。交互实例被添加到 Map 对象中，从而响应用户事件并更新 View 或 Layer 的状态。
- Control 与 Map: Control 模块提供了用户界面元素，如按钮和滑块，允许用户以特定方式与地图交互。控件被添加到 Map 对象中，并可以访问和修改 Map 和 View 的状态。