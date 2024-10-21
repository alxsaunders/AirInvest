import AWS from 'aws-sdk';

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION) {
  throw new Error('AWS credentials or region are not set in environment variables');
}

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getItem(tableName: string, partitionKeyName: string, partitionKeyValue: string) {
  const params = {
    TableName: tableName,
    Key: {
      [partitionKeyName]: partitionKeyValue
    }
  };

  try {
    const data = await dynamodb.get(params).promise();
    return data.Item;
  } catch (error) {
    console.error("Error fetching item from DynamoDB:", error);
    throw error;
  }
}

export async function putItem(tableName: string, item: object) {
  const params = {
    TableName: tableName,
    Item: item
  };

  try {
    await dynamodb.put(params).promise();
    return true;
  } catch (error) {
    console.error("Error putting item into DynamoDB:", error);
    throw error;
  }
}

// You can add more functions here as needed, for example:

export async function deleteItem(tableName: string, partitionKeyName: string, partitionKeyValue: string) {
  const params = {
    TableName: tableName,
    Key: {
      [partitionKeyName]: partitionKeyValue
    }
  };

  try {
    await dynamodb.delete(params).promise();
    return true;
  } catch (error) {
    console.error("Error deleting item from DynamoDB:", error);
    throw error;
  }
}

export async function queryItems(tableName: string, keyConditionExpression: string, expressionAttributeValues: AWS.DynamoDB.DocumentClient.ExpressionAttributeValueMap) {
  const params = {
    TableName: tableName,
    KeyConditionExpression: keyConditionExpression,
    ExpressionAttributeValues: expressionAttributeValues
  };

  try {
    const data = await dynamodb.query(params).promise();
    return data.Items;
  } catch (error) {
    console.error("Error querying items from DynamoDB:", error);
    throw error;
  }
}