import { Controller,Post,Body,UseGuards, Headers } from '@nestjs/common';
 
import { LoginService } from './login.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class LogonController {
    constructor(
        private readonly loginService: LoginService
    ) { }

    // 登录
    @Post('login')
    async login(@Body()loginDto:LoginDto):Promise<any> {
        return await this.loginService.login(loginDto)
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('logout')
    async logout(@Body('user_id')user_id:String):Promise<any> {
        return await this.loginService.logout(user_id)
    }
}
