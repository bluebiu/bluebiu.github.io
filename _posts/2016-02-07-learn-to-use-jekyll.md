---
layout: post
title: "从零开始折腾Jekyll"
subtitle: "——使用Jekyll模板"
categories: "blog"
tags: [github, blog, Jekyll, git, ruby, gem, plun-in, Liquid, duoshuo, highlight, Rouge, task-lists]
description: "Enjoy the process!"
first_time: "2016-02-07 15:50:33"
last_time: "2016-03-02 17:19:15"
img_version: "1456465498"
---

>目录

* 目录
{:toc}

## 一、Github Pages

首先，建议搭好一个Github Pages空间。  
如果不清楚，可以先看下「[从零开始用GitHub Pages创建博客][link_1]」。
当然，这只是个建议。如果只是想纯玩Jekyll，也可以直接往下看。（本文主要以我的折腾经历作为介绍，Jekyll的学习过程自然是从零开始，但本人的其它基础并不是「从零开始」……所以，有些内容涉及一些基础工具的使用，只做了些简单注释。不清楚的可以根据关键词直接百度谷歌之乎者也，不要犹豫：简单！粗暴！快速！有效！）

## 二、Jekyll是什么

>Transform your plain text into static websites and blogs.

——这是来自「[Jekyll官网][link_2]」最直接的介绍。  

* 个人认为，**它就是**一个可以做到相对闭环的打造博客页面的工具。  
*（既可以一时兴起，在本地搭建临时玩玩，任它自生自灭；也可以长期积累，通过推至网上分享，并可随时维护。）*
* 简单的说，**它就是**一个可以部署的cms。  
*（这么理解吧，后端部署可通过Ruby支持，前台cms可通过Git管理）*
* 再简单点，**它就是**一个壳。  
*（可以自己按需调整页面——壳外包装；也可以专注于内容编写——壳中内容）*
* 或者认为，**它就是**一把刀。  
*（开始做相应个性化配置改改改——磨刀；后面只需要把灵感记录下来写写写——亮剑）*
* 它是什么？**它就是****「Jekyll」**!

## 三、Jekyll怎么玩

Jekyll虽屌，但毕竟不是瑞士军刀，并且，也不建议把它玩成瑞士军刀。  
它的入门成本非常非常之低，只需要简单几步，即可上手。然后，如果想进一步折腾，那就需要有一些工具使用的经验和网页开发的基础。这个门槛，可高可低，就看各自的已有积累和钻研问题的本领了。想玩得6，「耐心模仿参考」、「仔细观察学习」、「善用搜索引擎」是不可或缺的法宝。  
多说了八万句废话，下面开始进入正题。

### 1、初见

从何入手？从哪里来，就从哪里入手！
从Github上用git把刚刚生成好的yourusername.github.io项目clone[[^note_1]]下来，假设放在一个叫`myblog`的目录中。

![img_1][]

#### 1.1、归零复位

> 若要化神，先要化凡！ ——《仙逆》

因为我们正是要利用Jekyll来打通本地调试和线上生成的关系，这些一个个全是已经生成好的html文件了，对我们来说，毫无用处！  
马上进到项目目录中，把除了`.git/`之外的其他文件夹全删了。（没错，一点不留，**全删**）删完，就算是从零开始正式入门，由简入深的上路了。

#### 1.2、简单套用

>通常拜入师门，听完师傅传授口诀，不免得自己摸索一番。而机智の小师弟若想要有所"速成"，自然先去寻师兄请（tou）教（shi）。  

网上有很多已经完善得很好的Jekyll模板，作者一直在使用并且持续维护的，发扬拿来主义即可。  

1. 比如[「有哪些简洁明快的 Jekyll 模板？ - 知乎」][link_3]里，辣摸多赞多分高的，挑个喜欢的。  
2. 找到它的github地址，fork[[^note_2]]下来，把除了`.git/`之外的所有文件夹全部拷贝到`myblog`目录下，push[[^note_3]]到你自己的yourusername.github.io项目中。  
3. 刷新访问yourusername.github.io，看到了什么？  

