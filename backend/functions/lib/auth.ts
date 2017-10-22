import fetch from 'node-fetch'
import * as jwt from 'jsonwebtoken'
import { jwk2pem } from 'pem-jwk'

let jwtSecret = null
async function getSecret() {
  if (jwtSecret) { return jwtSecret }
  const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`)
  const jwkInfo = await response.json()
  return jwk2pem(jwkInfo.keys[0])
}

export default async function({ headers }) {
  let token = headers.Authorization ?  headers.Authorization : headers.authorization
  token = token.replace("Bearer", '').trim()
  const secret = await getSecret()
  const decodedToken = jwt.verify(token, secret) as any
  return decodedToken.sub
}