import { ref, computed } from "vue";

export const useHistory = (Earth) => {
	const undoStack = ref([]);
	const redoStack = ref([]);

	const isAbleUndo = computed(() => {
		return undoStack.value.length > 0;
	});

	const isAbleRedo = computed(() => {
		return redoStack.value.length > 0;
	});

	const isDisableUndo = computed(() => {
		return !isAbleUndo.value;
	});
	
	const isDisableRedo = computed(() => {
		return !isAbleRedo.value;
	});

	const undo = () => {
		const command = undoStack.value.pop()
		command.undo()
		redoStack.value.push(command)
	};

	const redo = () => {
		const command = redoStack.value.pop()
		command.execute()
		undoStack.value.push(command)
	};

	const addHistory = (command) => {
		undoStack.value.push(command);
		redoStack.value = [];
	};

	const clearHistory = () => {
		undoStack.value = [];
		redoStack.value = [];
	};

	const historyManager = {
		undo,
		redo,
		addHistory,
		clearHistory,
	};

	const toolbar = ref([
		{
			group: "撤回、恢复",
			id: "undo",
			name: "撤回",
            disable: isDisableUndo,
			action: () => {
				undo()
			},
			removeAction: () => {},
		},
		{
			group: "撤回、恢复",
			id: "redo",
			name: "恢复",
            disable: isDisableRedo,
			action: () => {
				redo()
			},
			removeAction: () => {},
		},
	])

	return {
		isAbleUndo,
		isAbleRedo,
		historyManager,
        toolbar
	};
};
