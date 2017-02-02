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

## 一、事出有因

### 1、事出

这两天真是跟ssh怼上了……挺久没有更新blog了，于是趁放假来刷了一波，往github这么一push，又出翔了……

事情是这样：github.com是用git方式去维护更新仓库，它是基于ssh来实现的，而ssh连接对于客户端和服务端都会记录和检验一个私钥公钥的配对，以及RSA安全验证，如果曾经连过的服务端发生了变更，则客户端会有Warning提示，询问并更新记录的文件，防止DNS劫持等带来的安全问题。此时需要客户端删除旧的记录，以便保持known_hosts文件的准确，但这时这么多条ip记录，谁记得清楚……（这我到底想说的啥……）

简单点，说话的方式简单点：其实就是出现了`Warning: Permanently added 'github.com,192.30.253.112' (RSA) to the list of known hosts.`怎么破……

![img_0][]

这本没什么，但我就那么一查，又跪了……

### 3、有因

已经吃过搜索引擎的亏，所以这次特别的尝试了各种关键字的组合，试了各种角度姿势，甚至最后搬梯子用了「真正的」搜索引擎谷大哥，都没能查到我想要的答案……（问题是什么？——看标题！——**「known_hosts可以用通配符吗？」**）

很明显，这个「最后的」问题，不是一开始的问题，也是在搜索的过程中诞生的。因为查到这里时，就卡住了，因为，搜不到答案了……

于是，我还是自己来记录一下这个坑吧……

（还是忍不住说，严重怀疑自己提取关键词的能力，真的是搜到怀疑人生……）

## 二、事发现场

### 1、还原真相

第一时间，我就想到了是ssh问题，马上试了一下——

![img_1][]

发现几个线索：  
1. 再次ssh连接，竟然不报warning了。  
2. known_hosts里有github.com这个域名的记录。  
3. 类似192.30.252/253的记录，有多条，并且最后一条明显区别更大。  
4. 这些ip后面生成rsa公钥完全一样。

ping了下……发现ip跟最近的那条吻合（192.30.253.113）！那么就把它去掉，再试试！果然重现，而且，这次ip还有了变化。（192.30.253.112）

![img_2][]

好像有点眉目了，known_hosts里存储的域名、ip地址，如果跟当前ssh连接时的信息不吻合的话，就会跳出警告部分了？

>用OpenSSH的人都知ssh会把你每个你访问过计算机的公钥(public key)都记录在~/.ssh/known_hosts。  
**当下次再连接这台主机，**  
系统就会认出它的公钥已经保存在本地了，OpenSSH会核对公钥，  
**如果公钥相同，**从而跳过警告部分，直接提示输入密码。  
**如果公钥不同，**OpenSSH会发出警告，避免你受到DNS Hijack之类的攻击。[[^note_0]]


### 2、确认嫌疑

![img_3][]

稍微改了下known_hosts里的记录，把那些多余的记录都删了，然后再试，发现可以了，不告警了！

（本文完?）

真的，确实没事了。如果是伸手党，看到这里，基本可以洗洗睡了，也用不着看后面的废话了。

---

## 三、两个问题

但，秉着总是给自己找事的一贯作风，这博主又开始闷声挖坑了……

于是，盯着原先这串ip发了会呆，问了自己一句：**「它又变了咋办？」**……

### 1、第一个问题

对阿，要是以后这ip又变了呢？咱又得这么改一回？玩我呢？**「应该有办法可以让ssh连接时不检查这个配对关系吧？」**

结果谁知道就这样，带着这个问题，起飞了……

愣是查到天黑都没能降落……

前面也提到了，连搜索引擎也搞不定……

搜来搜去，全都没用！我可能用了假搜索引擎……

>有以下两个解决方案：
1. 手动删除修改known_hsots里面的内容；
2. 修改配置文件“~/.ssh/config”，加上这两行，重启服务器。
   StrictHostKeyChecking no
   UserKnownHostsFile /dev/null

（未完待续……）

### 2、第二个问题

## 四、事后总结

## 五、参考文档

* [Linux系统下的ssh使用(依据个人经验总结)](http://www.cnblogs.com/kevingrace/p/6110842.html) （有alive相关的ssh服务端和客服端的配置）

---

###### 注释:
[^note_0]: <http://tianxiamall.blog.163.com/blog/static/208489112201521487463/>

[img_0]: {{ site.img_url }}/img/pages/ssh_known_hosts/sourcetree.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_1]: {{ site.img_url }}/img/pages/ssh_known_hosts/ssh_t.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_2]: {{ site.img_url }}/img/pages/ssh_known_hosts/ssh_t2.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_3]: {{ site.img_url }}/img/pages/ssh_known_hosts/ssh_t3.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}

