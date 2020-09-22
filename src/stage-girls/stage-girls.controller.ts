import { Body, Controller, Post } from '@nestjs/common';
import { StageGirls } from './entity/stage-girls-entity';
import { StageGirlsService } from './stage-girls.service';

@Controller('StageGirls')
export class StageGirlsController {
  constructor(private readonly stageGirlsService: StageGirlsService) {}

  @Post('/GetList')
  async getList(): Promise<StageGirls[]> {
    return await this.stageGirlsService.getList();
  }

  @Post('/Save')
  async save(@Body() stageGirls: StageGirls[]): Promise<object> {
    return await this.stageGirlsService.save(stageGirls);
  }
}
