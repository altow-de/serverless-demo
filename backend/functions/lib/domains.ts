import { Route53 } from 'aws-sdk' 

const route53 = new Route53()

export class HostedZone {
  private zoneId
  private domain
  
  private async init() {
    const zones = (await route53.listHostedZonesByName().promise()).HostedZones
    this.zoneId = zones[0].Id
    this.domain = zones[0].Name
    return this
  }
  public static async init(){
    return await (new HostedZone()).init()
  }

  private buildParams(subDomain, address, action) {
    return {
      ChangeBatch: {
        Changes: [
          {
            Action: action, 
            ResourceRecordSet: {
              Name: `${subDomain}.${this.domain}`, 
              ResourceRecords: [
                {
                  Value: address
                }
              ], 
              TTL: 60, 
              Type: "A"
            }
          }
        ]
      }, 
      HostedZoneId: this.zoneId
     }
  }

  public async setRecord(subDomain, address) {
    let params = this.buildParams(subDomain, address, "UPSERT")
    await route53.changeResourceRecordSets(params).promise()
  }

  public async deleteRecord(subDomain, address) {
    let params = this.buildParams(subDomain, address, "DELETE")
    await route53.changeResourceRecordSets(params).promise()
  }
}