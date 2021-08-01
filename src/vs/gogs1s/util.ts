/**
 * @file github1s common utils
 * @autor netcon
 */
// http://code.git.yoqi.me/lyq/hosts.deny
export const getBrowserUrl = (): string => {
	return window.location.href;
};

export const replaceBrowserUrl = (url: string) => {
	if (window.history.replaceState) {
		window.history.replaceState(null, '', url);
	}
};
