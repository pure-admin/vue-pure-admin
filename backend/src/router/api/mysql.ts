import { Request, Response } from "express"

/**
 * 登陆
 * @route GET /login/
 * @summary 登陆
 * @group login - 登陆
 * @returns {object} 200 
 * @security JWT
 * @returns {Error}  default - Unexpected error
 */
const login =async (req: Request, res: Response) => {
  res.json({code:1 , msg: "成功"})
}

/**
 * 注册
 * @route GET /register/
 * @summary 注册
 * @group register - 注册
 * @returns {object} 200 
 * @security JWT
 * @returns {Error}  default - Unexpected error
 */

const register =async (req: Request, res: Response) => {
  res.json({code:1 , msg: "成功"})
}

/**
 * 列表更新
 * @route GET /updateList/
 * @summary 列表更新
 * @group updateList - 列表更新
 * @returns {object} 200 
 * @security JWT
 * @returns {Error}  default - Unexpected error
 */

const updateList =async (req: Request, res: Response) => {
  res.json({code:1 , msg: "成功"})
}

/**
 * 列表删除
 * @route GET /deleteList/
 * @summary 列表删除
 * @group deleteList - 列表删除
 * @returns {object} 200 
 * @security JWT
 * @returns {Error}  default - Unexpected error
 */

const deleteList =async (req: Request, res: Response) => {
  res.json({code:1 , msg: "成功"})
}

 /**
 * 分页查询
 * @route GET /searchPage/
 * @summary 分页查询
 * @group searchPage - 分页查询
 * @returns {object} 200 
 * @security JWT
 * @returns {Error}  default - Unexpected error
 */

const searchPage =async (req: Request, res: Response) => {
  res.json({code:1 , msg: "成功"})
}

/**
 * 模糊查询
 * @route GET /searchVague/
 * @summary 模糊查询
 * @group searchVague - 模糊查询
 * @returns {object} 200 
 * @security JWT
 * @returns {Error}  default - Unexpected error
 */

const searchVague =async (req: Request, res: Response) => {
  res.json({code:1 , msg: "成功"})
}

export {
  login,
  register,
  updateList,
  deleteList,
  searchPage,
  searchVague,
}