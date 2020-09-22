import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { StageGirlsAttribute } from './stage-girls-attribute.entity';

// 舞台少女数据
@Entity()
export class StageGirls {
  // Id
  @PrimaryGeneratedColumn()
  Id: number;

  // 内部Id
  @Column()
  AppId: number;

  // 角色Id
  @Column()
  CharacterId: number;

  // 图片地址
  @Column()
  ImageUrl: string;

  // 角色名字
  @Column()
  Name: string;

  // 演出角色
  @Column()
  CharacterName: string;

  // 角色属性
  @OneToOne(type => StageGirlsAttribute)
  @JoinColumn()
  Attribute: StageGirlsAttribute;
}
