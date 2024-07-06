import loginService from '$lib/services/login.service.js';
import { failure, success } from '$lib/utils/api-response';
import {
	AuthenticationErrorCodes,
	DuplicationErrorCodes,
	ServerErrorCodes,
	ValidationErrorCodes
} from '$lib/utils/api-error-codes.js';
import userRepository from '$lib/repositories/user.repository.js';

export const POST = async ({ request }) => {
	const params = await request.json();
	const username = params['username'];
	const email = params['email'];
	const password = params['password'];
	const name = params['name'];

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
	} else if (!email || email.length <= 0) {
		return failure({
			code: ValidationErrorCodes.EMAIL_REQUIRED,
			message: '이메일을 입력해주세요'
		});
	} else if (!name || name.length <= 0) {
		return failure({
			code: ValidationErrorCodes.NAME_REQUIRED,
			message: '이름을 입력해주세요'
		});
	}

	try {
		if (await userRepository.getUser(username)) {
			return failure({
				code: DuplicationErrorCodes.USERNAME_EXISTS,
				message: '이미 존재하는 계정입니다.'
			});
		}
		const result = await userRepository.createUser(username, name, email, password);
		return success({ data: result });
	} catch {
		return failure({
			code: ServerErrorCodes.INTERNAL_SERVER_ERROR,
			message: '에러가 발생했습니다.'
		});
	}
};
