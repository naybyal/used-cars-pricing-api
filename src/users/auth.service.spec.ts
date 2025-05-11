import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";

it('Can create an instance of auth service', async () => {
    
    const module = await Test.createTestingModule({
        providers: [AuthService, UsersService],
    }).compile();

    const authService = module.get(AuthService);

    expect(authService).toBeDefined();
})
