import { DynamoDB } from 'aws-sdk'

const documentClient = new DynamoDB.DocumentClient()

export async function list(event, context, cb) {
  let params = {
    TableName : 'dyndns-test-domains'
  }
  const data = await documentClient.scan(params).promise()
  context.succeed(data.Items)
}

export async function upsert(event, context, cb) {
  const params = {
    TableName : 'dyndns-test-domains',
    Item: event.query
  }
  await documentClient.put(params).promise()
  context.succeed(event.query)
}