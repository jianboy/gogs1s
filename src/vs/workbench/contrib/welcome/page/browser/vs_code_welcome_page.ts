/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { escape } from 'vs/base/common/strings';
import { localize } from 'vs/nls';

export default () => `
<div class="welcomePageContainer">
	<div class="welcomePage" role="document">
		<div class="title">
			<h1 class="caption">${escape(localize('welcomePage.vscode', "Visual Studio Code"))}</h1>
			<p class="subtitle detail">
				One second to read GitHub code with VS Code
			</p>
		</div>
		<div class="row">
			<div class="splash">
				<div class="section help">
					<h2 class="caption">${escape(localize('welcomePage.help', "Help"))}</h2>
					<ul>
						<li><a href="https://git.yoqi.me" target="_blank">git.yoqi.me</a></li>
						<li><a href="https://github.com/microsoft/vscode" target="_blank">VS Code Repository</a></li>
						<li><a href="https://project.yoqi.me" target="_blank">Zhizhou project</a></li>
					</ul>
				</div>
				<p class="showOnStartup"><input type="checkbox" id="showOnStartup" class="checkbox"> <label class="caption" for="showOnStartup">${escape(localize('welcomePage.showOnStartup', "Show welcome page on startup"))}</label></p>
			</div>
			<div class="commands">
				<div class="section authentication">
				<h2 class="caption">Authentication</h2>
				<div class="list">
					<div class="item"><button class="update-oauth-token"><h3 class="caption">Update OAuth Token</h3><span class="detail">Use a <a href="https://git.yoqi.me/user/settings/applications" target="_blank">OAuth token</a> to increase your rate limit</span></button></div>
					<div class="item"><button class="create-new-token"><h3 class="caption">Create New Token</h3><span class="detail">Create a new Token from your GitHub Account</span></button></div>
					<div class="item"><button class="clear-oauth-token"><h3 class="caption">Clear Saved Token</h3><span class="detail">Clear the saved GitHub OAuth Token for security</span></button></div>
				</div>
				</div>
				<div class="section learn">
					<h2 class="caption">${escape(localize('welcomePage.learn', "Learn"))}</h2>
					<div class="list">
						<div class="item showCommands"><button data-href="command:workbench.action.showCommands"><h3 class="caption">${escape(localize('welcomePage.showCommands', "Find and run all commands"))}</h3> <span class="detail">${escape(localize('welcomePage.showCommandsDescription', "Rapidly access and search commands from the Command Palette ({0})")).replace('{0}', '<span class="shortcut" data-command="workbench.action.showCommands"></span>')}</span></button></div>
						<div class="item showInterfaceOverview"><button data-href="command:workbench.action.showInterfaceOverview"><h3 class="caption">${escape(localize('welcomePage.interfaceOverview', "Interface overview"))}</h3> <span class="detail">${escape(localize('welcomePage.interfaceOverviewDescription', "Get a visual overlay highlighting the major components of the UI"))}</span></button></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
`;
