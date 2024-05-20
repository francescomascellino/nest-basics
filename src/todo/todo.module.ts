// todo/todo.module.ts

import { Module } from '@nestjs/common';

// Import TypeOrm
import { TypeOrmModule } from '@nestjs/typeorm';

// Import Todo Entity
import { Todo } from './entities/todo/todo';
import { TodoService } from './services/todo/todo.service';
import { TodoMapperService } from './services/todo-mapper/todo-mapper.service';

@Module({
    imports: [

        // Register the Todo entity with TypeOrmModule
        TypeOrmModule.forFeature([Todo])
    ],
    providers: [TodoService, TodoMapperService],
    controllers: []
})
export class TodoModule { }
