$(function(){
    /**
     * Github Pages不支持markdown的task-lists写法
     * 装了各种gem插件也不行
     * 于是还是自己动手写个简单丑陋的替换吧 -0-
     * 基于jquery
     * markdown syntax
     * 『[Num]. [x] 』
     * 『[Num]. [ ] 』
     * eg.
     *     1. [x] 佛挡杀佛说
     *     2. [ ] 点点滴滴的
     * 注：
     * 1）仅限制替换有序列表的（即<ol>...</ol>）
     * 2）「.」和「[」之间有空格
     * 3）「]」后面要跟一个空格
     * 4）「[]」中间是「空格」表示未完成，不打勾
     * 5）「[]」中间是「x」（小写）表示已完成，打勾
     *
     * biubiu -160207
     */

    var $checkboxFalse = '[ ] ';
    var $checkboxTrue = '[x] ';
    var $checkboxFalseInput = '<input type="checkbox" disabled="disabled" /> ';
    var $checkboxTrueInput = '<input type="checkbox" disabled="disabled" checked="checked" /> ';
    $('article .container .row ol').each(function(){
        $(this).find('li').each(function(){
            $html = $(this).html();
            if (0===$html.indexOf($checkboxFalse)) {
                $newHtml = $html.replace($checkboxFalse, $checkboxFalseInput);
            } else if (0===$html.indexOf($checkboxTrue)) {
                $newHtml = $html.replace($checkboxTrue, $checkboxTrueInput);
            } else {
                $newHtml = $html;
            }
            $(this).html($newHtml);
            console.log('replace success!');
        });
    });
});

