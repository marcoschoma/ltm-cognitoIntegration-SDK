const errorFactory = require('error-factory')

const RedisError = errorFactory('RedisClientError')

const Cache = async (redis, timeout) => {
  try {
    let client = redis.createClient({
      host: process.env.REDIS_SERVER,
      password: process.env.REDIS_SERVER_PASSWORD,
      port: process.env.REDIS_PORT
    })

    if (client.on) {
      client
        .on('connect', () => {
          client.select(process.env.REDIS_DATABASE || 1)
          //return client
        })
        .on('error', err => {
          throw RedisError(`Redis error ${err}`)
        })
    }

    if (!client.connected) {
      const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

      await wait(timeout || 3000)

      if (!client.connected) throw RedisError('Redis error, connection timeout')
    }

    return client
  } catch (error) {
    throw RedisError('Can`t connect to redis')
  }
}

module.exports = { Cache, RedisError }
