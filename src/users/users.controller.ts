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
    UseGuards,
    Session,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { User } from './entities/user.entity';
import { UserDto } from './dtos/user.dto';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {

    constructor(
        private usersService: UsersService,
        private authService: AuthService
    ) {
    }

    @Get('/whoami')
    @UseGuards(AuthGuard)
    whoAmI(
        @CurrentUser() user: User
    ) {

        return user;
    }
    
    @Post('/signup')
    async createUser(
        @Body() body: CreateUserDto,
        @Session() session: any
    ) {

        const user = await this.authService.signup(
            body.email,
            body.password
        );

        session.userId = user.id;

        return user;
    }

    @Post('/signin')
    async signin(
        @Body() body: CreateUserDto,
        @Session() session: any
    ) {

        const user = await this.authService.signin(
            body.email,
            body.password
        );

        session.userId = user.id;

        return user;
    }

    @Post('/signout')
    signout(
        @Session() session: any
    ) {
        
        session.userId = null;
        return { message: 'User signed out!' };
    }

    @Get('/:id')
    async findUser(
        @Param('id') id: string 
    ) {

        // console.log("Handler is running...")
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
