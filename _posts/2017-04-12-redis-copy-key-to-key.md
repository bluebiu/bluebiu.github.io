---
layout: post
title: "redis如何拷贝一个key的值到另一个key"
categories: "blog"
tags: [linux, redis, command, client, copy, key]
description: "命令行技巧多"
first_time: "2017-04-12 19:51:57"
last_time: "2017-04-20 12:25:16"
img_version: "1492661354"
---

## 一、命运偷走如果 只留下结果

测试，又是测试。在某一次测试中，打算从一个cache里copy一个key到另一个环境去。以为挺简单的，结果一路失败到底……

（4月12日）~~提前说下结果，本人才疏学浅，目前为止尚未找到解决办法……有大神小仙路过，还盼不吝赐教！……~~

（4月20日更新）已经找到处理方法，追加于【二、4】。

咱们来做个实验，还原下现场。

## 二、时间偷走初衷 只留下了苦衷

先看看数据源——是一段curl获取来的html代码片段。

![img_0][]

注意原始大小：`74714`字节

```
testcopy1: 74714
```

### 1. 猎户 天狼 织女 光年外沉默

首先，我原想着，就按平常最普通的方式拷贝就行了。于是就点击编辑 - 全选 - 复制。

![img_1][]

接着，新建一个key，粘贴，确定。

![img_2][]

![img_3][]

然后，看到了神奇的一幕——`74728`字节？？！

```
testcopy1: 74714
testcopy2: 74728
```

### 2. 回忆 青春 梦想 何时偷偷陨落

难道是通过页面的形式拷贝，会由于html的textarea标签输出有转义，导致拷贝时字符有变化了？

那么，我们通过命令行来试试？

![img_4][]

擦，整出个`74715`字节？差一点就对了？

对了，这里用到了`xargs`命令，和它的`-0`参数，

```
-0 当sdtin含有特殊字元时候，将其当成一般字符，像/'空格等 [[^note_0]]
例如：root@localhost:~/test#echo "//"|xargs  echo 
      root@localhost:~/test#echo "//"|xargs -0 echo 
```

```
testcopy1: 74714
testcopy2: 74728
testcopy3: 74715
```

区别在哪呢？自己查看了一下值，发现末尾有不同：

![img_5][]

![img_6][]

原始是没有的，但通过commmand拷贝完确实多出个`<br />`，怀疑是linux的stdin时多出来的「换行符」造成的？

### 3. 当故事失去美梦 美梦失去线索 而我们失去联络

怎么去掉这个「换行符」？q群问了一圈，偶遇一位大神指点，甩了一串命令，试了试：

`redis get testcopy1 | perl -pe 'chop;' | xargs -0 redis set testcopy4`

![img_7][]

差点就！……好吧，还是偏差了一丢丢。

但！……通过检查（这里忘了说使用场景，补一下上下文联系：这里拿到写入cache的html，是用来输出到前端页面用的，直接输出，所以成功与否，还得看那个页面浏览是否正常。）各个cache的情况：

![img_8][]

![img_9][]

结果：  
testcopy1, testcopy4能成功输出。
testcopy2, testcopy3页面报错。

```
testcopy1: 74714
testcopy2: 74728
testcopy3: 74715
testcopy4: 74712
```

### 4. 寂寞可以是忍受 也可以是享受 享受仅有的拥有

气的翻墙，然后找到了终极武器

```
You can do this with a Lua script:

redis.call('SET', KEYS[2], redis.call('GET', KEYS[1])); return 1;
KEYS1 is the source key
KEYS2 is the target key
The example below uses SCRIPT LOAD to create the script and invokes it using EVALSHA passing the following arguments:

The SHA1 returned from the script load
a 2 for the number of keys that will be passed
The source key
The target key.
Output:

redis 127.0.0.1:6379> set src.key XXX
OK
redis 127.0.0.1:6379> get src.key
"XXX"
redis 127.0.0.1:6379> SCRIPT LOAD "redis.call('SET', KEYS[2], redis.call('GET', KEYS[1])); return 1;"
"1119c244463dce1ac3a19cdd4fda744e15e02cab"
redis 127.0.0.1:6379> EVALSHA 1119c244463dce1ac3a19cdd4fda744e15e02cab 2 src.key target.key
(integer) 1
redis 127.0.0.1:6379> get target.key
"XXX"
It does appear to be a lot of stuff compared to simply doing a GET and then s SET, but once you've loaded the script (and memorized the SHA1) then you can reuse it repeatedly.[[^note_1]]
```

立刻上路：

![img_10][]

总算是妥妥的了。

## 三、摸不到的颜色 是否叫彩虹

小结下，redis中的key-value，是可以通过网页工具，命令行，redis-cli客户端等，进行新增修改删除，但没有复制。「[REDIS 命令参考](http://doc.redisfans.com)」需要自行处理。
方式可以有：

1. 网页工具操作：编辑 - 复制 - 新建 - 粘贴
2. 命令行：结合shell执行，可以stdout看到输出，也可以stdin配合执行多维指令
3. 登入client端，使用指令，或结合LUA等进行高级过程化操作。
4. copy时需要留意确认原始值和目标值的一致性，有效性。

## 四、参考文档

* [Xargs用法详解](http://blog.csdn.net/zhangfn2011/article/details/6776925/) （用多了，自然就记住了……）
* [REDIS 命令参考](http://doc.redisfans.com)（多看，多用，才知道有没有）
* [批量删除Redis数据库中的Key](http://blog.csdn.net/spring21st/article/details/15771861)

---

###### 注释:
[^note_0]: <http://blog.csdn.net/zhangfn2011/article/details/6776925/>
[^note_1]: <http://stackoverflow.com/questions/10891213/redis-how-to-set-one-key-equal-to-the-value-of-another-key>


[img_0]: {{ site.img_url }}/img/pages/redis_copy_key_to_key/origin_714.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_1]: {{ site.img_url }}/img/pages/redis_copy_key_to_key/copying.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_2]: {{ site.img_url }}/img/pages/redis_copy_key_to_key/addtest2.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_3]: {{ site.img_url }}/img/pages/redis_copy_key_to_key/test2_728.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_4]: {{ site.img_url }}/img/pages/redis_copy_key_to_key/command.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_5]: {{ site.img_url }}/img/pages/redis_copy_key_to_key/test3_715.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_6]: {{ site.img_url }}/img/pages/redis_copy_key_to_key/test1.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_7]: {{ site.img_url }}/img/pages/redis_copy_key_to_key/test4_712.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_8]: {{ site.img_url }}/img/pages/redis_copy_key_to_key/console_ok.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_9]: {{ site.img_url }}/img/pages/redis_copy_key_to_key/console_error.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_10]: {{ site.img_url }}/img/pages/redis_copy_key_to_key/test5_714.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}



