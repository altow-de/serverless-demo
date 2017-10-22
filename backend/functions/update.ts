import { HostedZone } from './lib/domains'
import { DB } from './lib/database'
import { find } from 'lodash'

const domainTable =  new DB('dyndns-test-domains', 'subdomain')

export async function update (event, context) {
  const token = event.headers.Authorization.replace("Basic ", "")
  const domainName = event.query.host.replace('.'+process.env.R53_HOSTED_ZONE, "")
  const address = event.query.dnsto

  let domain = await domainTable.getItem(domainName)
  if (domain.updateToken !== token) {
    return
  }

  const zone = await HostedZone.init()
  await zone.setRecord(domainName, address)
  domain.address = address

  await domainTable.putItem(domain)

  const succ = `<SUCCESS CODE="200" TEXT="Update succeeded." ZONE="${event.query.host}" IP="${address}">`
  return context.succeed(succ)
}