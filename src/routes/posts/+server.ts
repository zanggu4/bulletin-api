import postRepository from '$lib/repositories/post.repository';
import authService from '$lib/services/auth.service.js';
import { AuthenticationErrorCodes, ValidationErrorCodes } from '$lib/utils/api-error-codes.js';
import { failure, success } from '$lib/utils/api-response.js';
import type { Post } from '@prisma/client';

export const GET = async ({ url }) => {
	const size = 20;
	const lastId: number = Number(url.searchParams.get('lastId'));
	let posts: Post[];
	if (lastId == 0) {
		posts = await postRepository.getPosts(size);
	} else {
		posts = await postRepository.getPosts(size, lastId);
	}
	return success({ data: posts });
};

export const POST = async ({ request }) => {
	const params = await request.json();
	const title = params['title'];
	const content = params['content'];

	if (!title || title.length <= 0) {
		return failure({
			code: ValidationErrorCodes.TITLE_REQUIRED,
			message: '제목을 입력해주세요'
		});
	} else if (!content || content.length <= 0) {
		return failure({
			code: ValidationErrorCodes.CONTENT_REQUIRED,
			message: '내용을 입력해주세요'
		});
	}

	// Remove Bearer prefix
	const tokenTexts = request.headers.get('Authorization')?.split(' ') ?? [];
	let token: string | null;
	if (tokenTexts.length == 2 && tokenTexts[0] == 'Bearer') {
		token = tokenTexts[1];
	} else {
		token = null;
	}

	const userId = await authService.userId(token ?? undefined);
	if (!userId) {
		return failure({
			statusCode: 401,
			code: AuthenticationErrorCodes.LOGIN_REQUIRED,
			message: '로그인이 필요합니다'
		});
	}

	const post = await postRepository.createPost(title, content, userId);
	return success({ statusCode: 201, data: post });
};
