$( document ).ready(function() {

    $('.show-password-1').on('click', function(){
        var passInput=$('#password');
        if (passInput.attr('type')==='password')
        {
            passInput.attr('type','text');
        } else {
            passInput.attr('type','password');
        }
    });

    $('.show-password-1').on('click', function(){
        var passInput=$('#newPassword');
        if (passInput.attr('type')==='password')
        {
            passInput.attr('type','text');
        } else {
            passInput.attr('type','password');
        }
    });


    $('.show-password-2').on('click', function(){
        var passInput=$('#repeatPassword');
        if (passInput.attr('type')==='password')
        {
            passInput.attr('type','text');
        } else {
            passInput.attr('type','password');
        }
    });

    $('#password').on('click', function(){
        $(this).next('.show-password-frame').addClass('active');
    });

    $('#newPassword').on('click', function(){
        $(this).next('.show-password-frame').addClass('active');
    });

    $('#repeatPassword').on('click', function(){
        $(this).next('.show-password-frame').addClass('active');
    });


    $('#email').focusout(function(){
        $('#email').filter(function(){
            var email = $('#email').val();
            var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
            if ( !emailReg.test( email ) ) {
                $('.invalid-icon').addClass('active');
                $('#email').addClass('invalid-email');
                $('.text-danger').addClass('active');
            } else {
                $('.invalid-icon').removeClass('active');
                $('#email').removeClass('invalid-email');
                $('.text-danger').removeClass('active');
            }
        });
    });

    $('.user-frame').on('click', function(){
        $('.dropdown-menu').toggleClass('active');
    });


    $('.options-reveal-box').on('click', function(){
        if($(this).hasClass('active')) {
            $(this).removeClass('active');
        } else {
            $('.options-reveal-box').removeClass('active');
            $(this).addClass('active');
        }
    });








    








});


window.onload = function() {
    what();
    function what(){
        let d;
        d = new Date();
        // console.log(d.toString());
        var ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
        var mo = new Intl.DateTimeFormat('en', { month: 'long' }).format(d);
        var da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
        document.getElementById('current-date').innerHTML = mo + ' ' + da + '' + ',' + ' ' + ye;
    };
}

