function httpRequest(url, callback) {
  var xhr = new XMLHttpRequest()
  xhr.open("GET", url, true)
  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4) {
      callback(xhr.responseText)
    }
  }
  xhr.send()
}
httpRequest('http://freeapi.ipip.net/14.215.177.39', function(ip) {
  document.getElementById("ip_div").innerText = ip
})
var num = 0
setInterval(function () {
  num++
  document.getElementById("num").innerText = num
}, 1000)
