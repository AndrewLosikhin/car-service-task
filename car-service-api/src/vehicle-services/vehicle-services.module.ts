import { Module } from '@nestjs/common';
import { VehicleServicesService } from './vehicle-services.service';
import { VehicleServicesController } from './vehicle-services.controller';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  controllers: [VehicleServicesController],
  providers: [VehicleServicesService],
})
export class VehicleServicesModule {}
