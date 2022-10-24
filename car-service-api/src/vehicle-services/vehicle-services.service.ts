import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVehicleServiceDto } from './dto/create-vehicle-service.dto';
import { UpdateVehicleServiceDto } from './dto/update-vehicle-service.dto';
import * as camel from 'lodash-humps';
import { Connection } from 'pg';
import { PG_CONNECTION } from '../db/db.const';
import { VehicleService } from './entities/vehicle-service.entity';

@Injectable()
export class VehicleServicesService {
  constructor(@Inject(PG_CONNECTION) private conn: Connection) {}

  async create(createVehicleServiceDto: CreateVehicleServiceDto) {
    const result = await this.conn.query(
      `insert into vehicle_service ("service_type", "vehicle_id") values ('${createVehicleServiceDto.serviceType}', ${createVehicleServiceDto.vehicleId}) returning *;`,
    );
    return camel(result.rows[0]) as VehicleService;
  }

  async findAll() {
    const result = await this.conn.query(`select * from vehicle_service;`);
    return camel(result.rows) as VehicleService[];
  }

  async findOne(id: number) {
    const result = await this.conn.query(
      `select * from vehicle_service where "id" = ${id}`,
    );
    if (result.rows.length === 0) {
      throw new NotFoundException(`for id = ${id}`);
    }

    return camel(result.rows[0]) as VehicleService;
  }

  async update(id: number, updateVehicleServiceDto: UpdateVehicleServiceDto) {
    const result = await this.conn.query(
      `update vehicle_service set "service_type" = '${updateVehicleServiceDto.serviceType}', "vehicle_id" = ${updateVehicleServiceDto.vehicleId} where "id" = '${id}' returning *;`,
    );

    return camel(result.rows[0]) as VehicleService;
  }

  async remove(id: number) {
    await this.conn.query(`delete from service_type where "id" = ${id};`);
  }
}
