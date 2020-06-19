import 'source-map-support/register';
import * as uuid from 'uuid';
import { APIGatewayProxyEvent } from 'aws-lambda';

import TodosAccess from '../dataLayer/todosAccess';
import TodosStorage from '../dataLayer/todosStorage';
import { getmyUserID } from '../lambda/utils';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import { TodoItem } from '../models/TodoItem';

const myTodosAccess = new TodosAccess();
const myTodosStorage = new TodosStorage();



export async function createTodo(event: APIGatewayProxyEvent,
                                 createTodoRequest: CreateTodoRequest): Promise<TodoItem> {
    const myTodoID = uuid.v4();
    const myUserID = getmyUserID(event);

    const timeCreated = new Date(Date.now()).toISOString();



    const todoItem = {
        myUserID,
        myTodoID,
        timeCreated,
        done: false,
        attachmentUrl: `https://${myTodosStorage.getBucketName()}.s3.amazonaws.com/${myTodoID}`, ...createTodoRequest
    };

    await myTodosAccess.addTodoToDB(todoItem);
    return todoItem;
}

export async function deleteTodo(event: APIGatewayProxyEvent) {
    const myTodoID = event.pathParameters.myTodoID;
    const myUserID = getmyUserID(event);

    if (!(await myTodosAccess.getTodoFromDB(myTodoID, myUserID))) {
    return false;
    }

    await myTodosAccess.deleteTodoFromDB(myTodoID, myUserID);
        return true;
}

export async function getTodo(event: APIGatewayProxyEvent) {
    const myTodoID = event.pathParameters.myTodoID;

    const myUserID = getmyUserID(event);
return await myTodosAccess.getTodoFromDB(myTodoID, myUserID);
}






export async function getTodos(event: APIGatewayProxyEvent) {
    const myUserID = getmyUserID(event);
  return await myTodosAccess.getAllTodosFromDB(myUserID);
}

export async function updateTodo(event: APIGatewayProxyEvent,
                                 updateTodoRequest: UpdateTodoRequest) {
    const myTodoID = event.pathParameters.myTodoID;

    const myUserID = getmyUserID(event);

    if (!(await myTodosAccess.getTodoFromDB(myTodoID, myUserID))) {
        return false;
    }

    await myTodosAccess.updateTodoInDB(myTodoID, myUserID, updateTodoRequest);
    return true;
}

export async function generateUploadUrl(event: APIGatewayProxyEvent) {
    const bucket = myTodosStorage.getBucketName();
    const urlExpiration = process.env.SIGNED_URL_EXPIRATION;

      const myTodoID = event.pathParameters.myTodoID;

    const mySignedURLReq = {
        Bucket: bucket,
        Key: myTodoID,
        Expires: urlExpiration
    }

    return myTodosStorage.getPresignedUploadURL(mySignedURLReq);
}
