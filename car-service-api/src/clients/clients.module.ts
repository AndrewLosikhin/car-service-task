import { Module } from '@nestjs/common';
import { ClientsService } from './services/clients.service';
import { ClientsController } from './clients.controller';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { DbModule } from '../db/db.module';
import { VehicleServiceDataService } from './services/vehicle-service-data.service';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'exchange1',
        },
        {
          name: 'exchange2',
        },
      ],
      uri: 'amqp://localhost:5672',
      enableControllerDiscovery: true,
    }),
    ClientsModule,
    DbModule,
  ],
  controllers: [ClientsController],
  providers: [ClientsService, VehicleServiceDataService],
})
export class ClientsModule {}
