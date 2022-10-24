import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Connection } from 'pg';
import { PG_CONNECTION } from '../db/db.const';
import { Vehicle } from './entities/vehicle.entity';
import * as camel from 'lodash-humps';

@Injectable()
export class VehiclesService {
  constructor(@Inject(PG_CONNECTION) private conn: Connection) {}

  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    const result = await this.conn.query(
      `with created_vehicle as (
        insert into vehicle ("plate_number", "model", "client_id") values ('${createVehicleDto.plateNumber}', '${createVehicleDto.model}', ${createVehicleDto.clientId}) returning *
      ) select v.id, v.plate_number, v.model, jsonb_agg(c) as client from created_vehicle v 
      left join client c on c."id" = v."client_id"
      group by v.id, v.plate_number, v.model;`,
    );
    return camel(result.rows[0]) as Vehicle;
  }

  async findAll(): Promise<Vehicle[]> {
    const result = await this.conn
      .query(`select v.id, v.plate_number, v.model, jsonb_agg(distinct c.*) -> 0 as client, COALESCE(json_agg(distinct vs.*) FILTER (WHERE vs."vehicle_id" IS NOT NULL), '[]') as services from vehicle v 
    left join client c on c."id" = v."client_id" 
    left join vehicle_service vs ON vs."vehicle_id" = v.id
    group by v.id, v.plate_number, v.model;`);
    return camel(result.rows) as Vehicle[];
  }

  async findOne(id: number) {
    const result = await this.conn.query(
      `select v.id, v.plate_number, v.model, jsonb_agg(distinct c.*) -> 0 as client, COALESCE(json_agg(distinct vs.*) FILTER (WHERE vs."vehicle_id" IS NOT NULL), '[]') as services from vehicle v 
      left join client c on c."id" = v."client_id" 
      left join vehicle_service vs ON vs."vehicle_id" = v.id 
      where v."id" = ${id}
      group by v.id, v.plate_number, v.model;`,
    );
    if (result.rows.length === 0) {
      throw new NotFoundException(`for id = ${id}`);
    }

    return camel(result.rows[0]) as Vehicle;
  }

  async update(id: number, updateVehicleDto: UpdateVehicleDto) {
    const result = await this.conn.query(
      `with updated_vehicle as (
        update vehicle set "plate_number" = '${updateVehicleDto.plateNumber}', "model" = '${updateVehicleDto.model}', "client_id" = '${updateVehicleDto.clientId}' where "id" = '${id}' returning *
      ) select v.id, v.plate_number, v.model, jsonb_agg(distinct c.*) -> 0 as client, COALESCE(json_agg(distinct vs.*) FILTER (WHERE vs."vehicle_id" IS NOT NULL), '[]') as vehicles from updated_vehicle v 
      left join client c on c."id" = v."client_id" 
      left join vehicle_service vs ON vs."vehicle_id"  = v.id 
      group by v.id, v.plate_number, v.model;`,
    );

    return camel(result.rows[0]) as Vehicle;
  }

  async remove(id: number) {
    await this.conn.query(`delete from vehicle where "id" = ${id};`);
  }
}
