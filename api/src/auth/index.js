//const Joi = require('@hapi/joi')

const { GetAuthUrl } = require('./auth')

const Auth = (server, redis, axios) => {
  // server.route({
  //   method: 'GET',
  //   path: '/auth/callback',
  //   handler: async (req, res) => {
  //     return await Create(req.payload, res)
  //   },
  //   options: {
  //     description: 'OAUTH2 Authorization Code Callback',
  //     notes: ['201', '500'],
  //     tags: ['api'],
  //     validate: {
  //       params: {
  //         code: Joi.string()
  //           .required()
  //           .description('Oauth2 code param')
  //       }
  //     }
  //   }
  // })

  server.route({
    method: 'GET',
    path: '/auth',
    handler: async (req, res) => {
      return await GetAuthUrl(res, redis, axios)
    },
    options: {
      description: 'Get the Cognito Authorization URL',
      notes: 'Returns a complete authorization url',
      tags: ['api']
    }
  })
}

module.exports = Auth
