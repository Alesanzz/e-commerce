//@ts-check
import crypto from "crypto"
import { DAOFactory } from '../../dao/factory.js';

const userDAO = await DAOFactory('users');

class UserService {
  async findAUser(email) {
    const userCheck = await userDAO.findOne({ email: email });
    
    return userCheck;
  }

  async generateToken(email) {
    const user = await userDAO.findOne({email});
		if (!user) {
			throw new Error('User not found');
		}

		const token = crypto.randomBytes(20).toString('hex');
		const expires = new Date(Date.now() + 3600000); // 1 hora

		user.passwordToken = token;
		user.passwordTokenExpires = expires;

		await userDAO.update({_id: user._id}, user);

		return token;
  }

  async validateResetToken(email, token) {
		const user = await userDAO.findOne({
			email,
			passwordToken: token,
			passwordTokenExpires: {$gt: Date.now()},
		});

		if (!user) {
			throw new Error('Invalid or expired reset token');
		}

		return true;
	}
 
	async updatePassword(email, newPassword) {
		const user = await userDAO.findOne({email});
		if (!user) {
			throw new Error('User not found');
		}
		if (isValidPassword(newPassword, user.password)) {
			throw new Error(
				'New password cannot be the same as the current password',
			);
		}

		const hashedPassword = createHash(newPassword);
		await userDAO.update(
			{email},
			{
				password: hashedPassword,
				resetPasswordToken: undefined,
				resetPasswordExpires: undefined,
			},
		);
	}
}

export const userService = new UserService();
