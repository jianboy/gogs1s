/**
 * @file extension entry
 * @author netcon
 */

import * as vscode from 'vscode';
import { Gogs1sFS } from './gogs1sfs';
import { SettingsView } from './settings-view';
import { setExtensionContext } from './util';
import { commandUpdateToken, commandValidateToken, commandClearToken, commandSwitchBranch, commandSwitchTag, commandGetCurrentAuthority } from './commands';

export function activate(context: vscode.ExtensionContext) {
	setExtensionContext(context);
	context.subscriptions.push(new Gogs1sFS());

	context.subscriptions.push(vscode.window.registerWebviewViewProvider(SettingsView.viewType, new SettingsView()));

	context.subscriptions.push(vscode.commands.registerCommand('gogs1s.validate-token', commandValidateToken));
	context.subscriptions.push(vscode.commands.registerCommand('gogs1s.update-token', commandUpdateToken));
	context.subscriptions.push(vscode.commands.registerCommand('gogs1s.clear-token', commandClearToken));
	context.subscriptions.push(vscode.commands.registerCommand('gogs1s.get-current-authority', commandGetCurrentAuthority));
	context.subscriptions.push(vscode.commands.registerCommand('gogs1s.switch-branch', commandSwitchBranch));
	context.subscriptions.push(vscode.commands.registerCommand('gogs1s.switch-tag', commandSwitchTag));
}
