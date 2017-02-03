---
layout: post
title: "Linux使用ssh超时断开连接的真正原因"
categories: "blog"
tags: [linux, ssh, session, alive, NAT, iptables]
description: "要解决问题就不能不知道真正原因"
first_time: "2017-01-24 14:01:52"
last_time: "2017-01-28 20:39:23"
img_version: "1485607179"
---

## 一、挖坑

这篇的起因主要是来自上一个问题「[iTerm2中ssh保持连接不断开][link_0]」。

原本以为是个很常见的小问题，随手一搜，解决办法一大堆，试了试可行，就觉得没什么问题了。但，正因为觉得太简单了，在文末去查看了一下服务端配置，想找找问题起因，结果却发现开辟了一个深坑……

查看的默认配置：

```shell
$ echo $TMOUT
$ 
```

```shell
# ...
#TCPKeepAlive yes
# ...
#ClientAliveInterval 0
#ClientAliveCountMax 3
# ...
```

## 二、入坑

### 1、提问

提个问题：既然ssh是空闲过久导致连接超时而断开，那么`「ssh默认是多久时间，会自动断开连接？」`

结果翻遍大半个搜索引擎……全都是诸如「如何设置，才能让ssh不超时自动断」这样的鬼title，而且大部分都是互相抄，复制粘贴的内容……而我想问的问题是「到底多久超时」，却没人说过……或者说，其实跟本没有ssh超时这一说？！

再提个问题：如果ssh默认设置都没有限制，那`「为什么ssh会断开连接？」`

本以为是ssh自动断开超时连接的，但通过配置看到，默认值中并没有做任何限制，那么理论上，ssh的连接是不会断开的。那到底是谁，干了这件「坏事」？

### 2、再问

实在没什么头绪，跑到QQ群问了一番，结果真有大神回应，并且顺利找到了线索！

>最后通过各种摸索，终于知道了问题的主要原因，因为连接是可以的，只是会超时断开，根据网络结构来看，问题就可能出现在一下这几个部分[[^note_0]] ：  
    1. 服务器存在防火墙，会关闭超时空闲连接，或设置了关闭超时空闲连接。  
    2. 客服端和服务器之间存在路由器，路由器也可能带有防火墙，会关闭超时空闲连接。  
    3. 客服端存在防火墙，会关闭超时空闲连接。  

原来，问题出在**防火墙**！！

### 3、追问

为什么会是防火墙呢？根据大神指点：在iptables的一些NAT配置说明里有提到——

>4.3.6 State match
状态匹配扩展要有内核里的连接跟踪代码的协助，因为它是从连接跟踪机制中得到包的状态的。这样我们就可以了解连接所处的状态。它几乎适用于所有的协议，包括那些无状态的协议，如ICMP和UDP。**针对每个连接都有一个缺省的超时值，如果连接的时间超过了这个值，那么这个连接的记录就被会从连接跟踪的记录数据库中删除，也就是说连接就不再存在了。**这个match必须有-m state作为前提才能使用。状态机制的详细内容在章节状态机制中。[[^note_1]]

>NAT firewalls like to time out idle sessions to keep their state tables clean and their memory footprint low.  
**NAT防火墙喜欢对空闲的会话进行超时处理，以确保它们状态表的干净和内存的低占用率。**  
Some firewalls are nice, and let you idle for up to a day or so; some are gestapo and terminate your session after 5 minutes.  
**一些防火墙比较友好，允许你的空闲会话时间为一天甚至超过一天；另一些却如盖世太保，5分钟空闲就终止你的会话。**[[^note_2]]

通过这段描述（好吧，其实这段我没看得太透彻-0-。看来平时缺少些TCP等的知识细节的积累，对处理问题时的一些方向，线索，还是会有不少的障碍的。），我们就比较能大致想到断开的原因了——

**通过ssh连接后，客户端和服务端长时间没响应时，在两方机器设置中均没任何限制，但在各自的防火墙，或是中转网络连接路由的防火墙中，出现了「闲置超时断开」的缺省机制！**

## 三、填坑

总算知道了问题所在。既然如此，那就可以「对症下药」了：**让连接「忙」起来，别「闲」着！**

方法有几种，选其一即可。

### 1、修改服务端配置

![img_0][]

`TCPKeepAlive yes` #表示TCP保持连接不断开  
`ClientAliveInterval 300` #指定服务端向客户端请求消息的时间间隔，单位是秒，默认是0，不发送。设置个300表示5分钟发送一次（注意，这里是服务端主动发起），然后等待客户端响应，成功，则保持连接。  
`ClientAliveCountMax 3` #指服务端发出请求后客户端无响应则自动断开的最大次数。使用默认给的3即可。  
（注意：TCPKeepAlive必须打开，否则直接影响后面的设置。ClientAliveInterval设置的值要小于各层防火墙的最小值，不然，也就没用了。）

