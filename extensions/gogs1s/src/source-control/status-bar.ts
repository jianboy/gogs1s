/**
 * @file checkout to another ref in status bar
 * @author netcon
 */

import * as vscode from 'vscode';
import { getCurrentRef } from '../util';

export const updateCheckoutRefOnStatusBar = (() => {
    const checkoutItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        100
    );
    return async () => {
        const ref =await getCurrentRef();
        checkoutItem.text = `$(git-branch) ${ref}`;
        checkoutItem.tooltip = `Checkout branch/tag/commit...`;
        checkoutItem.command = `gogs1s.checkout-ref`;
        checkoutItem.show();
    };
})();
