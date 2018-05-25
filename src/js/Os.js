function detectOS() {
  let sUserAgent = navigator.userAgent;
  let isWin = navigator.platform == "Win32" || navigator.platform == "Windows";
  let isMac =
    navigator.platform == "Mac68K" ||
    navigator.platform == "MacPPC" ||
    navigator.platform == "Macintosh" ||
    navigator.platform == "MacIntel";
  if (isMac) return "Mac";
  let isUnix = navigator.platform == "X11" && !isWin && !isMac;
  if (isUnix) return "Unix";
  let isLinux = String(navigator.platform).indexOf("Linux") > -1;
  if (isLinux) return "Linux";
  if (isWin) {
    let isWin2K =
      sUserAgent.indexOf("Windows NT 5.0") > -1 ||
      sUserAgent.indexOf("Windows 2000") > -1;
    if (isWin2K) return "Windows 2000";
    let isWinXP =
      sUserAgent.indexOf("Windows NT 5.1") > -1 ||
      sUserAgent.indexOf("Windows XP") > -1;
    if (isWinXP) return "Windows XP";
    let isWin2003 =
      sUserAgent.indexOf("Windows NT 5.2") > -1 ||
      sUserAgent.indexOf("Windows 2003") > -1;
    if (isWin2003) return "Windows 2003";
    let isWinVista =
      sUserAgent.indexOf("Windows NT 6.0") > -1 ||
      sUserAgent.indexOf("Windows Vista") > -1;
    if (isWinVista) return "Windows Vista";
    let isWin7 =
      sUserAgent.indexOf("Windows NT 6.1") > -1 ||
      sUserAgent.indexOf("Windows 7") > -1;
    if (isWin7) return "Windows 7";
    let isWin10 =
      sUserAgent.indexOf("Windows NT 10") > -1 ||
      sUserAgent.indexOf("Windows 10") > -1;
    if (isWin10) return "Windows 10";
  }
  return "otherOs";
}
export default detectOS;