import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class CreateClientDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
