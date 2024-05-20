// src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { TodoModule } from './todo/todo.module';

@Module({
    imports: [
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
