const Home = server => {
  server.route({
    method: 'GET',
    path: '/',
    handler: () => {
      return { hello: 'world' }
    }
    // options: {
    //   description: 'Middleware Index',
    //   notes: '',
    //   tags: ['api']
    // }
  })
}

module.exports = Home
