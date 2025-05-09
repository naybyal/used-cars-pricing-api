import { 
    AfterInsert, 
    AfterUpdate, 
    AfterRemove, 
    Entity, 
    Column, 
    PrimaryGeneratedColumn 
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    email: string;
    
    @Column()
    @Exclude()
    password: string;

    @AfterInsert()
    logInsert() {
        console.log('Inserted User with id', this.id);
    }

    @AfterUpdate()
    logUpdate() {
        console.log('Updated User with id', this.id);
    }

    @AfterRemove()
    logRemove() {
        console.log('Removed User with id', this.id);
    }
    // The @AfterInsert, @AfterUpdate, and @AfterRemove decorators are used to define lifecycle hooks.
    // These hooks are called after the entity is inserted, updated, or removed from the database.
    // In this case, we are logging the id of the user that was inserted, updated, or removed.
    // This is useful for debugging and tracking changes to the entity.
    // The logInsert, logUpdate, and logRemove methods are called automatically by TypeORM
    // when the corresponding lifecycle events occur.
    // You can add any custom logic you want in these methods, such as sending notifications or updating other entities.
    // For example, you could send an email notification to the user when their account is created or updated.
    // You could also update a related entity, such as a profile or settings, when the user is created or updated.
    // This allows you to keep your code organized and maintainable by separating concerns. 
}