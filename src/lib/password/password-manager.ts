import bcrypt from 'bcrypt';

export function hashPassword(password: string): Promise<string> {
	const saltOrRounds = 10;
	return bcrypt.hash(password, saltOrRounds);
}

export function comparePassword(password: string, encrypted: string): Promise<boolean> {
	return bcrypt.compare(password, encrypted);
}
