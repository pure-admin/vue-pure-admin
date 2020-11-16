import app from "./app";
const PORT = 3000;
const expressSwagger = require('express-swagger-generator')(app)

// 引入测试数据
const test = require("./router/api/test")

let options = {
  swaggerDefinition: {
    info: {
      description: 'This is a sample server',
      title: 'Swagger',
      version: '1.0.0'
    },
    host: 'localhost:3000',
    basePath: '/',
    produces: ['application/json', 'application/xml'],
    schemes: ['http', 'https'],
    securityDefinitions: {
      JWT: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: ''
      }
    }
  },
  route: {
    url: '/swagger-ui.html',
    docs: '/swagger.json' //swagger文件 api
  },
  basedir: __dirname, //app absolute path
  files: ['./router/api/*.ts'] //Path to the API handle folder
}
expressSwagger(options)

app.get('/getApi', (req, res) => {
  test.testGetApi(req, res)
})

app.listen(PORT, () => {
    console.log('Swagger文档地址:', `http://localhost:${PORT}`);
})
