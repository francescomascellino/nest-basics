// src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { TodoModule } from './todo/todo.module';

import { Todo } from './todo/entities/todo/todo';

import { TodoMapperService } from './todo/services/todo-mapper/todo-mapper.service';

import { TodoController } from './todo/controllers/todo/todo.controller';
import { TodoService } from './todo/services/todo/todo.service';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            autoLoadEntities: true,
            synchronize: true,
            database: path.resolve(__dirname, '..', 'db.sqlite'),
            entities: [Todo],
        }),

        TodoModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
