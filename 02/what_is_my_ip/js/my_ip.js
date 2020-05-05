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
httpRequest('http://freeapi.ipip.net/115.239.100.170', function(ip) {
  document.getElementById("ip_div").innerText = ip
})
var num = 0
setInterval(function () {
  num++
  document.getElementById("num").innerText = num
}, 1000)
