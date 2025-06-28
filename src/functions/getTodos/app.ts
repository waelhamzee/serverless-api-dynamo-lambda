import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import db from '../../db/dynamoClient';

const TABLE_NAME = process.env.TODO_TABLE;

export const lambdaHandler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const result = await db.send(
            new ScanCommand({
                TableName: TABLE_NAME,
            }),
        );

        return {
            statusCode: 200,
            body: JSON.stringify(result.Items || []),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error', error: (error as Error).message }),
        };
    }
};
