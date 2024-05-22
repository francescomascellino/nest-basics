<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
 
## Installation

```bash
npm i -g @nestjs/cli
nest new [project-name]
```

```bash
npm install
```

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Basic CLI commands

```bash
nest g # generate

nest g module [moduleName] # generates a module named "moduleName"

nest g controller [controllerName] # generates a controller named "controllerName"

nest g service [serviceName] # generates a service named "serviceName"

# add --no-spec to skip tests scaffolding
```

## Modules

Modules in NestJS allow us to organize our application into distinct features or "competences." They help manage the application's structure by grouping related components, such as services, controllers, and providers, and defining the Dependency Injection (DI) context for those components.

let's generate our first module

```bash
nest generate module todo
```

This will scafold the todo directory and the file ***todo.module.ts***

```ts
// todo.module.ts
import { Module } from '@nestjs/common';

@Module({})
export class TodoModule {}
```
The ***@Module*** decorator is used to define the module's metadata, such as its name, imports, and exports. 

```ts
@Module({
  imports: [],
  providers: [],
  controllers: []
})
export class TodoModule {}
```

In this case, we  have not specified any imports or exports, so the module will not have any dependencies or be exported to other modules.

## Entities

Entities are classes that maps or database tables or collecions.

```bash
nest generate class todo/entities/Todo --no-spec
```

this will scaffold the file ***src/todo/entities/todo/todo.ts*** for the Todo class

```ts
export class Todo {}
```

We can add the properties of the Todo class to define our database entity

```ts
export class Todo {

    public id: number;
    public title: string;
    public completed: boolean;

    public constructor(title: string) {
        this.title = title;
        this.completed = false; // newly added tasks are not completed by default
    }

}
```

and will add the imports in Nest base Module, AppModule (***app.module.ts***) 

```ts
// src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo/todo.module';

@Module({
    imports: [TodoModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
```

In this guide we will use TypeOrm as ORM and squlite3

```bash
npm i @nestjs/typeorm typeorm sqlite3
```

We import in Nest base Module, AppModule (***app.module.ts***) TypeOrmModule with the ***forRoot()*** static method.

```ts
// src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// IMPORT Typeorm
import { TypeOrmModule } from '@nestjs/typeorm';
// IMPORT path
import * as path from 'path';
import { TodoModule } from './todo/todo.module';

@Module({
    imports: [

        // IMPORT Typeorm
        TypeOrmModule.forRoot({
            type: 'sqlite',
            autoLoadEntities: true,
            synchronize: true,
            database: path.resolve(__dirname, '..', 'db.sqlite')
        }),

        TodoModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
```

### TypeOrmModule.foRoot()
The ***forRoot()*** method is used to configure the TypeOrmModule. We pass the connection options as the first argument and the entities as the
second argument. The connection options are used to configure the database connection.

***forRoot()*** sets up the global database connection and configuration, needed once in the application's root module.

```ts
TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'test',
    password: 'test',
    database: 'test',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
})
```

Let's add the TypeOrmModule to our module ***todo.module.ts***, this time using the ***forFeature()*** method, specifying ***Todo*** as the entity to manage:

```ts
// src/todo/todo.module.ts

import { Module } from '@nestjs/common';

// Import TypeOrm
import { TypeOrmModule } from '@nestjs/typeorm';

// Import Todo Entity
import { Todo } from './entities/todo/todo';

@Module({
    imports: [

        // Register the Todo entity with TypeOrmModule
        TypeOrmModule.forFeature([Todo])
    ],
    providers: [],
    controllers: []
})
export class TodoModule { }
```

### TypeOrmModule.forFeature()
The ***forFeature()*** method is used to register an entity with the TypeOrmModule for a particular module, allowing those entities to be injected and used within that module.

Now that we have configured TypeORM, we can finally update our ***Todo entity*** with all the necessary rules:

```ts
// src/todo/entities/todo/todo.ts

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
```

## DTO
A DTO is a data transfer object that is used to transfer data between ors services.
 A DTO is an object that defines how the data will be sent over the network.

```ts
// src/todo/dto/add-todo.dto.ts

export class AddTodoDto {

    public readonly title: string;

    public constructor(opts?: Partial<AddTodoDto>) {
    Object.assign(this, opts);
    }

}
```

```ts
// src/todo/dto/edit-todo.dto.ts

export class EditTodoDto {

    public readonly title: string;
    public readonly completed: boolean;

    public constructor(opts?: Partial<EditTodoDto>) {
        Object.assign(this, opts);
    }

}
```

```ts
// src/todo/dto/todo.dto.ts

export class TodoDto {

    public readonly id: number;
    public readonly title: string;
    public readonly completed: boolean;

    public constructor(opts?: Partial<TodoDto>) {
        Object.assign(this, opts);
    }

}
```

