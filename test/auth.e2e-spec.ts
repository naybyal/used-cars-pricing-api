import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/users/auth.service';

describe('Authentication System (e2e)', () => {
    let app: INestApplication<App>;
    let mockUsersService: Partial<UsersService>;
    let mockAuthService: Partial<AuthService>;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('handles a signup request', () => {
        const email = 'test@test.com';

        return request(app.getHttpServer())
            .post('/auth/signup')
            .send({
                email,
                password: 'test',
            })
            .expect(201)
            .then((response) => {
                const { id, email } = response.body;
                
                expect(id).toBeDefined();
                expect(email).toEqual(email);
            });
    });
});
