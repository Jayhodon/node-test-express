var express = require('express')
var bodyParser = require('body-parser')
var fs = require('fs')

var app = express()

//将目录下的public文件开放出来
app.use('/public/', express.static('./public/'))

// 配置使用 art-template 模板引擎
app.engine('html', require('express-art-template'))


// 如果想要修改默认的 views 目录，则可以
// app.set('views', render函数的默认路径)

// 配置 body-parser 中间件（插件，专门用来解析表单 POST 请求体）
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var comments = []

app.get('/', function (req, res) {
  fs.readFile('./comment.json',function(err,files){
    if (err) {
      return res.end('404 Not Found.')
    }
    if(comments.length==0)
        comments=JSON.parse(files)
    //页面默认读取到的数据是二进制，而render 方法接收的是字符串
    //为了将二进制数据转换成字符串 所以需要toString()方法
    //同理需要将获取的files数据转换成json对象
    res.render('index.html', {
      comments: comments
    })
  })
})

app.get('/post', function (req, res) {
  res.render('post.html')
})

// 当以 POST 请求 /post 的时候，执行指定的处理函数
// 这样的话我们就可以利用不同的请求方法让一个请求路径使用多次
app.post('/post', function (req, res) {
  // 1. 获取表单 POST 请求体数据
  // 2. 处理
  // 3. 发送响应

  // req.query 只能拿 get 请求参数
  // console.log(req.query)

  var comment = req.body
  comment.dateTime = '2017-11-5 10:58:51'
  comments.push(comment)

  // res.send
  // res.redirect
  // 这些方法 Express 会自动结束响应
  res.redirect('/')
  // res.statusCode = 302
  // res.setHeader('Location', '/') 
})

app.listen(3000, function () {
  console.log('服务器启动成功了，运行127.0.0.1：3000进行访问')
})
