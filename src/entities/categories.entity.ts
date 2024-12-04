import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './products.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  img: string;

  @ManyToMany(() => Product, (product) => product.category, {
    lazy: true,
  })
  products: Promise<Product[]>;
}
