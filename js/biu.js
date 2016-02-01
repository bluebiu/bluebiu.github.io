$(function(){

    // hide #back-top first
    $("#back-top").hide();

    // fade in #back-top
    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $('#back-top').fadeIn(1000);
        } else {
            $('#back-top').fadeOut(1000);
        }
    });

    // scroll body to 0px on click
    $('#back-top a').on('click', function() {
        $('body,html').animate({
            scrollTop: 0
        }, 1000);
        return false;
    });

});

