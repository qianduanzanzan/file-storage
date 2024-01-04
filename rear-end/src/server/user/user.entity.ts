import { BaseEntity, Column, Entity, PrimaryGeneratedColumn,CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({name:"user"})
export class UserEntity extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({type:'varchar',name:'account',length: 255,nullable: false,unique:true})
    account: string
    @Column({type:'varchar',name:'nick_name',length: 255,nullable: false,unique:true})
    nick_name: string
    @Column({type:'varchar',name:'password',length: 255,nullable: false})
    password: string
    @Column({type:'varchar',name:'avatar',length: 255,nullable: true})
    avatar: string
    @Column({type:'int',name:'status',nullable: false})
    status: number
    @Column({type:'int',name:'is_admin',nullable: false})
    is_admin: number
    @CreateDateColumn({
        type: 'timestamp',
        name: 'created_at',
        comment: '创建时间',
    })
    createdAt: Date;
    @UpdateDateColumn({
        type: 'timestamp',
        name: 'update_at',
        comment: '更新时间',
    })
    updateAt: Date;
}