---
layout: post
title: "iTerm2中ssh保持连接不断开"
categories: "blog"
tags: [iTerm2, ssh, session, vim, ASCII]
description: "好用的东西也得好好去用才好用"
first_time: "2017-01-22 17:09:38"
last_time: "2017-01-23 21:22:34"
img_version: "1485607178"
---

## 一、一个iTerm2蛋疼的问题

最近基友搞了台mbp，在装一些常用app时，跟我交流到一个情况：「用iTerm2进行ssh时，空闲了一段时间就会断掉了……」想来，这个情形也是之前总遇到的，尤其正开着vim开开心心的一把梭时，突然有产品汪跑来跟你沟通需求细节，等好不容易聊完，人家的需求有了，你TM代码呢？……于是又吭哧吭哧回到刚才的界面，正准备撸起袖子加油干，却发现冰冷的窗口上一点反应都没有了……

![img_0][]

## 二、解决？解决！

看这情况，是服务器端把空闲连接给断开了。只能重新连接了。这么蛋疼，是该找点法子处理下了。

随手一搜，锦囊到手。

### 1、方案一（通过iTerm2参数配置）

>刚接触iTerm2，用起来感觉还不错，就是不知道如何保持连接，让ssh不断线。
`profiles -> sessions -> When idel, send ASCII code` [[^note_0]]

(我就不说这回答把「idle」都拼错了……-0-)

很快，按照设置，配好，验证，好了。

![img_1][]

我配置的ASCII code是97，所以是一串aaaaaa，一看效果，果然没断。但是接着用了用，就发现有坑了……

![img_2][]

![img_3][]

开着vim，过了一段时间再回来时，这一长串aaaaaa……还要手工ESC，u一下，才恢复，而且指不定还会有其它副作用，实在蛋疼……

### 2、方案二（通过客户端ssh参数配置）

>正确的做法是，通过配置 ServerAliveInterval 来实现，在 ~/.ssh/config 中加入：
`ServerAliveInterval=30`[[^note_1]]

>ServerAliveInterval 30 #表示ssh客户端每隔30秒给远程主机发送一个no-op包，no-op是无任何操作的意思，这样远程主机就不会关闭这个SSH会话。[[^note_2]]

好的，二话不说，马上改！

![img_4][]

我只需要在当前用户的ssh连接调整就好（注意：是本地发起连接的客户端！并非修改所要连接的远程服务器端），那么`vim ~/.ssh/config`，然后新增
```shell
Host *
    ServerAliveInterval 60
```
我觉得60秒就好了，而且基本去连的机器都保持，所以配置了`*`，如果有需要针对某个机器，可以自行配置为需要的`serverHostName`。

再经过最后的验证，方案二确实为最优选择。

## 三、补充

### 1、单次连接

若只是单次连接时需要，可使用-o参数实现：
`ssh -o ServerAliveInterval=30 user@host`

### 2、罪魁祸首？

最后看下服务端的配置：

![img_5][]

我去……结果发现服务端其实只是默认配置？并没有主动做什么限制，那这次问题的根源，其实只是因为Mac的wifi断开了造成的而已？并非ssh连接的问题吗？（wifi：这锅我不背……）

好吧，这个问题记下了，留着下次研究。
（果然发现，之前把问题想得太简单了，后面原来隐藏了这么个秘密……「[Linux使用ssh超时断开连接的真正原因][link_0]」）

## 四、参考文档

* [V2EX›问与答——iTerm2 如何保持连接](https://www.v2ex.com/t/155773) 
* [命令行终端保持连接](https://www.liaohuqiu.net/cn/posts/keep-alive-terminal-connection/) (简单明了，提到了Vim的副作用)
* [防止远程Linux主机自动断开SSH连接](http://www.win789.com/linux/2017/47601.html) 
* [SSH 连接超时(ssh timeout) 解决办法](http://www.linuxidc.com/Linux/2013-02/79941.htm)

---

###### 注释:
[^note_0]: <https://www.v2ex.com/t/155773>
[^note_1]: <https://www.liaohuqiu.net/cn/posts/keep-alive-terminal-connection/>
[^note_2]: <http://www.win789.com/linux/2017/47601.html>

[link_0]: {% post_url 2017-01-24-linux-ssh-session-alive %}

[img_0]: {{ site.img_url }}/img/pages/ssh_session/broken_pipe.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_1]: {{ site.img_url }}/img/pages/ssh_session/iterm2_ssh_session.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_2]: {{ site.img_url }}/img/pages/ssh_session/aaaaaa.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_3]: {{ site.img_url }}/img/pages/ssh_session/vim.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_4]: {{ site.img_url }}/img/pages/ssh_session/ssh_config.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_5]: {{ site.img_url }}/img/pages/ssh_session/sshd_config.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}


