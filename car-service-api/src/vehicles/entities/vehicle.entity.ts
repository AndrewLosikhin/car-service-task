import { Client } from '../../clients/entities/client.entity';
import { VehicleService } from '../../vehicle-services/entities/vehicle-service.entity';

export class Vehicle {
  id: number;
  plateNumber: string;
  model: string;
  client: Client;
  services: VehicleService[];
}
