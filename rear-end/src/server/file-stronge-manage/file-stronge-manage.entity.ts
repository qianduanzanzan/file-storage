import { BaseEntity, Column, Entity, PrimaryGeneratedColumn,CreateDateColumn,UpdateDateColumn } from "typeorm";

@Entity({name:"FileStrongeManage"})
export class FileStrongeManageEntity extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({type:'varchar',name:'name',length: 255,nullable: false,unique:true})
    name: string
    @Column({type:'varchar',name:'pid',length: 255,nullable: true})
    pid: string
    @Column({type:'varchar',name:'suffix',length: 255,nullable: true})
    suffix: string
    @Column({type:'varchar',name:'file_name',length: 255,nullable: true})
    fileName: string
    @Column({type:'bigint',name:'type',nullable: false})
    type: number
    @Column({type:'bigint',name:'del_status',nullable: false})
    del_status: number
    @Column({type:'double',name:'size',nullable: true})
    size: number
    @Column({type:'varchar',name:'uuid',nullable: true})
    uuid: string
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