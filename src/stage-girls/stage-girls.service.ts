import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StageGirls } from './entity/stage-girls-entity';
import { FindOneOptions, Repository } from 'typeorm';
import { StageGirlsAttribute } from './entity/stage-girls-attribute.entity';
import Axios from 'axios';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';
import { Stream } from 'stream';
import { OSSHelperService } from 'src/oss-helper/oss-helper.service';
import { Memoris } from './entity/memoris.entity';

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
    // 礼装 实体
    @InjectRepository(Memoris)
    private readonly MemorisRepository: Repository<Memoris>,
    // OSS 服务
    private readonly ossHelper: OSSHelperService,
  ) {}

  // 获取 - 舞台少女
  async getListByStageGirls(): Promise<Array<StageGirls>> {
    console.log('[Start Function getListByStageGirls()]');
    try {
      const result = await this.StageGirlsRepository.find({
        relations: ['Attribute'],
      });
      return result.sort((a, b) => b.Timestamp - a.Timestamp);
    } catch (e) {
      console.log(e);
    }
  }

  // 保存 - 舞台少女
  async saveStageGirls(stageGirls: Array<StageGirls>): Promise<object> {
    console.log('[Start Function save()]');

    for (const item of stageGirls) {
      // 图片下载
      // 头像
      this.downloadImages(
        `https://api.karen.makoo.eu/api/assets/jp/res/item_root/large/1_${item.AppId}.png`,
        `../../images/stageGirls/${item.AppId}`,
        `/images/stageGirls/${item.AppId}/${item.AppId}.png`,
        `${item.AppId}.png`,
      );
      // 头像 - jpg
      this.downloadImages(
        `https://api.karen.makoo.eu/api/assets/jp/res/item_root/large/1_${item.AppId}.png`,
        `../../images/stageGirls/${item.AppId}`,
        `/images/stageGirls/${item.AppId}/${item.AppId}.jpg`,
        `${item.AppId}.jpg`,
      );
      // 原图
      this.downloadImages(
        `https://api.karen.makoo.eu/api/assets/dlc/res/dress/cg/${item.AppId}/image.png`,
        `../../images/stageGirls/${item.AppId}`,
        `/images/stageGirls/${item.AppId}/${item.AppId}_plus.png`,
        `${item.AppId}_plus.png`,
      );
      // 原图 - jpg
      this.downloadImages(
        `https://api.karen.makoo.eu/api/assets/dlc/res/dress/cg/${item.AppId}/image.png`,
        `../../images/stageGirls/${item.AppId}`,
        `/images/stageGirls/${item.AppId}/${item.AppId}_plus.jpg`,
        `${item.AppId}_plus.jpg`,
      );

      // 不重复添加
      const isHasItem = await this.StageGirlsRepository.findOne({
        AppId: item.AppId,
      });
      if (isHasItem !== undefined) {
        // console.log(`${item.AppId} ${item.Name} 已经重复 跳过`);
        continue;
      }

      // 属性
      // const attribute = new StageGirlsAttribute();
      // attribute.AppId = item.Attribute.AppId;
      // attribute.Rarity = item.Attribute.Rarity;
      // attribute.PositionType = item.Attribute.PositionType;
      // attribute.AttributeType = item.Attribute.AttributeType;
      // attribute.AttackType = item.Attribute.AttackType;
      // attribute.PowerScore = item.Attribute.PowerScore;
      // attribute.HP = item.Attribute.HP;
      // attribute.ActPower = item.Attribute.ActPower;
      // attribute.NormalDefense = item.Attribute.NormalDefense;
      // attribute.SpecialDefense = item.Attribute.SpecialDefense;
      // attribute.Agility = item.Attribute.Agility;

      const attribute = { ...item.Attribute };

      await this.StageGirlsAttributeRepository.save(attribute);

      // 单体
      const stageGirl = new StageGirls();
      stageGirl.AppId = item.AppId;
      stageGirl.CharacterId = item.CharacterId;
      stageGirl.ImageUrl = `/images/stageGirls/${stageGirl.AppId}/${stageGirl.AppId}.png`;
      stageGirl.Name = item.Name;
      stageGirl.CharacterName = item.CharacterName;
      stageGirl.Timestamp = item.Timestamp;
      stageGirl.Attribute = attribute;
      await this.StageGirlsRepository.save(stageGirl);

      console.log(
        '[End Function save()] save done',
        stageGirl.AppId,
        stageGirl.Name,
      );
    }

    return {
      Msg: 'save stageGirls Done',
    };
  }

  // 获取 - 礼装
  async getListByMemoris(): Promise<Array<Memoris>> {
    console.log('[Start Function getListByMemoris()]');
    try {
      const result = await this.MemorisRepository.find();
      return result.sort((a, b) => b.Timestamp - a.Timestamp);
    } catch (e) {
      console.log(e);
    }
  }

  // 保存 - 礼装
  async saveMemoris(memoris: Array<Memoris>): Promise<object> {
    console.log('[Start Function saveMemoris()]');

    for (const item of memoris) {
      // 图片下载
      // 头像
      this.downloadImages(
        `https://api.karen.makoo.eu/api/assets/jp/res/item_root/large/2_${item.AppId}.png`,
        `../../images/memoirs/${item.AppId}`,
        `/images/memoirs/${item.AppId}/${item.AppId}.png`,
        `${item.AppId}.png`,
      );
      // 头像 - jpg
      this.downloadImages(
        `https://api.karen.makoo.eu/api/assets/jp/res/item_root/large/2_${item.AppId}.png`,
        `../../images/memoirs/${item.AppId}`,
        `/images/memoirs/${item.AppId}/${item.AppId}.jpg`,
        `${item.AppId}.jpg`,
      );
      // 原图
      this.downloadImages(
        `https://api.karen.makoo.eu/api/assets/dlc/res/equip/cg/${item.AppId}/image.png`,
        `../../images/memoirs/${item.AppId}`,
        `/images/memoirs/${item.AppId}/${item.AppId}_plus.png`,
        `${item.AppId}_plus.png`,
      );
      // 原图 - jpg
      this.downloadImages(
        `https://api.karen.makoo.eu/api/assets/dlc/res/equip/cg/${item.AppId}/image.png`,
        `../../images/memoirs/${item.AppId}`,
        `/images/memoirs/${item.AppId}/${item.AppId}_plus.jpg`,
        `${item.AppId}_plus.jpg`,
      );
      // 技能图标
      this.downloadImages(
        `https://api.karen.makoo.eu/api/assets/jp/res/battle/skill_icon/skill_icon_${item.SkillId}.png`,
        `../../images/skill`,
        `/images/skill/${item.SkillId}.png`,
        `${item.SkillId}.png`,
      );

      // 不重复添加
      try {
        const isHasItem = await this.MemorisRepository.findOne({
          AppId: item.AppId,
        });
        if (isHasItem !== undefined) {
          // console.log(`${item.AppId} ${item.Name} 已经重复 跳过`);
          continue;
        }
      } catch (error) {
        console.log(
          `=============${item.AppId} MemorisRepository.findOne Error ==================`,
        );
        console.log(error);
        console.log(
          `============================================================================`,
        );
      }

      try {
        const memory = { ...item };
        memory.ImageUrl = `/images/memoirs/${item.AppId}/${item.AppId}.png`;
        memory.SkillImageUrl = `/images/skill/${item.SkillId}.png`;
        await this.MemorisRepository.save(memory);
      } catch (error) {
        console.log(
          `=============${item.AppId} MemorisRepository.save Error ==================`,
        );
        console.log(error);
        console.log(
          `============================================================================`,
        );
      }

      console.log(
        '[End Function saveMemoris()] save done',
        item.AppId,
        item.Name,
      );
    }

    return {
      Msg: 'save Memoris Done',
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
    uploadPath: string,
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

    try {
      // 下载不存在的oss的图
      const isHas = await this.ossHelper.isExistObject(uploadPath);
      if (!isHas) {
        const response: Stream = await Axios({
          url,
          method: 'get',
          responseType: 'stream',
        }).then(res => res.data);

        // 流下载
        response
          .on('error', err => {
            console.log(
              '[Function downloadImages()] download faild, continue redownload',
            );
            this.downloadImages(url, filePath, uploadPath, name);
          })
          .pipe(writerStream)
          .on('close', () => {
            console.log(
              `[Function downloadImages()] download success, the path is ${myPath}`,
            );
            this.ossHelper.uploadFile(uploadPath, myPath);
          });
      }
    } catch (error) {
      console.log('[Function downloadImages()] Get Image Faild By ', url);
      this.downloadImages(url, filePath, uploadPath, name);
    }

    return filePath;
  }

  // 同步数据
  /**
   * @param isAll 是否全更新
   */
  async async(isAll: boolean = false): Promise<object> {
    console.log(
      `[Start Function] async() isAll:${isAll}: type: ${typeof isAll}`,
    );

    // 礼装数据
    const asyncMemoirsUrl = `https://api.karen.makoo.eu/api/equip_v2`;
    // const asyncMemoirsData: Array<any> = await Axios({
    //   method: 'get',
    //   url: asyncMemoirsUrl,
    // }).then(res => res.data.response_data);
    Axios({
      method: 'get',
      url: asyncMemoirsUrl,
    }).then(async res => {
      console.log('[async] asyncMemoirsData ');
      const asyncMemoirsData: Array<any> = res.data.response_data;
      let memorisList: Array<Memoris> = [];
      if (!isAll) {
        // 本地礼装数据
        memorisList = await this.getListByMemoris();
      }

      // 过滤出新增数据 - 礼装
      const filterListByMemoris = asyncMemoirsData
        .filter(item =>
          isAll ? true : !memorisList.find(i => i.AppId === Number(item.id)),
        )
        .map(item => {
          return {
            AppId: item.id,
            ImageUrl: '',
            SkillImageUrl: '',
            Name: item.basicInfo.name.ja,
            Profile: item.basicInfo.profile.ja,
            SkillId: item.skill.iconID,
            SkillType: item.skill.type,
            Skill: item.skill.info.ja,
            PowerScore: item.stat.total,
            HP: item.stat.hp,
            ActPower: item.stat.atk,
            NormalDefense: item.stat.pdef,
            SpecialDefense: item.stat.mdef,
            Rarity: item.basicInfo.rarity,
            Timestamp: item.basicInfo.published.ja,
          };
        });

      await this.saveMemoris(filterListByMemoris as Array<Memoris>);
    });

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

    // let memorisList: Array<Memoris> = [];
    let stageGirlsList: Array<StageGirls> = [];

    // 非全部同步
    if (!isAll) {
      // 本地礼装数据
      // memorisList = await this.getListByMemoris();
      // 本地舞台少女数据
      stageGirlsList = await this.getListByStageGirls();
    }

    // 过滤出新增数据 - 舞台少女
    const filterListByStageGirls = asyncStageGirlsData
      .filter(item =>
        isAll ? true : !stageGirlsList.find(i => i.AppId === item.id),
      )
      .map(item => {
        return {
          AppId: item.id,
          CharacterId: item.basicInfo.character,
          ImageUrl: '',
          Name: asyncCharacterData.find(i => i.id === item.basicInfo.character)
            ?.name.ja,
          CharacterName: item.basicInfo.name.ja,
          Timestamp: item.basicInfo.released.ja,
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

    // 过滤出新增数据 - 礼装
    // const filterListByMemoris = asyncMemoirsData
    //   .filter(item =>
    //     isAll ? true : !memorisList.find(i => i.AppId === Number(item.id)),
    //   )
    //   .map(item => {
    //     return {
    //       AppId: item.id,
    //       ImageUrl: '',
    //       Name: item.basicInfo.name.ja,
    //       Profile: item.basicInfo.profile.ja,
    //       SkillId: item.skill.iconID,
    //       SkillType: item.skill.type,
    //       Skill: item.skill.info.ja,
    //       PowerScore: item.stat.total,
    //       HP: item.stat.hp,
    //       ActPower: item.stat.atk,
    //       NormalDefense: item.stat.pdef,
    //       SpecialDefense: item.stat.mdef,
    //       Rarity: item.basicInfo.rarity,
    //       Timestamp: item.basicInfo.published.ja,
    //     };
    //   });

    // console.log(
    //   `[Start Function] async() 是否为全更新（${isAll}），本次同步舞台少女数量：${filterListByStageGirls.length}，礼装少女数量：${filterListByMemoris.length}。`,
    // );

    await this.saveStageGirls(filterListByStageGirls as Array<StageGirls>);
    // await this.saveMemoris(filterListByMemoris as Array<Memoris>);

    return {
      Msg: 'Async Done',
    };
  }
}
