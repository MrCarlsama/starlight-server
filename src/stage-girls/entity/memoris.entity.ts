import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// 礼装数据
@Entity()
export class Memoris {
  // Id
  @PrimaryGeneratedColumn()
  Id?: number;

  // 内部Id
  @Column()
  AppId: number;

  // 图片地址
  @Column()
  ImageUrl: string;

  // 礼装名字
  @Column()
  Name: string;

  // 礼装描述
  @Column()
  Profile: string;

  // 礼装技能Id
  @Column()
  SkillId: number;

  // 礼装技能类型
  @Column()
  SkillType: string;

  // 礼装技能图片地址
  @Column()
  SkillImageUrl: string;

  // 礼装技能
  @Column()
  Skill: string;

  // 综合力
  @Column()
  PowerScore: number;

  // Hp
  @Column()
  HP: number;

  // Act Power
  @Column()
  ActPower: number;

  // 普通防御力
  @Column()
  NormalDefense: number;

  // 特殊防御力
  @Column()
  SpecialDefense: number;

  // 初始星
  @Column()
  Rarity: number;

  // 时间戳
  @Column()
  Timestamp: number;
}
