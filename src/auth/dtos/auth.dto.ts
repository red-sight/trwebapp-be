import { IsNotEmpty } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  initData: string;
}
