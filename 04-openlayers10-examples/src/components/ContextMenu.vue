<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'

const props = defineProps({
  menuList: {
    type: Array,
    default: () => ([])
  },
  parentElement: {
    type: HTMLElement,
    default: document.body
  },
  beforeShowContextMenu: {
    type: Function,
    default: () => {
      return () => true
    }
  }
})

const emit = defineEmits(['command'])

const visible = ref(false)
const width = 130
const itemHeight = 40
const padding = 5

const contextMenuStyle = reactive({
  width: width + 'px',
  paddingTop: padding + 'px',
  paddingBottom: padding + 'px',
  transform: 'translate(0, 0)'
})

const onContextMenu = (event) => {
  event.preventDefault();
  
  const isContinue = props.beforeShowContextMenu(event)

  if (!isContinue) {
    visible.value = false;
    return
  }

  const position = calcContextMenuPosition();

  contextMenuStyle.transform = `translate(${position.x}px, ${position.y}px)`

  visible.value = true

  function calcContextMenuPosition() {
    const parentRect = props.parentElement.getBoundingClientRect();
    const contextMenuWidth = width;
    const contextMenuHeight = itemHeight * props.menuList.length + padding * 2;
    let x = event.clientX - parentRect.x;
    let y = event.clientY - parentRect.y;
    if (x + contextMenuWidth > parentRect.width) {
      x = x - contextMenuWidth;
    }
    if (y + contextMenuHeight > parentRect.height) {
      y = y - contextMenuHeight
    }
    return { x, y }
  }
}
const onClickOther = () => {
  visible.value = false;
}

const initListener = () => {
  props.parentElement.addEventListener('contextmenu', onContextMenu)
  document.addEventListener('mousedown', onClickOther)
}
onMounted(initListener)

const removeListener = () => {
  props.parentElement.removeEventListener('contextmenu', onContextMenu)
  document.removeEventListener('mousedown', onClickOther)
}
onUnmounted(removeListener)


const onCommand = (item) => {
  console.log(`onCommand---`, item)
  emit('command', item.command)
  visible.value = false
}
</script>

<template>
  <ul v-if="visible" class="context-menu" :style="contextMenuStyle" @mousedown.stop.prevent>
    <li v-for="item in menuList" :key="item.command" class="context-menu-item" @click.stop="onCommand(item)">
      <el-icon size="14">
        <component :is="item.icon" />
      </el-icon>
      <span>{{ item.text }}</span>
    </li>
  </ul>
</template>

<style scoped>

.context-menu {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 4px;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.6);
  list-style: none;
  padding: 0;
  margin: 0;
  color: #fff;
}

.context-menu-item {
  height: 40px;
  padding: 0 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #fff;
}

.context-menu-item .el-icon{
  margin-right: 4px;
}

.context-menu-item:hover {
  background-color: var(--el-color-primary);
}
</style>