// src/todo/dto/add-todo.dto.ts

export class AddTodoDto {

    public readonly title: string;

    public constructor(opts?: Partial<AddTodoDto>) {
        Object.assign(this, opts);
    }

}