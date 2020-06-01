import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';

// dev imported
import { generateUploadUrl } from '../../businessLogic/todos';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  //const todoId = event.pathParameters.todoId
  
  const signedUrl = generateUploadUrl(event);

  

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  
  
  
  //return undefined

  return {
    statusCode: 202,
    headers: {'Access-Control-Allow-Origin': '*','Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({uploadUrl: signedUrl
    })
  };
}
