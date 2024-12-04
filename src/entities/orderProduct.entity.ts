import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './products.entity';
import { Order } from './orders.entity';

@Entity()
export class OrderProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.order_Products, {
    onDelete: 'CASCADE',
  })
  order: Order;

  @ManyToOne(() => Product, (product) => product.id, {
    eager: true,
    onDelete: 'CASCADE',
  })
  product: Product;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'float' })
  price: number;
}
