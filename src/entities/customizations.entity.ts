import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Brand } from './brands.entity';
import { Category } from './categories.entity';
import { Product } from './products.entity';

@Entity()
export class Customization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  deliveryPrice: number;

  @ManyToMany(() => Product)
  @JoinTable()
  featuredProducts: Product[];

  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[];

  @ManyToMany(() => Brand)
  @JoinTable()
  brands: Brand[];
}