哈哈，这时，博客已经完全变样，如你所挑的那个模板的样子，出现在你眼前。
（不过等等……怎么全是别人的文章……莫慌，还差一步。）

#### 1.3、临门一脚

到了这里，别人已经帮你把所有该准备的都准备好了，只需把你的鞋换上而已。  

1) 修改配置文件`_config.yml`

```shell
>cd path/to/yourblog
>vim _config.yml
```

并修改一些个性信息（以我为例）

```yaml
# 网站配置
url: "http://bluebiu.com" # 填写自己的网站地址
baseurl: "" # 一般都是设置为根目录path

title: "Biu^Biu's Blog" # 网站标题
keyword: "biubiu, @biubiu, ..." # 据说是跟seo相关

comments:
    duoshuo: 
        short_name: "bluebiu" # 不一定是这个结构，但如有duoshuo的short_name，要改成自己。
        # 切记！这里一定不要用别人的！没有就置空。
        # 再重复一次...
        # 重要事情 x3
# ...
# 其他自行排查。如果还有什么是个人个性化的，都改为自己的即可。
# 文件不长，建议至少过一遍。
```

2) 添加文章

```shell
>cd _post/
>rm *
>touch 2016-01-01-hello-world.md
>vim !$
```

```liquid
---
layout: post
title: "你好，世界"
categories: "blog"
---

## Hello world.

I am a student, my name is LiLei.
...
```

再次提交改动至Github。  

over！  
（完了？）  

### 2、回眸

按步骤做到这里的话，已经完成了Jekyll模板的简单使用。  
来看看整个博客页面的改变。

![img_2][]
![img_3][]
![img_4][]

可以看到，模板的应用，以及新博客的发布，都已经生效。  
回顾一下几个关键的步骤：

1. 拷贝样式
2. 修改配置
3. 发布文章

之后需要再次更换样式，更新内容，发布博客等等，也就这几板斧了。  
如果还不是很清楚这些步骤的意义，那下面就来细说下这几个要点。

### 3、相识

>相识，而相知。需要一个过程，更需要时间的积累。

#### 3、1 目录结构

所谓`1. 拷贝样式`，也就是把整个文件夹拷贝过来，那么这几个文件/文件夹分别是什么呢，简单只需要记住几个

```
- _config.yml   // 全局配置文件所在，位置与名字不可改动
- _posts/       // 文章编写存放之处       
- index.html    // 首页入口文件
```

还有其它的？不用管，那些都是themes所需要的，放着就行。
（现在就想马上多了解的话，可以看看这里的更多官方描述：[「目录结构 - jekyllcn.com」][link_4]。不急的话，后面自然会有机会挨个说到）

#### 3、2 修改配置

明显就是要修改`_config.yml`文件，来实现「证明我是我」的配置了。
url: [yourdomian] //也就是写上你的实际博客地址咯
baseurl: 这个又重要，又不重要的配置呢，主要是影响到站点具体生成的路径的区别。涉及到是yourusername.github.io的master分支，还是yoursomeproject.github.io的gh-pages分支。  

比如：你有域名`aaa.com`， 的username是`bbb`，那么

1. 你「博客」的github地址就是`bbb.github.io`，做了CNAME指向你的domian后，实际地址就是`aaa.com`，baseurl配置为空`''`。
2. 你的某个项目`ccc_project`有gh-pages分支，那么该「项目描述博客」的地址就是biubiubiu.github.io，实际上地址就是`aaa.com/ccc_project`，相应的baseurl: `ccc_project`
3. 也许有留意到了，配置的每一项，是英文格式冒号 + 空格 + "值"。格式不能写错，否则github就会发邮件嘤嘤嘤了……

剩下的里面基本都有一些注释，或者非常明显的英文变量，耐心看下，比较直观可以看明白。
（感觉不够清楚的，仍可以通过这里先看看：[「配置 - jekyllcn.com」][link_5]）

#### 3、3 发布博客

记住几点：

