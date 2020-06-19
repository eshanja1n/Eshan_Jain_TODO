import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const XAWS = AWSXRay.captureAWS(AWS);

export default class TodosAccess {
  constructor(


    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
      private readonly myTodoTable = process.env.TODOS_TABLE,
      private readonly index = process.env.INDEX_NAME
  ) {}

  async addTodoToDB(myTodoItem) {
      await this.docClient.put({


        TableName: this.myTodoTable,
          Item: myTodoItem
      }).promise();
  }

  async deleteTodoFromDB(myTodoID, myUserID) {
      await this.docClient.delete({
          TableName: this.myTodoTable,
          Key: {
              myTodoID,
              myUserID
          }
      }).promise();
  }



  async getTodoFromDB(myTodoID, myUserID) {
      const res = await this.docClient.get({
          TableName: this.myTodoTable,
          Key: {
              myTodoID,
              myUserID



          }
      }).promise();
    return res.Item;
  }

  async getAllTodosFromDB(myUserID) {
      const res = await this.docClient.query({
          TableName: this.myTodoTable,

          index: this.index,
          KeyConditionExpression: 'myUserID = :myUserID',
          ExpressionAttributeValues: {
                ':myUserID': myUserID
          }
      }).promise();
            return res.Items;
  }

  async updateTodoInDB(myTodoID, myUserID, theUpdatedTodo) {


    await this.docClient.update({
          TableName: this.myTodoTable,
          Key: {
              myTodoID,
              myUserID
          },
          UpdateExpression: 'set #name = :n, #dueDate = :due, #done = :d',

          ExpressionAttributeValues: {
              ':n': theUpdatedTodo.name,
              ':due': theUpdatedTodo.dueDate,
              ':d': theUpdatedTodo.done
          },

          ExpressionAttributeNames: {
              '#name': 'name',
              '#dueDate': 'dueDate',
              '#done': 'done'
          }
      }).promise();
  }
}
