import { Test } from "@nestjs/testing";
import { 
    BadRequestException,
    NotFoundException
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";

describe('AuthService', () => {
    let authService: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        fakeUsersService = {
            find: (email: string) => Promise.resolve([]),
            create: (email: string, password: string) => 
                Promise.resolve({ id: 1, email, password } as User),
        };


        const module = await Test.createTestingModule({
            providers: [
                AuthService, 
                {
                    provide: UsersService,
                    useValue: fakeUsersService,
                },
            ],
        }).compile();

        authService = module.get(AuthService);
    });

    it ('Can create an instance of auth service', async () => {

        expect(authService).toBeDefined();
    });

    it ("Can create a new user with salted and hashed password", async() => {
        const user = await authService.signup("testuser404@test.com", "testPass404");
        
        expect(user.password).not.toEqual("testPass404");
        
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();

    });

    it('Throws an error if user signs up with email that is in use', async () => {
        fakeUsersService.find = () =>
          Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
            
        await expect(
            authService.signup('test_signup@test.com', 'testPassword403')
        ).rejects.toThrow(BadRequestException);
    });

    it ("Throws an error if signin is called with an unused email", async () => {
        await expect(
            authService.signin("test@testifed.com", "testPass404"),
        ).rejects.toThrow(NotFoundException);
    });

    it ("Throws an error if an invalid password is provided", async () => {
        fakeUsersService.find = () =>
            Promise.resolve([{ id: 1, email: "test@test.com", password: "testPass404" } as User]);
        
        await expect(
            authService.signin("test9@test.com", "wrongPass"),
        ).rejects.toThrow(BadRequestException);
    });

    it ("Returns a user if correct password is provided", async () => {
        fakeUsersService.find = () =>
            Promise.resolve([{ id: 1, email: "testify@testify.com", password: "b29c8b660032e204.0bcc5ec1d4f7c9d6ca64734a012af1d53fdca94f05cba94c83d947c6cb4f6e44" } as User]);
        
        const user = await authService.signin("testify@testify.com", "testPass404");
        expect(user).toBeDefined();
    });
});
