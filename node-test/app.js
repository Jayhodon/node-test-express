var http=require('http')
var fs = require('fs')
var url = require('url')
var template = require('art-template')

var comments = []

http
  .createServer(function (req, res) 
{
        // 使用 url.parse 方法将路径解析为一个方便操作的对象，
        //第二个参数为 true 表示直接将查询字符串转为一个对象（通过 query 属性来访问）
        var parseObj = url.parse(req.url, true)

        // 单独获取不包含查询字符串的路径部分（该路径不包含 ? 之后的内容）
        var pathname = parseObj.pathname
    
        if (pathname === '/') {
          fs.readFile('./view/index.html', function (err, data) {
            if (err) {
              return res.end('404 Not Found.')
            }
            fs.readFile('./comment.json',function(err,files){
              if (err) {
                return res.end('404 Not Found.')
              }
              //页面默认读取到的数据是二进制，而render 方法接收的是字符串
              //为了将二进制数据转换成字符串 所以需要toString()方法
              //同理需要将获取的files数据转换成json对象
              if(comments.length==0)
                comments=JSON.parse(files)
              var htmlStr = template.render(data.toString(), {
                comments: comments
              })
              res.end(htmlStr)
            })
          })
        }else if (pathname === '/post') {
          fs.readFile('./view/post.html', function (err, data) {
            if (err) {
              return res.end('404 Not Found.')
            }
            res.end(data)
          })
        }else if (pathname.indexOf('/public/') === 0) {
          // 将public公开出来
          // 如果请求路径是以 /public/ 开头的，就直接可以把请求路径当作文件路径来直接进行读取
          fs.readFile('.' + pathname, function (err, data) {
            if (err) {
              return res.end('404 Not Found.')
            }
            res.end(data)
          })
        } else if (pathname === '/comment') {
          var comment = parseObj.query
          comment.dateTime = '2019-12-25 21:11:22'
          comments.push(comment)
    
          // 如何通过服务器让客户端重定向？
          //    1. 状态码设置为 302 临时重定向
          //        statusCode
          //    2. 在响应头中通过 Location 告诉客户端往哪儿重定向
          //        setHeader
          // 如果客户端发现收到服务器的响应的状态码是 302 就会自动去响应头中找 Location ，然后对该地址发起新的请求
          // 所以你就能看到客户端自动跳转了
          res.statusCode = 302
          res.setHeader('Location', '/')
          res.end()
        } else {
          fs.readFile('./view/404.html', function (err, data) {
            if (err) {
              return res.end('404 Not Found.')
            }
            res.end(data)
          })
        }
      })
.listen(3000,function(){
    console.log("服服务器启动成功了，运行127.0.0.1：3000进行访问");  
})