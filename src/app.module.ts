import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DATABASE_CONFIG } from './config';
import { OSSHelperModule } from './oss-helper/oss-helper.module';
import { StageGirlsModule } from './stage-girls/stage-girls.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: DATABASE_CONFIG.host,
      port: DATABASE_CONFIG.port,
      username: DATABASE_CONFIG.username,
      password: DATABASE_CONFIG.password,
      database: 'starlight',
      autoLoadEntities: true,
      synchronize: true,
    }),
    StageGirlsModule,
    OSSHelperModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
