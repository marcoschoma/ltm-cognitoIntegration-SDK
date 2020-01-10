const Joi = require('@hapi/joi')
const { ok } = require('../config/response')
const { Callback, GetAuthUrl } = require('./auth')

const OpenIdClient = (server, redis) => {
  server.route({
    method: 'GET',
    path: '/auth/callback',
    handler: async (req, res) => {
      return ok(res, { authorizeURL: await Callback(res, redis, req.query.code, req.query.state) })
    },
    options: {
      description: 'OAUTH2 Authorization Code Callback',
      notes: ['201', '500'],
      tags: ['api'],
      validate: {
        query: Joi.object({
          code : Joi.string()
                  .required()
                  .description('Authorization Code'),
          state : Joi.string()
                  .required()
                  .description('State of authentication')
        })
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/auth',
    handler: async (req, res) => {
      return await GetAuthUrl(res, redis)
    },
    options: {
      description: 'Get the Cognito Authorization URL',
      notes: 'Returns a complete authorization url',
      tags: ['api']
    }
  })
}

module.exports = OpenIdClient
