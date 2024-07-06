import jwt from 'jsonwebtoken';

const secretKey = import.meta.env.VITE_ACCESS_TOKEN_JWT_SECRET_KEY;

declare module 'jsonwebtoken' {
	interface UserIDJwtPayload extends jwt.JwtPayload {
		userId: number;
	}
}

export class AccessTokenService {
	async createFrom(userId: number): Promise<string> {
		return jwt.sign({ userId: userId }, secretKey, { expiresIn: '30m' });
	}

	async userId(token: string | undefined): Promise<number | undefined> {
		if (!token) {
			return undefined;
		}
		try {
			const verifiedToken = <jwt.UserIDJwtPayload>jwt.verify(token, secretKey);
			return verifiedToken['userId'];
		} catch {
			return undefined;
		}
	}
}

const accessTokenService = new AccessTokenService();
export default accessTokenService;
