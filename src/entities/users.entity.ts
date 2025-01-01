import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from './orders.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  full_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @Column()
  city: string;

  @Column()
  address: string;

  @Column({ type: 'json', default: {} })
  cart: Record<string, number>;

  @OneToMany(() => Order, (order) => order.user, {
    cascade: true,
  })
  orders: Order[];

  @Column({ default: 'client' })
  role: string;

  @Column({ nullable: true })
  nonce: string;
}
