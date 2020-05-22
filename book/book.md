## Chrome扩展及应用开发

### 1. 初步接触Chrome扩展及应用开发
#### 1.1 认识Chrome扩展及应用
Chrome扩展及应用是一系列文件的集合，这些文件包括HTML文件、CSS样式文件、JavaScript脚本文件、图片等静态文件以及manifest.json文件

#### 1.2 应用与扩展的区别
扩展与浏览器结合得更紧密些，更加强调扩展浏览器功能。而应用无法像扩展一样轻易
获取用户在浏览器中浏览的内容并进行更改，实际上应用有更加严格的权限限制，所以
应用更像是一个独立的与Chrome浏览器关联不大的程序，此时你可以把Chrome看出是一个
开发环境，而不是一个浏览器

#### 1.3 我的第一个chrome扩展
manifest.json
``` json
{
  "manifest_version": 2,
  "name": "我的时钟",
  "version": "1.0",
  "description": "我的第一个Chrome扩展",
  "icons": {
    "16": "images/icon16.png",
    "48": "images/icon48.png",
    "128": "images/icon128.png"
  },
  "browser_action": {
    "default_icon": {
      "19": "images/icon19.png",
      "38": "images/icon38.png"
    },
    "default_title": "我的时钟",
    "default_popup": "popup.html"
  }
}
```

popup.html
``` html
<html>

<head>
  <style>
    * {
      margin: 0;
      padding: 0;
    }

    body {
      width: 200px;
      height: 100px;
    }

    div {
      line-height: 100px;
      font-size: 42px;
      text-align: center;
    }
  </style>
</head>

<body>
  <div id="clock_div"></div>
  <script src="js/my_clock.js"></script>
</body>

</html>
```

my_clock.js
``` javascript
function my_clock(el) {
  var today = new Date()
  var h = today.getHours()
  var m = today.getMinutes()
  var s = today.getSeconds()
  h = h >= 10 ? h : ('0' + h)
  m = m >= 10 ? m : ('0' + m)
  s = s >= 10 ? s : ('0' + s)
  el.innerHTML = h + ':' + m + ':' + s
  setTimeout(function() {
      my_clock(el)
  }, 1000) 
}
var clock_div = document.getElementById('clock_div')
my_clock(clock_div)
```

