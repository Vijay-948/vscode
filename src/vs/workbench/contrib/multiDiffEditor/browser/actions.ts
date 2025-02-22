/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from 'vs/base/common/codicons';
import { URI } from 'vs/base/common/uri';
import { EditorContextKeys } from 'vs/editor/common/editorContextKeys';
import { localize2 } from 'vs/nls';
import { Action2, MenuId } from 'vs/platform/actions/common/actions';
import { ContextKeyExpr } from 'vs/platform/contextkey/common/contextkey';
import { ServicesAccessor } from 'vs/platform/instantiation/common/instantiation';
import { MultiDiffEditor } from 'vs/workbench/contrib/multiDiffEditor/browser/multiDiffEditor';
import { MultiDiffEditorInput } from 'vs/workbench/contrib/multiDiffEditor/browser/multiDiffEditorInput';
import { IEditorService } from 'vs/workbench/services/editor/common/editorService';

export class GoToFileAction extends Action2 {
	constructor() {
		super({
			id: 'multiDiffEditor.goToFile',
			title: localize2('goToFile', 'Open File'),
			icon: Codicon.goToFile,
			precondition: EditorContextKeys.inMultiDiffEditor,
			menu: {
				when: EditorContextKeys.inMultiDiffEditor,
				id: MenuId.MultiDiffEditorFileToolbar,
				order: 22,
				group: 'navigation',
			},
		});
	}

	run(accessor: ServicesAccessor, ...args: any[]): void {
		const uri = args[0] as URI;
		const editorService = accessor.get(IEditorService);
		editorService.openEditor({ resource: uri });
	}
}

export class CollapseAllAction extends Action2 {
	constructor() {
		super({
			id: 'multiDiffEditor.collapseAll',
			title: localize2('collapseAllDiffs', 'Collapse All Diffs'),
			icon: Codicon.collapseAll,
			precondition: ContextKeyExpr.and(ContextKeyExpr.equals('activeEditor', MultiDiffEditor.ID), ContextKeyExpr.not('multiDiffEditorAllCollapsed')),
			menu: {
				when: ContextKeyExpr.and(ContextKeyExpr.equals('activeEditor', MultiDiffEditor.ID), ContextKeyExpr.not('multiDiffEditorAllCollapsed')),
				id: MenuId.EditorTitle,
				group: 'navigation',
			},
			f1: true,
		});
	}

	async run(accessor: ServicesAccessor, ...args: any[]): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const activeEditor = editorService.activeEditor;

		if (activeEditor instanceof MultiDiffEditorInput) {
			const viewModel = await activeEditor.getViewModel();
			viewModel.collapseAll();
		}
	}
}

export class ExpandAllAction extends Action2 {
	constructor() {
		super({
			id: 'multiDiffEditor.expandAll',
			title: localize2('ExpandAllDiffs', 'Expand All Diffs'),
			icon: Codicon.expandAll,
			precondition: ContextKeyExpr.and(ContextKeyExpr.equals('activeEditor', MultiDiffEditor.ID), ContextKeyExpr.has('multiDiffEditorAllCollapsed')),
			menu: {
				when: ContextKeyExpr.and(ContextKeyExpr.equals('activeEditor', MultiDiffEditor.ID), ContextKeyExpr.has('multiDiffEditorAllCollapsed')),
				id: MenuId.EditorTitle,
				group: 'navigation',
			},
			f1: true,
		});
	}

	async run(accessor: ServicesAccessor, ...args: any[]): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const activeEditor = editorService.activeEditor;

		if (activeEditor instanceof MultiDiffEditorInput) {
			const viewModel = await activeEditor.getViewModel();
			viewModel.expandAll();
		}
	}
}
