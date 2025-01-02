import {
  Column,
  CreateDateColumn,
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
import { Customization } from './customizations.entity';

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

  @Column({ type: 'float', default: 0, nullable: true })
  soldPercentage: number;

  @Column({ type: 'float' })
  normalSinglePrice: number;

  @Column({ type: 'float', default: 0, nullable: true })
  soldSinglePrice: number;

  @Column({ type: 'float' })
  normalMultiPrice: number;

  @Column({ type: 'float', default: 0, nullable: true })
  soldMultiPrice: number;

  @Column({ type: 'boolean', default: true })
  in_Stock: boolean;

  @CreateDateColumn()
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

  @ManyToOne(
    () => Customization,
    (customization) => customization.featuredProducts,
    {
      onDelete: 'SET NULL',
    },
  )
  customization: Customization;
}
