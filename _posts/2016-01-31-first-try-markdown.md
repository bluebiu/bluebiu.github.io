---
layout: post
title: "Try Markdown"
subtitle: "// Todo"
categories: "blog"
tags: [try, done]
description: "Take easy!"
first_time: "2016-01-31 15:00:25"
last_time: "2016-02-08 00:53:11"
---

## 发表

发表第一个markdown

哈哈哈，才发现文件的『First』都写错成『Fist』了……

各种实验田

## 试试初步高亮

试试`markdown`语法

```php
<?php
echo 'php是最好的1语言';
exit;
?>
```

{% highlight php %}
<?php
echo 'fafa';
// Todo
function a() {
    exit('heee');
}
?>
{% endhighlight %}

{% highlight php linenos%}
<?php
echo 'fafa';
// Todo
function a() {
    exit('heee');
}
?>
{% endhighlight %}

## 试试分享微信头图

![wx题图](/img/wx_share_default.jpg "wxshare")

## 尝试h6颜色
---

###### 这是h6

## 尝试脚注

php[[^1]]
php2[[^note2]]
php3 for note4[[^note4]]
php444 for note3 [[^note3]]

## 尝试下划线

_用了『_』的标记_  
markdown不支持的，只能用html的行内标签\<u\>,比如<u>下划线</u>这样。  
[@超链接](http://bluebiu.com)
{{site.url}}

## 试试斜体

_我是斜体_

## 尝试链接的引用方法
Here is a [homepage][link1] link.

## 试下任务列表

1. [ ] 文章的锚点自动生成
2. [x] 代码高亮的安装
3. [x] tasklist展示
4. [ ] 七牛上传图片接口
5. [ ] ……
6. 

## 无序列表

* 收拾收拾是
* 反反复复方法
* GG嘎嘎嘎

## 再试

6. [x] 罚点啥
9. [ ] 问问
10. [x] fdsfds

在代码区段内插入反引号，你可以用多个反引号来开启和结束代码区段
试试``there is a php code `echo 123;` here``还行哦。  

再来`````this is five `````真可以。


---

###### 注释:
[^1]: 外文名:PHP: Hypertext Preprocessor，中文名：“超文本预处理器”
[^note2]: 外文名:PHP: Hypertext Preprocessor，中文名：“超文本预处理器”
[^note4]: 外文名:PHP: Hypertext Preprocessor，中文名：“超文本预处理器4444444”
[^note3]: 外文名:PHP: Hypertext Preprocessor，中文名：“超文本预处理器”

[link1]: http://bluebiu.com "biubiu's blog"