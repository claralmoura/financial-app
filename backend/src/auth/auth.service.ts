import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/email/email.service';
import { ResetPasswordInput } from './dto/reset-password.input';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  /**
   * Valida se a senha enviada corresponde à senha hasheada no banco.
   * @param email Email do usuário
   * @param pass Senha enviada no login
   * @returns O objeto do usuário se a senha for válida, senão null.
   */
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  /**
   * Gera um token JWT para um usuário validado.
   * @param user Objeto do usuário
   * @returns Um objeto com o access_token
   */
  async login(user: any) {
    const payload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      return {
        message:
          'Se um usuário com este e-mail existir, um link de redefinição de senha será enviado.',
      };
    }

    const resetToken = randomBytes(32).toString('hex');

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 3600000);

    await user.save();

    try {
      await this.emailService.sendPasswordResetEmail(user, resetToken);
      return {
        message:
          'Se um usuário com este e-mail existir, um link de redefinição de senha será enviado.',
      };
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      console.error(error);
      throw new Error(
        'Não foi possível enviar o e-mail de redefinição de senha.',
      );
    }
  }

  async resetPassword(
    resetPasswordInput: ResetPasswordInput,
  ): Promise<{ message: string }> {
    const { token, password } = resetPasswordInput;
    const user = await this.usersService.findOneBy({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new UnauthorizedException(
        'Token de redefinição de senha inválido ou expirado.',
      );
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    return { message: 'Sua senha foi redefinida com sucesso.' };
  }
}
