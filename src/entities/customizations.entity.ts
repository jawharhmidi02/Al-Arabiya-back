import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinTable,
  ManyToOne,
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

  @OneToMany(() => Product, (product) => product.customization)
  featuredProducts: Product[];

  @OneToMany(() => Category, (category) => category.customization)
  categories: Category[];

  @OneToMany(() => Brand, (brand) => brand.customization)
  brands: Brand[];
}
