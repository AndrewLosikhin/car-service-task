import { Module } from '@nestjs/common';
import { VendorsModule } from './vendors/vendors.module';

@Module({
  imports: [VendorsModule],
})
export class AppModule {}
