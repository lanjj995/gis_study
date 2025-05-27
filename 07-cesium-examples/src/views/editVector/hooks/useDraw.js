import {
	ScreenSpaceEventHandler,
	Ellipsoid,
	Cartographic,
	CallbackProperty,
	PolygonHierarchy,
	Cartesian3,
	Color,
	ScreenSpaceEventType,
	CustomDataSource,
	EllipsoidGeodesic,
	Math as CesiumMath,
	Entity
} from "cesium";
import { collapseItemProps, ElMessage } from "element-plus";
import { circle as turfCircle } from "@turf/circle";
import { AddFeatureCommand } from './command'

export const DRAW_TEMP_ID = {
	POLYGON: "DrawPolygon",
	BOX: "DrawBox",
	CIRCLE: "DrawCircle",
};

export const getDrawTempId = (type) => {
	return DRAW_TEMP_ID[type] + '_' + Date.now()
}

const useDrawPolygon = (Earth, dataSource, historyManager) => {
	// 绘制多边形
	let drawPolygonPoints = [];
	let pointEntities = [];
	let drawPolygonTempEntity = null;
	let drawPolygonHandler = null;

	const drawPolygon = () => {
		if (drawPolygonHandler) return;
		drawPolygonHandler = new ScreenSpaceEventHandler(Earth.viewer.scene.canvas);

		// 左键添加顶点
		drawPolygonHandler.setInputAction((click) => {
			const position = Earth.viewer.scene.pickPosition(click.position);
			if (!position) return;

			// 添加顶点
			drawPolygonPoints.push(position);
			const point = new Entity({
				position: position,
				point: {
					color: Color.RED,
					pixelSize: 5,
					outlineColor: Color.WHITE,
					outlineWidth: 2,
				},
			})
			pointEntities.push(point)
			dataSource.entities.add(point);

			// 动态更新多边形
			if (drawPolygonPoints.length >= 2) {
				if (!drawPolygonTempEntity) {
					drawPolygonTempEntity = dataSource.entities.add({
						id: getDrawTempId(DRAW_TEMP_ID.POLYGON),
						polygon: {
							hierarchy: new CallbackProperty(() => {
								return new PolygonHierarchy(
									drawPolygonPoints.concat(
										drawPolygonPoints[0]
									)
								);
							}, false),
							material: Color.fromAlpha(Color.RED, 0.2),
							clampToGround: true, // 根据需求设置是否贴地
						},
						polyline: {
							positions: new CallbackProperty(() => {
								return drawPolygonPoints.concat(
									drawPolygonPoints[0]
								);
							}, false),
							material: Color.RED,
							width: 3,
							clampToGround: true, // 根据需求设置是否贴地
						},
					});
				}
			}
		}, ScreenSpaceEventType.LEFT_CLICK);

		// 移动鼠标动态绘制多边形
		drawPolygonHandler.setInputAction((click) => {
			const position = Earth.viewer.scene.pickPosition(click.endPosition);
			if (drawPolygonPoints.length === 1) {
				drawPolygonPoints.push(position);
			}
			if (drawPolygonPoints.length >= 2) {
				drawPolygonPoints[drawPolygonPoints.length - 1] = position;
			}
		}, ScreenSpaceEventType.MOUSE_MOVE);

		// 右键闭合多边形
		drawPolygonHandler.setInputAction((click) => {
			const position = Earth.viewer.scene.pickPosition(click.position);
			const point = new Entity({
				position: position,
				point: {
					color: Color.RED,
					pixelSize: 5,
					outlineColor: Color.WHITE,
					outlineWidth: 2,
				},
			})
			pointEntities.push(point)
			dataSource.entities.add(point);
			if (drawPolygonPoints.length >= 3) {
				drawPolygonPoints.push(position); // 闭合多边形
				drawPolygonTempEntity.polygon.hierarchy = drawPolygonTempEntity.polygon.hierarchy.getValue()
				drawPolygonTempEntity.polyline.positions = drawPolygonTempEntity.polyline.positions.getValue()
				historyManager.addHistory(new AddFeatureCommand(Earth, dataSource, drawPolygonTempEntity))
				drawPolygonTempEntity = null
				pointEntities.forEach(point => {
					dataSource.entities.remove(point)
				})
				drawPolygonTempEntity = null
				removeDrawPolygon()
				drawPolygon()
			} else {
				ElMessage.warning("请至少绘制三个点");
			}
		}, ScreenSpaceEventType.RIGHT_CLICK);
	};

	const removeDrawPolygon = () => {
		if (drawPolygonHandler) {
			drawPolygonHandler.removeInputAction(
				ScreenSpaceEventType.MOUSE_MOVE
			);
			drawPolygonHandler.removeInputAction(
				ScreenSpaceEventType.LEFT_CLICK
			);
			drawPolygonHandler.removeInputAction(
				ScreenSpaceEventType.RIGHT_CLICK
			);
			drawPolygonHandler = null;
		}
		if (drawPolygonTempEntity) {
			dataSource.entities.remove(drawPolygonTempEntity);
			drawPolygonTempEntity = null;
		}
		drawPolygonPoints = [];
		pointEntities = [];
	};

	return {
		drawPolygon,
		removeDrawPolygon,
	};
};

