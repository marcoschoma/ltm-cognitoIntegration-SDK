//const errorFactory = require('error-factory')

//const AuthError = errorFactory('Autherror')

const Discovery = async (redis, axios) => {
  const discovery = await axios.get(process.env.COGNITO_DISCOVERY_ENDPOINT)

  redis.set('DiscoveryEndpoint', discovery.data, 'EX', 3600)
}

const Callback = async (redis, axios, code) => {
  const discovery = Discovery(redis, axios)

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

module.exports = { Discovery, Callback }

/*
//edmilson: 404 em algum endpoints
// vinicius diz que está sem sandbox e por isso tá cagado
//edmilson: mas não podem mandar pra prod sem testar
//UAT?

//AUTH
//edmilson: usam v1.0
//gerente de TI da wiz = política deles é não ter integração com tela ou parceiro
federar?
--será analisado


pedimos pra eles passar quais fluxos (endpoint) eles precisam
 - preparar ambiente e disponibilizar

*/