注意：最后要重启sshd服务才生效  
`sudo /etc/init.d/ssh restart`

修改服务端的配置往往会比较麻烦，也涉及到权限问题，以及安全问题。还是比较推荐下面的方法。

### 2、修改客户端配置

`vim ~/.ssh/config`

```shell
Host *
    ServerAliveInterval 60
```

这个在上一个问题「[iTerm2中ssh保持连接不断开][link_0]」中有说到的方案。  
`Host *` #表示需要启用该规则的服务端（域名或ip）  
`ServerAliveInterval 60` #表示没60秒去给服务端发起一次请求消息（这个设置好就行了）  
`ServerAliveCountMax 3` #表示最大连续尝试连接次数（这个基本不用设置）  

### 3、修改连接工具的配置

通过改变连接工具的一些默认配置，把keepalive的配置打开起来即可：

* secureCRT：会话选项 - 终端 - 反空闲 - 发送NO-OP每xxx秒，设置一个非0值。  
* putty：Connection - Seconds between keepalive(0 to turn off)，设置一个非0值。  
* iTerm2：profiles - sessions - When idle - send ASCII code.  
* XShell：session properties - connection - Keep Alive - Send keep alive message while this session connected. Interval [xxx] sec.  

当然，用这个办法的副作用也是有的，比如iTerm2会出现一些并不想输入的字符、vim会有些多余字符插入等等，这些情况就按个人的需要酌情取舍了。

### 4、连接参数-o

`ssh -o ServerAliveInterval=30 user@host`

## 四、坑不停

上面基本就把现象，原因，处理方法都说得差不多了，不过，这里还要多说两句。

一般来说，**不建议修改服务端。**会涉及到权限问题，以及安全问题。还是比较推荐修改客服端或工具等的方法。查的过程有看到过说关于抓包看到服务器发包时握手问题的，具体原因……

还有，细心的读者可能还会发现，「三、1」中提到的`TCPKeepAlive`，其实还有更深一层的意思和相关作用。但这里涉及的TCP心跳包，保活，探测报文等等……

与上面搭配的还有系统变量`echo $TMOUT`……

对上面提到的防火墙问题，前文提到的QQ群大神又帮忙往下查一查，告知还可以看到一个关于防火墙配置时的参数`ip_conntrack_tcp_timeout_established`[[^note_3]]，要研究下这个参数以及其所在文件的设置详情……

好吧……总结一下就是，有时从一个比较「小」的坑，可能就这样不知不觉的牵扯到了一堆底层的知识，一不留神就蒙逼了……

不过，这种能够不断的挖掘深坑，坑中有坑，坑复一坑，坑坑向上的感觉，总的来说还是非常有意思的。以后要继续发掘……

对于开头提到的问题，至少目前是可以「见好就收」了。对于期间遇到的一些「既有深度又有广度」的问题，本文无法一一兼顾。一口吃不下一个广西粽，一铲填不平全部的坑，暂时不能一下子研究到位的，还可以保持关注，记录下来。后面有兴趣的话，让我们再慢慢揭开它们的面纱吧。:)

## 五、参考文档

* [Linux系统下的ssh使用(依据个人经验总结)](http://www.cnblogs.com/kevingrace/p/6110842.html) （有alive相关的ssh服务端和客服端的配置）
* [ssh配置讲解大全](http://blog.chinaunix.net/uid-20395453-id-3264845.html)（里面有详细的debug过程，tcpdump抓包信息）
* [客户端连接linux经常间隔性断开链接](http://www.cnblogs.com/whatlonelytear/p/5532433.html) （点出根源是防火墙问题）
* [ssh 设置超时时间](http://blog.chinaunix.net/uid-10697776-id-3341317.html)（文中有一段英文以及翻译，很有价值）
* [linux 配置防火墙 配置nat转发服务](http://lilinji.blog.51cto.com/5441000/1129350)（提到ip_conntrack_tcp_timeout_established，还有防火墙iptables，NAT等配置，值得研究学习）

---

###### 注释:
[^note_0]: <http://www.cnblogs.com/whatlonelytear/p/5532433.html>
[^note_1]: <http://www.360doc.com/content/16/0627/16/1157518_571159455.shtml>
[^note_2]: <http://blog.chinaunix.net/uid-10697776-id-3341317.html>
[^note_3]: <http://lilinji.blog.51cto.com/5441000/1129350>

[link_0]: {% post_url 2017-01-22-iterm2-ssh-session-idle %}

[img_0]: {{ site.img_url }}/img/pages/ssh_session/server_sshd_config.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}