// 绘制矩形
const useDrawBox = (Earth, dataSource, historyManager) => {

	// 绘制矩形
	// 绘制多边形
	let startPos, tempRectangle, positions;
	let drawBoxHandler = null;
	const drawBox = () => {
		if (drawBoxHandler) return;
		drawBoxHandler = new ScreenSpaceEventHandler(Earth.viewer.scene.canvas);

		drawBoxHandler.setInputAction((click) => {
			startPos = Earth.viewer.scene.pickPosition(click.position);
			if (!startPos) return;

			// 动态绘制矩形
			drawBoxHandler.setInputAction((move) => {
				if (!startPos) return;
				const endPos = Earth.viewer.scene.pickPosition(move.endPosition);
				if (!endPos) return;

				// 计算矩形四角坐标
				const startCarto =
					Ellipsoid.WGS84.cartesianToCartographic(startPos);
				const endCarto =
					Ellipsoid.WGS84.cartesianToCartographic(endPos);
				const box = [
					new Cartographic(startCarto.longitude, startCarto.latitude),
					new Cartographic(endCarto.longitude, startCarto.latitude),
					new Cartographic(endCarto.longitude, endCarto.latitude),
					new Cartographic(startCarto.longitude, endCarto.latitude),
					new Cartographic(startCarto.longitude, startCarto.latitude),
				];
				positions = Cartesian3.fromRadiansArray(
					box.reduce((a, b) => a.concat(b.longitude, b.latitude), [])
				);

				// 更新临时矩形
				if (!tempRectangle) {
					tempRectangle = dataSource.entities.add({
						id: getDrawTempId(DRAW_TEMP_ID.BOX),
						polygon: {
							hierarchy: new CallbackProperty(() => {
								return new PolygonHierarchy(positions);
							}, false),
							material: Color.fromAlpha(Color.RED, 0.2),
							outline: true,
							clampToGround: true, // 根据需求设置是否贴地
						},
						polyline: {
							material: Color.RED,
							clampToGround: true, // 根据需求设置是否贴地
							positions: new CallbackProperty(() => {
								return positions;
							}, false),
							width: 3,
						},
					});
				}
			}, ScreenSpaceEventType.MOUSE_MOVE);

			// 点击确定最终矩形
			drawBoxHandler.setInputAction((click) => {
				if (!startPos || !positions) return
				tempRectangle.polygon.hierarchy = tempRectangle.polygon.hierarchy.getValue()
				tempRectangle.polyline.positions = tempRectangle.polyline.positions.getValue()
				historyManager.addHistory(new AddFeatureCommand(Earth, dataSource, tempRectangle))
				tempRectangle = null
				removeDrawBox()
				drawBox()
			}, ScreenSpaceEventType.LEFT_CLICK);
		}, ScreenSpaceEventType.LEFT_CLICK);
	};

	const removeDrawBox = () => {
		if (drawBoxHandler) {
			drawBoxHandler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
			drawBoxHandler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
			tempRectangle && dataSource.entities.remove(tempRectangle);
			drawBoxHandler = null;
			startPos = null;
			tempRectangle = null;
			positions = null;
		}
	};

	return {
		drawBox,
		removeDrawBox,
	};
};

