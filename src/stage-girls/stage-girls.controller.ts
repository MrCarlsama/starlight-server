import { Body, Controller, Post } from '@nestjs/common';
import { Memoris } from './entity/memoris.entity';
import { StageGirls } from './entity/stage-girls-entity';
import { StageGirlsService } from './stage-girls.service';

@Controller('StageGirls')
export class StageGirlsController {
  constructor(private readonly stageGirlsService: StageGirlsService) {}

  // 获取 - 舞台少女
  @Post('/GetListByStageGirls')
  async getListByStageGirls(): Promise<StageGirls[]> {
    return await this.stageGirlsService.getListByStageGirls();
  }

  // 获取 - 礼装
  @Post('/GetListByMemoris')
  async getListByMemoris(): Promise<Memoris[]> {
    return await this.stageGirlsService.getListByMemoris();
  }

  // @Post('/Save')
  // async save(@Body() stageGirls: StageGirls[]): Promise<object> {
  //   return await this.stageGirlsService.saveStageGirls(stageGirls);
  // }

  @Post('/Async')
  async async(@Body() Option = { isAll: false }): Promise<object> {
    return await this.stageGirlsService.async(Option.isAll);
  }
}
