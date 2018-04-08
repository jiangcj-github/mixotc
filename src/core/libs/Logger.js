/**
 * 自定义日志文件
 * @param params 日志内容
 *
 * 注：1.暂时只由process.env.LOGGER控制
 *     2.暂时只支持原日志输出，后期增加完善
 */
export default function (...params) {
  if (process.env.LOGGER) {
    console.log(...params)
  }
}
