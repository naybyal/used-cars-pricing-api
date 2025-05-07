import { Body, Controller, Post, Get } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {

    constructor(
        // The constructor is used to inject dependencies into the class.
        // In this case, we are injecting the UsersService.
        private usersService: UsersService
    ) {}

    @Post('/signup')
    createUser(
        @Body() body: CreateUserDto
    ) {
        // The createUser method is used to handle the POST request to the /signup endpoint.
        // It takes a CreateUserDto object as the request body.
        // It calls the create method of the UsersService to create a new user.
        // The @Body() decorator is used to extract the request body and map it to the CreateUserDto object.
        this.usersService.create(body.email, body.password);
    }

    
}
