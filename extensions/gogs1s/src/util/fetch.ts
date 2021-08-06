/**
 * @file github1s fetch api
 * @author netcon
 */

import * as vscode from 'vscode';
import { throttle } from './func';
import { getExtensionContext } from './context';

const getGitHubAuthToken = (): string => {
	const context = getExtensionContext();
	return context?.globalState.get('gogs-oauth-token') || '8bc0feea4ad91b28a9df5645c00f4235b77b4afa';
};

export class RequestError extends Error {
	constructor(message: string, public token: string) {
		super(message);
		if (typeof (<any>Object).setPrototypeOf === 'function') {
			(<any>Object).setPrototypeOf(this, RequestError.prototype);
		}
	}
}

export class RequestNotFoundError extends RequestError {
	constructor(message: string, token: string) {
		super(message, token);
		if (typeof (<any>Object).setPrototypeOf === 'function') {
			(<any>Object).setPrototypeOf(this, RequestNotFoundError.prototype);
		}
	}
}

export class RequestRateLimitError extends RequestError {
	constructor(message: string, token: string) {
		super(message, token);
		if (typeof (<any>Object).setPrototypeOf === 'function') {
			(<any>Object).setPrototypeOf(this, RequestRateLimitError.prototype);
		}
	}
}

export class RequestInvalidTokenError extends RequestError {
	constructor(message: string, token: string) {
		super(message, token);
		if (typeof (<any>Object).setPrototypeOf === 'function') {
			(<any>Object).setPrototypeOf(this, RequestInvalidTokenError.prototype);
		}
	}
}

// only report network error once in 5 seconds
export const throttledReportNetworkError = throttle(() => vscode.window.showErrorMessage('Request Failed, Maybe an Network Error'), 5000);

// 设置get请求，带上header
export const fetch = (url: string, options?: RequestInit) => {
	const token = getGitHubAuthToken();
	const authHeaders = token ? { Authorization: `token ${token}` } : {};
	const customHeaders = (options && 'headers' in options ? options.headers : {});

	return self.fetch(url, { mode: 'cors', ...options, headers: { ...authHeaders, ...customHeaders } })
		.catch(() => {
			throttledReportNetworkError();
			throw new RequestError('Request Failed, Maybe an Network Error', token);
		})
		.then(response => {
			if (response.status < 400) {
				return response.json();
			}
			if (response.status === 403) {
				return response.json().then(data => { throw new RequestRateLimitError(data.message, token); });
			}
			if (response.status === 401) {
				return response.json().then(data => { throw new RequestInvalidTokenError(data.message, token); });
			}
			if (response.status === 404) {
				throw new RequestNotFoundError('Not Found', token);
			}
			throw new RequestError(`Gogs1s: Request got HTTP ${response.status} response`, token);
		});
};
