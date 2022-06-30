import { Test, TestingModule } from '@nestjs/testing';
import { SocialloginController } from './sociallogin.controller';

describe('SocialloginController', () => {
  let controller: SocialloginController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SocialloginController],
    }).compile();

    controller = module.get<SocialloginController>(SocialloginController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
