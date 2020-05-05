function count(n) {
  var sum = 0
  for(var i=1; i<=n; i++) {
    sum += i
  }
  return sum
}
var c = count(5) + 1
console.log(c)