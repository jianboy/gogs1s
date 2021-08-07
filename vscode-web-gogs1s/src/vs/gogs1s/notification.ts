/**
 * @file github1s notification
 * @author netcon
 */

import 'vs/css!./notification';

const NOTIFICATION_STORAGE_KEY = 'GOGS1S_NOTIFICATION';
// change it if a new notification should be shown
const NOTIFICATION_STORAGE_VALUE = '20210801';

const notification = {
	title: 'ATTENTION: This page is officially provided by liuyuqi.gov@msn.cn.',
	content: 'Gogs1s is an open source project, which is officially provided by liuyuqi.gov@msn.cn.',
	link: 'https://github.com/jianboy/gogs1s',
};

const notificationHtml = `
<div class="notification-main">
	<div class="notification-title">${notification.title}</div>
	<div class="notification-content">
		${notification.content}
		<a class="notification-link" href="${notification.link}" target="_blank">See more</a>
	</div>
</div>
<div class="notification-footer">
	<button class="notification-confirm-button">I know</button>
	<div class="notification-show-me-again">
		<input type="checkbox" checked>Don't show me again</div>
	</div>
</div>
`;

export const renderNotification = () => {
	// if user has confirm the notification and check `don't show me again`, ignore it
	if (!window.localStorage || window.localStorage.getItem(NOTIFICATION_STORAGE_KEY) === NOTIFICATION_STORAGE_VALUE) {
		return;
	}

	const notificationElement = <HTMLDivElement>document.createElement('div');
	notificationElement.classList.add('gogs1s-notification');//增加样式，notification.css class定位
	notificationElement.innerHTML = notificationHtml;
	document.body.appendChild(notificationElement);

	(<HTMLButtonElement>notificationElement.querySelector('.notification-confirm-button'))!.onclick = () => {
		const notShowMeAgain = !!((<HTMLInputElement>notificationElement.querySelector('.notification-show-me-again input'))!.checked);
		if (notShowMeAgain) {
			window.localStorage.setItem(NOTIFICATION_STORAGE_KEY, NOTIFICATION_STORAGE_VALUE);
		}
		document.body.removeChild(notificationElement);
	};
};