#### 1.4 Manifest 文件格式
[扩展manifest属性列表](https://developer.chrome.com/apps/manifest)
[应用manifest属性列表](https://developer.chrome.com/apps/manifest)

#### 1.5 DOM简述
DOM（Document Object Model）文档对象模型

#### 1.6 调试方法与代码质量
右键审查元素打开控制台，或者点击背景页进入控制台

### 2. Chrome扩展基础
#### 2.1 操作用户正在浏览的页面
manifest.json
``` json
{
  "manifest_version": 2,
  "name": "永远点不到的搜索按钮",
  "version": "1.0",
  "description": "让你永远也点不到百度的搜索按钮",
  "content_scripts": [
    {
      "matches": [
        "*://www.baidu.com/"
      ],
      "js": [
        "js/cannot_touch.js"
      ]
    }
  ]
}
```
cannot_touch.js
``` javascript
function btn_move(el, mouseLeft, mouseTop) {
  var leftRnd = (Math.random() - 0.5) * 20
  var topRnd = (Math.random() - 0.5) * 20
  var btnLeft = mouseLeft + (leftRnd > 0 ? 100 : -100) + leftRnd
  var btnTop = mouseTop + (topRnd > 0 ? 30 : -30) + topRnd
  btnLeft = btnLeft < 100 ? (btnLeft + window.innerWidth - 200) : (
    btnLeft > window.innerWidth - 100 ? btnLeft - window.innerWidth + 200 : btnLeft)
  btnTop = btnTop < 100 ? (btnTop + window.innerHeight - 200) : (
    btnTop > window.innerHeight - 100 ? btnTop - window.innerHeight + 200 : btnTop)
  el.style.position = 'fixed'
  el.style.left = btnLeft + 'px'
  el.style.top = btnTop + 'px'
}

function over_btn(e) {
  if (!e) {
    e = window.event
  }
  btn_move(this, e.clientX, e.clientY)
}

document.getElementById('s_btn_wr').onmouseover = over_btn
```

#### 2.2 跨域请求
在Chrome扩展应用的API中，大部分函数都是非阻塞函数，使用回调函数将非阻塞函数的最终结果传递下去
##### 2.2.1 实例一
manifest.json
``` json
{
  "manifest_version": 2,
  "name": "测试异步非阻塞",
  "version": "1.0",
  "description": "测试异步非阻塞",
  "content_scripts": [
    {
      "matches": [
        "*://www.baidu.com/"
      ],
      "js": [
        "js/count.js",
        "js/httpRequest.js",
        "js/asyncHttpRequest.js"
      ]
    }
  ],
  "permissions": [
    "tabs",
    "http://*/*",
    "https://*/*"
  ]
}
```

js/count.js
``` javascript
function count(n) {
  var sum = 0
  for(var i=1; i<=n; i++) {
    sum += i
  }
  return sum
}
var c = count(5) + 1
console.log(c)
```

js/httpRequest.js
``` javascript
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
```

js/asyncHttpRequest.js
``` javascript
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
```

##### 实例二
manifest.json
``` json
{
  "manifest_version": 2,
  "name": "查看我的IP",
  "version": "1.0",
  "description": "查看我的电脑当前的公网IP",
  "icons": {
    "16": "images/icon16.png",
    "48": "images/icon48.png",
    "128": "images/icon128.png"
  },
  "browser_action": {
    "default_icon": {
      "19": "images/icon19.png",
      "38": "images/icon38.png"
    },
    "default_title": "查看我的ip",
    "default_popup": "popup.html"
  },
  "permissions": [
    "http://freeapi.ipip.net/"
  ]
}
```

popup.html
``` html
<html>

<head>
  <style>
    * {
      margin: 0;
      padding: 0;
    }

    body {
      width: 400px;
      height: 100px;
    }

    div {
      line-height: 100px;
      font-size: 42px;
      text-align: center;
    }
  </style>
</head>

<body>
  <div id="ip_div">正在查询……</div>
  <div id="num">0</div>
  <script src="js/my_ip.js"></script>
</body>

</html>
```

js/my_ip.js
``` javascript
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

```

#### 2.3 常驻后台
在Manifest中指定backgroud域可以使扩展常驻后台。background可以包含3种属性，
分别是scripts、page和persistent。如果指定了scripts属性，则chrome会在扩展启动时自动创建一个包含所有指定脚本的页面；如果指定了page属性，则chrome会在将指定的HTML文件作为后台页面运行。通常我们只需要使用scripts属性即可，除非在后台页面中需要构建特殊的HTML--但一般情况下，后台页面的HTML我们是看不到的。persistent属性定义了常驻后台的方式--当其值为true时，表示扩展将一直在后台运行，无论其是否正在工作；当其值为false时，表示扩展在后台按需运行，这就是chrome后来提出的Event Page。Event Page可以有效减小扩展对内存的消耗，如非必要，请将persistent设置为false

manifest.json
``` json
{
  "manifest_version": 2,
  "name": "百度在线状态",
  "version": "1.0",
  "description": "监视百度是否在线",
  "icons": {
      "16": "images/icon16.png",
      "48": "images/icon48.png",
      "128": "images/icon128.png"
  },
  "browser_action": {
      "default_icon": {
        "19": "images/icon19.png",
        "38": "images/icon38.png"
      }
  },
  "background": {
      "scripts": [
        "js/status.js"
      ],
      "persistent": false
  },
  "permissions": [
    "*://www.baidu.com/"
  ]
}
```

js/status.js
``` javascript
function httpRequest(url, callback) {
  var xhr = new XMLHttpRequest()
  xhr.open("GET", url, true)
  xhr.onreadystatechange = function () {
    if (xhr.readyState) {
      callback(true)
    }
  }
  xhr.onerror = function () {
    callback(false)
  }
  xhr.send()
}
setInterval(function() {
  httpRequest('http://www.baidu.com/', function(status) {
    chrome.browserAction.setIcon({
      path: 'images/' + (status ? 'online.png' : 'offline.png')
    })
  })
}, 5000)
```

#### 2.4 带扩展页面的扩展
[16/daily API](https://openweathermap.org/forecast16)

manifest.json
``` json
{
  "manifest_version": 2,
  "name": "天气预报",
  "version": "1.0",
  "description": "查看未来两周的天气情况",
  "icons": {
      "16": "images/icon16.png",
      "48": "images/icon48.png",
      "128": "images/icon128.png"
  },
  "browser_action": {
      "default_icon": {
          "19": "images/icon19.png",
          "38": "images/icon38.png"
      },
      "default_title": "天气预报",
      "default_popup": "popup.html"
  },
  "options_page": "options.html",
  "permissions": [
      "https://samples.openweathermap.org/data/2.5/forecast?q=*"
  ]
}
```

options.html
``` html
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>设定城市</title>
    </head>
    <body>
        <input type="text" id="cityId" />
        <input type="button" id="save" value="保存" />
        <script src="js/options.js"></script>
    </body>
</html>
```

js/options.js
``` javascript
var cityId = localStorage.cityId;
cityId = cityId?cityId:'524901';
document.getElementById('cityId').value = cityId;
document.getElementById('save').onclick = function(){
    localStorage.city = document.getElementById('cityId').value;
    alert('保存成功。');
}
```

popup.html
``` html
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <style>
  * {
      margin: 0;
      padding: 0;
  }

  body {
      width: 520px;
      height: 270px;
  }

  table {
      font-family: "Lucida Sans Unicode", "Lucida Grande", Sans-Serif;
      font-size: 12px;
      width: 480px;
      text-align: left;
      border-collapse: collapse;
      border: 1px solid #69c;
      margin: 20px;
      cursor: default;

  }

  table th {
      font-weight: normal;
      font-size: 14px;
      color: #039;
      border-bottom: 1px dashed #69c;
      padding: 12px 17px;
      white-space: nowrap;
  }

  table td {
      color: #669;
      padding: 7px 17px;
      white-space: nowrap;
  }

  table tbody tr:hover td {
      color: #339;
      background: #d0dafd;
  }

  </style>
  </head>
  <body>
  <div id="weather">载入中……</div>
  <script src="js/weather.js"></script>
  </body>
  </html>
```

js/weather.js
``` javascript
function httpRequest(url, callback){
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
          callback(xhr.responseText);
      }
  }
  xhr.send();
}

function showWeather(result){
  result = JSON.parse(result);
  var list = result.list;
  var table = '<table><tr><th>日期</th><th>天气</th><th>最低温度</th><th>最高温度</th></tr>';
  for(var i in list){
      var d = new Date(list[i].dt*1000);
      table += '<tr>';
      table += '<td>'+d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+'</td>';
      table += '<td>'+list[i].weather[0].description+'</td>';
      table += '<td>'+Math.round(list[i].temp.min-273.15)+' °C</td>';
      table += '<td>'+Math.round(list[i].temp.max-273.15)+' °C</td>';
      table += '</tr>';
  }
  table += '</table>';
  document.getElementById('weather').innerHTML = table;
}

var cityId = localStorage.cityId;
cityId = cityId?cityId:'524901';
var url = 'https://samples.openweathermap.org/data/2.5/forecast/daily?id='+cityId+'&lang=zh_cn&appid=b1b15e88fa797225412429c1c50c122a1';
httpRequest(url, showWeather);
```

#### 2.5 扩展页面间的通信
Chrome提供了4个有关扩展页面间相互通信的接口，分别是
- runtime.sendMessage
- runtime.onMessage
- runtion.connect
- runtion.onConnect
  
这里只讲runtime.sendMessage和runtime.onMessage，runtion.connect和runtion.onConnect自己查[文档](http://developer.chrome.com/extensions/extension)

Chrome提供的大部分API是不支持在content_scripts中运行的，但runtime.sendMessage和runtime.onMessage可以在content_scripts中运行，所以扩展的其他页面也可以同content_scripts相互通信
- runtime.sendMessage完整的方法为：
chorme.runtime.sendMessage(extensionId, message, options, callback)
其中，extensionId为所发送消息的目标扩展，如果不指定这个值，则默认为发起此消息的扩展本身；message为要发生的内容，类型随意，内容随意，比如可以是'hello', 也可以是{action: 'play'、2013和[1, 2, 3]等等；options为对象类型，包含了一个值为布尔类型的includeTisChannelId属性，此属性仅在扩展和网页间通信时才会用到，它的值决定了扩展发起此消息时，是否要将TLS通信ID发生给监听此消息的外部扩展。这是有关加强用户连接安全性的技术，不是必须掌握的，options时一个可选参数；callback是回调函数，用于接收返回结果，同样是一个可选参数。

- runtime.onMessage完整的方法为：
chorme.runtime.onMessage.addListener(callback)
此处的callback为必选参数，为回调函数。callback接收到的参数有3个，分别是message、sender和sendResponse，即消息内容、消息发送者相关信息和相应函数。其中sender对象包含4个属性，分别是：
- tab
- id
- url
- tisChannelId
  
tab是发起消息的标签, 后面会讲到

manifest.json
``` json
{
  "manifest_version": 2,
  "name": "扩展内部通信Demo",
  "version": "1.0",
  "description": "扩展内部通信Demo",
  "browser_action": {
      "default_popup": "popup.html"
  },
  "background": {
      "scripts": [
          "js/background.js"
      ]
  }
}
```

popup.html
``` html
<script src="js/popup.js"></script>
```

js/popup.js
``` javascript
chrome.runtime.sendMessage('Hello', function(response){
  document.write(response);
});
```

js/background.js
``` javascript
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
  if(message == 'Hello'){
      sendResponse('Hello from background.');
  }
});
```

#### 2.6 存储数据
#### 2.7 i8n

### 3. Chrome扩展的UI界面
#### 3.1 CSS简述
##### 3.1.1 默认样式及box模型
##### 3.1.2 元素定位
##### 3.1.3 字体及背景颜色
#### 3.2 Browser Actions
##### 3.2.1 图标
##### 3.2.2 popup页面
##### 3.2.3 标题和badge
#### 3.3 右键菜单
#### 3.4 桌面提醒
#### 3.5 omibx
#### 3.6 Page Actions

### 4. 管理你的浏览器
#### 4.1 书签
##### 4.1.1 创建书签
##### 4.1.2 创建书签分类
##### 4.1.3 调整书签位置
##### 4.1.4 更新书签
##### 4.1.5 移除书签
##### 4.1.6 获取书签内容
##### 4.1.7 书签事件
#### 4.2 Cookies
##### 4.2.1 管理Cookie
##### 4.2.2 读取Cookie
##### 4.2.3 设置Cookie
##### 4.2.4 删除Cookie
##### 4.2.5 获取全部的Cookie Store
##### 4.2.6 监控操作的Cookie的行为
#### 4.3 历史
##### 4.3.1 读取历史
##### 4.3.2 添加历史
##### 4.3.3 删除历史
##### 4.3.4 对历史操作的监听
#### 4.4 管理扩展与应用
##### 4.4.1 读取用户已安装的扩展和应用的信息
##### 4.4.2 获取权限警告
##### 4.4.3 启用、禁用、卸载扩展和启动应用
##### 4.4.4 对管理操作的监听
#### 4.5 标签
##### 4.5.1 获取标签信息
##### 4.5.2 创建标签
##### 4.5.3 更新标签
##### 4.5.4 移动标签
##### 4.5.5 重载标签
##### 4.5.6 移除标签
##### 4.5.7 获取当前标签页面的显示语言
##### 4.5.8 获取指定窗口活动标签可见部分的截图
##### 4.5.9 注入JavaScript和CSS
##### 4.5.10 与指定标签中的内容脚本（Content Script）通信
##### 4.5.11 监视标签行为
#### 4.6 Override Pages

### 5. 部分高级API
#### 5.1 下载
#### 5.2 网络请求
#### 5.3 代理
#### 5.4 系统信息

### 6. Chrome应用基础
#### 6.1 更加严格的内容安全策略
#### 6.2 图标设计规范
#### 6.3 应用的生命周期
#### 6.4 应用窗口
##### 6.4.1 创建窗口
##### 6.4.2 样式更加自由的窗口
##### 6.4.3 获取窗口
##### 6.4.4 窗口事件
#### 6.5 编写第一个Chrome应用

### 7. 文件系统
#### 7.1 目录及文件操作对象
#### 7.2 获取目录及文件操作对象
#### 7.3 读取文件
#### 7.4 遍历目录
#### 7.5 创建及删除目录和文件
#### 7.6 写入文件
##### 7.6.1 Typed Array
##### 7.6.2 Blob对象
##### 7.6.3 FileWriter对象
#### 7.7 复制及移动目录和文件

### 8. 媒体库
#### 8.1 获取媒体库
#### 8.2 添加及移除媒体库
#### 8.3 更新媒体库
#### 8.4 获取媒体文件信息

### 9. 网络通信
#### 9.1 UDP 协议
##### 9.1.1 建立与关闭连接
##### 9.1.2 发送与接收数据
##### 9.1.3 多播
##### 9.1.4 获取socket和组
##### 9.1.5 局域网聊天应用
#### 9.2 TCP 协议
##### 9.2.1 建立与关闭连接
##### 9.2.2 发送与接收数据
##### 9.2.3 获取Socket
#### 9.3 TCP Server
##### 9.3.1 建立与关闭连接
##### 9.3.2 监听数据
##### 9.3.4 HTTP Server
#### 9.4 WebSocket

### 10. 其他接口
#### 10.1 操作USB设备
##### 10.1.1 发现设备
##### 10.1.2 接口操作
##### 10.1.3 传输操作
#### 10.2 串口通信
##### 10.2.1 建立连接
##### 10.2.2 发送和接收数据
##### 10.2.3 获取连接及状态
#### 10.3 文字转语音
##### 10.3.1 朗读文字
##### 10.3.2 获取声音
##### 10.3.3 获取朗读状态并监听事件
#### 10.4 系统信息

### 附录A 制作Chrome主题
#### A.1 背景图片
#### A.2 颜色
#### A.3 颜色叠加
#### A.4 UI属性
#### A.5 实用My Chrome Theme制作主题

### 附录B CSS选择器
#### B.1 基本选择器
#### B.2 高级选择器
#### B.3 伪类

### 附录C Chrome扩展及应用的完整API列表
#### C.1 Chrome扩展的全部API
#### C.2 Chrome应用的全部API