***Partial*** is a TS type that makes partially optional our class/interface properties.
In our specific case, ***Partial<AddTodoDto>*** indicates that the object passed to the constructor of the ***AddTodoDto*** class can have only some of the properties defined in the ***AddTodoDto*** class, and these properties can be optional rather than mandatory.
We need Partial in the ***add-todo.dto.ts*** becuse we have not to the fine the completed property as it will be false by default, and we need it in the ***edit-todo.dto.ts*** because we could edit only one of the properties.

The *** Object.assign()*** static method copies all enumerable own properties from one or more source objects to a target object. It returns the modified target object.


## Services
Services contain our app business logic, giving us a defined set of features (like the methods findAll, findOne, add, edit e delete).

We will create a service that maps a Todo (***src/todo/entities/todo/todo.ts***) class and converts it into a TodoDto Class (***src/todo/dto/todo.dto.ts***), converting a database entity to a data transfer object.

```bash
nest generate service todo/services/TodoMapper
```

The command will scaffold the ***todo-mapper.service-ts*** file.

```ts
// src/services/todo-mapper/todo-mapper.service.ts

import { Injectable } from '@nestjs/common';
// Import Todo and TodoDto Classes
import { Todo } from '../../entities/todo/todo'
import { TodoDto } from '../../dto/todo.dto';

@Injectable()
export class TodoMapperService {

    // Maps a Todo object to a TodoDto object. Accepts a Todo object as a parameter and returns a TodoDto object.
    public modelToDto({ id, title, completed }: Todo): TodoDto {
        return new TodoDto({ id, title, completed });
    }

}
```

TodoMapper has the @Injectable() decoration, so we will be able to inject it on out TodoService, in wich we will implement the findAll, findOne, add, edit e delete features.

```bash
nest generate service todo/services/todo
```

The command will scaffold the ***todo.service.ts*** file.

```ts
// src/todo/services/todo/todo.service.ts

import { Injectable } from '@nestjs/common';

@Injectable()
export class TodoService { }
```

Add the methods we will serve to the controller:

```ts
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
    public async remove(id): Promise<Todo> {
        let todo = await this.todoRepository.findOne(id);

        if (!todo) throw new NotFoundException();

        todo = await this.todoRepository.remove(todo);

        return todo;
    }

}
```

## Controller

Create the controller using CLI

```bash
nest generate controller todo/controllers/todo
```

The command will scaffold the ***todo.controller.ts*** file.

```ts
// src/todo/controllers/todo/todo.controller.ts

import { Controller } from '@nestjs/common';

// The @Controller('todo') decorator sets the base path for all routes defined within this controller to '/todo' (ex: http://localhost:3000/todo/).
@Controller('todo')
export class TodoController {}
```

Implement the CRUD methods in the controller, calling the ***todoService*** methods

```ts
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
    // ParseIntPipe si assicura di convertire evebtuali stringe in numeri
    public findOne(@Param('id', ParseIntPipe) id: number): Promise<TodoDto> {
        console.log(`Controller received id: ${id}`);
        return this.todoService.findOne(id);
    }

    // EDIT
    @Put(':id')
    public edit(@Param('id', ParseIntPipe) id: number, @Body() todo: EditTodoDto): Promise<TodoDto> {
        console.log(`Controller received id: ${id}`);
        return this.todoService.edit(id, todo);
    }

    // CREATE
    @Post()
    public add(@Body() todo: AddTodoDto): Promise<TodoDto> {
        return this.todoService.add(todo);
    }

    // DESTROY
    @Delete(':id')
    public remove(@Param('id', ParseIntPipe) id: number): Promise<TodoDto> {
        return this.todoService.remove(id);
    }

}
```

## Generating a new resource
To create a new resource, simply run the following command in the root directory of your project:

```bash
$ nest g resource [resourceName]
```

The command not only generates all the NestJS building blocks (module, service, controller classes) but also an entity class, DTO classes as well as the testing (.spec) files and will import the module in ***AppModule***.

```bash
$ nest g resource test/test/
```

will generate:

```bash
CREATE src/test/test/test.controller.ts (917 bytes)
CREATE src/test/test/test.controller.spec.ts (576 bytes)
CREATE src/test/test/test.module.ts (250 bytes)
CREATE src/test/test/test.service.ts (633 bytes)
CREATE src/test/test/test.service.spec.ts (464 bytes)
CREATE src/test/test/dto/create-test.dto.ts (31 bytes)
CREATE src/test/test/dto/update-test.dto.ts (173 bytes)
CREATE src/test/test/entities/test.entity.ts (22 bytes)
```