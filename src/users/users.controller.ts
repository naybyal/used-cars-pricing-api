import { Controller, Post, Get } from '@nestjs/common';

@Controller('auth')
export class UsersController {
    @Post('/signup')
    createUser() {
        
    }
}
