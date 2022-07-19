import { Module } from '@nestjs/common';
import { TimesService } from './times.service';
import { TimesController } from './times.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TimeSchema } from './time.Schema';
@Module({
  imports: [MongooseModule.forFeature([{ name: 'Time', schema: TimeSchema }])],
  controllers: [TimesController],
  providers: [TimesService]
})
export class TimesModule {}
