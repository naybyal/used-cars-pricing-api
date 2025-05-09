import { 
    Body, 
    Controller, 
    Post, 
    Get, 
    Patch, 
    Delete, 
    Param, 
    Query, 
    NotFoundException,
    UseInterceptors,
    ClassSerializerInterceptor
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';


@Controller('auth')
@Serialize(UserDto)
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

    @Get('/:id')
    async findUser(
        @Param('id') id: string 
    ) {
        console.log("Handler is running...")
        const user = await this.usersService.findOne(parseInt(id));
        if (!user)
            throw new NotFoundException('User not found!');
        return user;
    }

    @Get()
    findAllUsers(
        @Query('email') email: string
    ) {
        return this.usersService.find(email);
    }

    @Delete('/:id')
    removeUser(
        @Param('id') id: string
    ) {
        return this.usersService.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(
        @Param('id') id: string,
        @Body() body: UpdateUserDto
    ) {
        return this.usersService.update(parseInt(id), body);
    }

}
