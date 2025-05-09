import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {

    constructor(private usersService: UsersService) {}

    async signin(
        email: string,
        password: string
    ) {

        // Find the user by email
        const [user] = await this.usersService.find(email);

        if (!user)
            throw new BadRequestException('Invalid credentials!');

        // Get the salt and hash from the stored password
        const [salt, storedHash] = user.password.split('.');

        // Hash the password with the salt
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        
        // Compare the hash with the stored hash
        if (storedHash !== hash.toString('hex'))
            throw new BadRequestException('Invalid credentials!');
    
        return user;
    }

    async signup(
        email: string,
        password: string
    ) {

        // Check if the user already exists
        const users = await this.usersService.find(email);

        if (users.length)
            throw new BadRequestException('User already exists; email in use!');
    
        //          --- Hash the password ---

        // 1. Generate a salt
        const salt = randomBytes(8).toString('hex');

        // 2. Hash the password with the salt
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        // 3. Store the salt and hash in the database
        const hashedAndSaltedPassword = salt + '.' + hash.toString('hex');
        const user = await this.usersService.create(email, hashedAndSaltedPassword);

        return user;
    }
}