const errorFactory = require('error-factory')
const AuthError = errorFactory('Autherror')

const { ok, badRequestWithMessage } = require('../config/response')
const state = 'xyc6'

const { Issuer } = require('openid-client')

const Discovery = async redis => {
	try {
		const cacheKey = 'DiscoveryEndpoint'
		let cachedToken = await redis.getAsync(cacheKey)
		if (cachedToken) return JSON.parse(cachedToken)

		return await Issuer.discover(process.env.COGNITO_DISCOVERY_ENDPOINT)
	} catch (error) {
		console.error(error.message)
		throw AuthError(error)
	}
}

const Callback = async (response, redis, request) => {
	try {
		const issuer = await Discovery(redis)
		const client = new issuer.Client({
			client_id: process.env.APP_AUTH_CODE_CLIENT_ID,
			client_secret: process.env.APP_AUTH_CODE_CLIENT_SECRET,
			redirect_uris: [process.env.APP_AUTH_CODE_CALLBACK],
			response_types: ['code']
			// id_token_signed_response_alg (default "RS256")
			// token_endpoint_auth_method (default "client_secret_basic")
		})
		const params = client.callbackParams(request)
		const nonce = ''
		return await client.callback(process.env.APP_AUTH_CODE_CALLBACK, params, { nonce })
	} catch (error) {
		console.error(error.message)
		return badRequestWithMessage(response, error)
	}
}

const GetAuthUrl = async (response, redis) => {
	try {
		const { authorization_endpoint } = await Discovery(redis)

		return ok(response, {
			auth: `${authorization_endpoint}?scope=${process.env.APP_AUTH_CODE_SCOPES}&response_type=code&client_id=${process.env.APP_AUTH_CODE_CLIENT_ID}&redirect_uri=${process.env.APP_AUTH_CODE_CALLBACK}&state=${state}`
		})
	} catch (error) {
		console.error(error.message);
		return badRequestWithMessage(response, error)
	}
}

module.exports = { Discovery, Callback, GetAuthUrl };

//criar endpoint de validar o token
//bater na showcase do MKP usando o token
