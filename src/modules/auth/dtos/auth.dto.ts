import { IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class AuthDto {
  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  initData: string;
}
