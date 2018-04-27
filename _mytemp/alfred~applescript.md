alfred ~ applescript

***

http://help.apple.com/applescript/mac/10.9/#apscrpt5
AppleScript 语言被整理成不同类别：

术语组：相关术语的分组。在“AppleScript 编辑器”字典中，术语组在第一栏内显示，用橙色字母“S”表示。

命令：请求操作或结果。命令也称为“事件”，显示在第二栏内，用蓝色字母“C”表示（也称为事件）。

类：可用脚本控制的对象。类的说明列出了类中存在的属性和元素。类显示在第二栏内，用淡紫色字母“C”表示。

属性：包含值的对象。属性显示在第三栏内，用淡蓝色字母“P”表示。

元素：包含于其他对象中的对象。例如，一个段落可能包含许多词。元素可能显示在第三栏内，用橙色字母“E”表示。

[AppleScript学习笔记（二）AppleScript的四种数据类型 - CSDN博客](http://blog.csdn.net/jymn_chen/article/details/19770495)
[Find Safari Tabs with AppleScript](http://hea-www.harvard.edu/~fine/OSX/safari-tabs.html)
[使用 AppleScript 抓住最顶层窗口显示在 web 浏览器中的 URL： 最终名单 - CSDN博客](http://blog.csdn.net/qtcreatorlinux/article/details/8525662)
tell application "Safari"
    return properties of front window
end tell
tell application "Safari"
    set nowTitle to name of front document
    set nowUrl to URL of front document
    return "[" & nowTitle & "](" & nowUrl & ")"
end tell




****

[Sublime Text 3 remove default keyboard shortcut - Super User](https://superuser.com/questions/731695/sublime-text-3-remove-default-keyboard-shortcut)

[Sublime Text 3 如何修改默认快捷键 - CSDN博客](https://blog.csdn.net/u012251421/article/details/52805965)

