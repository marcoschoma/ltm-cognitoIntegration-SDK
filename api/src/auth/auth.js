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
    console.error(error.message)
    throw AuthError(error)
  }
}

const Callback = async (response, redis, axios, code, state) => {
  try {
    const discovery = await Discovery(redis, axios)

    var result = await axios.post(
      discovery.token_endpoint,
      {
        code: code,
        state: state,
        client_id: process.env.APP_AUTH_CODE_CLIENT_ID,
        client_secret: process.env.APP_AUTH_CODE_CLIENT_SECRET,
        grant_type: process.env.APP_AUTH_CODE_GRANT_TYPE,
        redirect_uri: process.env.APP_AUTH_CODE_CALLBACK
      }
    )

    return result

  } catch (error) {
    console.error(error.message)
    return badRequestWithMessage(response, error)
  }
}

const GetAuthUrl = async (response, redis, axios) => {
  try {
    const { authorization_endpoint } = await Discovery(redis, axios)

    return ok(response, {
      auth: `${authorization_endpoint}?scope=${process.env.APP_AUTH_CODE_SCOPES}&response_type=code&client_id=${process.env.APP_AUTH_CODE_CLIENT_ID}&redirect_uri=${process.env.APP_AUTH_CODE_CALLBACK}&state=${state}`
    })
  } catch (error) {
    console.error(error.message)
    return badRequestWithMessage(response, error)
  }
}

module.exports = { Discovery, Callback, GetAuthUrl }


//criar endpoint de validar o token
//bater na showcase do MKP usando o token