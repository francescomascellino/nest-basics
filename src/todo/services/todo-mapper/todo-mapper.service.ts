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
