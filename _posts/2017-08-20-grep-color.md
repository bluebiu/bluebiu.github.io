---
layout: post
title: "linux的grep指令中color参数的坑"
categories: "blog"
tags: [linux, grep, color, centos, auto, always, lsb_release, version]
description: "竟然可以了？这是为什么呢～"
first_time: "2017-08-20 13:23:34"
last_time: "2017-08-20 13:23:34"
img_version: "1502354455"
---


### 一、我对你付出的青春 这么多年

之前一直用着一个挺好用的指令，查看文件内容时，可以过滤掉注释、空行：  
`cat filename | grep -v '[#;]' | grep -v '^$'`  
好端端的，突然发现去空行不行了。  

![img_0][]  

###### [（？？？黑人问号脸）]

换到另一台机器试了下，完全一样的文件，完全一样的指令，竟然又可以了……

![img_1][]  

###### [（？？？？？？黑人问号脸*2）]

这不科学……


### 二、换来了一句 谢谢你的成全

回到有问题的机器，再仔细的试了试。

![img_2][]

发现线索：这诡异的`[K`是什么？  
沿线搜索——

>这里用到grep的一个参数-color，color有三个值供选择：never、always、auto。  
always和auto的区别就是，always会在任何情况下都给匹配字段加上颜色标记，当通过管道或重定向时就会多出一些控制字符，结果会变成  
    export ^[[1;32m^[[KGREP^[[m^[[K_OPTIONS='-color=always'  
    export ^[[1;32m^[[KGREP^[[m^[[K_COLOR='1;32′  
而auto则只在输出到终端时才加上颜色。[[^note_0]]  

看到了很眼熟的`[K`，赶紧到`~/.bashrc`里看了一眼

![img_3][]

果然！之前为了好看（可以高亮出grep的搜索项）的逼格加上去的，这下算砸了自己脚……


### 三、成全了 你的潇洒与冒险

用其它参数试试：

![img_4][]

用「never」，立竿见影！

![img_5][]

用「auto」，也是妥妥的。  
（心急，早就把`~/.bashrc`里的改好成`auto`了，哈哈）  

目前看来，答案就是 **使用了`always`，造成给管道后提供数据源时，误增了`[K`这样的字符串，导致后续筛选有了偏差。**  
至于到底是怎么影响到，真不知道，就把锅算在centos上的bug吧～  
现在改成 **`auto`，也就是它能识别到使用者到底是在管道中的场景，还是输出时的场景** 了。  
那么，这个问题又搞定了，乐一个先～


### 四、成全了 我的碧海蓝天

强迫症犯了，迫切想去把本地刚弄好的vagrant里的也改了，改之前最后试了一下，结果一愣，竟然没影响？

![img_6][]

###### centos6.9表示毫无压力

![img_7][]

###### centos5.8确认可以稳定重现

行，这下真是找到centos的锅了，不过人家也默默把它修复了，可以翻篇了。

篇外收获——  
查看linux版本，`lsb_release- a`并不能通杀所有，`cat /etc/*-release`也是个很好的手段。


### 五、参考文档

* [grep高亮显示匹配项](http://blog.sina.com.cn/s/blog_8c6d7ff6010188uy.html)  
* [grep使用](http://www.cnblogs.com/dongzhiquan/archive/2013/01/09/2853879.html)  
* [Linux系统中如何判断当前Linux是什么类型和什么版本即是哪个发行版](https://www.crifan.com/how_to_check_which_linux_distribution_what_type_linux/)

---

###### 注释:
[^note_0]: <http://blog.sina.com.cn/s/blog_8c6d7ff6010188uy.html>


[img_0]: {{ site.img_url }}/img/pages/grep_color/no.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_1]: {{ site.img_url }}/img/pages/grep_color/ok.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_2]: {{ site.img_url }}/img/pages/grep_color/k.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_3]: {{ site.img_url }}/img/pages/grep_color/always.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_4]: {{ site.img_url }}/img/pages/grep_color/never.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_5]: {{ site.img_url }}/img/pages/grep_color/ok2.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_6]: {{ site.img_url }}/img/pages/grep_color/centos5.8.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_7]: {{ site.img_url }}/img/pages/grep_color/centos6.9.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}

