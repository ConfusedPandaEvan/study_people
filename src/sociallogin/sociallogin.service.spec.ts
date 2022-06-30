import { Test, TestingModule } from '@nestjs/testing';
import { SocialloginService } from './sociallogin.service';

describe('SocialloginService', () => {
  let service: SocialloginService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocialloginService],
    }).compile();

    service = module.get<SocialloginService>(SocialloginService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
