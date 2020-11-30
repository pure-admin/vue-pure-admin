import md5 from 'md5-node'
import jwt from "jsonwebtoken"
import jwtSecret from "../../config"
import Logger from "../../loaders/logger"
import { Request, Response } from "express"
import { createMathExpr } from "svg-captcha"
import { connection } from '../../utils/initMysql'

export interface dataModel {
  length: number
}

// 保存验证码
let verify: number | string

/**
 * @typedef Point
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
 * @param {Point.model} point.body.required - the new point
 * @produces application/json application/xml
 * @consumes application/json application/xml
 * @returns {Response.model} 200 
 * @returns {Array.<Point>} Point 
 * @headers {integer} 200.X-Rate-Limit 
 * @headers {string} 200.X-Expires-After 
 * @security JWT
 */

const login = async (req: Request, res: Response) => {
  console.log(req.body)
  // if (verify !== req.query.verify) return res.json({
  //   code: -1,
  //   info: "请输入正确的验证码"
  // })
  //生成jwt(token令牌)  {expiresIn:3600}为token的过期时间，这里设置的是1小时
  // const accessToken = jwt.sign({
  //   accountId: account.id
  // }, settings.accessTokenSecret, { expiresIn: 3600 })
  // const idToken = jwt.sign({
  //   sub: account.id,
  //   preferred_username: account.username
  // }, "some secret that doesn't matter")
  // //返回token
  // response.status(200).json({
  //   access_token: accessToken,
  //   id_token: idToken
  // })
  // accessToken
}

/**
 * 注册
 * @route POST /register
 * @summary 注册
 * @group register - 注册
 * @param {string} username.query.required - username 
 * @param {string} password.query.required - password
 * @param {string} verify.query.required - verify
 * @returns {object} 200 
 * @security JWT
 */

const register = async (req: Request, res: Response) => {
  if (verify !== req.query.verify) return res.json({
    code: -1,
    info: "请输入正确的验证码"
  })
  let sql: string = 'select * from users where username=' + "'" + req.query.username + "'"
  connection.query(sql, async (err, data: dataModel) => {
    if (data.length > 0) {
      await res.json({
        code: -1,
        info: "账号已被注册"
      })
    } else {
      let sql: string = 'insert into users (username,password) value(' + "'" + req.query.username + "'" + ',' + "'" + req.query.password +
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
  verify = create.text
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