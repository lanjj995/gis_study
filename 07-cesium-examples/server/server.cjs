const httpServer = require('http-server')
const { resolve } = require('path')
const { URL } = require('url')

const server = httpServer.createServer({
  root: resolve(__dirname, '../public'),
  before: [
    (req, res, next) => {
      const url = new URL(req.url, 'http://localhost')
      console.log(`befored----------`, url.pathname.endsWith('.terrain'))
      if (url.pathname.endsWith('.terrain')) {
        console.log(`befored----------`)
        res.setHeader('Content-Type', 'application/octet-stream')
        res.setHeader('Content-Encoding', 'gzip')
      }
      next()
    }
  ],
  cors: true
})

const port = 9090
server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})