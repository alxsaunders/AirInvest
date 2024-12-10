import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const dynamodb = new DynamoDB.DocumentClient();

export async function POST(request: Request) {
  const { analysis, userId } = await request.json();
  
  const item = {
    id: uuidv4(),
    userId,
    ...analysis,
    createdAt: new Date().toISOString()
  };

  await dynamodb.put({
    TableName: 'investment-analyses',
    Item: item
  }).promise();

  return Response.json({ success: true, id: item.id });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  const result = await dynamodb.query({
    TableName: 'investment-analyses',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  }).promise();

  return Response.json(result.Items);
}