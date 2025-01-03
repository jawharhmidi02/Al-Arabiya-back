import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderProduct } from './orderProduct.entity';
import { Users } from './users.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'Waiting to get Accepted...' })
  state: string;

  @CreateDateColumn()
  created_At: Date;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  city: string;

  @Column()
  address: string;

  @Column({ default: 0 })
  deliveryPrice: number;

  @Column({ default: 'delivery' })
  type: string;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order, {
    cascade: true,
  })
  order_Products: OrderProduct[];

  @ManyToOne(() => Users, (user) => user.orders, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  user: Users;
}
