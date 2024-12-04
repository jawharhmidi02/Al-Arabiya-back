import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderProduct } from './orderProduct.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  state: string;

  @Column({ default: new Date() })
  created_At: Date;

  @Column()
  client_Name: string;

  @Column()
  client_Phone: string;

  @Column()
  client_Email: string;

  @Column()
  client_Address: string;

  @Column()
  type: string;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order, {
    cascade: true,
  })
  order_Products: OrderProduct[];
}
