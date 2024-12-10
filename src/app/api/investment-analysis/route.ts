// src/app/api/investment-analysis/route.ts
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

const docClient = DynamoDBDocumentClient.from(client);

export async function POST(request: Request) {
  try {
    const { analysis, userId } = await request.json();
    
    const item = {
      userId,
      id: uuidv4(),
      ...analysis,
      createdAt: new Date().toISOString()
    };

    await docClient.send(
      new PutCommand({
        TableName: "investment-analyses",
        Item: item
      })
    );

    return Response.json({ success: true, id: item.id });
  } catch (error) {
    console.error('DynamoDB Error:', error);
    return Response.json({ error: 'Failed to save analysis' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return Response.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const result = await docClient.send(
      new QueryCommand({
        TableName: "investment-analyses",
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId
        }
      })
    );

    return Response.json(result.Items || []);
  } catch (error) {
    console.error('DynamoDB Error:', error);
    return Response.json({ error: 'Failed to fetch analyses' }, { status: 500 });
  }
}