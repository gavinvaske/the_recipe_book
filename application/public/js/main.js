$( document ).ready(function() {

    $('.recipe-search-bar').on('keyup', () => {
        const query = $('.recipe-search-bar').val().trim();
        const pageNumber = 1; // TODO STORM: Set this variable dynamically
        const resultsPerPage = 15; // TODO STORM: Set this number to be whatever you think is best

        if (!query) {
            return;
        }

        $.ajax({
            url: '/recipes/query',
            type: 'POST',
            data: {
                query,
                pageNumber,
                resultsPerPage
            },
            success: function(searchResults) {
                $('#search-results').empty();
                searchResults.forEach((result, index) => {
                    const resultAsHtml = `<div> Result #: ${index+1}; Design Number: ${result.designNumber || 'N/A'}; Die Number: ${result.dieNumber || 'N/A'}; How-to-Video: ${result.howToVideo || 'N/A'}; Notes: ${result.notes || 'N/A'}; Author: ${result.author.email || 'N/A'}; </div>`;
                    $('#search-results').append(resultAsHtml);
                });
            },
            error: function() {
                alert('Uh oh, the search feature is currently unavailable');
            }
        });
    });

    const shouldDisplayProfilePicture = $('.profile-picture').length;

    if (shouldDisplayProfilePicture) {
        $.ajax({
            url: '/users/profile-picture',
            type: 'GET',
            success: function(profilePicture) {
                const noProfilePictureExists = !profilePicture || !profilePicture.imageType || !profilePicture.imageData;
                
                if (noProfilePictureExists) {
                    return;
                }

                const contentType = profilePicture.imageType;
                const imageData = profilePicture.imageData;

                $('.profile-picture').css('background', `url('data:image/${contentType};base64,${imageData}') center center no-repeat`);
                $('.profile-picture').css('background-size', 'cover');
            },
            error: function(error) {
                console.log(`An error occurred while fetching your profile picture: ${JSON.stringify(error)}`);
            }
        });
    }

    $('.table th').on('click', function(){
        let sortingId = $(this).attr('id');
        if ($(this).attr('aria-sort') === 'none') {
            $('.table th').attr('aria-sort', 'none');
            $(this).attr('aria-sort', 'ascending');
        } else if ($(this).attr('aria-sort') === 'ascending') {
            $('.table th').attr('aria-sort', 'none');
            $(this).attr('aria-sort', 'descending');
        } else if ($(this).attr('aria-sort') === 'descending') {
            $('.table th').attr('aria-sort', 'none');
            $(this).attr('aria-sort', 'ascending');
        }
        alert('Sorting Row ID:' + ' ' + sortingId);
    });

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
        $('.dropdown-menu.user-options').toggleClass('active');
    });

    $('#recipe-dropdown-trigger').on('click', function(){
        $('.dropdown-menu.recipe-dropdown').toggleClass('active');
        $('#recipe-dropdown-trigger').toggleClass('active');
    });


    $('.options-reveal-box').on('click', function(){
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
        } else {
            $('.options-reveal-box').removeClass('active');
            $(this).addClass('active');
        }
    });

    $('.list-options li').on('click', function(){
        $('.list-options li').removeClass('active');
        $(this).addClass('active');
    });

    // $('.admin-options li').on('click', function(){
    //     var optionValue = $(this).attr("value");
    //     alert(optionValue);
    // });

    $('.list-options li').on('click', function(){
        $(this).each(function(){
            var optionValue = $(this).attr('value');
            if (optionValue){
                $('.content-box').not('.' + optionValue).hide();
                $('.' + optionValue).show();
            } else {
                $('.content-box').hide();
            }
        });
    }).change();







    








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
};

