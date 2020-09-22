import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

enum AttackType {
  普通 = 1,
  特殊 = 2,
}

enum CharacterAttribute {
  花 = 1,
  风,
  雪,
  月,
  宙,
  云,
  梦,
}

@Entity()
export class StageGirlsAttribute {
  // Id
  @PrimaryGeneratedColumn()
  Id: number;

  // 内部Id
  @Column()
  AppId: number;

  // 初始星
  @Column()
  Rarity: number;

  // 站位 1-2-3
  @Column()
  PositionType: string;

  // 角色属性
  @Column({
    type: 'enum',
    enum: CharacterAttribute,
  })
  AttributeType: CharacterAttribute;

  // 攻击类型
  @Column({
    type: 'enum',
    enum: AttackType,
  })
  AttackType: AttackType;

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

  // 速度
  @Column()
  Agility: number;
}
