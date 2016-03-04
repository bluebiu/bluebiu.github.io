---
layout: post
title: "从零开始用GitHub Pages创建博客"
categories: "blog"
tags: [github, blog, jekyll, git, aliyun, cname, markdown]
description: "记录下各种坑点"
first_time: "2016-01-01 01:26:33"
last_time: "2016-02-21 10:27:12"
img_version: "1456465498"
---

> 目录

* mulu
{:toc}

## 一、突发奇想

突然就想搞个博客，于是就开始搞起来了。  
当然是从什么都不了解，到踩了不少坑，然后就总算弄得差不多了。  
收集，参考，模仿，调整，少不了这些套路的了。  
下面整理了大部分，先大致记录着。  

## 二、从无到有

迷茫着，迷茫着，不知不觉就上道了。   

### 1、探索

大信息时代，自然是先百度知乎了一波。发现有很多介绍，什么[网易博客][link_1]，[新浪博客][link_2]，[博客园][link_3], [CSDN博客][link_4]，[开源中国][link_5]，[简书][link_6]等等，各种技术博客的温床。后来一看，竟没几个是支持markdown的……(除了简书，之前新浪博客新版可选markdown模式试了下，由于是在线编辑器，非常局限，并不能算是「好用」的markdown编辑器。后面其他的也没有完全仔细去试了，毕竟想到是在线编辑器，就还是算了……)

这时候[Github Pages][link_7]就顺理成章的「被发现」了。:)

在阮一峰前辈的「[搭建一个免费的，无限流量的Blog----github Pages和Jekyll入门][link_8]」文中介绍说：

>...  
整个思路到这里就很明显了。你先在本地编写符合Jekyll规范的网站源码，然后上传到github，由github生成并托管整个网站。  
...  
这种做法的好处是：  
    * 免费，无限流量。  
    * 享受git的版本管理功能，不用担心文章遗失。  
    * 你只要用自己喜欢的编辑器写文章就可以了，其他事情一概不用操心，都由github处理。  
...  
它的缺点是：  
    * 有一定技术门槛，你必须要懂一点git和网页开发。  
    * 它生成的是静态网页，添加动态功能必须使用外部服务，比如评论功能就只能用disqus。
    * 它不适合大型网站，因为没有用到数据库，每运行一次都必须遍历全部的文本文件，网站越大，生成时间越长。  
...

这简直对我来说，它的**优点**等于：

* 线上：免费，省心；线下：存储文档便捷可靠。
* 可善用本地编辑器来支持markdown！
* 非常适合掌握git和少量前端技巧者几乎无门槛使用！
* 适合暂时还没买服务器，数据库的人……

那还等啥？就地搞起！@#&……%￥#@！@（）&）……

### 2、开动

选型结束，马上开始进行实践。
最先看了一些采用了这个方式的博客，发现页面素材百花争艳……有点搞不懂了——这些都用什么做的？Jekyll和Hexo都是什么？——好吧，小白刚入门，不知其意是很正常的。那么后退一步，先回头看看怎么突然就不懂了？
我们前面说了，只是选型到了GitHub Pages，那这个GitHub Pages（github.io）是什么呢？

>You can use `GitHub's Automatic Page Generator` to quickly create a website for a project, user, or organization.  
>To generate User and Organization Pages sites, you'll need to create a repository named `username.github.io` . The username or organization name must be your own or your GitHub Pages site will not build. The automatic page generator is accessible via the repository's Settings page. You can read more about User and Organization Pages here.[[^note_1]]

OK。反正不管名字叫什么，这东西理解起来就是：最终上传内容到了github上，就能展示页面了。那就按介绍的步骤走一波咯 \>>>

**（1）**、首先，你得注册好github帐号，拥有github仓库空间。  
**（2）**、创建pages仓库，必须是以你的github帐号名作为开头，即`yourName.github.io`。[[^note_2]]（注意一定要一致，否则pages页面将无法构建生成。）  
**（3）**、根据官方指示，开启自动构建页面设置——


>
1）On GitHub, navigate to the main page of the repository.  
2）Under your repository name, click  `Settings`.  
![img_1][]  
3）Click the `Automatic Page Generator` button.  
![img_2][]  
4）Author your content in the Markdown editor.  
5）Click the `Continue To Layouts` button  
6）Preview your content in our themes.  
![img_3][]  
7）Publish button When you find a theme that you like, click `Publish page`.[[^note_3]]  
![img_4][]  

基本一套下来就能访问 「yourUserName.github.io」啦，如果不行，按步骤重新确认一遍……（首次操作后，可能要等3-10分钟才生效）

搞定后的首次访问效果图如下 \>>>  
![img_5][]

-0-，那么接下来就是域名问题了。

### 3、包装

直接访问github，时常出现访问失败，加载页面资源失败，当然是各种网络因素，各种墙（尤其在公司时https，域名白名单等弱智墙……），梯问题导致，破坏心情。或者是觉得这个xxxx.github.io太low，影响逼格……
其实很好办，我们可以考虑建立一个自定义域名来解除困扰。

