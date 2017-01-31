---
layout: post
title: "git rebase实践（四）"
subtitle: "——与push发生的冲突"
categories: "blog"
tags: [git, rebase, push, rejected]
description: "Practice is to test the truth!"
first_time: "2016-07-05 17:05:07"
last_time: "2016-07-05 17:05:07"
img_version: "1484300999"
---

>关于git rebase实践的系列：  
[「git rebase实践（一）——关于rebase定义的实践结果」][link_1]  
[「git rebase实践（二）——关于merge和rebase」][link_2]  
[「git rebase实践（三）——关于-i参数的使用」][link_3]

## 一、关于git rebase后push的冲突问题

简单说下这个问题：在本地和远程已并行存在的情况下，rebase了本地分支，然后打算push到远程时，就会出现rejected而拒绝。

## 二、重现

1.本地仓库进行多次commit（本例4次）
2.push到远程仓库
3.本地仓库进行rebase,并且把4次commit调整为3次（通过rebase -i中的squash）
4.再次进行push，则出现rejected

![img_0][]

![img_1][]

![img_2][]

## 三、解决办法

### 1、如果是一个人在一个分支上独立工作

如果是这样……太好了！恭喜你！非常简单！——
`git push --force`，直接覆盖，以你本地的为准，强制推送远程仓库即可。
然后？该干嘛干嘛。

### 2、如果是多人合作（远程仓库属于公共仓库公用分支）

……！
停！打住！马上CTRL+C！可别以为「老夫上传代码就是一把梭」，要出人命的懂不懂……
敲黑板，注意了—— **严禁对公共仓库公用分支进行rebase后的push操作！** （推不了你还敢给我用--force？）
这个操作仅限于理论上可行，但实际可适应的场景是非常非常局限，并且基本是没有必要的。所以这东西一旦被团队中的参与者滥用，后果是非常恶劣的。具体可以看下参考文档了解。

通过引用一段温柔的描述，再次强调一下这个准则：

>呃，奇妙的衍合也并非完美无缺，要用它得遵守一条准则：
一旦分支中的提交对象发布到公共仓库，就千万不要对该分支进行衍合操作。
如果你遵循这条金科玉律，就不会出差错。否则，人民群众会仇恨你，你的朋友和家人也会嘲笑你，唾弃你。

### 3、如何挽救/避免？

首先，如果你进行这些操作前看了本文，那应该能及时刹车。（……废话！基本是出了事才会查）
那么现在，还没有敲下回车确定push的你，还有最后回头的机会：
`git pull`，`git rebase`，把远程的记录重写回你的本地仓库中进行还原。（本地近期的变更提交请先自己另行保留）

然后，把这个准则在团队中重复3遍或以上！

### 4.如果有人（你）已经push --force了？

请再轻声念一遍上面的准则，祝那人（你）平安……
（最原始的解决办法就是看哪位成员的本地仓库是最新最稳定可信然后以他为准还原覆盖远程仓库了，其它的就是慢慢跟每个成员解释吧……）
不信，你就试试吧。-0-

## 四、参考文档

* [Git 分支 - 分支的衍合](https://git-scm.com/book/zh/v1/Git-分支-分支的衍合) （官方说明）
* [Git push rejected after feature branch rebase](http://stackoverflow.com/questions/8939977/git-push-rejected-after-feature-branch-rebase) (stack overflow提问到了git push --force的用法)
* [git rebase 时会碰到的小问题和解决方法](https://www.v2ex.com/t/162905)(一些讨论和观点)

[link_1]: {% post_url 2016-06-08-learn-git-rebase %}
[link_2]: {% post_url 2016-06-09-learn-git-rebase-merge %}
[link_3]: {% post_url 2016-06-10-learn-git-rebase-i %}

[img_0]: {{ site.img_url }}/img/pages/learn_git_rebase/rebase_24.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_1]: {{ site.img_url }}/img/pages/learn_git_rebase/rebase_25.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_2]: {{ site.img_url }}/img/pages/learn_git_rebase/rebase_26.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}

