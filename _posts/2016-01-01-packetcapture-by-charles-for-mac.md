---
layout: post
title: "在Mac上使用Charles抓包"
categories: "blog"
tags: [charles, fiddler, mac, https, ssl, packetcapture]
description: "善用抓包工具"
first_time: "2016-01-01 01:26:33"
last_time: "2016-02-02 11:23:12"
img_version: "1456465498"
---

## 一、先吐个槽

刚好公司电脑硬盘挂了，开不了机，一向就懒在win下的fiddler抓包，现在突然没有了，手无寸铁，顿悟工具的重要性……本想着打算边查边用……结果……

受不了百度一搜索下来，全是些过气的文章。:( 

要么是集中2011~2013段的，基本就是一顿抄，一顿转载，也不确定到底靠谱不。要么就是太过于旧的版本，用法什么的都变化了，无法从中参考。于是还是自己观察挑一些有用的+直接查官网说明+反复尝试，然后搞定。-_@

最后，来整理一下。（不会太详细，就说些关键点）

charles版本`v3.11.2`。

需要实现的是，可以通过charles代理，实现手机端设置后，得到抓包信息，包括https的，顺带也发现可以抓本机浏览器的。

## 二、步骤

### 1、安装Charles

(破解什么的自行搞定……)

### 2、打开，并设置基本参数

打开Proxy——Proxy Settings...——Proxies——HTTP Proxy里的Port，就是代理的端口，是与手机端一致（比如这里默认8888，我设置了`8889`）——勾选Enable transparent HTTP proxying

### 3、手机连接wifi，并且设置手动代理

（ip为当前电脑，端口是上面设置的`8889`）
此时，手机打开一个url，已经可以实现初步抓包！下面接着把https的配置好

——不配置的话，报错提示（如「图1」）

```
SSLHandshake: Remote host closed connection during handshake

You may need to configure your browser or application to trust the Charles Root Certificate. See SSL Proxying in the Help menu.
```

![图1][img_1]

###### 「图1」

### 4、接着配置电脑上charles的ssl

Proxy——SSL Proxying Settings——SSL Proxying ——勾选Enable SSL Proxying——Locations里add一个Host和port（比如xxx-api.xxx.com, 443）(注意，这里先别填`*:443`, 下文会说明为什么）​

### 5、获取证书

Help——SSL Proxying——Install Charles Root Certificate on a Mobile Device or Remote Brower...——出现一个弹窗（如「图2」）

![图2][img_2]

###### 「图2」

### 6、手机安装证书

手机按提示，访问http://charlesproxy.com/getssl，出现安装证书提示，随便打个名称，选择WLAN（这里android，一定要选`WLAN`而不是VPNxxx），确定，完成！
这时再看看手机访问的https的链接，Charles能抓到了吧！

### 7、如果此时也想电脑也可以抓到https，还需要一点设置

Help——SSL Proxying——Install Charles Root Certificate——这时会打开【实用工具的钥匙串访问】——解锁系统根证书——搜索找到Charles Proxy Custom Root Certificate (built on biuMBA,local,31 DEV 2015)——打开——选择信任——使用此证书时：始终信任（如「图3」）​

![图3][img_3]

###### 「图3」

### 8、别急，最后一步

记得前面说过的`*：443`吗，对，这时就可以改为`*：443`了，手机端，电脑，都可以访问任意https而畅通无阻。（如果前面就设置了，就会出现，手机访问xxx-api.xxx.com正常，而电脑访问一些https的资源时，就有问题……我就是刷着知乎，发现样式全丢了，一看charles，全部报红叉，我去……想重现，发现重现不了，我也不想再折腾回去了……@_@）

好像是

```
Transaction began prior to session being cleared, body content transmitted before the session clear has not been captured
```

类似这样的。

## 三、重点说明

### 1、关键步骤说明

在「二、6」那里要用手机的访问https的浏览器来访问，才生效，否则无效。（这是新版charles不同的地方，官网说3.10之前的版本，仍是下载crt证书来完成这步，而之后的都是上述说的新方法。）

>Version of Charles prior to v3.10 used a single SSL Root Certificate. You can still download the legacy certificate bundle here or the certificate itself here (for installing on mobile devices). Note that these certificates **will not work** on Charles v3.10. [[^note_1]]

>If you are running Charles v3.10 or later, please go to Charles and consult the SSL Proxying submenu in the **Help menu**, for instructions on installing your new Charles Root Certificate. [[^note_2]]

>Charles generates its own certificates for sites, which it signs using a Charles Root Certificate, which is uniquely generated for your installation of Charles (as of v3.10). You will see a warning in your browser, or other application, when it receives that certificate because the Charles Root Certificate is not in your list of trusted root certificates. See SSL Proxying. [[^note_3]]

正是通过查看说明，在Help菜单上找到了相应入口，一个简单的小说明，就让原本一筹莫展的问题，瞬间得以突破，进而下一步操作！**耐心、细心**很重要。

### 2、提醒

本文说明里，用的是安卓手机连接电脑（别问为什么用mac的还用android……），排查中，看到文档有提到ios9的话会遇到一些问题，顺手就留个课外作业：用iphone的童鞋，如果要抓去https的话，该如何操作呢？-0-

## 四、参考文档

* <https://www.zhihu.com/question/26600336>（就是刷这个发现电脑抓不到https的问题……）
* <http://www.guokr.com/post/114121/>（这个https原理卜错，留着看看）
* <http://coolnull.com/3948.html>（win的，而且是旧版本的charles）
* <http://www.veryhuo.com/a/view/98081.html>（说了些基本图标的功能，还算好吧……）
* <http://drops.wooyun.org/tips/2423>（基本功能）

---

###### 注释:
[^note_1]: <http://www.charlesproxy.com/documentation/additional/legacy-ssl-proxying/>
[^note_2]: 同1
[^note_3]: <http://www.charlesproxy.com/documentation/using-charles/ssl-certificates/>


[img_1]: {{ site.img_url }}/img/pages/charles_for_mac/charles_1.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }} "charles_https_warning"
[img_2]: {{ site.img_url }}/img/pages/charles_for_mac/charles_2.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }} "allow_mobile_proxy"
[img_3]: {{ site.img_url }}/img/pages/charles_for_mac/charles_3.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }} "cenfigure_certificate"
