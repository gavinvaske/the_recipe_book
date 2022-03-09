function showPassword() {
    let x = $(this).attr("class");
    alert(x);
}

$( document ).ready(function() {

$('.show-password-1').on('click', function(){
    var passInput=$("#password");
    if(passInput.attr('type')==='password')
      {
        passInput.attr('type','text');
    }else{
       passInput.attr('type','password');
    }
})

$('.show-password-2').on('click', function(){
    var passInput=$("#repeatPassword");
    if(passInput.attr('type')==='password')
      {
        passInput.attr('type','text');
    }else{
       passInput.attr('type','password');
    }
})

$('#password').on('click', function(){
    $(this).next('.show-password-frame').addClass('active');
})

$('#repeatPassword').on('click', function(){
    $(this).next('.show-password-frame').addClass('active');
})

});