// src/auth/dto/auth.payload.ts
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AuthPayload {
  @Field()
  access_token: string;
}
