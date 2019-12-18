const errorFactory = require('error-factory')
const AuthError = errorFactory('Autherror')

const { ok, badRequestWithMessage } = require('../config/response')

const Discovery = async (response, redis, axios) => {
  try {
    const cacheKey = 'DiscoveryEndpoint'

    const cachedToken = await redis.get(cacheKey)

    if (cachedToken) return ok(response, JSON.parse(cachedToken))

    const discovery = await axios.get(process.env.COGNITO_DISCOVERY_ENDPOINT)

    redis.set(cacheKey, JSON.stringify(discovery.data), 'EX', 7200)
  } catch (error) {
    throw AuthError(error)
  }
}

const Callback = async (redis, axios, code) => {
  const discovery = await Discovery(redis, axios)
  console.log(discovery)
  var result = await axios.post(
    discovery.token_endpoint,
    {
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.APP_AUTH_CODE_CALLBACK
    }
  )
  return result
  //token_endpoint_auth_methods_supported: ['client_secret_basic', '']
}

const GetAuth = async (response, redis, axios) => {}

module.exports = { Discovery, Callback, GetAuth }

