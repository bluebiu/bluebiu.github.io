---
layout: post
title: "excel的一次谜の报错"
categories: "blog"
tags: [excel, linux, xml, number, string]
description: "火眼金睛"
first_time: "2017-02-14 17:39:01"
last_time: "2017-02-23 20:33:36"
img_version: "1487853404"
---

## 一、「有人在吗？excel打不开，报错」

眼看就要下班了，需求方妹纸竟然说用后台导出的excel打不开？惊出一身冷汗。

——「发过来，我看能重现卜」

——[已成功接收到文件xxx0214.xls]

——「我这打开也报错了，我看看吧……」

## 二、「这谁写的代码？」

一翻记录，都2年多前离职同事留下的世界遗产了，每次都是边骂边看，算，还是自己看着办吧……

![img_0][]

打不开，报错，而且这报错信息，一点用都没看出来。

导了另外一天的数据，打开，正常。这时反应过来了，应该是「这天」的数据有问题。

随手就往打开好的ide里一扔，火眼金睛看了半天，找到了「问题」所在。

![img_1][]

嗯，就你不一样，这还不抓个现行。总之满满的都是`<Data ss:Type="String">111111</Data>`，是你的锅了。那么，改成`String`看看。

![img_2][]

打开了，破案！

## 三、「行了，发你一份能打开的了，你再试试」

打发完需求方，回头理下。

![img_3][]

按感觉又改了改，发现这样也行。不太明白，是不是xml里还有格式的对应限制的？（提问：老司机们，**xml的number类型，有长度限制吗？大小是多少？**）

这个暂时放一放，去找源头，毕竟php输出的……

![img_4][]

好吧，网上这么多 **「php生成Excel文件」** 的方法，非选了这么个麻烦货……（按我之前自己的做法，是直接用`\t`,`\n`输出一个`.csv`文件就可以了阿）

好了，这个就暂时先不深究了。


## 四、总结

最后还是觉得没弄清楚，就去XML的教程上看了一遍。

>可扩展标记语言，标准通用标记语言的子集，是一种用于标记电子文件使其具有结构性的标记语言。  
——[百度百科：XML](http://baike.baidu.com/link?url=sBUGvQsG9tiFF3lrlnOjVOnNy_fZh7uus8Bjp_EEh_oIw8fYwAjlm9Y2lGnj7r4O4MHo7z2t38qORT7OkYiuv2tgMsc6mVrYT8E6UQ_bEtdmDKcP-Y4DLvuVQdcv-ABEIDo4KiXhnQzER6TV5k_wFuhlLvYiJ3ZlL2kaFV3b2MIjafTjkeBGbemBE9pyAz9V0sVD_lJosF050P-to1TQ7q)

>XML 元素是可扩展，以携带更多的信息。  
XML 的优势之一，就是可以在不中断应用程序的情况下进行扩展。  
——[XML教程](http://www.runoob.com/xml/xml-elements.html)

突然意识到：XML的元素，只是一个标志符和里面的数值，并不会对「标志符」是什么，进而对「数值」做限制的。那么我前面的疑问「**xml的number类型，有长度限制吗？大小是多少？**」应该就不是XML的问题，问题应该在excel上：因为XML的标签和数值给的是`number`和`一个超长的数字值`，但excel读取时，就「傻傻」的按它自己的number标准去读取了，然后发现数据超出，异常，于是就报错了！（excel：怪我咯？……）

好吧，到这，才是真正破案了……

## 五、又收获一个linux语句

为什么用「又」？

![img_5][]

截取的文件可以用重定向输入到新的文件中：  

`head -100  filename >a.txt`

现用现查，轻松简单，快记下来（从图上还看得出熟练使用了二分法……为了找到上面那行异常的`<number>`,鬼知道我经历了什么）  

还有`tail`，`sed`，各种好东西，要多消化吸收。

## 六、参考文档

* [PHP生成Excel](http://jyald.iteye.com/blog/523988) （没懂到底为什么要用这种方法）
* [php生成excel文件的简单方法](http://www.jb51.net/article/46561.htm) （生成csv）
* [linux文件截取前几行，后几行，中间几行命令](http://blog.csdn.net/kangaroo_07/article/details/43733891) 
* [xml 数据类型方法的使用准则](https://msdn.microsoft.com/zh-cn/library/ms175894.aspx)（基本也没什么用，不过是官方的说明）
* [XML教程 - XML元素](http://www.runoob.com/xml/xml-attributes.html)（很详细的基础教程）

---

[img_0]: {{ site.img_url }}/img/pages/excel_export_error/error.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_1]: {{ site.img_url }}/img/pages/excel_export_error/number.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_2]: {{ site.img_url }}/img/pages/excel_export_error/excel.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_3]: {{ site.img_url }}/img/pages/excel_export_error/value.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_4]: {{ site.img_url }}/img/pages/excel_export_error/php.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_5]: {{ site.img_url }}/img/pages/excel_export_error/head.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}


