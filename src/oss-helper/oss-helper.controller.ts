import { Controller, Post } from '@nestjs/common';
import { OSSHelperService } from './oss-helper.service';

@Controller('OSSHelper')
export class OssHelperController {
  constructor(private readonly ossHelperService: OSSHelperService) {}

  @Post('/Upload')
  async upload(ossPath: string, localPath: string): Promise<any> {
    return await this.ossHelperService.uploadFile(ossPath, localPath);
  }
}
