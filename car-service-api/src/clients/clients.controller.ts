import { Controller, Get, Post, Body, Param, Sse } from '@nestjs/common';
import { ClientsService } from './services/clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { IdParam } from './dto/id-param.dto';
import { SensorsDataDto } from './dto/sensors-data.dto';
import { map } from 'rxjs';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  findAll() {
    return this.clientsService.findAll();
  }

  @Post(':id/sensors-data')
  addSensorsData(@Param() { id }: IdParam, @Body() sensorsDto: SensorsDataDto) {
    return this.clientsService.broadcastToServices(id, sensorsDto);
  }

  @Sse(':id/widgets')
  findWidgets(@Param('id') clientId: number) {
    return this.clientsService.$widgets.pipe(
      map((widgets) => ({
        data: widgets.filter((w) => w.clientId === +clientId),
      })),
    );
  }
}
