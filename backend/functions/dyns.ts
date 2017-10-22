import { DB } from './lib/database'
import { HostedZone } from './lib/domains'

// user
/*
{
id: userId
bought: false
}
*/
// domains
/*
{
  subdomain
  user
  address
  updateToken
}
*/

const userTable = new DB('dyndns-test-user-info', 'userId')
const domainTable =  new DB('dyndns-test-domains', 'subdomain')

export async function list(event, context, cb) {
  const list = await domainTable.getItems()
  context.succeed(list)
}

export async function upsert(event, context, cb) {
  const domainName = event.query.domain
  const address = event.query.address
  const domain = await domainTable.getItem(domainName)

  let updateToken = event.query.updateToken
  if (!updateToken) {
    updateToken = domain.updateToken
  }

  const zone = await HostedZone.init()  
  await zone.setRecord(domainName, address)
  await domainTable.putItem({
    subdomain : domainName,
    address: address,
    updateToken
  })
  context.succeed({"success": true})
}

export async function remove(event, context, cb) {
  const domainName = event.query.domain
  const address = event.query.address
  const domain = await domainTable.getItem(domainName)

  if (!domain || !domainName.length) {
    return context.fail({"success": false})
  }

  const zone = await HostedZone.init()
  await zone.deleteRecord(domainName, address)
  await domainTable.removeItem(domainName)
  context.succeed({"success": true})
}

