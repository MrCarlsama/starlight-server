import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StageGirls } from './entity/stage-girls-entity';
import { Repository } from 'typeorm';
import { StageGirlsAttribute } from './entity/stage-girls-attribute.entity';
import Axios from 'axios';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';
import { Stream } from 'stream';

@Injectable()
export class StageGirlsService {
  constructor(
    // 舞台少女 实体
    @InjectRepository(StageGirls)
    private readonly StageGirlsRepository: Repository<StageGirls>,
    // 舞台少女-属性 实体
    @InjectRepository(StageGirlsAttribute)
    private readonly StageGirlsAttributeRepository: Repository<
      StageGirlsAttribute
    >,
  ) {}

  // 获取 - 舞台少女
  async getList(): Promise<Array<StageGirls>> {
    console.log('[Start Function getList()]');

    return await this.StageGirlsRepository.find({
      relations: ['Attribute'],
    });
  }

  // 保存 - 舞台少女
  async save(stageGirls: Array<StageGirls>): Promise<object> {
    console.log('[Start Function save()]');

    for (const item of stageGirls) {
      // 不重复添加
      if (!this.StageGirlsRepository.findOne({ AppId: item.AppId })) {
        console.log(`${item.AppId} ${item.Name} 已经重复 跳过`);
        continue;
      }

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

      // 图片下载
      // 头像
      const imgPath = `../../images/stageGirls/${stageGirl.AppId}`;
      if (!existsSync(join(__dirname, imgPath))) {
        this.downloadImages(
          `https://api.karen.makoo.eu/api/assets/jp/res/item_root/large/1_${stageGirl.AppId}.png`,
          `../../images/stageGirls/${stageGirl.AppId}`,
          `${stageGirl.AppId}.png`,
        );
        // 原图
        this.downloadImages(
          `https://api.karen.makoo.eu/api/assets/dlc/res/dress/cg/${stageGirl.AppId}/image.png`,
          `../../images/stageGirls/${stageGirl.AppId}`,
          `${stageGirl.AppId}_plus.png`,
        );
      }

      console.log(
        '[End Function save()] save done',
        stageGirl.AppId,
        stageGirl.Name,
      );
    }

    return {
      Msg: 'Done',
    };
  }

  // 保存 - 下载文件流
  /**
   * @param url 下载路径
   * @param filePath 保持路径
   * @param name 保存文件名
   */
  async downloadImages(
    url: string,
    filePath: string,
    name: string,
  ): Promise<string> {
    filePath = join(__dirname, filePath);
    // 目录判断
    if (!existsSync(filePath)) {
      mkdirSync(filePath, { recursive: true });
    }

    const myPath = resolve(filePath, name);
    const writerStream = createWriteStream(myPath, {
      encoding: 'binary',
    });

    const response: Stream = await Axios({
      url,
      method: 'get',
      responseType: 'stream',
    }).then(res => res.data);

    // 流下载
    response
      .on('error', err => {
        console.log(err);
        console.log(
          '[Function downloadImages()] download faild, continue redownload',
        );
        this.downloadImages(url, filePath, name);
      })
      .pipe(writerStream)
      .on('close', () => {
        console.log(
          `[Function downloadImages()] download success, the path is ${myPath}`,
        );
      });

    return filePath;
  }

  // 同步数据
  /**
   * @param isAll 是否全更新
   */
  async async(isAll: boolean = false): Promise<object> {
    console.log('[Start Function] async() ');

    // 舞台少女数据
    const asyncStageGirlsUrl = `https://api.karen.makoo.eu/api/dress_v2`;
    const asyncStageGirlsData: Array<any> = await Axios({
      method: 'get',
      url: asyncStageGirlsUrl,
    }).then(res => res.data.response_data);
    console.log('[async] asyncStageGirlsData ');

    // 角色数据
    const asyncCharacterUrl = `https://api.karen.makoo.eu/api/chara`;
    const asyncCharacterData: Array<any> = await Axios({
      method: 'get',
      url: asyncCharacterUrl,
    }).then(res => res.data.response_data);
    console.log('[async] asyncCharacterData ');

    // 本地数据
    const stageGirlsList = await this.getList();

    // 过滤出新增数据
    const filterList = asyncStageGirlsData
      .filter(item => !stageGirlsList.find(i => i.AppId === item.id))
      .map(item => {
        return {
          AppId: item.id,
          CharacterId: item.basicInfo.character,
          ImageUrl: '',
          Name: asyncCharacterData.find(i => i.id === item.basicInfo.character)
            ?.name.ja,
          CharacterName: item.basicInfo.name.ja,
          Attribute: {
            AppId: item.id,
            Rarity: item.basicInfo.rarity,
            PositionType: item.base.roleIndex.role,
            AttributeType: item.base.attribute,
            AttackType: item.base.attackType,
            PowerScore: item.stat.total,
            HP: item.stat.hp,
            ActPower: item.stat.atk,
            NormalDefense: item.stat.pdef,
            SpecialDefense: item.stat.mdef,
            Agility: item.stat.agi,
          },
        };
      });

    await this.save(filterList as Array<StageGirls>);

    return {
      Msg: 'Async Done',
    };
  }
}
