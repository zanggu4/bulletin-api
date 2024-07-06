import prisma from '$lib/database/prisma';
import { hashPassword } from '$lib/password/password-manager';
import type { PrismaClient, User } from '@prisma/client';

export class UserRepository {
	constructor(private prisma: PrismaClient) {}

	async getUser(username: string): Promise<User> {
		return this.prisma.user.findFirstOrThrow({ where: { username: username } });
	}

	async createUser(username: string, name: string, email: string, password: string): Promise<User> {
		const hashedPassword = await hashPassword(password);

		const user = this.prisma.user.create({
			data: {
				username: username,
				password: hashedPassword,
				profile: {
					create: {
						name: name,
						email: email
					}
				}
			}
		});
		return user;
	}
}

const userRepository = new UserRepository(prisma);
export default userRepository;
