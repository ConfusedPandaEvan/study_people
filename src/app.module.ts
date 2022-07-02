import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocialloginModule } from './sociallogin/sociallogin.module';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://test:sparta@cluster0.ylhhbdq.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }),
    SocialloginModule,
    UserModule],
  controllers: [AppController],
  providers: [AppService, UserService],
})
export class AppModule {}
