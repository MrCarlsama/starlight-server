import { Module } from '@nestjs/common';
import { OssHelperController } from './oss-helper.controller';
import { OSSHelperService } from './oss-helper.service';

@Module({
  imports: [],
  controllers: [OssHelperController],
  providers: [OSSHelperService],
  exports: [OSSHelperService],
})
export class OSSHelperModule {}
