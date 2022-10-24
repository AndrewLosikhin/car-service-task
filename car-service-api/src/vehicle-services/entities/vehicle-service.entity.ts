export enum ServiceType {
  FuelDelivery = 'FuelDelivery',
  Maintenance = 'Maintenance',
  Fine = 'Fine',
  Parking = 'Parking',
  GasStation = 'GasStation',
}

export class VehicleService {
  id: number;
  serviceType: ServiceType;
  vehicleId: number;
}
