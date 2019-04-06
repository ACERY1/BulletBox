import randomize from 'randomatic';
/**
 * @returns {String} 12位随机数字/字母混合字符串
 */
export const generateAppid = () =>{
  return randomize("Aa0", 12);
}