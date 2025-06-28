import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import db from '../../db/dynamoClient';

const TABLE_NAME = process.env.TODO_TABLE;

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const body = JSON.parse(event.body || '{}');

    const item = {
        id: uuidv4(),
        title: body.title,
        completed: false,
        createdAt: new Date().toISOString(),
    };

    await db.send(
        new PutCommand({
            TableName: TABLE_NAME,
            Item: item,
        }),
    );

    return {
        statusCode: 201,
        body: JSON.stringify(item),
    };
};
