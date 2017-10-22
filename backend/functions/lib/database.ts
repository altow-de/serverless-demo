import { DynamoDB } from 'aws-sdk'


export class DB {
  private table
  private key
  private documentClient

  constructor(table, key) {
    this.documentClient = new DynamoDB.DocumentClient()
    this.table = table
    this.key = key
  }

  public async getItem(id) {
    const params = {
      TableName : this.table,
      Key: {}
    }
    params.Key[this.key] = id
    const data = await this.documentClient.get(params).promise()
    return data.Item ? data.Item : null
  }

  public async putItem(item) {
    const params = {
      TableName : this.table,
      Item: item
    }
    return await this.documentClient.put(params).promise()
  }

  public async removeItem(id) {
    const params = {
      TableName : this.table,
      Key: {}
    }
    params.Key[this.key] = id
    return await this.documentClient.delete(params).promise()
  }

  public async getItems(key?, value?) {
    let params: {} = {
      TableName : this.table,
      FilterExpression : `${key} = :search`,
      ExpressionAttributeValues : {':search' : value}
    }
    
    if (!key) {
      params = {TableName: this.table}
    }
    
    const data = await this.documentClient.scan(params).promise()
    return data.Items ? data.Items : []
  }
}