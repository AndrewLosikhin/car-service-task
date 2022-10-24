import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VehiclesModule } from './vehicles/vehicles.module';
import { VehicleServicesModule } from './vehicle-services/vehicle-services.module';
import { DbModule } from './db/db.module';
import { ClientsModule } from './clients/clients.module';

@Module({
  imports: [VehiclesModule, VehicleServicesModule, DbModule, ClientsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
