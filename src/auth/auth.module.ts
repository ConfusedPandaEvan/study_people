import { Module } from '@nestjs/common';
import { ControllerAuthGuard } from './controllerauth.guard';
import { UserSchema } from 'src/users/user.Schema';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
    imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
    providers: [ControllerAuthGuard]
})
export class AuthModule {}
