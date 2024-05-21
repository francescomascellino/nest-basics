// src/todo/services/todo/todo.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';

import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';

// imports Todo entity
import { Todo } from '../../entities/todo/todo';

// Imports DTOs
import { TodoDto } from '../../dto/todo.dto';
import { AddTodoDto } from '../../dto/add-todo.dto';
import { EditTodoDto } from '../../dto/edit-todo.dto';

// Imports TodoMapperService
import { TodoMapperService } from '../todo-mapper/todo-mapper.service';

@Injectable()
export class TodoService {

    public constructor(

        // The @InjectRepository decorator is used to obtain an instance of the Repository<Todo> from TypeORM. 
        //This repository will be used to interact with the database for CRUD operations related to the Todo entity.
        @InjectRepository(Todo) private readonly todoRepository: Repository<Todo>,
        private readonly todoMapper: TodoMapperService
    ) { }


    // INDEX
    public async findAll(): Promise<TodoDto[]> {
        const todos = await this.todoRepository.find();
        return todos.map(this.todoMapper.modelToDto);
    }

    // SHOW
    public async findOne(id: number): Promise<TodoDto> {

        // SELECT * FROM todo WHERE id = ?
        const todo = await this.todoRepository.findOne(
            {
                where: {
                    id
                }
            }
        );

        if (!todo) throw new NotFoundException(`Todo with id ${id} not found`);

        return this.todoMapper.modelToDto(todo);

    } catch(error) {
        console.error('Error in findOne service method:', error);
        throw new Error('Internal server error');
    }

    // CREATE
    public async add({ title }: AddTodoDto): Promise<TodoDto> {
        let todo = new Todo(title);
        todo = await this.todoRepository.save(todo);
        return this.todoMapper.modelToDto(todo);
    }

    // EDIT
    public async edit(id: number, { title, completed }: EditTodoDto): Promise<TodoDto> {

        let todo = await this.todoRepository.findOne(
            {
                where: {
                    id
                }
            }
        );

        console.log(todo);

        if (!todo) throw new NotFoundException();

        todo.completed = completed;
        todo.title = title;

        todo = await this.todoRepository.save(todo);

        return this.todoMapper.modelToDto(todo);
    }

    // DESTROY
    public async remove(id: number): Promise<Todo> {
        let todo = await this.todoRepository.findOne(
            {
                where: {
                    id
                }
            }
        );

        if (!todo) throw new NotFoundException();

        todo = await this.todoRepository.remove(todo);

        return todo;
    }

}