// 绘制圆形
const useDrawCircle = (Earth, dataSource, historyManager) => {
	let center, radius, tempEntity, hierarchy;
	let drawCircleHandler = null;
	const drawCircle = () => {
		function calcPositionsDistance(...positions) {
			let distance = 0;
			for (let index = 0; index < positions.length - 1; index++) {
				const current = positions[index];
				const next = positions[index + 1];
				const geodesic = new EllipsoidGeodesic(current, next);
				const d = Math.sqrt(
					Math.pow(geodesic.surfaceDistance, 2) +
						Math.pow(next.height - current.height, 2)
				);
				distance += d;
			}
			return distance;
		}

		if (drawCircleHandler) return;
		drawCircleHandler = new ScreenSpaceEventHandler(Earth.viewer.scene.canvas);

		// 第一步：点击确定圆心
		drawCircleHandler.setInputAction((click) => {
			const position = Earth.viewer.scene.pickPosition(click.position);
			if (!position) return;
			center = Ellipsoid.WGS84.cartesianToCartographic(position);

			// 显示圆心
			tempEntity = dataSource.entities.add({
				id: getDrawTempId(DRAW_TEMP_ID.CIRCLE),
				position: position,
				point: { color: Color.RED, pixelSize: 5 },
			});

			// 第二步：移动鼠标动态绘制圆
			drawCircleHandler.removeInputAction(
				ScreenSpaceEventType.LEFT_CLICK
			);
			drawCircleHandler.setInputAction((move) => {
				if (!position || !center) return;
				const endPos = Earth.viewer.scene.pickPosition(move.endPosition);
				if (!endPos) return;
				const endCarto =
					Ellipsoid.WGS84.cartesianToCartographic(endPos);
				radius = calcPositionsDistance(center, endCarto);

				// 使用 turf.js 生成圆
				const circle = turfCircle(
					[
						CesiumMath.toDegrees(center.longitude),
						CesiumMath.toDegrees(center.latitude),
					],
					radius, // 转为公里
					{ steps: 64, units: "meters" }
				);
				hierarchy = Cartesian3.fromDegreesArray(
					circle.geometry.coordinates[0].flat()
				);

				// 更新临时圆
				if (!tempEntity.polygon) {
					tempEntity.polygon = {
						hierarchy: new CallbackProperty(() => {
							return new PolygonHierarchy(hierarchy);
						}, false),
						material: Color.fromAlpha(Color.RED, 0.2),
						outline: true,
						clampToGround: true, // 根据需求设置是否贴地
					};
				}
				if (!tempEntity.polyline) {
					tempEntity.polyline = {
						positions: new CallbackProperty(() => {
							return hierarchy;
						}, false),
						material: Color.RED,
						width: 3,
						clampToGround: true, // 根据需求设置是否贴地
					};
				}
			}, ScreenSpaceEventType.MOUSE_MOVE);

			// 第三步：点击确定半径
			drawCircleHandler.setInputAction((click) => {
				tempEntity.polygon.hierarchy = tempEntity.polygon.hierarchy.getValue()
				tempEntity.polyline.positions = tempEntity.polyline.positions.getValue()
				tempEntity.point = null
				tempEntity.position = null
				historyManager.addHistory(new AddFeatureCommand(Earth, dataSource, tempEntity))
				tempEntity = null
				removeDrawCircle()
				drawCircle()
			}, ScreenSpaceEventType.LEFT_CLICK);
		}, ScreenSpaceEventType.LEFT_CLICK);
	};

	const removeDrawCircle = () => {
		if (drawCircleHandler) {
			drawCircleHandler.removeInputAction(
				ScreenSpaceEventType.MOUSE_MOVE
			);
			drawCircleHandler.removeInputAction(
				ScreenSpaceEventType.LEFT_CLICK
			);
			tempEntity && dataSource.entities.remove(tempEntity);
			tempEntity = null;
			hierarchy = null;
			center = null;
			radius = null;
			drawCircleHandler = null;
		}
	};

	return {
		drawCircle,
		removeDrawCircle,
	};
};

export const useDraw = (Earth, dataSource, historyManager) => {

    const { drawPolygon, removeDrawPolygon } = useDrawPolygon(
		Earth,
		dataSource,
		historyManager
	);
	const { drawBox, removeDrawBox } = useDrawBox(Earth, dataSource, historyManager);
	const { drawCircle, removeDrawCircle } = useDrawCircle(Earth, dataSource, historyManager);

	const drawToolbar = [
		{
			group: "绘制",
			id: "drawPolygon",
			name: "多边形",
			action: () => {
				drawPolygon();
			},
			removeAction: () => {
				removeDrawPolygon();
			},
		},
		{
			group: "绘制",
			id: "drawBox",
			name: "矩形",
			action: () => {
				drawBox();
			},
			removeAction: () => {
				removeDrawBox();
			},
		},
		{
			group: "绘制",
			id: "drawCircle",
			name: "圆型",
			action: () => {
				drawCircle();
			},
			removeAction: () => {
				removeDrawCircle();
			},
		},
	];

	return {
		drawPolygon,
		removeDrawPolygon,
		drawBox,
		removeDrawBox,
		drawCircle,
		removeDrawCircle,
        drawToolbar
	};
};
