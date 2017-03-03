---
layout: post
title: "PHP利用curl「转发」"
subtitle: "——「偷梁换柱」，暗渡陈仓"
categories: "blog"
tags: [php, curl, response, header, body, image]
description: "不用不知道一用吓一跳"
first_time: "2017-02-28 15:01:32"
last_time: "2017-02-28 15:01:32"
img_version: "1488265307"
---

## 一、PHP不是最好的语言

最近做个需求，需要转发一个图片素材。（假设提供服务接口的我为A，图片源为B，请求接口方为C，流程就是C请求A，A需要从B获取图片，然后再返回给C。）

按以往的经验，我就先curl获取B的图片，再输出给C就好。

问题来了，我一直以为，A要把源文件先从B处curl获取，然后存成a，给把a文件提供给C下载获取。这么一来，好像很麻烦！PHP要这样实现吗？……

## 二、JAVA才是最好的语言？

### 1. java可以实现

跟对接同事商量了一下，发现这样效率太差，不过给出了一个说法：「可以直接转发二进制内容过来，不用下载存放」，我：「java可以这样？」，答：「是」。

「如果java能实现的话，php应该也可以？」

### 2. php也可以实现

马上去试了下。

1. 刚开始，用`file_get_contents`，拿到body，然后直接输出，确实可以了！
2. 紧接着，用`curl`来实现。同理，输出body。可行。
3. 问题来了，上面的输出，都需要声明一个头部（Header），如果这样，只能写死。

代码：  

```php
<?php
$url = 'https://api.weixin.qq.com/cgi-bin/media/get?access_token=ACCESS_TOKEN&media_id=MEDIA_ID'; 
// 这里获取到的，并不能预先知道是什么类型，如jpg,jpeg,png,gif
$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $url );
curl_setopt($curl, CURLOPT_HEADER, 0);
curl_setopt($curl, CURLOPT_TIMEOUT, 10);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, FALSE);
$response = curl_exec($curl);
$httpCode = curl_getinfo($curl,CURLINFO_HTTP_CODE);
$headerSize = curl_getinfo($curl, CURLINFO_HEADER_SIZE);
curl_close($curl);
header("Content-Type: image/jpeg; image/gif; image/jpg; image/png; charset=utf-8");
echo $response;exit;
```

效果：

![img_0][]

再看看获取图片的原始返回：

![img_2][]

两者相差在头部

这个还是不太好，所以php就真的是不完美的吗?

## 三、PHP是最好的语言

继续尝试：

![img_1][]

如果把`CURLOPT_HEADER`设置为`true`，返回中就带有头部信息。但直接输出的话，会发现头部也被当成body一起输出了。PHP一定要用header方法设置头部才可以！

找到一个分开header和body的方法：

>这里可以看到结果中header和body信息是在一起的，那么如何分离它们呢。[[^note_0]]方法有二种，  
>一是通过curl自带的curl_getinfo()方法[[^note_1]]获取头的长度，然后使用substr来分割字符串。示例代码如下：

```php
<?php
$response = curl_exec($ch);
if (curl_getinfo($ch, CURLINFO_HTTP_CODE) == '200') {
    $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $header = substr($response, 0, $headerSize);
    $body = substr($response, $headerSize);
}  
```

>第二种方法基于header和body是通过两个回车换行来分割的，所以可以通过如下代码实现：

```php
<?php
$response = curl_exec($ch);

if (curl_getinfo($ch, CURLINFO_HTTP_CODE) == '200') {
    list($header, $body) = explode("\r\n\r\n", response, 2);
}
```

马上调整：

```php
<?php
curl_close($curl);
if (!empty($response) && 200==$httpCode) {
    $header = substr($response, 0, $headerSize);
    $body = substr($response, $headerSize);
    $headerArr = explode("\n", $header);
    foreach ($headerArr as $v) {
        header($v);
    }
    echo $body;
    exit;
}
```

注意，这里php的header不支持一下传多个参数，所以只能用循环的方式全部转发！

![img_3][]

好了，这下就已用php完美实现了。

## 五、参考文档

* [php curl 分离header和body信息](http://blog.csdn.net/vieri_ch/article/details/21258571) （涨姿势了）
* [PHP-手册-函数参考-其它服务-cURL-curl_getinfo函数](http://www.php.net/manual/zh/function.curl-getinfo.php) （要多积累）

---

###### 注释:
[^note_0]: <http://blog.csdn.net/vieri_ch/article/details/21258571>
[^note_1]: <http://www.php.net/manual/zh/function.curl-getinfo.php>


[img_0]: {{ site.img_url }}/img/pages/php_curl_response/4type.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_1]: {{ site.img_url }}/img/pages/php_curl_response/outputheader.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_2]: {{ site.img_url }}/img/pages/php_curl_response/origin.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_3]: {{ site.img_url }}/img/pages/php_curl_response/done.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}


