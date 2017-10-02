$(document).ready(function(){
    $('#home-choice').addClass('selected');
    $('#profile-content').hide();
    menuChoiceHndler();
    profileToggleHandler();


});

function profileToggleHandler(){
    $('#profile-info-toggle').change(function() {
        if($(this).prop('checked')=== true){
            $('#profile-content').hide();
            $('#profile-summary').show();
        }
    });
}

function menuChoiceHndler(){
    $('#home-choice').on('click',function(){
        if(!$('#home-choice').hasClass('selected')){
            $('#home-choice').addClass('selected');
            $('#cards').show();
        }
        if($('#brainfeed-choice').hasClass('selected')){
           $('#brainfeed-choice').removeClass('selected');
        }
        if($('#profile-choice').hasClass('selected')){
           $('#profile-choice').removeClass('selected');
            $('#profile-content').hide();
        }
        if($('#social-choice').hasClass('selected')){
           $('#social-choice').removeClass('selected');
        }
    });

    $('#brainfeed-choice').on('click',function(){
        if(!$('#brainfeed-choice').hasClass('selected')){
            $('#brainfeed-choice').addClass('selected');
        }
        if($('#home-choice').hasClass('selected')){
            $('#home-choice').removeClass('selected');
        }
        if($('#profile-choice').hasClass('selected')){
            $('#profile-choice').removeClass('selected');
        }
        if($('#social-choice').hasClass('selected')){
            $('#social-choice').removeClass('selected');
        }
    });

    $('#profile-choice').on('click',function(){
        if(!$('#profile-choice').hasClass('selected')){
            $('#profile-choice').addClass('selected');
            $('#profile-content').show();
        }
        if($('#brainfeed-choice').hasClass('selected')){
            $('#brainfeed-choice').removeClass('selected');
        }
        if($('#home-choice').hasClass('selected')){
            $('#home-choice').removeClass('selected');
            $('#cards').hide();
        }
        if($('#social-choice').hasClass('selected')){
            $('#social-choice').removeClass('selected');
        }
    });

    $('#social-choice').on('click',function(){
        if(!$('#social-choice').hasClass('selected')){
            $('#social-choice').addClass('selected');
        }
        if($('#brainfeed-choice').hasClass('selected')){
            $('#brainfeed-choice').removeClass('selected');
        }
        if($('#home-choice').hasClass('selected')){
            $('#home-choice').removeClass('selected');
        }
        if($('#profile-choice').hasClass('selected')){
            $('#profile-choice').removeClass('selected');
        }
    });
}