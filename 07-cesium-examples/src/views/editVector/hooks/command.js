
class Command {

	execute() {
		throw new Error("execute method must be implemented");
	}

	undo() {
		throw new Error("undo method must be implemented");
	}
}

// 添加操作
export class AddFeatureCommand extends Command {
	constructor(Earth, dataSource, entity) {
		super()
		this.Earth = Earth
		this.dataSource = dataSource
		this.entity = entity
	}

	execute() {
		this.dataSource.entities.add(this.entity)
	}

	undo() {
		this.dataSource.entities.remove(this.entity)
	}
}

// 删除操作
export class RemoveFeatureCommand extends Command {}

// 移动操作
export class MoveFeatureCommand extends Command {}

// 合并操作
export class MergeFeatureCommand extends Command {}

// 切分
export class SplitFeatureCommand extends Command {}

// 编辑
export class EditFeatureCommand extends Command {}
