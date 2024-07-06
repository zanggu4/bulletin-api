import type { ApiErrorCode, ValidationErrorCodes } from './api-error-codes';

export interface ApiResponse {
	status: 'success' | 'error';
	message: string;
	data?: any;
	error?: ApiError;
}

export interface ApiError {
	code: ApiErrorCode;
	details?: any;
}

export function success({
	statusCode = 200,
	message,
	data
}: {
	statusCode?: number;
	message?: string;
	data?: any;
}): Response {
	const successResponse: ApiResponse = {
		status: 'success',
		message: message ?? 'success',
		data: data
	};
	return newResponse(successResponse, statusCode);
}

export function failure({
	statusCode = 400,
	code,
	message,
	details
}: {
	statusCode?: number;
	code: ApiErrorCode;
	message: string;
	details?: any;
}): Response {
	const failureResponse: ApiResponse = {
		status: 'error',
		message: message,
		error: {
			code: code,
			details: details
		}
	};
	return newResponse(failureResponse, statusCode);
}

function newResponse(body: any, statusCode: number): Response {
	return new Response(JSON.stringify(body), {
		headers: {
			'Content-Type': 'application/json'
		},
		status: statusCode
	});
}
