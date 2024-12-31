import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SpecialOffer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  href: string;

  @Column()
  img: string;
}
