import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StageGirls } from './entity/stage-girls-entity';
import { Repository } from 'typeorm';
import { StageGirlsAttribute } from './entity/stage-girls-attribute.entity';

@Injectable()
export class StageGirlsService {
  constructor(
    @InjectRepository(StageGirls)
    private readonly StageGirlsRepository: Repository<StageGirls>,
    @InjectRepository(StageGirlsAttribute)
    private readonly StageGirlsAttributeRepository: Repository<
      StageGirlsAttribute
    >,
  ) {}

  // 获取 - 舞台少女
  async getList(): Promise<StageGirls[]> {
    console.log(await this.StageGirlsRepository.findOne({ Id: 1 }));
    return await this.StageGirlsRepository.find();
  }

  // 保存 - 舞台少女
  async save(stageGirls: StageGirls[]): Promise<object> {
    console.log(stageGirls[0]);
    console.log(stageGirls.length);

    for (const item of stageGirls) {
      // 属性
      const attribute = new StageGirlsAttribute();
      attribute.AppId = item.Attribute.AppId;
      attribute.Rarity = item.Attribute.Rarity;
      attribute.PositionType = item.Attribute.PositionType;
      attribute.AttributeType = item.Attribute.AttributeType;
      attribute.AttackType = item.Attribute.AttackType;
      attribute.PowerScore = item.Attribute.PowerScore;
      attribute.HP = item.Attribute.HP;
      attribute.ActPower = item.Attribute.ActPower;
      attribute.NormalDefense = item.Attribute.NormalDefense;
      attribute.SpecialDefense = item.Attribute.SpecialDefense;
      attribute.Agility = item.Attribute.Agility;
      await this.StageGirlsAttributeRepository.save(attribute);

      // 单体
      const stageGirl = new StageGirls();
      stageGirl.AppId = item.AppId;
      stageGirl.CharacterId = item.CharacterId;
      stageGirl.ImageUrl = item.ImageUrl;
      stageGirl.Name = item.Name;
      stageGirl.CharacterName = item.CharacterName;
      stageGirl.Attribute = attribute;
      await this.StageGirlsRepository.save(stageGirl);

      console.log('save done', stageGirl.AppId, stageGirl.Name);
    }

    return {
      Msg: 'Done',
    };
  }
}
