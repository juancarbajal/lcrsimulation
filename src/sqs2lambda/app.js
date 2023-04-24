const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB();

exports.handler = async (event) => {
    await ddb.putItem({
        "TableName": "LCRdb",
        "Item": JSON.parse(event.Records[0].body)
    }).promise();
};
