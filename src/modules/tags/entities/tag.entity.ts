import { Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({ timestamps: false })
export class Tag extends Model<Tag> {
  @PrimaryKey
  @Column({ type: DataType.STRING(64) })
  name: string;
}
