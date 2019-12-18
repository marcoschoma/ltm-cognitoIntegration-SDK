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

const GetAuth = async (response, redis, axios) => {}

module.exports = { Discovery }
