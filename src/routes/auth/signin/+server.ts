import loginService from '$lib/services/login.service.js';
import { failure, success } from '$lib/utils/api-response';
import { AuthenticationErrorCodes, ValidationErrorCodes } from '$lib/utils/api-error-codes.js';

export const POST = async ({ request }) => {
	const params = await request.json();
	const username = params['username'];
	const password = params['password'];

	if (!username || username.length <= 0) {
		return failure({
			code: ValidationErrorCodes.USERNAME_REQUIRED,
			message: '아이디를 입력해주세요'
		});
	} else if (!password || password.length <= 0) {
		return failure({
			code: ValidationErrorCodes.PASSWORD_REQUIRED,
			message: '비밀번호를 입력해주세요'
		});
	}

	try {
		const result = await loginService.loginOrThrow(username, password);
		return success({ data: result });
	} catch {
		return failure({
			statusCode: 400,
			code: AuthenticationErrorCodes.INVALID_CREDENTIALS,
			message: '일치하는 계정이 없습니다.'
		});
	}
};
