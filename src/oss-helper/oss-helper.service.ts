import * as OSS from 'ali-oss';
import { Injectable } from '@nestjs/common';
import { OSS_CONFIG } from 'src/config';

@Injectable()
export class OSSHelperService {
  private client: OSS;
  public constructor() {
    this.client = new OSS({ ...OSS_CONFIG });
  }

  /**
   *
   * @param ossPath
   * @param localPath
   */
  async uploadFile(ossPath: string, localPath: string): Promise<any> {
    try {
      const isHas = await this.isExistObject(ossPath);
      if (!isHas) {
        console.log(`${ossPath} 开始OSS上传`);
        let result = await this.client.put(ossPath, localPath);
        // ossPath可以自定义为文件名（例如file.txt）或目录（例如abc/test/file.txt）的形式，实现将文件上传至当前Bucket或Bucket下的指定目录。
        await this.client.putACL(ossPath, 'public-read');
        console.log(`${ossPath} OSS上传成功`);
      }
    } catch (e) {
      console.log(e);
      console.log(`${ossPath} 上传oss失败，重新上传`);
      const isHas = await this.isExistObject(ossPath);
      if (!isHas) {
        this.uploadFile(ossPath, localPath);
      }
    }
  }
  /**
   *
   * @param name
   * @param options
   */
  async isExistObject(
    name: string,
    options: OSS.HeadObjectOptions = {},
  ): Promise<boolean> {
    try {
      await this.client.head(name, options);
      // console.log(`${name}, 文件存在`);
      return true;
    } catch (error) {
      if (error.code === 'NoSuchKey') {
        console.log(`${name}, 文件不存在`);
        return false;
      }
    }
  }
}
