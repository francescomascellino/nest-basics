// src/todo/controllers/todo/todo.controller.ts

// Import TodoService
import { TodoService } from 'src/todo/services/todo/todo.service';

// Imports DTOs
import { TodoDto } from '../../dto/todo.dto';
import { AddTodoDto } from '../../dto/add-todo.dto';
import { EditTodoDto } from '../../dto/edit-todo.dto';

import {
    Controller,

    // Import decorators for handling HTTP requests
    Get, Post, Body, Put, Param, Delete
} from '@nestjs/common';

// The @Controller('todo') decorator sets the base path for all routes defined within this controller to '/todo' (ex: http://localhost:3000/todo/).
@Controller('todo')
export class TodoController {

    public constructor(private readonly todoService: TodoService) { }

    // INDEX
    @Get()
    // // Returns a Promise that represents the completion of an asynchronous operation, resolving with an array of TodoDto objects.
    public findAll(): Promise<TodoDto[]> {
        // Invokes the findAll() method of the todoService to retrieve all TodoDto objects.
        return this.todoService.findAll();
    }

    // SHOW
    @Get(':id')
    public findOne(@Param('id') id: number): Promise<TodoDto> {
        return this.todoService.findOne(id);
    }

    // EDIT
    @Put(':id')
    public edit(@Param('id') id: number, @Body() todo: EditTodoDto): Promise<TodoDto> {
        return this.todoService.edit(id, todo);
    }

    // CREATE
    @Post()
    public add(@Body() todo: AddTodoDto): Promise<TodoDto> {
        return this.todoService.add(todo);
    }

    // DESTROY
    @Delete(':id')
    public remove(@Param('id') id: number): Promise<TodoDto> {
        return this.todoService.remove(id);
    }

}
