import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

// used for testing only
@Injectable()
export class VendorsService {
  private readonly logger = new Logger(VendorsService.name);
  constructor(private readonly amqpConnection: AmqpConnection) {}

  @RabbitSubscribe({
    exchange: 'exchange1',
    routingKey: 'gas-station-routing',
  })
  public async gasSubHandler({ plateNumber }: any) {
    this.logger.log(`Gas request: ${plateNumber}`);
    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 5000 + 2000),
    );

    this.amqpConnection.publish('exchange2', 'gas-station-routing', {
      plateNumber,
      distance: 1230,
      price: 490,
    });
  }

  @RabbitSubscribe({
    exchange: 'exchange1',
    routingKey: 'fuel-deliver-routing',
  })
  public async fuelSubHandler({ plateNumber, volumeLeft }: any) {
    this.logger.log(`Fuel request: ${plateNumber}`);

    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 10000 + 5000),
    );

    this.amqpConnection.publish('exchange2', 'fuel-deliver-routing', {
      plateNumber,
      volume: volumeLeft,
      amount: 3325,
      time: 45,
    });
  }

  @Cron('* 1 * * * *')
  handleFinesMockCron() {
    this.amqpConnection.publish('exchange2', 'fines-routing', {
      plateNumber: 'м558рм48', // mock model
      count: 4,
      amount: 5000,
    });
  }

  @Cron('10 * * * * *')
  handleParkingMockCron() {
    this.amqpConnection.publish('exchange2', 'parking-routing', {
      plateNumber: 'м558рм48', // mock model
      number: 119,
      amount: 5000,
      time: 240,
    });
  }

  @Cron('6 * * * * *')
  handleMaintenanceMockCron() {
    this.amqpConnection.publish('exchange2', 'maintenance-routing', {
      plateNumber: 'м558рм48', // mock model
      distanceMax: 320000,
      amount: 47300,
      time: 360,
    });
  }
}
