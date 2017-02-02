---
layout: post
title: "known_hosts可以用通配符吗"
categories: "blog"
tags: [linux, ssh, known_hosts, regex]
description: "搜索工具也不如亲自动手靠谱"
first_time: "2017-02-02 11:39:01"
last_time: "2017-02-02 11:39:01"
img_version: "1486006756"
---

## 一、起因

这两天真是跟ssh怼上了……挺久没有更新blog了，于是趁放假来刷了一波，往github这么一push，又出翔了……

事情是这样：github.com是用git方式去维护更新仓库，它是基于ssh来实现的，而ssh连接对于客户端和服务端都会记录和检验一个私钥公钥的配对，以及RSA安全验证，如果曾经连过的服务端发生了变更，则客户端会有Warning提示，询问并更新记录的文件，防止DNS劫持等带来的安全问题。此时需要客户端删除旧的记录，以便保持known_hosts文件的准确，但这时这么多条ip记录，谁记得清楚……（这我到底想说的啥……）

简单点，说话的方式简单点：其实就是出现了`Warning: Permanently added 'github.com,192.30.253.113' (RSA) to the list of known hosts.`怎么破……

![img_0][]

## 五、参考文档

* [Linux系统下的ssh使用(依据个人经验总结)](http://www.cnblogs.com/kevingrace/p/6110842.html) （有alive相关的ssh服务端和客服端的配置）

---

###### 注释:
[^note_0]: <http://www.cnblogs.com/whatlonelytear/p/5532433.html>

[link_0]: {% post_url 2017-01-22-iterm2-ssh-session-idle %}

[img_0]: {{ site.img_url }}/img/pages/ssh_session/server_sshd_config.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}

