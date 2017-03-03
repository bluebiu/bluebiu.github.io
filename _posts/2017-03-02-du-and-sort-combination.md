---
layout: post
title: "du和sort组合使用：显示文件夹/文件大小并排序"
categories: "blog"
tags: [linux, du, sort, dir, file, size]
description: "组合拳威力大"
first_time: "2017-03-03 10:57:28"
last_time: "2017-03-03 10:57:28"
img_version: "1488509862"
---

>那些网络上各种互相抄袭，说用du -sh * \| sort -rn的，真的自己试过吗？！

## 一、飞过人间的无常 才懂爱才是宝藏

项目测试中，突然发现请求全部超时无响应。

一看，log全是499、504。  
一想，代码没动过，估计db或cache出问题了。  
一查，好吧，连db的那台，硬盘爆了。

![img_0][]

硬盘满了，查看哪些文件比较占空间。首先，就想看哪个文件夹比较大。  
一般用`du -sh *`查看当前目录。发现是mysql相关文件最大。进到相关目录，继续排查。

这里有个差别，下图看到对比：

![img_1][]

`du -h --max-depth=1`：仅统计文件夹（包括当前目录`./`）。  
`du -sh *`：包含当前目录文件夹和文件。

大小看到了，接着是排序。

## 二、像孩子依赖着肩膀 像眼泪依赖着脸庞

排序，一般用管道符`|`+`sort`。

```
sort命令是帮我们依据不同的数据类型进行排序，其语法及常用参数格式：
　　sort [-bcfMnrtk][源文件][-o 输出文件] 
补充说明：sort可针对文本文件的内容，以行为单位来排序。

参　　数：
  -b   忽略每行前面开始出的空格字符。
  -c   检查文件是否已经按照顺序排序。
  -f   排序时，忽略大小写字母。
  -M   将前面3个字母依照月份的缩写进行排序。
  -n   依照数值的大小排序。
  -o<输出文件>   将排序后的结果存入指定的文件。
  -r   以相反的顺序来排序。
  -t<分隔字符>   指定排序时所用的栏位分隔字符。
  -k  选择以哪个区间进行排序。
```

根据文档，`sort`指令选用`-n`和`-r`即可。

但是，问题来了。上面的`du`命令中，带了个`-h`的参数，这个参数表示：  
**`h或–human-readable 以K，M，G为单位，提高信息的可读性。`**  
尝试一下：

![img_2][]

捂脸……明显不行！看着就是只按了得到的「数值」的大小来排序，根本没有考虑后面单位。  

仔细看看文档：

```text
du命令功能说明：统计目录(或文件)所占磁盘空间的大小。

语　　法：du [-abcDhHklmsSx] [-L <符号连接>][-X <文件>][--block-size][--exclude=<目录或文件>] [--max-depth=<目录层数>][--help][--version][目录或文件]

常用参数：
    -a或-all  为每个指定文件显示磁盘使用情况，或者为目录中每个文件显示各自磁盘使用情况。
    -b或-bytes 显示目录或文件大小时，以byte为单位。
    -c或–total 除了显示目录或文件的大小外，同时也显示所有目录或文件的总和。
    -D或–dereference-args 显示指定符号连接的源文件大小。
    -h或–human-readable 以K，M，G为单位，提高信息的可读性。
    -H或–si 与-h参数相同，但是K，M，G是以1000为换算单位,而不是以1024为换算单位。
    -k或–kilobytes 以1024 bytes为单位。
    -l或–count-links 重复计算硬件连接的文件。
    -L<符号连接>或–dereference<符号连接> 显示选项中所指定符号连接的源文件大小。
    -m或–megabytes 以1MB为单位。
    -s或–summarize 仅显示总计，即当前目录的大小。
    -S或–separate-dirs 显示每个目录的大小时，并不含其子目录的大小。
    -x或–one-file-xystem 以一开始处理时的文件系统为准，若遇上其它不同的文件系统目录则略过。
    -X<文件>或–exclude-from=<文件> 在<文件>指定目录或文件。
    –exclude=<目录或文件> 略过指定的目录或文件。
    –max-depth=<目录层数> 超过指定层数的目录后，予以忽略。
    –help 显示帮助。
    –version 显示版本信息。
```

其中两个参数`-m`和`-k`可以尝试：

![img_3][]

`du -sm`后可以看到，统一了单位（Mb），再进行排序，已经可以实现大小的区分。不过精度就略有不足。

![img_4][]

`du -sk`则精确到了Kb，再次排序成功。

所以，结论：可根据精度需要，`du`指令选择`-m`or`-k`参数。`sort`指令选择`-n`和`-r`对数值排序，并倒序显示—**`du -sk * | sort -rn`**

## 三、像诗人依赖着月亮 像海豚依赖海洋

最后还有点收尾工作。

前面说到硬盘爆满问题，现在找到起因是mysql导致，接着尝试了一些简单的处理。不过最后发现效果并不大。最主要的几个大文件，看到了也不能轻易删除。是个坑，没敢乱来，暂且这样。

![img_5][]

查看innodb的存放路径和规则。

![img_6][]

确实吻合1000M，简单查了下，都说不能删（包括ibdata1, ib_logfile0, ib_logfile1等），好吧。

![img_7][]

还有说是同步的binlog。查了下，看到是`On`。

![img_8][]

于是执行了下`reset master`。才有了那么点效果，然后临时解决完就接着联调去了。

这个留着以后再破。

## 四、参考文档

* [linux du命令参数及用法详解---linux统计磁盘空间大小命令](http://www.linuxso.com/command/du.html) （再「详解」，也得自己去参透，实践）
* [linux之sort用法](http://www.cnblogs.com/dong008259/archive/2011/12/08/2281214.html)
* [mysql硬盘满怎么办 ](http://blog.chinaunix.net/uid-20761674-id-3417025.html) 
* [mysql-bin占用空间太大的问题](http://blog.csdn.net/u010433704/article/details/50517848)
* [mysql的innodb扩容、ibdata1 瘦身](http://blog.csdn.net/zm2714/article/details/8479974/)

---


[img_0]: {{ site.img_url }}/img/pages/du_and_sort_combination/df_h.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_1]: {{ site.img_url }}/img/pages/du_and_sort_combination/du_sh.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_2]: {{ site.img_url }}/img/pages/du_and_sort_combination/sort_sh.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_3]: {{ site.img_url }}/img/pages/du_and_sort_combination/sort_sm.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_4]: {{ site.img_url }}/img/pages/du_and_sort_combination/sort_sk.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_5]: {{ site.img_url }}/img/pages/du_and_sort_combination/variables_innodb.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_6]: {{ site.img_url }}/img/pages/du_and_sort_combination/ibdata.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_7]: {{ site.img_url }}/img/pages/du_and_sort_combination/log_bin.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_8]: {{ site.img_url }}/img/pages/du_and_sort_combination/reset_master.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}


