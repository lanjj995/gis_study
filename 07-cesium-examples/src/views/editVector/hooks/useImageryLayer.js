import { ImageryLayer, ImageryProvider, Rectangle, UrlTemplateImageryProvider } from "cesium"
import config from "@/config";

export const useImageryLayer = (Earth) => {
	// 加载底图
	const loadImage = (image) => {
		const urlImageryProvider = new UrlTemplateImageryProvider({
			url:
				config.API_URL +
				"/image/publish/get-image?bbox={westDegrees},{southDegrees},{eastDegrees},{northDegrees}&path=" +
				image.path,
			tileWidth: 256,
			tileHeight: 256,
			rectangle: Rectangle.fromDegrees(
				...image.imageInfo.bbox.split(",")
			),
		});
		const imageryLayer = new ImageryLayer(urlImageryProvider);
		imageryLayer.id = image.id;
		imageryLayer.sampleImageryLayer = true;
		Earth.viewer.imageryLayers.add(imageryLayer);
		return imageryLayer;
	};

	// 删除底图
	const removeOtherImageryLayers = (image) => {
		Earth.viewer.imageryLayers._layers.forEach((e) => {
			if (e.id !== image.id && e.sampleImageryLayer) {
				Earth.viewer.imageryLayers.remove(e);
			}
		});
	};

	// fit 底图
	const flyToImageryLayer = (imageryLayer) => {
		Earth.viewer.flyTo(imageryLayer, {
			duration: 0,
		});
	};

    const changeImageryLayer = (image) => {
        removeOtherImageryLayers(image)
        const imageryLayer = loadImage(image)
        flyToImageryLayer(imageryLayer)
    }
    
    return {
        changeImageryLayer
    }
    
};