1. 所有文章以markdown格式文件，保存在`_posts/`目录下
2. **[非常重要]**文件名称格式: `年-月-日-标题.MARKUP`（例如: `2016-01-01-hello-world.md`）
3. 要有「头信息」。  
如

```
---
title: hello world
subtitle: yeah
---
```

即使都不写，也至少必须填上

```
---
---
```

保存，提交，推送。剩下的就交给github pages了。
还有吗？没了。以后只需要不断的重复`3、3`即可发表博客，哪天真要改样式，无非按3个流程再走一遍（记得备份下`_post/`文件夹）。
没了。
真的没了。
如果不想过于折腾，按上述这些，就已经足够用上jekyll（之于）github pages了。
然后，人的欲望往往不会轻易止步……

### 4、迷恋

>谈不上一见钟情，那便是日久生情。

对于一个有强迫症+好奇心的人来说，弄到这，不知不觉也已经了解并实践了不少东西，期间不免会遇上几个坑，或者卡在一些问题上，投入了精力，也破有收获。这样一来一回的好事，慢慢加深了兴趣。于是又有了后面很多的折腾点：「liquid语法」，「jekyll部署+插件」，「语法高亮」，「timeline优化」，「tags与categories调整」，「task-list展示」，「图片缓存与发布问题？」……等等。  
只能说 **「上一个坑的终点，也是下一个坑起点。」** 
（随手贴个效果图出来看看咯）  

![img_5][]

由于本文篇幅有限，就只粗谈模板使用，还有一些细节和技巧的话，就留到下一篇来废话了。  
于是乎，又有了下面这篇[「折腾Jekyll实录」][link_6]的出现。  
边记录，边整理，边更新。

## 四、参考文档

* [Jekyll官网](http://jekyllrb.com) (比较完整的介绍)
* [Jekyll中文官网](http://jekyllcn.com) (由官网翻译而来)
* [有哪些简洁明快的 Jekyll 模板？ - 知乎](https://www.zhihu.com/question/20223939) (非常多优秀的成熟Jekyll模板)
* [Jekyll Themes](http://jekyllthemes.org) (比较纯粹的原始模板，使用的话还需要自行配置一部分)
* [Clean Blog - Jekyll Themes](http://jekyllthemes.org/themes/clean-blog/) （本文示例所用的Jekyll Themes）
* [Using Jekyll with Pages](https://help.github.com/articles/using-jekyll-with-pages/#platform-mac) （github中对于如何使用Jekyll的大概介绍）
* [configuration - jekyll](https://jekyllrb.com/docs/configuration/) (配置说明 - 官网英文版)

---

###### 注释:

[^note_1]: -用`git clone`指令，把你远程仓库的源码，下载到本地。在项目页面的右上角有SSH的地址。  
[^note_2]: -别人的开源项目，git页码右上角点击`Fork`，即可拿到当前的源码并加入你的仓库中，然后按1的方式可自行下载。
[^note_3]: -每次修改后，用`git add .`, `git commit -m "some simple notes"`, `git push origin master`完成修改内容提交并上传远程仓库。


[link_1]: {% post_url 2016-02-01-create-blog-in-github %}
[link_2]: http://jekyllrb.com
[link_3]: https://www.zhihu.com/question/20223939
[link_4]: http://jekyllcn.com/docs/structure/
[link_5]: http://jekyllcn.com/docs/configuration/
[link_6]: {% post_url 2016-02-21-learn-to-use-jekyll-more %}


[img_1]: {{ site.img_url }}/img/pages/learn_to_use_jekyll/jekyllthemes1_clone.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_2]: {{ site.img_url }}/img/pages/learn_to_use_jekyll/jekyllthemes2_pages.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_3]: {{ site.img_url }}/img/pages/learn_to_use_jekyll/jekyllthemes2_pages2.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_4]: {{ site.img_url }}/img/pages/learn_to_use_jekyll/jekyllthemes3_hello.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_5]: {{ site.img_url }}/img/pages/learn_to_use_jekyll/jekyllthemes4_todolist.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