#### 3.1、获取独立域名

获取个性域名有很多途径，可以在各种地方购买，选择收费或免费，选择各种后缀等等，就不展开安利了，用到个人适合的就行了。  
我是在[万网][link_9]申请了一个。  
保证开通可访问和可管理的状态，然后就往下走了。  

#### 3.2、配置

这里需要2步，增加DNS解析，增加github里CNAME文件。

##### （1）、解析域名设置

设置为子域名和顶级域名，是不同的。

>
* Subdomains  
A subdomain is configured with a `CNAME` record through your DNS provider.
* Apex domains  
An apex domain is usually configured with an `A`, `ALIAS`, or `ANAME` record through your DNS provider and is often assigned to one or more IP addresses.[[^note_4]]

根据指引，要配置为「xxblog.yourDomian.com」这样的子域名时，需要增加一个`CNAME`解析。要配置为「yourDomian.com」的顶级域名时，需要增加一个`A记录`。

>
* Configuring a custom subdomain with your DNS provider  
In cooperation with your DNS provider, create a CNAME record that points from that domain to `username.github.io`. Your DNS changes can take up to a full day to propagate.[[^note_5]]  
* Configuring an A record with your DNS provider  
With your DNS provider, create A records that resolve to the following IP addresses:  
\>192.30.252.153  
\>192.30.252.154 [[^note_6]]

CNAME配置为跟之前访问pages的相同即可，A记录则是配置为2个给定的IP值。（如果要配置www的子域，可以用CNAME实现。）
我选择了用A记录配置顶级域名，如下：  

![img_6][]

嗯，设置好了先打开看一眼？……duang！

![img_7][]

纳尼……404？！不过好在看到是github的404页面了，至少说明配置的解析，到了github。配到了还不行？到这里，我反复去试了subdomian的CNAME配置和切回apex domian配置，发现仍然404依旧。
百思不得其解，翻来翻去，偶然翻到一篇知乎帖子：

>
**我仅仅把域名解析到上面的IP，Github 的服务器怎么判断我的 Github Page 是哪个？**  
例如我的自定义域名是：http://example.com，我的 Github Page 是：http://username.github.io  
当输入http://example.com时，DNS解析到 192.30.252.153，服务器怎么知道我要去的是 http://username.github.io？ 毕竟 Github Page 有千千万万个。[[^note_7]]

一拍脑袋，擦，我这后面还有一半的配置没弄呢。

##### （2）、添加CNAME文件

必须要在仓库根目录中建立一个`CNAME`文件，才能保证github顺利redirect成功。

>
* Creating and committing a CNAME file  
To redirect your GitHub Pages site, you must create and commit a CNAME file that contains the custom domain to your repository's root directory. For more information, see "Adding a CNAME file to your repository." [[^note_8]]  
* Adding a CNAME file to your repository  
...  
    * 4) In the file name field, type `CNAME` (with all caps!).  
    * 5) In the new file, add a single line that specifies the bare subdomain for your custom domain. For example, use `blog.example.com`, not `https://blog.example.com`. Note that there can only be **one domain** in the CNAME file. [[^note_9]]  

（值得注意的是，里面只能写一个域名，不需要添加「https」等protocal）  
来到`username.github.io`这个仓库的根目录，增加一个`CNAME`文件， 
 
```
>cd [path/to/blogroot]
>touch CNAME
>vim CNAME
```

里面写入，并保存  

```
yourDomain.com
```

写好提交下，上传到github仓库，

```
>git status
>git add CNAME
>git commit -m "add CNAME file"
>git push origin master
>git status
```

![img_8][]

最后看下github仓库中是否与本地仓库一致，也有了CNAME文件。  
确认无误。  
ok。  
稍等片刻。  
刷新刚才的「404页面」？  
看到内容了吗！  
Bingo！  

![img_9][]

至此，已经从零开始，到现在在github上搭建好了一个博客。
刚接触都不容易，喝口水歇一歇吧。:)

## 四、关于Jekyll

在github搭建博客，其实已经告了一个段落。
总结一下，其实还是不够**细心**，遗漏了一些关键步骤。不过好在仍然是有**耐心**，又把路给铺回正道上了……

不过，紧接着折腾心骤起……又回头仔细看了看github help，看到有个说明：

>
..., GitHub Pages supports Jekyll, ... **Jekyll  makes it easy to create** site-wide headers and footers without having to copy them across every page. It also offers some other advanced templating features. [[^note_10]]

有这好事？于是又接着度了一波~乎了一波~，看到各种美观简洁大方的页面，来自于Jekyll模板，又看了不少关于Jekyll、Hexo等的介绍，大概就是能模仿github把markdown构造成html，支持本地简单调试，可自由扩展等，觉得非常不错。跟着就再折腾了一波，得到了现在的这个样子。至于是怎么折腾的，涉及到`Jekyll`, `ruby`, `gem`, `bundler` `_config.yml`, `plun-in`, `Liquid`, `duoshuo`, `highlight`, `Rouge`, `tag`, `category`, `task-lists`……这又说来话长了，准备在下一篇中细说。有兴趣可以接着看 \>>>「[然而标题却还没想好???][link_10]」

