function httpRequest(url) {
  var xhr = new XMLHttpRequest()
  xhr.open("GET", url, true)
  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4) {
      return xhr.responseText
    }
  }
  xhr.send()
}
var text = httpRequest('http://localhost:3000/text')
console.log(text)