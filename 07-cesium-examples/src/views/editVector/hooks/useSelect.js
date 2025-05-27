import {
    Entity,
    ScreenSpaceEventHandler,
    ScreenSpaceEventType,
    defined,
    Color,
} from 'cesium'
import { ref } from 'vue'

export const useSelect = (Earth, dataSource) => {
    const selectedEntities = ref([])

    const startSelect = () => {
        const handler = new ScreenSpaceEventHandler(Earth.viewer.scene.canvas)
        handler.setInputAction((click) => {
            const pick = Earth.viewer.scene.pick(click.position)
            if (pick && pick instanceof Entity && dataSource.entities.contains(pick)) {
                addSelectedEntities([pick])
            }
        }, ScreenSpaceEventType.LEFT_CLICK)
    }

    const addSelectedEntities = (entities) => {
        entities.forEach(entity => {
            entity.polyline.material = Color.YELLOW
        })
        selectedEntities.value.push(...entities)
    }

    const removeSelectedEntities = (entities) => {
        entities.forEach(entity => {
            entity.polyline.material = Color.RED
        })
        selectedEntities.value = selectedEntities.value.filter(entity => !entities.includes(entity))
    }

    const removeSelect = () => {
        
    }

    const selectToolbar = [
        {
            group: '1',
            id: 'select',
            name: '选择',
            action: () => {
                startSelect()
            },
            removeAction: () => {
                removeSelect()
            }
        },
    ]

    return {
        selectToolbar,
        addSelectedEntities,
        removeSelectedEntities,
    }
}