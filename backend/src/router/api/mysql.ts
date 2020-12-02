import * as mysql from "mysql2"
import secret from "../../config"
import * as jwt from "jsonwebtoken"
import { createHash } from "crypto"
import Logger from "../../loaders/logger"
import { Request, Response } from "express"
import { createMathExpr } from "svg-captcha"
import getFormatDate from "../../utils/date"
import { Code, Info } from "../../utils/infoEnum"
import { connection } from "../../utils/initMysql"

export interface dataModel {
  length: number
}

// 保存验证码
let generateVerify: number

/**
 * @typedef Error
 * @property {string} code.required
 */

/**
 * @typedef Response
 * @property {[integer]} code
 */

/**
 * @typedef Login
 * @property {string} username.required - 用户名 - eg: admin
 * @property {string} password.required - 密码 - eg: 123456
 * @property {integer} verify.required - 验证码
 */

/**
 * @route POST /login
 * @param {Login.model} point.body.required - the new point
 * @produces application/json application/xml
 * @consumes application/json application/xml
 * @summary 登录
 * @group 用户登录、注册相关
 * @returns {Response.model} 200 
 * @returns {Array.<Login>} Login
 * @headers {integer} 200.X-Rate-Limit 
 * @headers {string} 200.X-Expires-After 
 * @security JWT
 */

const login = async (req: Request, res: Response) => {
  const { username, password, verify } = req.body
  if (generateVerify !== verify) return res.json({
    code: Code.failCode,
    info: Info[0]
  })
  let sql: string = 'select * from users where username=' + "'" + username + "'"
  connection.query(sql, async function (err, data: dataModel) {
    if (data.length == 0) {
      await res.json({
        code: Code.failCode,
        info: Info[1]
      })
    } else {
      if (createHash('md5').update(password).digest('hex') == data[0].password) {
        const accessToken = jwt.sign({
          accountId: data[0].id
        }, secret.jwtSecret, { expiresIn: 3600 })
        await res.json({
          code: Code.successCode,
          info: Info[2],
          accessToken
        })
      } else {
        await res.json({
          code: Code.failCode,
          info: Info[3]
        })
      }
    }
  })
}

/**
 * @typedef Register
 * @property {string} username.required - 用户名 - eg: admin
 * @property {string} password.required - 密码 - eg: 123456
 * @property {integer} verify.required - 验证码
 */

/**
* @route POST /register
* @param {Register.model} point.body.required - the new point
* @produces application/json application/xml
* @consumes application/json application/xml
* @summary 注册
* @group 用户登录、注册相关
* @returns {Response.model} 200
* @returns {Array.<Register>} Register
* @headers {integer} 200.X-Rate-Limit
* @headers {string} 200.X-Expires-After
* @security JWT
*/

const register = async (req: Request, res: Response) => {
  const { username, password, verify } = req.body
  if (generateVerify !== verify) return res.json({
    code: Code.failCode,
    info: Info[0]
  })
  if (password.length < 6) return res.json({
    code: Code.failCode,
    info: Info[4]
  })
  let sql: string = 'select * from users where username=' + "'" + username + "'"
  connection.query(sql, async (err, data: dataModel) => {
    if (data.length > 0) {
      await res.json({
        code: Code.failCode,
        info: Info[5]
      })
    } else {
      let time = await getFormatDate()
      let sql: string = 'insert into users (username,password,time) value(' + "'" + username + "'" + ',' + "'" + createHash('md5').update(password).digest('hex') +
        "'" + ',' + "'" + time + "'" + ')'
      connection.query(sql, async function (err) {
        if (err) {
          Logger.error(err)
        } else {
          await res.json({
            code: Code.successCode,
            info: Info[6]
          })
        }
      })
    }
  })
}

/**
 * @typedef UpdateList
 * @property {string} username.required - 用户名 - eg: admin
 */

/**
 * @route PUT /updateList/{id}
 * @summary 列表更新
 * @param {UpdateList.model} point.body.required - 用户名 
 * @param {UpdateList.model} id.path.required - 用户id
 * @group 用户管理相关
 * @returns {object} 200
 * @returns {Array.<UpdateList>} UpdateList
 * @security JWT
 */

