/**
 * @file github1s commands
 * @author netcon
 */

import * as vscode from 'vscode';
import { getExtensionContext, getRepositoryBranches, getRepositoryTags, getCurrentRef, getCurrentAuthority, changeCurrentRef } from './util';
import { validateToken } from './api';

export const commandValidateToken = (silent: boolean = false) => {
	const context = getExtensionContext();
	const oAuthToken = context.globalState.get('gogs-oauth-token') as string || '8bc0feea4ad91b28a9df5645c00f4235b77b4afa';
	return validateToken(oAuthToken).then(tokenStatus => {
		if (!silent) {
			const remaining = tokenStatus.remaining;
			if (!oAuthToken) {
				if (remaining > 0) {
					vscode.window.showWarningMessage(`You haven\'t set a OAuth Token yet, and you can have ${remaining} requests in the current rate limit window.`);
				} else {
					vscode.window.showWarningMessage('You haven\'t set a OAuth Token yet, and the rate limit is exceeded.');
				}
			} else if (!tokenStatus.valid) {
				vscode.window.showErrorMessage('Current OAuth Token is invalid.');
			} else if (tokenStatus.valid && tokenStatus.remaining > 0) {
				vscode.window.showInformationMessage(`Current OAuth Token is OK, and you can have ${remaining} requests in the current rate limit window.`);
			} else if (tokenStatus.valid && tokenStatus.remaining <= 0) {
				vscode.window.showWarningMessage('Current OAuth Token is Valid, but the rate limit is exceeded.');
			}
		}
		return tokenStatus;
	});
};

export const commandUpdateToken = (silent: boolean = false) => {
	return vscode.window.showInputBox({
		placeHolder: 'Please input the OAuth Token',
	}).then(token => {
		if (!token) {
			return;
		}
		return getExtensionContext()!.globalState.update('gogs-oauth-token', token || '8bc0feea4ad91b28a9df5645c00f4235b77b4afa').then(() => {
			// we don't need wait validate, so we don't `return`
			vscode.window.showWarningMessage('OAuth Token have updated.');
		});
	});
};

export const commandClearToken = (silent: boolean = false) => {
	return vscode.window.showWarningMessage('Would you want to clear the saved OAuth Token?', { modal: true }, 'Confirm').then(choose => {
		if (choose === 'Confirm') {
			return getExtensionContext()!.globalState.update('gogs-oauth-token', '').then(() => {
				!silent && vscode.window.showInformationMessage('You have cleared the saved OAuth Token.');
			}).then(() => true);
		}
		return false;
	});
};

export const commandGetCurrentAuthority = (): Promise<string> => getCurrentAuthority();
//状态栏切换分支，调用查询所有分支
export const commandSwitchBranch = () => {
	return Promise.all([getRepositoryBranches(), getCurrentRef()]).then(([repositoryBranches, currentRef]) => (
		vscode.window.showQuickPick(repositoryBranches.map(item => item.name), { placeHolder: currentRef }).then((newRef: string) => {
			return newRef && changeCurrentRef(newRef).then((newRef) => {
				vscode.window.showInformationMessage(`Switch to branch: ${newRef}`);
			});
		})
	));
};

export const commandSwitchTag = () => {
	return Promise.all([getRepositoryTags(), getCurrentRef()]).then(([repositoryBranches, currentRef]) => (
		vscode.window.showQuickPick(repositoryBranches.map(item => item.name), { placeHolder: currentRef }).then((newRef: string) => {
			return newRef && changeCurrentRef(newRef).then((newRef) => {
				vscode.window.showInformationMessage(`Switch to branch: ${newRef}`);
			});
		})
	));
};
// 切换 ref 命令，代替切换 branch 和 tags
export const commandCheckoutRef = async () => {
	const [branchRefs, tagRefs] = await Promise.all([
		getRepositoryBranches(),
		getRepositoryTags(),
	]);
	const branchPickerItems: vscode.QuickPickItem[] = branchRefs.map(
		(branchRef) => ({
			label: branchRef.name,
			description: (branchRef.commit?.id || '').slice(0, 8),
		})
	);
	const tagPickerItems: vscode.QuickPickItem[] = tagRefs.map((tagRef) => ({
		label: tagRef.name,
		description: `Tag at ${(tagRef.body)}`,
	}));

	const quickPick = vscode.window.createQuickPick();
	const [owner, repo, ref] = await getCurrentAuthority().split('+');
	quickPick.placeholder = ref;
	quickPick.items = [...branchPickerItems, ...tagPickerItems];

	quickPick.show();
	const choice = await new Promise<vscode.QuickPickItem | undefined>(
		(resolve) => quickPick.onDidAccept(() => resolve(quickPick.activeItems[0]))
	);
	quickPick.hide();
	
	var newRef = choice?.label || quickPick.value;
	return newRef && changeCurrentRef(newRef).then((newRef) => {
		vscode.window.showInformationMessage(`Checkout to: ${newRef}`);
	});
}