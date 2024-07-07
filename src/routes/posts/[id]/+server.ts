import postRepository from '$lib/repositories/post.repository';
import { PostErrorCodes } from '$lib/utils/api-error-codes';
import { failure, success } from '$lib/utils/api-response.js';

export const GET = async ({ params }) => {
	const id = Number(params.id);
	const post = await postRepository.getPost(id);
	if (post) {
		return success({ data: post });
	}
	return failure({
		statusCode: 404,
		code: PostErrorCodes.NOT_FOUND,
		message: '게시물이 존재하지 않습니다.'
	});
};
