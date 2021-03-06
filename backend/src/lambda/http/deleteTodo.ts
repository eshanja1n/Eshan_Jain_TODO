import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';


import { deleteTodo } from '../../businessLogic/todos';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {


  //const todoId = event.pathParameters.todoId

  // TODO: Remove a TODO item by id


  if (!(await deleteTodo(event))) {
    return {
      statusCode: 404,
      body: JSON.stringify({error: 'THIS ITEM DOES NOT EXIST SIR'})
    };
  }
  //return undefined




  return {
    statusCode: 202,
    headers: {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({})
  };
}
