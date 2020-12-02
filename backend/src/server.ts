import app from "./app"
import * as open from "open"
import config from "./config"
import { user } from "./models/mysql"
import Logger from "./loaders/logger"
import { queryTable } from "./utils/initMysql"
const expressSwagger = require("express-swagger-generator")(app)
expressSwagger(config.options)

queryTable(user)

import {
  login,
  register,
  updateList,
  deleteList,
  searchPage,
  searchVague,
  captcha,
} from "./router/api/mysql"

app.post('/login', (req, res) => {
  login(req, res)
})

app.post('/register', (req, res) => {
  register(req, res)
})

app.put('/updateList/:id', (req, res) => {
  updateList(req, res)
})

app.delete('/deleteList/:id', (req, res) => {
  deleteList(req, res)
})

app.post('/searchPage', (req, res) => {
  searchPage(req, res)
})

app.post('/searchVague', (req, res) => {
  searchVague(req, res)
})

app.get('/captcha', (req, res) => {
  captcha(req, res)
})

app.listen(config.port, () => {
  Logger.info(`
    ################################################
    🛡️  Swagger文档地址: http://localhost:${config.port} 🛡️
    ################################################
  `)
}).on('error', err => {
  Logger.error(err)
  process.exit(1)
})

open(`http://localhost:${config.port}`)  // 自动打开默认浏览器