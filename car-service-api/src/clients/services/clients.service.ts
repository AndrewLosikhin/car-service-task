import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateClientDto } from '../dto/create-client.dto';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { BehaviorSubject, Observable } from 'rxjs';
import * as camel from 'lodash-humps';
import { Connection } from 'pg';
import { PG_CONNECTION } from '../../db/db.const';
import { Client } from '../entities/client.entity';
import {
  VehicleServiceData,
  VehicleServiceDataService,
} from './vehicle-service-data.service';
import { ServiceType } from '../../vehicle-services/entities/vehicle-service.entity';
import { SensorsDataDto } from '../dto/sensors-data.dto';
import { WidgetEntity } from '../entities/widget.entity';

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);
  private widgetsSubject: BehaviorSubject<WidgetEntity[]> = new BehaviorSubject(
    [],
  );

  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly vehicleServiceDataService: VehicleServiceDataService,
    @Inject(PG_CONNECTION) private conn: Connection,
  ) {
    this.findWidgets();
  }

  async create(createClientDto: CreateClientDto) {
    const result = await this.conn.query(
      `insert into client ("email") values ('${createClientDto.email}') returning *;`,
    );
    return camel(result.rows[0]) as Client;
  }

  async findAll() {
    const result = await this.conn.query(`select * from client;`);
    return camel(result.rows) as Client[];
  }

  get $widgets(): Observable<WidgetEntity[]> {
    return this.widgetsSubject.asObservable();
  }

  async findWidgets() {
    const result = await this.conn.query(
      `select v."client_id", v."id", vs.service_type, vsd.data, RANK () OVER ( 
        PARTITION BY v.plate_number
        ORDER BY vsd.data NULLS LAST, 
        case vs."service_type"
                when 'FuelDelivery' then 1
                when 'Maintenance' then 2
                when 'Fine' then 3
                when 'Parking' then 4
                when 'GasStation' then 5
             end
      ) rank_number from vehicle_service vs
    left join vehicle v  on v.id = vs.vehicle_id
    left join lateral ( select *
          from vehicle_service_data vsd 
          where vs.id = vsd.vehicle_service_id
          order by vsd."created_at" desc
          fetch first 1 row only ) vsd on true
    group by v."client_id", v.id, vs.service_type, vsd.data;`,
    );

    this.widgetsSubject.next(camel(result.rows) as WidgetEntity[]);
  }

  // we probably need to negotiate the contract between vendors and car service
  broadcastToServices(_clientId: number, sensorsData: SensorsDataDto) {
    this.amqpConnection.publish(
      'exchange1',
      'gas-station-routing',
      sensorsData,
    );

    this.amqpConnection.publish(
      'exchange1',
      'fuel-deliver-routing',
      sensorsData,
    );
  }

  // probably should be moved into separate vendors-communication module
  @RabbitSubscribe({
    exchange: 'exchange2',
    routingKey: 'gas-station-routing',
  })
  public async gasSubHandler(msg: VehicleServiceData) {
    this.logger.log(`Gas station response: ${JSON.stringify(msg)}`);
    await this.vehicleServiceDataService.create(ServiceType.GasStation, msg);
    await this.findWidgets();
  }

  @RabbitSubscribe({
    exchange: 'exchange2',
    routingKey: 'fines-routing',
  })
  public async finesSubHandler(msg: VehicleServiceData) {
    this.logger.log(`Fines response: ${JSON.stringify(msg)}`);
    await this.vehicleServiceDataService.create(ServiceType.Fine, msg);
    await this.findWidgets();
  }

  @RabbitSubscribe({
    exchange: 'exchange2',
    routingKey: 'fuel-deliver-routing',
  })
  public async fuelDeliverSubHandler(msg: VehicleServiceData) {
    this.logger.log(`Fuel deliver response: ${JSON.stringify(msg)}`);
    await this.vehicleServiceDataService.create(ServiceType.FuelDelivery, msg);
    await this.findWidgets();
  }

  @RabbitSubscribe({
    exchange: 'exchange2',
    routingKey: 'parking-routing',
  })
  public async parkingSubHandler(msg: VehicleServiceData) {
    this.logger.log(`Parking response: ${JSON.stringify(msg)}`);
    await this.vehicleServiceDataService.create(ServiceType.Parking, msg);
    await this.findWidgets();
  }

  @RabbitSubscribe({
    exchange: 'exchange2',
    routingKey: 'maintenance-routing',
  })
  public async maintenanceSubHandler(msg: VehicleServiceData) {
    this.logger.log(`Maintenance response: ${JSON.stringify(msg)}`);
    await this.vehicleServiceDataService.create(ServiceType.Maintenance, msg);
    await this.findWidgets();
  }
}
