
import secret from "../../config"
import * as jwt from "jsonwebtoken"
import { createHash } from "crypto"
import Logger from "../../loaders/logger"
import { Request, Response } from "express"
import { createMathExpr } from "svg-captcha"
import { connection } from '../../utils/initMysql'

export interface dataModel {
  length: number
}

// 保存验证码
let generateVerify: number | string

/**
 * @typedef Login
 * @property {string} username.required - 用户名
 * @property {string} password.required - 密码
 * @property {string} verify.required - 验证码
 */

/**
 * @typedef Error
 * @property {string} code.required
 */

/**
 * @typedef Response
 * @property {[integer]} code
 */

/**
 * 登录
 * @route POST /login
 * @param {Login.model} point.body.required - the new point
 * @produces application/json application/xml
 * @consumes application/json application/xml
 * @returns {Response.model} 200 
 * @returns {Array.<Login>} Login
 * @headers {integer} 200.X-Rate-Limit 
 * @headers {string} 200.X-Expires-After 
 * @security JWT
 */

const login = async (req: Request, res: Response) => {
  const { username, password, verify } = req.body
  if (generateVerify !== verify) return res.json({
    code: -1,
    info: "请输入正确的验证码"
  })
  let sql: string = 'select * from users where username=' + "'" + username + "'"
  connection.query(sql, async function (err, data: dataModel) {
    if (data.length == 0) {
      await res.json({
        code: -1,
        info: "账号尚未被注册"
      })
    } else {
      if (createHash('md5').update(password).digest('hex') == data[0].password) {
        const accessToken = jwt.sign({
          accountId: data[0].id
        }, secret.jwtSecret, { expiresIn: 3600 })
        await res.json({
          code: 0,
          info: "登录成功",
          accessToken
        })
      } else {
        await res.json({
          code: -1,
          info: "密码错误"
        })
      }
    }
  })
}

/**
 * @typedef Register
 * @property {string} username.required - 用户名
 * @property {string} password.required - 密码
 * @property {string} verify.required - 验证码
 */

/**
* 注册
* @route POST /register
* @param {Register.model} point.body.required - the new point
* @produces application/json application/xml
* @consumes application/json application/xml
* @returns {Response.model} 200
* @returns {Array.<Register>} Register
* @headers {integer} 200.X-Rate-Limit
* @headers {string} 200.X-Expires-After
* @security JWT
*/

const register = async (req: Request, res: Response) => {
  const { username, password, verify } = req.body
  if (generateVerify !== verify) return res.json({
    code: -1,
    info: "请输入正确的验证码"
  })
  if (password.length < 6) return res.json({
    code: -1,
    info: "密码长度不能小于6位"
  })
  let sql: string = 'select * from users where username=' + "'" + username + "'"
  connection.query(sql, async (err, data: dataModel) => {
    if (data.length > 0) {
      await res.json({
        code: -1,
        info: "账号已被注册"
      })
    } else {
      let sql: string = 'insert into users (username,password) value(' + "'" + username + "'" + ',' + "'" + createHash('md5').update(password).digest('hex') +
        "'" + ')'
      connection.query(sql, async function (err) {
        if (err) {
          Logger.error(err)
        } else {
          await res.json({
            code: 0,
            info: "账号注册成功"
          })
        }
      })
    }
  })
}

/**
 * 列表更新
 * @route GET /updateList
 * @summary 列表更新
 * @group updateList - 列表更新
 * @returns {object} 200 
 * @security JWT
 */

const updateList = async (req: Request, res: Response) => {
  res.json({ code: 1, msg: "成功" })
}

/**
 * 列表删除
 * @route GET /deleteList
 * @summary 列表删除
 * @group deleteList - 列表删除
 * @returns {object} 200 
 * @security JWT
 */

const deleteList = async (req: Request, res: Response) => {
  res.json({ code: 1, msg: "成功" })
}

/**
* 分页查询
* @route GET /searchPage
* @summary 分页查询
* @group searchPage - 分页查询
* @returns {object} 200 
* @security JWT
* @returns {Error}  default - Unexpected error
*/

const searchPage = async (req: Request, res: Response) => {
  res.json({ code: 1, msg: "成功" })
}

/**
 * 模糊查询
 * @route GET /searchVague
 * @summary 模糊查询
 * @group searchVague - 模糊查询
 * @returns {object} 200 
 * @security JWT
 */

const searchVague = async (req: Request, res: Response) => {
  res.json({ code: 1, msg: "成功" })
}

/**
 * 图形验证码
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
  generateVerify = create.text
  res.type('svg') // 响应的类型
  res.json({ code: 1, msg: create.text, svg: create.data })
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