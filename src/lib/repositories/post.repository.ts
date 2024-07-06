import prisma from '$lib/database/prisma';
import type { Post, PrismaClient } from '@prisma/client';

export class PostRepository {
	constructor(private prisma: PrismaClient) {}

	async getPosts(size: number, lastId?: number): Promise<Post[]> {
		if (lastId) {
			return this.prisma.post.findMany({ where: { id: { lt: lastId } }, take: size });
		} else {
			return this.prisma.post.findMany({ take: size });
		}
	}

	async getPost(id: number): Promise<Post | null> {
		return this.prisma.post.findFirst({ where: { id: id } });
	}

	async createPost(title: string, content: string, userId: number): Promise<Post> {
		return this.prisma.post.create({
			data: {
				title: title,
				content: content,
				userId: userId
			}
		});
	}
}

const postRepository = new PostRepository(prisma);
export default postRepository;
