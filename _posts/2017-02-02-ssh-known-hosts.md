---
layout: post
title: "known_hosts可以用通配符吗"
categories: "blog"
tags: [linux, ssh, known_hosts, regex]
description: "搜索工具也不如亲自动手靠谱"
first_time: "2017-02-02 11:39:01"
last_time: "2017-02-04 00:03:36"
img_version: "1486137827"
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

1. 再次ssh连接，竟然不报warning了？！  
2. known_hosts里有github.com这个域名的记录。  
3. 类似192.30.252/253的记录，有多条，并且最后一条明显区别较大。  
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
1. 手动删除修改known_hosts里面的内容；  
2. 修改配置文件“~/.ssh/config”，加上这两行，重启服务器。  
   StrictHostKeyChecking no  
   UserKnownHostsFile /dev/null  

就上面这两句话吧，至少能搜到20遍（百度：ssh known_hosts），然而，屁用没有！……

1. 要手动的话，我还查个鸟阿，直接结案了。
2. 这两配置，排列组合我分开试，一起试，混合试，都不能满足需求。  
`StrictHostKeyChecking`设置是否将新主机公钥加入known_hosts文件。no就是自动加；yes就是要手动加，并且访问被拒绝；ask就是询问同意后自动加。  
`UserKnownHostsFile`指定其它文件作为known_hosts文件。

![img_4][]

所以，这两参数，有啥用？有鸟用！摔！……

接着查……

>修改**服务端**的ssh配置,如下[[^note_1]]:  
vi /etc/ssh/sshd_config  
#打开host_based的验证  
HostbasedAuthentication yes  
#不允许忽略~/.ssh/known_hosts  
**IgnoreUserKnownHosts no**  
#不允许忽略~/.shosts  
IgnoreRhosts no  

终于明白，这是**服务端**设置而要求的，难怪客户端怎么设置都没用！然而，**一般不建议调整服务端配置**，也不太可能让别人的服务端随意修改，所以，这条路基本又走到头了。

### 2、第二个问题

虽然第一个问题就这么完蛋了，但仍留下了很重要的信息：**原因是来自服务端配置。但本质还是由于本地known_hosts更新不及时，就会导致ssh出现告警**。

这个「更新不及时」在场景上是不可避免的，因为我根本无法预估这个东西变化的时间点而去随时更新。所以注意力就来到了known_hosts这个文件上：

>……3. 类似192.30.252/253的记录，有多条，并且最后一条明显区别较大。……

前面提到，这里的ip地址，很有规则。发现前2位一样，从第3位开始不同（估计252是16年的，253是现在的）。

```linux
192.30.252.128
192.30.252.129
192.30.252.121
192.30.252.130
192.30.253.113
```

于是，很自然就想到**通配符**。

那么，问题也就来了，**「known_hosts可以用通配符吗」**？

这个问题，完全没能在搜索引擎上找到答案。找到些好像是接近的：

>可以使用关键字Host来使声明只作用于特定的系统。Host声明作用于它与下一个Host声明之间的所有配置行。在主机名中，可以使用通配符\*和?。  
Host [hostnames]  
将下面的声明（直到下一条Host声明）都指定为只适用于hostnames。hostnames采用的格式应该与在命令行上所用的格式一样，而且也能够包含通配符\*和?。单个\*指定所有主机。[[^note_2]]  

其实这个说的就是平时用的`~/.ssh/config`里，针对于Host的设置，那就对known_hosts试试。

![img_5][]

![img_6][]

![img_8][]

先后尝试了「*」，「?」，「???」等通配符。配合known_hosts文件的变化，以及使用-v参数观察

```linux
debug1: Host 'github.com' is known and matches the RSA host key.
debug1: Found key in /Users/biubiu/.ssh/known_hosts:24
```

很快，就试出了结果：**答案是「可以」！**

通配符验证：  
`*`是多个字符  
`?`是单个字符

最后，根据前面记录github的ip，暂时决定用图中所修改的试试，观察一段时间再说。修改后是：  
`github.com 192.30.25* ssh-rsa XXXXXX……`

## 四、最后小结

又被「万能」的搜索引擎玩了一回……不得不再次吐槽：

1. 这东西可能根本就没人说过，找不到也是正常……
2. 中途找到那2个配置根本就是扯淡，为啥还这么多人抄来抄去……

不过通过搜索引擎积累的信息也是非常有用的，也许网上的答案是针对人家的问题的，并不一定通用。

采集有用的资料，排除掉没用的信息，沿着查到线索，再通过自己一些实践，最后得到自己想要的答案，这个还是非常畅快的！

## 五、其它收获

>事实上OpenSSH在工具ssh-keygen加了三个选项，协助你管理hash了的known_hosts。你可以用"ssh-keygen -F 计算机名称"找出相关的公钥：  
ssh-keygen -F www.example.net  
如果你想更新某计算机的公钥，可以先打"ssh-keygen -R 计算机名称"删除该计算机的公钥，然后再"ssh 计算机名称"再进入该计算机，ssh自然会重新下载新的公钥。  
如果你的known_hosts 档案仍未被hash，你可以打"ssh-keygen -H" [[^note_3]]

![img_7][]

## 六、参考文档

* [ssh 配置讲解大全](http://blog.chinaunix.net/uid-20395453-id-3264845.html) （这里找出了服务端配置导致由于known_hosts引起告警的原因）
* [ssh登陆之忽略known_hosts文件](http://blog.csdn.net/yasaken/article/details/7348441)（误导答案很多，还互相抄袭。随便放个出来。）
* [Is it possible to find out the hosts in the known_hosts file?](http://unix.stackexchange.com/questions/31549/is-it-possible-to-find-out-the-hosts-in-the-known-hosts-file#comment42847_31550)（ssh-keygen -F）
* [OpenSSH 中 known_hosts 的维护](http://tianxiamall.blog.163.com/blog/static/208489112201521487463/)
* [第十一章、远程联机服务器SSH / XDMCP / VNC / RDP —— 鸟哥的Linux私房菜](http://cn.linux.vbird.org/linux_server/0310telnetssh_2.php)（里面也没能提到关于known_hosts格式的问题，不过说得比较细致，还有一些例如重置系统公钥等等的细节也不错。）

---

###### 注释:
[^note_0]: <http://tianxiamall.blog.163.com/blog/static/208489112201521487463/>
[^note_1]: <http://blog.chinaunix.net/uid-20395453-id-3264845.html>
[^note_2]: <http://www.hao32.com/unix-linux/462.html>
[^note_3]: <http://tianxiamall.blog.163.com/blog/static/208489112201521487463/>

[img_0]: {{ site.img_url }}/img/pages/ssh_known_hosts/sourcetree.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_1]: {{ site.img_url }}/img/pages/ssh_known_hosts/ssh_t.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_2]: {{ site.img_url }}/img/pages/ssh_known_hosts/ssh_t2.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_3]: {{ site.img_url }}/img/pages/ssh_known_hosts/ssh_t3.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_4]: {{ site.img_url }}/img/pages/ssh_known_hosts/params.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_5]: {{ site.img_url }}/img/pages/ssh_known_hosts/wildcard_1.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_6]: {{ site.img_url }}/img/pages/ssh_known_hosts/wildcard_2.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_7]: {{ site.img_url }}/img/pages/ssh_known_hosts/ssh_keygen.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_8]: {{ site.img_url }}/img/pages/ssh_known_hosts/ssh_v.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}

