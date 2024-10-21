const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const docClient = DynamoDBDocumentClient.from(client);

async function getItem(userId: string): Promise<void> {
  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Key: {
      userId: userId
    }
  };

  try {
    const command = new GetCommand(params);
    const result = await docClient.send(command);
    
    if (result.Item) {
      console.log('Retrieved item:', JSON.stringify(result.Item, null, 2));
    } else {
      console.log('Item not found');
    }
  } catch (error) {
    console.error('Error retrieving item:', error);
  }
}

getItem('user-1729494044644');