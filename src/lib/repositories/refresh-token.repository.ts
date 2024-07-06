import prisma from '$lib/database/prisma';
import type { PrismaClient, RefreshToken } from '@prisma/client';

export class RefreshTokenRepository {
	constructor(private prisma: PrismaClient) {}

	async create(userId: number, expiredDate: Date): Promise<RefreshToken> {
		const token = await this.prisma.refreshToken.create({
			data: {
				expiredAt: expiredDate,
				userId: userId
			}
		});
		return token;
	}

	async useRefreshToken(token: string): Promise<RefreshToken> {
		return await this.prisma.$transaction(async (tx) => {
			const refreshToken = await tx.refreshToken.findFirstOrThrow({
				where: {
					token: token,
					isUsed: false
				}
			});

			await tx.refreshToken.update({
				where: {
					token: token
				},
				data: {
					isUsed: true
				}
			});

			return refreshToken;
		});
	}
}

const refreshTokenRepository = new RefreshTokenRepository(prisma);
export default refreshTokenRepository;
