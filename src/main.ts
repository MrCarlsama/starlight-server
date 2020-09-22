import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 静态文件
  app.useStaticAssets(join(__dirname, '../static/'), {
    prefix: '/static/', // 虚拟名称 http://localhost:3010/static/...png
  });

  // 处理跨域
  app.enableCors();

  await app.listen(9000);
}
bootstrap();
