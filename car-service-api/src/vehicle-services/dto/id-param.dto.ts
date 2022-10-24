import { ExistId } from '../../db/validators/exist-nested-in.validator';
import { IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class IdParam {
  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsPositive()
  @ExistId('vehicle_service')
  id: number;
}
