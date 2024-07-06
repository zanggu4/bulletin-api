import type { RefreshTokenRepository } from '$lib/repositories/refresh-token.repository';
import refreshTokenRepository from '$lib/repositories/refresh-token.repository';
import type { AccessTokenService } from './access-token.service';
import accessTokenService from './access-token.service';

export class AuthService {
	constructor(
		private accessTokenService: AccessTokenService,
		private refreshTokenRepo: RefreshTokenRepository
	) {}

	/**
	 * 액세스 토큰으로부터 회원 번호 추출
	 * @param accessToken
	 * @returns 찾지 못한 경우 undefined
	 */
	async userId(accessToken: string | undefined): Promise<number | undefined> {
		if (accessToken) {
			return await accessTokenService.userId(accessToken);
		}
		return undefined;
	}

	/**
	 * 갱신 토큰으로 부터 액세스 토큰 생성
	 * @param token 토큰
	 * @returns 성공시 액세스 토큰 반환. 실패시 error
	 */
	async createAccessTokenFromRefreshToken(token: string | undefined): Promise<string> {
		if (!token) {
			throw Error('Invalid Refresh token');
		}
		const refreshToken = await this.refreshTokenRepo.useRefreshToken(token);
		const userId = refreshToken.userId;
		return this.createAccessToken(userId);
	}

	/**
	 * 갱신 토큰으로부터 회원 번호 추출
	 * @param refreshToken
	 * @returns 찾지 못한 경우 undefined
	 */
	async userIdFromRefreshToken(token: string | undefined): Promise<number | undefined> {
		const accessToken = await authService.createAccessTokenFromRefreshToken(token);
		return this.userId(accessToken);
	}

	/**
	 * 액세스 토큰 생성
	 * @param userId 회원번호
	 * @returns 회원번호가 존재하는 경우 JWT 토큰 생성, 그외 에러 반환
	 */
	async createAccessToken(userId: number): Promise<string> {
		return this.accessTokenService.createFrom(userId);
	}

	/**
	 * 갱신 토큰 생성
	 * @param userId 회원 번호
	 * @returns 토큰
	 */
	async createRefreshToken(userId: number): Promise<string> {
		const expiredDate = new Date();
		const after7days = expiredDate.getDate() + 7;
		expiredDate.setDate(after7days);

		const token = await this.refreshTokenRepo.create(userId, expiredDate);
		return token.token;
	}
}

const authService = new AuthService(accessTokenService, refreshTokenRepository);
export default authService;
