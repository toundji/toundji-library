import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class Audit extends BaseEntity {

    @PrimaryGeneratedColumn()
    id?: number;

    @CreateDateColumn({ name: 'created_at', })
    createdAt?: Date;

    @Column({ name: 'created_by', nullable: true, })
    createdBy?: number;

    @DeleteDateColumn({ name: 'deleted_at', nullable: true })
    deletedAt?: Date;
}