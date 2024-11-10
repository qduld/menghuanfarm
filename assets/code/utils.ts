export function formatSeconds(seconds, blackspace = false) {
  // 计算小时、分钟和秒
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  // 根据条件拼接输出
  let result = "";
  if (hrs > 0) {
    blackspace ? (result += `${hrs}h `) : (result += `${hrs}h`);
  }
  if (mins > 0) {
    blackspace ? (result += `${mins}min `) : (result += `${mins}min`);
  }
  result += `${secs}s`;
  return result.trim(); // 去掉多余空格
}
