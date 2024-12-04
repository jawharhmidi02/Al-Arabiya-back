import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './products.entity';

@Entity()
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  img: string;

  @OneToMany(() => Product, (product) => product.category, { lazy: true })
  products: Promise<Product[]>;
}
