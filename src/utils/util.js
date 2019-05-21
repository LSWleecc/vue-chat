/**
 * Created by lsw on 2019/5/20 0020.
 */
/*创建cookie*/
function _SetCookie(name , value , exdays) {
  var d = new Date()
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
  var expires = 'expires' + d.toGMTString()
  document.cookie = name + '=' + value + ';' + expires
}

/*获取cookie*/
function _getCookie(name) {
  var cname = name + "="
  var ca = document.cookie.split('; ')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i].trim()
    if(c.indexOf(cname) == 0) return c.substring(cname.length , c.length)
  }
  return ''
}

/*删除cookie*/
function _delCookie(name) {
  var exp = new Date()
  exp.setTime(exp.getTime() - 1)
  var cval = _getCookie(name)
  if(cval !== null){
    var expires = 'expires' + d.toGMTString()
    document.cookie = name + '=' + cval + '; ' + expires
  }
}

/*清除所有cookie*/
function _delAllCookie() {
  var arrCookie = document.cookie.split('; ')
  for (var i = 0; i < arrCookie.length; i++) {
    var arr = arrCookie[i].split('=')
    if(arr.length > 0){
      _delCookie(arr[0])
    }
  }
}

export  {
  _SetCookie,
  _getCookie,
  _delCookie,
  _delAllCookie
}

