import Conf from '../../conf.json'

async function request(action, method = 'GET', params = '') {
  const accessToken = localStorage.getItem('id_token') || null
  const headers = { authorization: `Bearer ${accessToken}` }
  const response = await fetch(`${Conf.API}/${action}${params}`, { headers, method })
  return await response.json()
} 

export async function remove(domain) {
  return await request('remove', 'POST', `?domain=${domain.subdomain}&address=${domain.address}`)
}
export async function upsert(domain) {
  if (!domain.subdomain || !domain.address) {
    return
  }
  return await request('upsert', 'POST', `?domain=${domain.subdomain}&address=${domain.address}&updateToken=${domain.updateToken}`)
}
export async function getDomains () {
  return await request('list')
}

export async function getUser () {
  return await request('user')
}

export async function buy(query) {
  return await request('buy', 'POST', query)
}