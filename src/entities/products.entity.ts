import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './categories.entity';
import { Brand } from './brands.entity';
import { OrderProduct } from './orderProduct.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column({ type: 'text', array: true, default: [] })
  img: string[];

  @Column({ default: false, nullable: true })
  onSold: boolean;

  @Column({ default: 0, nullable: true })
  soldPercentage: number;

  @Column({ type: 'float' })
  normalSinglePrice: number;

  @Column({ type: 'float', default: 0 })
  soldSinglePrice: number;

  @Column({ type: 'float' })
  normalMultiPrice: number;

  @Column({ type: 'float', default: 0 })
  soldMultiPrice: number;

  @Column({ type: 'boolean', default: true })
  in_Stock: boolean;

  @Column({ default: new Date() })
  created_At: Date;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  category: Category;

  @ManyToOne(() => Brand, (brand) => brand.products, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  brand: Brand;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.product, {
    cascade: true,
  })
  orderProducts: OrderProduct[];
}
