import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StageGirlsModule } from './stage-girls/stage-girls.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'caonima33',
      database: 'starlight',
      autoLoadEntities: true,
      synchronize: true,
    }),
    StageGirlsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
