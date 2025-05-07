import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';


@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)     // Inject the User repository (dependency injection)
        private repo: Repository<User>
    ) {
        // The constructor is used to inject dependencies into the class.
        // In this case, we are injecting the User repository.
    }

    create(
        email: string,
        password: string
    )  {
         const user = this.repo.create({ email, password });
        // The create method is used to create a new user object.
        // It takes an object with the email and password properties.
        return this.repo.save(user);
    }

    findOne(
        id: number
    ) {
        return this.repo.findOneBy({ id });
    }

    find(
        email: string
    ) {
        return this.repo.find({ where: { email } });
    }

    async update(
        id: number,
        attributes: Partial<User>
    ) {
        const user = await this.findOne(id);

        if (!user) 
            throw new Error("User not found!");

        Object.assign(user, attributes);
        return this.repo.save(user);
    }

    async remove(
        id: number
    ) {
        const user = await this.findOne(id);

        if (!user)
            throw new Error("User not found!");

        return this.repo.remove(user);
    }
}
