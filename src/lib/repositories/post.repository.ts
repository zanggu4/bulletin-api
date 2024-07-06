import prisma from '$lib/database/prisma';
import type { Post, PrismaClient } from '@prisma/client';

export class PostRepository {
	constructor(private prisma: PrismaClient) {}

	private commonInclude() {
		return {
			user: {
				select: {
					username: true,
					profile: {
						select: {
							name: true
						}
					}
				}
			}
		};
	}

	async getPosts(size: number, lastId?: number): Promise<Post[]> {
		if (lastId) {
			return this.prisma.post.findMany({
				include: this.commonInclude(),
				where: { id: { lt: lastId } },
				orderBy: [{ id: 'desc' }],
				take: size
			});
		} else {
			return this.prisma.post.findMany({
				include: this.commonInclude(),
				orderBy: [{ id: 'desc' }],
				take: size
			});
		}
	}

	async getPost(id: number): Promise<Post | null> {
		return this.prisma.post.findFirst({
			include: this.commonInclude(),
			where: { id: id }
		});
	}

	async createPost(title: string, content: string, userId: number): Promise<Post> {
		return this.prisma.post.create({
			include: this.commonInclude(),
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
