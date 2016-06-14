---
layout: post
title: "git rebase实践（二）"
subtitle: "——关于merge和rebase"
categories: "blog"
tags: [git, rebase, merge, HEAD]
description: "Practice is to test the truth!"
first_time: "2016-06-09 17:04:02"
last_time: "2016-06-13 22:04:24"
img_version: "1465826571"
---

>关于git rebase实践的系列：  
[「git rebase实践（一）——关于rebase定义的实践结果」][link_1]  
[「git rebase实践（二）——关于merge和rebase」][link_2]  
[「git rebase实践（三）——关于-i参数的使用」][link_3]

## 一、关于git rebase和git merge

rebase和merge都是用来合并分支的指令。这篇文章的重心，主要是以rebase为主，说说merge和rebase一起实践起来发生的情况。

### 1、相同

都可以把目标分支合并入当前分支中。

### 2、不同

按我个人感觉的说法，merge是把两条路进行一个「岔路相逢」，而rebase就是把两条路修成一条。  
实际上体现就是——log会出现不同！也就是所谓的rebase后的log是线性干净的，merge后的log稍显复杂，但会按时间来排序。   
各有所用吧。在需要的场景下选择需要的用法即可。

## 二、实际操作

one：先co -b mergeone分支，提交1，提交2，回master提交3，git merge mergeone，结果是0-3>1>2-4，再git rebase mergeone，结果得0-1-2-3。   
——推测1：rebase会把merge的提交覆盖（4没了）。此时rebase仍然按之前的逻辑（比如co -b mergeone后，再有3的话，那么不管3在哪里，都是会在1，2后）

![img_1][]

two：提交1，先co -b mergetwo，提交2，提交3，回master提交4，merge，结果是0-1-4>2>3>5，再rebase，结果是0-1-2-3-4。   
——推测2：merge跟rebase相同的地方，都是根据分支的生命周期来进行合并。

![img_2][]

three：先co -b mergethree，提交1，2，回master提交3，然后先rebase，结果0-1-2-3，再merge时，提示已经是最新的了。   
推测3：rebase后就不需要merge了

![img_3][]

这次实际操作，其实到这里，就差不多足够了。   
我们已经可以通过步骤，看到merge先后，对于进行rebase其实是并无干扰的。而rebase后，也发现并没有merge的需要了。   
（好吧，其实我写到了这，感觉已经可以交差了，这篇博客也该结束了……但就总觉得，还是需要搞清楚为什么，才能舒服的按下cmd+s……）

## 三、扩展学习

看了不少帖子，全是肤浅的介绍merge与rebase的简单区别，毫无用处。直到看到有一篇文章里说到——

>rebase的原理：先将当前分支的HEAD引用指向目标分支和当前分支的共同祖先commit节点，然后将当前分支上的commit一个个apply到目标分支上，apply完以后再将HEAD引用指向当前分支。是不是有点绕，下面我们看个实例。[[^note_1]]

虽然确实很绕，但让我顿时就明白，我一直忘了一个很重要的东西，对于git来说的，「HEAD引用」。

继续往下看——

>下面就开始rebase的介绍，我们会基于master新建一个release-1.0的分支，并在该分支上提交一个更新。

![img_4][]

>这时，我们在release-1.0分支上执行"git rebase master"，就会得到下面的对象关系图。

![img_5][]

>根据rebase的工作原理进行分析：
把当前分支的HEAD引用指向"00abc3f"
然后将当前分支上的commit一个个apply到目标分支，这里就是把"ed53897"更新apply到master上；注意，如果没有冲突，这里将直接生成一个新的更新
最后更新当前分支的HEAD引用执行最新的提交"8791e3b"
这个就是rebase操作，可以看到通过rebase操作的话，我们的commit历史会一直保持线性。

简单说就是，以commit的记录为准，进行各种识别。   
完美！我们做了那么多的操作，实际上在git里也就是一个引用的变更记录，就实现了这些区分的行为，非常简洁高效的工具！   
后面一篇实践，我准备写下-i（交互式rebase）的一些用法：[「git rebase实践（三）——关于-i参数的使用」][link_4]

## 四、参考文档

* [Git 分支 - 变基](https://git-scm.com/book/zh/ch3-6.html) （看看人家官方给的title……）
* [Git Step by Step – (8) Git的merge和rebase](http://www.cnblogs.com/wilber2013/p/4209547.html) （本文第三节中的引用就是来自这篇，建议去仔细看下。）
* [随笔分类 - Git Step by Step](http://www.cnblogs.com/wilber2013/category/643754.html) （这里写的git的相关系列，都非常赞，强烈推荐！）

---

###### 注释:
[^note_1]: <http://www.cnblogs.com/wilber2013/p/4209547.html>

[link_1]: {% post_url 2016-06-08-learn-git-rebase %}
[link_2]: {% post_url 2016-06-09-learn-git-rebase-merge %}
[link_3]: {% post_url 2016-06-10-learn-git-rebase-i %}
[link_4]: {% post_url 2016-06-10-learn-git-rebase-i %}

[img_1]: {{ site.img_url }}/img/pages/learn_git_rebase/rebase_7.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_2]: {{ site.img_url }}/img/pages/learn_git_rebase/rebase_8.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_3]: {{ site.img_url }}/img/pages/learn_git_rebase/rebase_9.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_4]: {{ site.img_url }}/img/pages/learn_git_rebase/rebase_10.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_5]: {{ site.img_url }}/img/pages/learn_git_rebase/rebase_11.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
