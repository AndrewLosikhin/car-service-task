import { ExistId } from '../../db/validators/exist-nested-in.validator';
import { IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleDto {
  @ApiProperty()
  plateNumber: string;

  @ApiProperty()
  model: string;

  @ApiProperty()
  @IsPositive()
  @ExistId('client')
  clientId: number;
}
