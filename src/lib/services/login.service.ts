import type { UserRepository } from '$lib/repositories/user.repository';
import { comparePassword } from '$lib/password/password-manager';
import authService from './auth.service';
import userRepository from '$lib/repositories/user.repository';
import type { AccessTokenEntity } from '$lib/entities/access-token.entity';

export class LoginService {
	constructor(private userRepo: UserRepository) {}

	async loginOrThrow(username: string, password: string): Promise<AccessTokenEntity> {
		const user = await this.userRepo.getUser(username);
		const isMatchedPassword = await comparePassword(password, user.password);
		if (!isMatchedPassword) {
			throw Error('Login failure');
		}
		return this.tokenOrThrow(user.id);
	}

	async joinOrThrow(
		username: string,
		name: string,
		email: string,
		password: string
	): Promise<AccessTokenEntity> {
		const user = await this.userRepo.createUser(username, name, email, password);
		return this.tokenOrThrow(user.id);
	}

	private async tokenOrThrow(userId: number): Promise<AccessTokenEntity> {
		const accessToken = authService.createAccessToken(userId);
		const refreshToken = authService.createRefreshToken(userId);
		const tokens = await Promise.all([accessToken, refreshToken]);

		return { accessToken: tokens[0], refreshToken: tokens[1] };
	}
}

const loginService = new LoginService(userRepository);
export default loginService;
