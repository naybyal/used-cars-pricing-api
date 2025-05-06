import { Body, Controller, Post, Get } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class UsersController {
    @Post('/signup')
    createUser(
        @Body() body: CreateUserDto
    ) {
        console.log(body);
    }
}
