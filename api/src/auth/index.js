const Joi = require('@hapi/joi')
const { ok } = require('../config/response')

const { Discovery } = require('./auth')

const Auth = (server, redis, axios) => {
  server.route({
    method: 'GET',
    path: '/auth/callback',
    handler: async (req, res) => {
      console.log(req)
      return ok(res, { authorizeURL: await Callback(redis, axios, req.payload.code) })
    },
    options: {
      description: 'OAUTH2 Authorization Code Callback',
      notes: ['201', '500'],
      tags: ['api'],
      validate: {
        query: Joi.object({
          code : Joi.string()
                  .required()
                  .description('the id for the todo item'),
        })
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/auth',
    handler: async (req, res) => {
      return ok(res, { authorizeURL: await Discovery(redis, axios) })
    },
    options: {
      description: 'Get the Cognito Authorization URL',
      notes: 'Returns a complete authorization url',
      tags: ['api']
    }
  })
}

module.exports = Auth