const updateList = async (req: Request, res: Response) => {
  const { id } = req.params
  const { username } = req.body
  let payload = null
  try {
    const authorizationHeader = req.get("Authorization")
    const accessToken = authorizationHeader.substr("Bearer ".length)
    payload = jwt.verify(accessToken, secret.jwtSecret)
  } catch (error) {
    return res.status(401).end()
  }
  let modifySql: string = 'UPDATE users SET username = ? WHERE id = ?'
  let sql: string = 'select * from users where id=' + id
  connection.query(sql, function (err, data) {
    connection.query(sql, function (err) {
      if (err) {
        Logger.error(err)
      } else {
        let modifyParams: string[] = [username, id]
        // 改
        connection.query(modifySql, modifyParams, async function (err, result) {
          if (err) {
            Logger.error(err)
          } else {
            await res.json({
              code: Code.successCode,
              info: Info[7]
            })
          }
        })
      }
    })
  })
}

/**
 * @typedef DeleteList
 * @property {integer} id.required - 当前id
 */

/**
 * @route DELETE /deleteList/{id}
 * @summary 列表删除
 * @param {DeleteList.model} id.path.required - 用户id
 * @group 用户管理相关
 * @returns {object} 200 
 * @returns {Array.<DeleteList>} DeleteList
 * @security JWT
 */

const deleteList = async (req: Request, res: Response) => {
  const { id } = req.params
  let payload = null
  try {
    const authorizationHeader = req.get("Authorization")
    const accessToken = authorizationHeader.substr("Bearer ".length)
    payload = jwt.verify(accessToken, secret.jwtSecret)
  } catch (error) {
    return res.status(401).end()
  }
  let sql: string = 'DELETE FROM users where id=' + "'" + id + "'"
  connection.query(sql, async function (err, data) {
    if (err) {
      console.log(err)
    } else {
      await res.json({
        code: Code.successCode,
        info: Info[8]
      })
    }
  })
}

/**
 * @typedef SearchPage
 * @property {integer} page.required - 第几页 - eg: 1
 * @property {integer} size.required - 数据量（条）- eg: 5
 */

/**
* @route POST /searchPage
* @param {SearchPage.model} point.body.required - the new point
* @produces application/json application/xml
* @consumes application/json application/xml
* @summary 分页查询
* @group 用户管理相关
* @returns {Response.model} 200
* @returns {Array.<SearchPage>} SearchPage
* @headers {integer} 200.X-Rate-Limit
* @headers {string} 200.X-Expires-After
* @security JWT
*/

const searchPage = async (req: Request, res: Response) => {
  const { page, size } = req.body
  let payload = null
  try {
    const authorizationHeader = req.get("Authorization")
    const accessToken = authorizationHeader.substr("Bearer ".length)
    payload = jwt.verify(accessToken, secret.jwtSecret)
  } catch (error) {
    return res.status(401).end()
  }
  let sql: string = 'select * from users limit ' + size + ' offset ' + size * (page - 1)
  connection.query(sql, async function (err, data) {
    if (err) {
      Logger.error(err)
    } else {
      await res.json({
        code: Code.successCode,
        info: data
      })
    }
  })
}

/**
 * @typedef SearchVague
 * @property {string} username.required - 用户名  - eg: admin
 */

/**
* @route POST /searchVague
* @param {SearchVague.model} point.body.required - the new point
* @produces application/json application/xml
* @consumes application/json application/xml
* @summary 模糊查询
* @group 用户管理相关
* @returns {Response.model} 200
* @returns {Array.<SearchVague>} SearchVague
* @headers {integer} 200.X-Rate-Limit
* @headers {string} 200.X-Expires-After
* @security JWT
*/

const searchVague = async (req: Request, res: Response) => {
  const { username } = req.body
  let payload = null
  try {
    const authorizationHeader = req.get("Authorization")
    const accessToken = authorizationHeader.substr("Bearer ".length)
    payload = jwt.verify(accessToken, secret.jwtSecret)
  } catch (error) {
    return res.status(401).end()
  }
  if (username === "" || username === null) return res.json({
    code: Code.failCode,
    info: Info[9]
  })
  let sql: string = 'select * from users'
  sql += " WHERE username LIKE " + mysql.escape("%" + username + "%")
  connection.query(sql, function (err, data) {
    connection.query(sql, async function (err) {
      if (err) {
        Logger.error(err)
      } else {
        await res.json({
          code: Code.successCode,
          info: data
        })
      }
    })
  })
}

/**
 * @route GET /captcha
 * @summary 图形验证码
 * @group captcha - 图形验证码
 * @returns {object} 200 
 * @security JWT
 */

const captcha = async (req: Request, res: Response) => {
  const create = createMathExpr({
    mathMin: 1,
    mathMax: 4,
    mathOperator: "+"
  })
  generateVerify = Number(create.text)
  res.type('svg') // 响应的类型
  res.json({ code: Code.successCode, info: create.text, svg: create.data })
}

export {
  login,
  register,
  updateList,
  deleteList,
  searchPage,
  searchVague,
  captcha,
}