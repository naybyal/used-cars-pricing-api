import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let mockUsersService: Partial<UsersService>;
  let mockAuthService: Partial<AuthService>;

  beforeEach(async () => {
    mockUsersService = {
      findOne: (
        id: number
      ) => {
        return Promise.resolve({ id, email: 'test@test.com', password: 'test' } as User); 
      },
      find: (
        email: string
      ) => {
        return Promise.resolve([
          { id: 1, email, password: 'test' } 
        ] as User[]);
      },
      // remove: () => {},
      // update: () => {},
    };

    mockAuthService = {
      signin: (
        email: string,
        password: string
      ) => {
        return Promise.resolve({ id: 1, email, password } as User);
      }
      
      // signup: () => {},
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it ('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it ("findUser throws an error if user with a given id is not found", async () => {
    mockUsersService.findOne = () => null;

    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it ("findAllUsers returns an array of users", async () => {
    const users = await controller.findAllUsers('test@test.com');
    
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('test@test.com');
  });

  it ("signin updates session object and returns user", async () => {
    const session = { userId: -1 };
    const user = await controller.signin(
      { email: 'test@test.com', password: 'test' },
      session
    );

    expect(user.id).toEqual(1);
    expect(session['userId']).toEqual(1);
    expect(session['userId']).toEqual(user.id);
  });
});
