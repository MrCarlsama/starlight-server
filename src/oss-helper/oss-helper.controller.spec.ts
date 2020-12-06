import { Test, TestingModule } from '@nestjs/testing';
import { OssHelperController } from './oss-helper.controller';

describe('OssHelperController', () => {
  let controller: OssHelperController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OssHelperController],
    }).compile();

    controller = module.get<OssHelperController>(OssHelperController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
