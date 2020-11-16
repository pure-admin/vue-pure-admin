/**
 * 测试
 * @route GET /getApi/
 * @summary 测试
 * @group test - 测试
 * @returns {object} 200 
 * @security JWT
 * @returns {Error}  default - Unexpected error
 */

exports.testGetApi = (req, res) => {
  res.json({code:1 , msg: "成功"})
}