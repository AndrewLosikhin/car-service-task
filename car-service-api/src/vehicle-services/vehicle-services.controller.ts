import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { VehicleServicesService } from './vehicle-services.service';
import { CreateVehicleServiceDto } from './dto/create-vehicle-service.dto';
import { UpdateVehicleServiceDto } from './dto/update-vehicle-service.dto';
import { IdParam } from './dto/id-param.dto';

@Controller('vehicle-services')
export class VehicleServicesController {
  constructor(
    private readonly vehicleServicesService: VehicleServicesService,
  ) {}

  @Post()
  create(@Body() createVehicleServiceDto: CreateVehicleServiceDto) {
    return this.vehicleServicesService.create(createVehicleServiceDto);
  }

  @Get()
  findAll() {
    return this.vehicleServicesService.findAll();
  }

  @Get(':id')
  findOne(@Param() { id }: IdParam) {
    return this.vehicleServicesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param() { id }: IdParam,
    @Body() updateVehicleServiceDto: UpdateVehicleServiceDto,
  ) {
    return this.vehicleServicesService.update(id, updateVehicleServiceDto);
  }

  @Delete(':id')
  remove(@Param() { id }: IdParam) {
    return this.vehicleServicesService.remove(+id);
  }
}
