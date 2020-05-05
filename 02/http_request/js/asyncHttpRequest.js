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
var text = httpRequest('http://localhost:3000/text', function(text) {
  console.log(text)
})
