import { APIGatewayProxyHandler } from 'aws-lambda';
import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import db from '../../db/dynamoClient';

const TABLE_NAME = process.env.TODOS_TABLE;

export const handler: APIGatewayProxyHandler = async (event) => {
    const todoId = event.pathParameters?.id;

    if (!todoId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing todo id.' }),
        };
    }

    try {
        await db.send(
            new DeleteCommand({
                TableName: TABLE_NAME,
                Key: { id: todoId },
            }),
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Todo deleted successfully.' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to delete todo.', error }),
        };
    }
};
