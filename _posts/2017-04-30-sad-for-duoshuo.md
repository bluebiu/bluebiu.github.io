---
layout: post
title: "好你个「多说」"
categories: "person"
tags: [duoshuo, over, sad, wangyiyun]
description: "oh~no~"
first_time: "2017-04-30 21:20:13"
last_time: "2017-04-30 21:20:13"
img_version: "1493558440"
---

## 转眼走到了 自传最终章

终于在放假时间，闲下来整理下博客了。

翻了翻之前的博文，实在写得废话连篇。什么「于是」，「所以」，「然后」，「接着」……各种解释，各种思路的转弯，牵引……感觉吧，毕竟是偏理科的性子，扎实的逻辑思维方法，导致了这么个「**总想把前因后果描述得清清楚楚，来龙去脉诠释得干干净净的想法**」，结果却只不过是写成了「**由着自己的思绪航线胡乱飞翔的流水账**」……确实不怎么样，改。少说这些「废话」。

下面还是进入正题……

## 双颊曾光滑 夜色曾沁凉

有一段时间没去博客拔草了，刚登录了一下评论功能的多说，又来惊喜了……

![img_0][]

###### 「[重要通知: 多说即将关闭][http://dev.duoshuo.com/threads/58d1169ae293b89a20c57241]」——多说网 发表于 3月21日

>因公司业务调整，非常遗憾的向大家宣布多说项目即将关闭。 我们将于2017年6月1日正式关停服务，在此之前您可以通过后台的数据导出功能导出自己站点的评论数据。 对此给您造成的不便，我们深表歉意，感谢您的一路相伴。

这很可以，一锤定音，说完蛋就完蛋了。  
俱往矣。好在「多说」这个评论功能我也没用很深（主要是博客也没啥人看-0-），得，赶紧找个后浪推一推吧。

## 在我的时代 还有唱片行

一百度，铺天盖地——

* [如何评价“多说”即将关闭？有什么替代方案？——知乎](https://www.zhihu.com/question/57426274)
* [如何看待多说社会化评论系统即将关闭？——知乎](https://www.zhihu.com/question/57444893)
* [V2EX› 分享创造› 多说挂了，用 GitHub Issues 来当评论系统吧](https://www.v2ex.com/t/352545)
* [Gitment：使用 GitHub Issues 搭建评论系统](https://imsun.net/posts/gitment-introduction/)
* [多说甩下的锅，畅言来稳稳地接——搜狐科技](http://it.sohu.com/20170327/n484983201.shtml)
* [多说没了，我的评论将何去何从——人云亦云](http://www.renyyy.com/articles/694/)

厉害了，表面上都是评论，实际上全都是狠狠的刷了一波硬广！硬就硬吧，反正也只能从骡子里找马了。知乎上看了几大片回复，大致捋了捋：
1. [disqus](http://www.disqus.com)：全球第一，但要翻墙。早先刚搭建博客时就有考虑，想想为了给留言的朋友减少麻烦（不用自备梯子），弃之，与人方便自己方便。现在还是暂不考虑吧。
2. [畅言](http://changyan.kuaizhan.com)：看到的第一个硬广，很及时。
3. [网易云跟帖](https://gentie.163.com/index.html)：硬广+1，很及时+1。
4. [来必力](https://livere.com)：看推荐都说得卜错，我就上官网看了下，首页就开了半天，什么玩意，退下……
5. [Gitment](https://github.com/imsun/gitment)：国人利用github issues硬是做出了一个，粗看了下，感觉卜错，但授权有点奇怪，等以后有空研究了再用吧。

就在「畅言」和「网易云跟帖」里挑一个吧。来回斟酌，想了下「搜狐新闻」和「网易新闻」……然后就选了「网易云跟帖」……

## 以为的日常 原来是无常

说下迁移过程：

**首先**，（注册就不用说了吧）开通网易云跟帖，设置一下站点信息，基本的皮肤，功能。

![img_2][]

###### 留意下这里的站点名称，会显示在每个评论人的昵称旁边，按需调整

![img_3][]

###### blue, I like it ~

![img_4][]

###### 值得说下，之前看到网友推荐的帖子里，会提到这个名称和文案毫无违和感，但我这里看，已经是可以自定义的了，所以算是加分项。

**接着**，转移数据。多说导出，导入网易云跟帖。

![img_5][]

![img_6][]

###### 导出时是[zip]文件，导入上传时也是这个[zip]文件即可。

![img_7][]

###### 解压检查看看，很稳。

**然后**，就是放置代码。

![img_8][]

###### 模板加上管理后台拿到的js代码。（我这里是找到`_layouts`下的`post.html`）

![img_9][]

###### 同时也去掉多说的代码片段~

**最后**，看效果咯。

![img_10][]

###### 先看看之前的……[手动捂脸]

![img_11][]

###### 这打赏我可是没忘阿……[二次捂脸]

![img_12][]

###### 现在是这样了……（数据都对，但总有读取不出的「author_name」，只能默默成为有态度的人了……）


替换之后的变化：
1. 评论都是从上往下倒序了。
2. 回复有引用框了。（继承了网易盖楼风格）
3. 登录少了一些常用的第三方联登方式（比如微信）
4. 介于3，所以会出现一些未登录的「有态度的」网友，以及一些获取不到头像的头像了。

## 写这首长诗 用一生时光

参考文档，都在上面有附上链接，不再重复了……


[img_0]: {{ site.img_url }}/img/pages/sad_for_duoshuo/guanbi.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_1]: {{ site.img_url }}/img/pages/sad_for_duoshuo/guanbi.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_2]: {{ site.img_url }}/img/pages/sad_for_duoshuo/setting0.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_3]: {{ site.img_url }}/img/pages/sad_for_duoshuo/setting1.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_4]: {{ site.img_url }}/img/pages/sad_for_duoshuo/setting2.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_5]: {{ site.img_url }}/img/pages/sad_for_duoshuo/export.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_6]: {{ site.img_url }}/img/pages/sad_for_duoshuo/import.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_7]: {{ site.img_url }}/img/pages/sad_for_duoshuo/json.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_8]: {{ site.img_url }}/img/pages/sad_for_duoshuo/script.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_9]: {{ site.img_url }}/img/pages/sad_for_duoshuo/diff.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_10]: {{ site.img_url }}/img/pages/sad_for_duoshuo/dashang.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_11]: {{ site.img_url }}/img/pages/sad_for_duoshuo/dashang2.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_12]: {{ site.img_url }}/img/pages/sad_for_duoshuo/now.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
