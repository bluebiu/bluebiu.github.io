---
layout: post
title: "git rebase实践（一）"
subtitle: "——关于rebase定义的实践结果"
categories: "blog"
tags: [git, rebase, definition]
description: "Enjoy the process more!"
first_time: "2016-06-09 01:35:22"
last_time: "2016-06-09 01:35:22"
img_version: "1465407458"
---

>关于git rebase实践的系列：  
[「git rebase实践（一）——关于rebase定义的实践结果」][link_1]  
[「git rebase实践（二）——关于merge和rebase」][link_2]  
[「git rebase实践（三）——关于-i参数的使用」][link_3]

*（才发现竟然距离上一次写博有几个月之久了，这真是有点三天打鱼两天晒网的赶脚……不过，本意也就是想到有意思，有价值的就多写写，只不过没想到竟也成了挑剔的借口……哈哈，算了，随想随写，开工前忍不住吐槽自己两句-0-）*

## 一、关于git rebase命令

先看下来自官网的解释——
`git-rebase - Reapply commits on top of another base tip`[[^note_1]]

个人的理解，就是可以「重新定义」分支的一些「基准点」。

1. 它能把某个分支的提交，以某种形式，合并到当前分支。（merge）
2. 还能针对当前分支的一些提交进行一些重写。（commit）

结果大概就是什么「可以保持提交记录的树的整洁」「可以对一些历史提交进行『反悔』」……等，比如下图。

![img_0][]

更多的一些详细表达就不赘述了。（凡是可以百度到的……给你个眼神，自己体会）

## 二、使用git rebase的结果

### 1、预热+了解

看了那样间断又拗口的「定义」，基本还是无法准确理解rebase的作用的，就连得到的基本结果都不清楚。翻帖子，爬楼，各种看别人说的，还是可以了解个大概，但也仅仅就到这程度了。更不说大部分又是抄来抄去的，实在是不敢过于相信。  
于是，还是要亲自实践一番。

边操作，边思考，依旧是这样套路进行着——

### 2、操作+推测

one：先checkout -b one分支，提交1，再回master提交2，然后在master rebase，结果是log顺序为0-1-2。  
——推测1：以提交时间为顺序？

![img_1][]

two：先co -b two，回到master，提交1，再到two提交2，回master rebase，结果0-2-1。  
——推测2：以rebase跟的某分支为先，当前分支为后？

![img_2][]

three：先再master提交1，再co -b three，提交2，回master rebase，结果0-1-2。  
——推测3：以某分支生存时间范围为优先，「插入」当前分支的历史之前。

![img_3][]

four：先在master提交1，再co -b four，回master提交2，回four提交3，回master rebase，结果0-1-3-2。  
——推测4：会把rebase后跟的那个分支A的内容「全部插入」到当前分支master之前，在A生成后的所有B的提交都被算在后面。

![img_4][]

five：先在master提交1，再co -b five，提交2，回master提交3，回five提交4，回master rebase，结果0-1-2-4-3。  
——推测5：会把release后跟的分支A的所有提交，都「全部插入」到当前分支后。两部分都按各自时间顺序。

![img_5][]

six：先在master提交1，再co -b six，提交2，回master提交3，回six提交4，回master提交5，在master rebase six，结果0-1-2-4-3-5。  

seven：同six，最后rebase时加了参数 -i， 结果也一样。

## 三、get rebase实践小结

### 1、结论

在**当前分支**（master）进行rebase**其他分支**（A），得到结果是把A里所有提交，整体插入到master后面的提交前（提交分割点是**生成A的时间点**开始）。（也就是说，A是在时间点xxx时checkout -b出来的，那么master在xxx前的提交不受rebase影响，master在xxx后的提交，都得放在A的提交的后面。）

附：具体代码操作过程

```shell
(master) >touch seven1 && echo '2025'>seven1
(master) >git add .
(master) >git ci "seven1 in master 2025"
(master) >git co -b seven
(seven) >touch seven2 && echo '2026'>seven2
(seven) >git add .
(seven) >git ci "seven2 in seven 2026"
(seven) >git co master
(master) >touch seven3 && echo '2027'>seven3
(master) >git add .
(master) >git ci "seven3 in master 2027"
(master) >git co seven
(seven) >touch seven4 && echo '2028'>seven4
(seven) >git add .
(seven) >git ci "seven4 in seven 2028"
(seven) >git co master
(master) >touch seven5 && echo '2029'>seven5
(master) >git add .
(master) >git ci "seven5 in master 2029"
(master) >git st
(master) >git lg
(master) >git rebase -i seven
(master) >git lg

alias：
git ci = git commit -i
git co = git checkout
git st = git status
git lg = git log --xxxxxxxxxxxxx
```

### 2、其他

这次只是简单的通过具体操作，了解并验证git rebase得到的基本结果。实际应用中，还涉及到更多细节。比如merge与rebase的区别，merge后再rebase如何操作，反悔当前分支历史提交如何进行rebase操作，rebase -i后里面的各个参数如何使用，等等，仍需掌握，才能顺利把rebase运用在生产项目中，提供真正的支持与帮助。  
这些后面会继续把这些实践都记录总结下来，算提前挖坑了。  
[「git rebase实践（二）——关于merge和rebase」][link_4]  
[「git rebase实践（三）——关于-i参数的使用」][link_5]

## 四、参考文档

* [git英文官网](https://git-scm.com/docs/git-rebase) (详细定义，多个例子)
* [git内核文档地址](https://www.kernel.org/pub/software/scm/git/docs/git-rebase.html) （另一个官方说明，可供参考）
* [rebase](http://gitbook.liuhui998.com/4_2.html) （Git Community Book 中文版）
* [Git Rebase教程： 用Git Rebase让时光倒流](https://linux.cn/article-4046-1.html) （rebase一个使用示例，深入浅出，非常好理解）

---

###### 注释:
[^note_1]: <https://git-scm.com/docs/git-rebase>


[link_1]: {% post_url 2016-06-08-learn-git-rebase %}
[link_2]: {% post_url 2016-06-09-learn-git-rebase-merge %}
[link_3]: {% post_url 2016-06-10-learn-git-rebase-i %}
[link_4]: {% post_url 2016-06-09-learn-git-rebase-merge %}
[link_5]: {% post_url 2016-06-10-learn-git-rebase-i %}

[img_0]: {{ site.img_url }}/img/pages/learn_git_rebase/rebase_0.jpg{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_1]: {{ site.img_url }}/img/pages/learn_git_rebase/rebase_1.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_2]: {{ site.img_url }}/img/pages/learn_git_rebase/rebase_2.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_3]: {{ site.img_url }}/img/pages/learn_git_rebase/rebase_3.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_4]: {{ site.img_url }}/img/pages/learn_git_rebase/rebase_4.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_5]: {{ site.img_url }}/img/pages/learn_git_rebase/rebase_5.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}