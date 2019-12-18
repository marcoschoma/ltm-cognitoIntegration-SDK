require('dotenv').config()

const Hapi = require('@hapi/hapi')
const Inert = require('@hapi/inert')
const Vision = require('@hapi/vision')
const HapiSwagger = require('hapi-swagger')
const Redis = require('redis')
const axios = require('axios')

const chalk = require('./config/chalk')
const { PORT } = require('./config/config')
const { Cache } = require('./config/redis')

const Home = require('./home')
const Auth = require('./auth')

console.log(`Cognito Integration - ${process.env.NAME} ${process.env.VERSION}`)

const Start = async () => {
  const server = await new Hapi.server({
    port: PORT,
    host: process.env.HOST || '0.0.0.0'
  })

  const swaggerOptions = {
    info: {
      title: `Cognito Integration - ${process.env.NAME} ${process.env.VERSION}`,
      version: '1'
    }
  }

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions
    }
  ])

  try {
    await server.start()
    chalk.info(`Server running on ${server.info.uri}`)
  } catch (error) {
    chalk.info(error)
  }

  return server
}

process.on('unhandledRejection', err => {
  chalk.error(err)
  process.exit(1)
})

const startupError = err => {
  chalk.error('🚨 Error bootstrapping app!', err)
}

Cache(Redis, 3000)
  .then(client => {
    Start().then(server => {
      Auth(server, client, axios)
      Home(server)
    })
  })
  .catch(startupError)
