import { Inject, Injectable, Logger } from '@nestjs/common';
import { Connection } from 'pg';
import { PG_CONNECTION } from '../../db/db.const';
import { ServiceType } from '../../vehicle-services/entities/vehicle-service.entity';

export interface VehicleServiceData {
  plateNumber: string;
}

@Injectable()
export class VehicleServiceDataService {
  private readonly logger = new Logger(VehicleServiceDataService.name);
  constructor(@Inject(PG_CONNECTION) private conn: Connection) {}
  async create<T extends VehicleServiceData>(
    serviceType: ServiceType,
    data: T,
  ) {
    const existEntity = await this.conn.query(
      `select exists (select 1 from "vehicle" where "plate_number"='${data.plateNumber}');`,
    );

    if (!existEntity.rows[0].exists) {
      this.logger.warn(
        `Unknown vehicle data recieved from vendors for type ${serviceType}`,
      );
      return;
    }

    const { plateNumber, ...dataWithoutVehicleInfo } = data;

    await this.conn.query(
      `insert into vehicle_service_data ("vehicle_service_id", "data")
      select vs.id as vehicle_service_id, '${JSON.stringify(
        dataWithoutVehicleInfo,
      )}' as data from vehicle_service vs 
      inner join vehicle v on v.id = vs.vehicle_id
      where v.plate_number = '${plateNumber}' and vs."service_type" = '${serviceType}';`,
    );
  }
}
