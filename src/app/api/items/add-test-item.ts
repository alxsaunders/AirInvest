const AWS = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function addTestItem() {
  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Item: {
      uesrId: 'user-' + Date.now(), // Add this line to include the userId
      id: 'test-item-' + Date.now(),
      name: 'Test Item',
      description: 'This is a test item added via script '
    }
  };

  try {
    await dynamodb.put(params).promise();
    console.log('Test item added successfully:', params.Item);
  } catch (error) {
    console.error('Error adding test item:', error);
  }
}

addTestItem();