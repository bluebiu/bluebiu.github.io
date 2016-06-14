---
layout: post
title: "git rebase实践（三）"
subtitle: "——关于-i参数的使用"
categories: "blog"
tags: [git, rebase, pick, squash]
description: "Practice is to test the truth!"
first_time: "2016-06-09 17:13:47"
last_time: "2016-06-10 00:40:34"
img_version: "1465463635"
---

>关于git rebase实践的系列：  
[「git rebase实践（一）——关于rebase定义的实践结果」][link_1]  
[「git rebase实践（二）——关于merge和rebase」][link_2]  
[「git rebase实践（三）——关于-i参数的使用」][link_3]

## 一、关于git rebase -i

>使用这个rebase的原因，是来自于公司的gitlab通过hook限制了提交的规范，导致在新旧提交规范交接时，合入旧的分支时，带的那些commit-msg不符合要求，导致提交失败。于是，需要使用rebase进行调整。

加了参数「-i」就是可以发起交互模式。交互模式就是进入到一个vim的编辑界面，一切操作都可以按vim的方式进行。

![img_0][]

如果只是简单的进行rebase操作，默认都是pick。当有一些特殊的情况，需要用到edit, squash等的时候，就要用到-i了。   
本文主要进行的操作是pick, edit, squash。

## 二、基本操作

### 1、pick

先co -b出ione分支，提交1，提交2，切回master提交3，然后rebase -i ione，会出现下图——

![img_1][]

看到的hash是3的，不改动，保持pick，直接:q，得到结果——

![img_2][]

此时，就完成了一次最简单的rebase的交互模式的操作（得到结果，跟之前不加-i时是完全一样的）。

不过，如果我把某个pick去掉了呢？接着看：   
先co -b itwo，提交1，2，切回master提交3，4，然后rebase -i itwo，再出现的交互里，我把3的hash给注释掉了——

![img_3][]

结果，就真的没把3的提交带入，并且3的提交就这样消失了！

![img_4][]

仔细确认，确实3提交里的文件itwo3，已经不在当前分支了。（所以rebase时一定要谨慎，不然某些提交，可能就这样无声无息的消失了。）

那么pick就是这样，给git了解到需要参与rebase的提交，剩下的事情，就交给rebase自动处理了。如果说要对中间的某个提交，进行「后悔」，那么可以通过edit来实现。

### 2、edit

edit最大的特征就是：git会提供一个中断，供你自行操作（而pick是自动进行rebase）。

先co -b ithree，提交1，2，回master提交3，4，然后rebase -i ithree，在出现的交互里，把4的pick改为「e」

![img_5][]

:wq后，就看到了，确实暂停（中断）在4的hash上，

![img_6][]

此时，可以根据提示，做些操作。比如，重写下commit-msg。

![img_7][]

根据提示，继续git rebase --continue，整个rebase就完成了。   

那么细心的人应该发现了，为什么rebase时，只有master（当前分支）的提交，而没有ithree（目标分支）的提交，可进行选择呢？……擦，这我也不造。不过根据前面的认识理解，rebase是`「变基」`，简单理解的话，应该就是只会对`当前分支`进行pick等操作了。   
（// TODO 希望这样理解是接近正确的，之后如果找到准确资料，再更新确认）

### 3、squash

憋说话，先看一遍操作。    

1）git rebase -i bbea759 「这里就是要选择ithree第一个提交的前一个提交hash」

![img_8][]

2）进入交互模式后可以看到，hash是以倒序的形式给出。

![img_9][]

3）把除了第一个hash外的其它行前的pick，改成「s」

![img_10][]

4）:wq后会进入合并commit-msg的编辑界面，编辑好后再次:wq

![img_11][]

5）done。再看log，已经只剩下squash后的一条记录。

![img_12][]

看完过程，其实就知道squash是做什么的了。`#  s, squash = use commit, but meld into previous commit`——把多个提交，合并成一个提交。

## 三、总结与补充

1. 首先就是前面发现到的，rebase只能pick到`当前分支`的提交。
2. 选择hash时，要选择你所想要修改的提交的`父提交`。
例如：
git log得到
commit_one
commit_two
commit_three
commit_four
此时，
`git rebase -i HEAD~3` 等同于 `git rebase -i commit_four`
3. 交互模式进入的hash列表，是`倒序`的。
4. 修改pick时，可以使用`简写`「p,e,s」等。
5. 如果交互模式时，把某行删除，那就意味选择了`丢弃该提交`。
6. 使用`squash`时，必须至少保留最前面一个提交hash为pick。
7. 交互模式里，可以调整commit的上下顺序，进行`重排提交`。
8. git rebasee `--continue`是继续完成，`--abort`是完全取消。
9. 至于其他的交互参数，可自行尝试-0-

## 四、参考文档

* [Git Rebase教程： 用Git Rebase让时光倒流](https://linux.cn/article-4046-1.html) （rebase一个使用示例，深入浅出，非常好理解）
* [git rebase简介(高级篇) ](http://blog.chinaunix.net/uid-27714502-id-3436706.html) (pick, edit的使用)
* [git rebase 更改历史树](http://www.cnblogs.com/dabaopku/archive/2012/06/24/2559652.html) （提到了「重排提交」）

[link_1]: {% post_url 2016-06-08-learn-git-rebase %}
[link_2]: {% post_url 2016-06-09-learn-git-rebase-merge %}
[link_3]: {% post_url 2016-06-10-learn-git-rebase-i %}

[img_0]: {{ site.img_url }}/img/pages/learn_git_rebase/rebase_6.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_1]: {{ site.img_url }}/img/pages/learn_git_rebase/rebase_12.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_2]: {{ site.img_url }}/img/pages/learn_git_rebase/rebase_13.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_3]: {{ site.img_url }}/img/pages/learn_git_rebase/rebase_14.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_4]: {{ site.img_url }}/img/pages/learn_git_rebase/rebase_15.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_5]: {{ site.img_url }}/img/pages/learn_git_rebase/rebase_16.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_6]: {{ site.img_url }}/img/pages/learn_git_rebase/rebase_17.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_7]: {{ site.img_url }}/img/pages/learn_git_rebase/rebase_18.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_8]: {{ site.img_url }}/img/pages/learn_git_rebase/rebase_19.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_9]: {{ site.img_url }}/img/pages/learn_git_rebase/rebase_20.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_10]: {{ site.img_url }}/img/pages/learn_git_rebase/rebase_21.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_11]: {{ site.img_url }}/img/pages/learn_git_rebase/rebase_22.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_12]: {{ site.img_url }}/img/pages/learn_git_rebase/rebase_23.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
