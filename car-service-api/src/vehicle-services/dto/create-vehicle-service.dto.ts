import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { ExistId } from '../../db/validators/exist-nested-in.validator';
import { ServiceType } from '../entities/vehicle-service.entity';

export class CreateVehicleServiceDto {
  @ApiProperty({ enum: [...Object.values(ServiceType)] })
  @IsEnum(ServiceType)
  serviceType: ServiceType;

  @ApiProperty()
  @IsNumber()
  @ExistId('vehicle')
  vehicleId: number;
}
