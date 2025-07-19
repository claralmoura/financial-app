import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String, { description: 'Nome do usuário' })
  @IsNotEmpty({ message: 'O nome não pode ser vazio.' })
  name: string;

  @Field(() => String, { description: 'Email do usuário (deve ser único)' })
  @IsEmail({}, { message: 'Por favor, insira um email válido.' })
  email: string;

  @Field(() => String, {
    description: 'Senha do usuário (mínimo de 8 caracteres)',
  })
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
  password: string;
}
