import { ServiceType } from '../../vehicle-services/entities/vehicle-service.entity';

export class WidgetEntity {
  clientId: number;
  vehicleId: number;
  serviceType: ServiceType;
  data: unknown;
}
