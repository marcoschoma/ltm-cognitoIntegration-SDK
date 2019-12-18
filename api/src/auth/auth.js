const errorFactory = require('error-factory')
const AuthError = errorFactory('Autherror')

const { ok, badRequestWithMessage } = require('../config/response')
const state = 'xyc6'

const Discovery = async (redis, axios) => {
  try {
    const cacheKey = 'DiscoveryEndpoint'

    let cachedToken = await redis.getAsync(cacheKey)

    if (cachedToken) return JSON.parse(cachedToken)

    const { data } = await axios.get(process.env.COGNITO_DISCOVERY_ENDPOINT)

    redis.set(cacheKey, JSON.stringify(data), 'EX', 7200)

    return data
  } catch (error) {
    throw AuthError(error)
  }
}

const GetAuthUrl = async (response, redis, axios) => {
  try {
    const { authorization_endpoint } = await Discovery(redis, axios)

    return ok(response, {
      auth: `${authorization_endpoint}?scope=${process.env.APP_AUTH_CODE_SCOPES}&response_type=code&client_id=${process.env.APP_AUTH_CODE_CLIENT_ID}&redirect_uri=${process.env.APP_AUTH_CODE_CALLBACK}&state=${state}`
    })
  } catch (error) {
    return badRequestWithMessage(response, error)
  }
}

module.exports = { Discovery, GetAuthUrl }
