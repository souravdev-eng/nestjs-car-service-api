import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterRemove,
  AfterUpdate,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logInsert() {
    console.log('USER Insert ID IS -->', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('USER Remove ID IS -->', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('USER Update ID IS -->', this.id);
  }
}
