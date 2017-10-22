import { DB } from './lib/database'

const userTable = new DB('dyndns-test-user-info', 'userId')
const domainTable =  new DB('dyndns-test-domains', 'subdomain')

export async function list(event, context, cb) {
  const list = await domainTable.getItems()
  context.succeed(list)
}

export async function upsert(event, context, cb) {
  await await domainTable.putItem(event.query)
  context.succeed(event.query)
}