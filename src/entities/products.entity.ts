import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './categories.entity';
import { Brand } from './brands.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  img: string;

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

  @ManyToMany(() => Category, (category) => category.id, {
    onDelete: 'CASCADE',
  })
  category: Category[];

  @ManyToOne(() => Brand, (brand) => brand.id, {
    onDelete: 'SET NULL',
  })
  brand: Brand;
}