先看看现在的效果：  

![img_10][]

当然，结构也不是最开始那个默认theme时的样子了。现在是这样的：  

![img_11][]

其实也是把旧的全干掉，再把新的放进来重头弄的，不如，就叫「[从零开始折腾Jekyll][link_10]」吧哈哈……
（发现一篇的话篇幅太长，层次不明，于是分为了两篇「[从零开始折腾Jekyll - 使用Jekyll模板][link_10]」、「[折腾Jekyll实录][link_11]」 —— 2016.02.21 10:27）


## 五、参考文档

* [Categories / GitHub Pages Basics](https://help.github.com/categories/github-pages-basics/) (总说明文档入口，官方答疑)
* [创建GitHub技术博客全攻略](http://blog.csdn.net/renfufei/article/details/37725057)（里面cname那里有一段说反了……）
* [自定义域名A记录到 Github 的IP时，Github怎么知道我的 Github page 是哪一个？ - 知乎](https://www.zhihu.com/question/28311939) (一语点醒梦中人，道明了CNAME文件的作用)
* [搭建一个免费的，无限流量的Blog----github Pages和Jekyll入门](http://www.ruanyifeng.com/blog/2012/08/blogging_with_jekyll.html)（阮一峰对GitHub Pages的入门指引）
* [有哪些简洁明快的 Jekyll 模板？ - 知乎](https://www.zhihu.com/question/20223939) （各种优秀模板秀）
* [云解析 > 产品使用问题 > 网站解析 > 域名解析设置](https://help.aliyun.com/knowledge_detail/6555867.html?spm=5176.product9002830_dns.3.2.mDIEwl) （万网域名解析官方文档）

---

###### 注释：

[^note_1]: -<https://help.github.com/articles/creating-pages-with-the-automatic-generator/>
[^note_2]: -<https://help.github.com/articles/user-organization-and-project-pages/>，根据介绍：个人主页就是建立「yourName.github.io」分支，而如果是项目仓库的话，就在其仓库下建立「gh-pages」分支即可。
[^note_3]: -同1
[^note_4]: -<https://help.github.com/articles/about-custom-domains-for-github-pages-sites/>，域名解析说明
[^note_5]: -<https://help.github.com/articles/tips-for-configuring-a-cname-record-with-your-dns-provider/>，子域名设置CNAME说明
[^note_6]: -<https://help.github.com/articles/tips-for-configuring-an-a-record-with-your-dns-provider/>，顶级域名设置A记录说明
[^note_7]: -<https://www.zhihu.com/question/28311939>
[^note_8]: -<https://help.github.com/articles/setting-up-a-custom-domain-with-github-pages/>
[^note_9]: -<https://help.github.com/articles/adding-a-cname-file-to-your-repository/>
[^note_10]: -<https://help.github.com/articles/using-jekyll-with-pages/>，可以用Jekyll便捷维护


[link_1]: http://blog.163.com 
[link_2]: http://blog.sina.com 
[link_3]: http://www.cnblogs.com 
[link_4]: http://blog.csdn.net 
[link_5]: http://my.oschina.net 
[link_6]: http://www.jianshu.com 
[link_7]: https://pages.github.com 
[link_8]: http://www.ruanyifeng.com/blog/2012/08/blogging_with_jekyll.html 
[link_9]: http://wanwang.aliyun.com
[link_10]: {% post_url 2016-02-07-learn-to-use-jekyll %}
[link_11]: {% post_url 2016-02-21-learn-to-use-jekyll-more %}

[img_1]: {{ site.img_url }}/img/pages/how_to_create_blog/pages1_repo-actions-settings.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_2]: {{ site.img_url }}/img/pages/how_to_create_blog/pages2_automatic-page-generator.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_3]: {{ site.img_url }}/img/pages/how_to_create_blog/pages3_generator-picker.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_4]: {{ site.img_url }}/img/pages/how_to_create_blog/pages4_generator-publish.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_5]: {{ site.img_url }}/img/pages/how_to_create_blog/pages5_myblog1.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_6]: {{ site.img_url }}/img/pages/how_to_create_blog/pages6_dns_setting.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_7]: {{ site.img_url }}/img/pages/how_to_create_blog/pages7_myblog2.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_8]: {{ site.img_url }}/img/pages/how_to_create_blog/pages8_myblog3.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_9]: {{ site.img_url }}/img/pages/how_to_create_blog/pages9_myblog4.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_10]: {{ site.img_url }}/img/pages/how_to_create_blog/pages10_myblog5.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
[img_11]: {{ site.img_url }}/img/pages/how_to_create_blog/pages11_myblog6.png{{ page.img_version | default: site.img_version | prepend: "?vvv=" }}
