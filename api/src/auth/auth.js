//const errorFactory = require('error-factory')

//const AuthError = errorFactory('Autherror')

const Discovery = async (redis, axios) => {
  const discovery = await axios.get(process.env.COGNITO_DISCOVERY_ENDPOINT)

  redis.set('DiscoveryEndpoint', discovery.data, 'EX', 3600)
}

module.exports = { Discovery }
