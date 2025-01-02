import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './products.entity';
import { Customization } from './customizations.entity';

@Entity()
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  img: string;

  @OneToMany(() => Product, (product) => product.brand)
  products: Product[];

  @ManyToOne(() => Customization, (customization) => customization.brands, {
    onDelete: 'CASCADE',
  })
  customization: Customization;
}
