import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StageGirlsController } from './stage-girls.controller';
import { StageGirlsService } from './stage-girls.service';
import { StageGirls } from './entity/stage-girls-entity';
import { StageGirlsAttribute } from './entity/stage-girls-attribute.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StageGirls, StageGirlsAttribute])],
  controllers: [StageGirlsController],
  providers: [StageGirlsService],
})
export class StageGirlsModule {}
