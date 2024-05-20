// src/todo/entities/todo/todo.ts

/* 
export class Todo {

    public id: number;
    public title: string;
    public completed: boolean;

    public constructor(title: string) {
        this.title = title;
        this.completed = false;
    }

}
 */

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Todo {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public title: string;

    @Column()
    public completed: boolean;

    public constructor(title: string) {
        this.title = title;
        this.completed = false;
    }
}