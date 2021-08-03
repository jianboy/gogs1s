/**
 * @file GitHub1s APIs
 * @author netcon
 */

import * as vscode from 'vscode';
// import { getBranches } from './github-api-gql';
import { hasValidToken } from './util';
import { fetch, RequestError, RequestRateLimitError, RequestInvalidTokenError, RequestNotFoundError, throttledReportNetworkError } from './util/fetch';

// TODO: GraphQL API is experimental now, we need more test.
// It maybe crash or slow when there are too many files in one directory.
// For example the repository `git/git`, the TTFB cost about 3 seconds,
// and the response body size exceed 7MB before zip
export const ENABLE_GRAPHQL: boolean = false;

export interface UriState {
	owner: string;
	repo: string;
	path: string;
}

export const isGraphQLEnabled = () => {
	return hasValidToken() && ENABLE_GRAPHQL;
};

const handleRequestError = (error: RequestError) => {
	if (error instanceof RequestRateLimitError) {
		if (!error.token) {
			throw vscode.FileSystemError.NoPermissions('API Rate Limit Exceeded, Please Offer an OAuth Token.');
		}
		throw vscode.FileSystemError.NoPermissions('API Rate Limit Exceeded, Please Change Another OAuth Token.');
	}
	if (error instanceof RequestInvalidTokenError) {
		throw vscode.FileSystemError.NoPermissions('Current OAuth Token Is Invalid, Please Change Another One.');
	}
	if (error instanceof RequestNotFoundError) {
		throw vscode.FileSystemError.NoPermissions('Current OAuth Token Is Invalid, Please Change Another One.');
	}
	if (error instanceof RequestNotFoundError) {
		throw vscode.FileSystemError.FileNotFound('GitHub Resource Not Found');
	}
	throw vscode.FileSystemError.Unavailable(error.message || 'Unknown Error Occurred When Request To GitHub');
};
//目录和文件同一个接口，目录返回list，接口返回object
export const readGitHubDirectory = (owner: string, repo: string, ref: string, path: string) => {
	return fetch(`https://git.yoqi.me/api/v1/repos/${owner}/${repo}/git/trees/${ref}`).catch(handleRequestError);
};

export const readGitHubFile = (owner: string, repo: string, ref: string, path: string) => {
	let url = "";
	if (path == null || path == "/") {
		url = `https://git.yoqi.me/api/v1/repos/${owner}/${repo}/contents?ref=${ref}`;
	} else {
		url = `https://git.yoqi.me/api/v1/repos/${owner}/${repo}/contents/${path.replace(/^\//, ':')}?ref=${ref}`;
	}
	return fetch(url).catch(handleRequestError);
};
//没有这个接口
export const validateToken = (token: string) => {
	return {
		token: token,
		valid: true,
		limit: 0,
		remaining: 0,
		reset: 0
	};
};

export const getGithubBranches = (owner: string, repo: string) => {
	return fetch(`https://git.yoqi.me/api/v1/repos/${owner}/${repo}/branches`)
		.then(branches => {
			return branches;
		})
		.catch(handleRequestError);
};
// 暂时没有tags接口
export const getGithubTags = (owner: string, repo: string) => {
	return fetch(`https://git.yoqi.me/api/v1/repos/${owner}/${repo}/tags`)
		.then(tags => {
			return tags;
		})
		.catch(handleRequestError);
};
// GET /repos/:owner/:repo/git/trees/:sha
export const getGithubAllFiles = (owner: string, repo: string, ref: string, path: string = '/') => {
	return fetch(`https://git.yoqi.me/api/v1/repos/${owner}/${repo}/git/trees/${ref}${path.replace(/^\//, ':')}?recursive=1`)
		.catch(handleRequestError);
};

// export const getGitHubBranches = (owner: string, repo: string) => {
// 	if (isGraphQLEnabled()) {
// 		return getBranches(owner, repo);
// 	}
// 	return getGithubBranches(owner, repo);
// };
