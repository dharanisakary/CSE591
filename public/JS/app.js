$(document).ready(function(){
    $('#home-choice').addClass('selected');
    $('#profile-content').hide();
    $('#brain-feed').hide();
    $('#social-search').hide();

    menuChoiceHndler();
    profileToggleHandler();
    retrieveInfo();
    brainTableFunctionality();
    searchBtnHandler();
});


function searchBtnHandler(){
    $('a[href="#search"]').on('click', function(event) {
        event.preventDefault();
        $('#search').addClass('open');
        $('#search > form > input[type="search"]').focus();
    });

    $('#search, #search button.close').on('click keyup', function(event) {
        if (event.target == this || event.target.className == 'close' || event.keyCode == 27) {
            $(this).removeClass('open');
        }
    });
}

function brainTableFunctionality(){
    $('.btn-filter').on('click', function () {
        var $target = $(this).data('target');
        if ($target != 'all') {
            $('.table tr').css('display', 'none');
            $('.table tr[data-status="' + $target + '"]').fadeIn('slow');
        } else {
            $('.table tr').css('display', 'none').fadeIn('slow');
        }
    });
}

function retrieveInfo(){
    var user = $.cookie("user");
    if(!user){
        window.location.href = "/WebApp/public/404.html";
    }
}

function profileToggleHandler(){
    $('#profile-info-toggle').change(function() {
        if($(this).prop('checked')=== true){
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
           $('#brain-feed').hide();
        }
        if($('#profile-choice').hasClass('selected')){
           $('#profile-choice').removeClass('selected');
            $('#profile-content').hide();
        }
        if($('#social-choice').hasClass('selected')){
           $('#social-choice').removeClass('selected');
            $('#social-search').hide();
        }
    });

    $('#brainfeed-choice').on('click',function(){
        if(!$('#brainfeed-choice').hasClass('selected')){
            $('#brainfeed-choice').addClass('selected');
            $('#brain-feed').show();
        }
        if($('#home-choice').hasClass('selected')){
            $('#home-choice').removeClass('selected');
            $('#cards').hide();
        }
        if($('#profile-choice').hasClass('selected')){
            $('#profile-choice').removeClass('selected');
            $('#profile-content').hide();
        }
        if($('#social-choice').hasClass('selected')){
            $('#social-choice').removeClass('selected');
            $('#social-search').hide();
        }
    });

    $('#profile-choice').on('click',function(){
        if(!$('#profile-choice').hasClass('selected')){
            $('#profile-choice').addClass('selected');
            $('#profile-content').show();
        }
        if($('#brainfeed-choice').hasClass('selected')){
            $('#brainfeed-choice').removeClass('selected');
            $('#brain-feed').hide();
        }
        if($('#home-choice').hasClass('selected')){
            $('#home-choice').removeClass('selected');
            $('#cards').hide();
        }
        if($('#social-choice').hasClass('selected')){
            $('#social-choice').removeClass('selected');
            $('#social-search').hide();
        }
    });

    $('#social-choice').on('click',function(){
        if(!$('#social-choice').hasClass('selected')){
            $('#social-choice').addClass('selected');
            $('#social-search').show();
        }
        if($('#brainfeed-choice').hasClass('selected')){
            $('#brainfeed-choice').removeClass('selected');
            $('#brain-feed').hide();
        }
        if($('#home-choice').hasClass('selected')){
            $('#home-choice').removeClass('selected');
            $('#cards').hide();
        }
        if($('#profile-choice').hasClass('selected')){
            $('#profile-choice').removeClass('selected');
            $('#profile-content').hide();
        }
    });

    $('#pre-screening-questions').carousel({
        wrap:false,
        ride:false
    });

    $('#saveImage').on('click', function() {
        $('#saveImage').attr('disabled', true);
        $('#branch-info').hide();
        $('#pre-screening').show();
        $('#modal-branches .modal-title').text('Pre Screening');
    });

    $('#finishPreScreen').on('click', function(){
        // TODO : Check answers
        var answers = 0;
        $('#modal-branches .modal-title').text('Pre Screening Result');
        $('#pre-screening-questions .item').each(function(index, element){
            answers += $(element).has('input:checked').length;
        });
        $('#branch-info').hide();
        $('#pre-screening').hide();
        $('#pre-screening-result').show();
        var content = "";
        if(answers > 1){
            content = "Congratulations! "
        }else{
            content = "Oops!";
        }
        content += '<br/> Closing ..';
        $('#pre-screening-result p').html(content);
        setTimeout("$('#modal-branches').modal('hide');",3000);
    });

    $('#pre-screening-questions').on('slid.bs.carousel', function(){ 
        if ($('.carousel-inner .item:last').hasClass('active')){
            $(this).find(".carousel-control-next").hide();
            //$('#saveImage').attr('disabled', false);
            $('#saveImage').parent().addClass('hidden');
            $('#finishPreScreen').parent().removeClass('hidden');
        }
    });

    $('#modal-branches').on('show.bs.modal', function (e) {
        // Reset Model
        $('#branch-info').show();
        $('#pre-screening').hide();
        $('#pre-screening-result').hide();
        $('#pre-screening-questions').carousel(0);
        $('#saveImage').parent().removeClass('hidden');
        $('#saveImage').attr('disabled', false);
        $('#finishPreScreen').parent().addClass('hidden');
        $('#pre-screening-result p').empty();
        $(this).find(".carousel-control-next").show();
        $('#modal-branches .modal-title').text('Welcome to the Branch Creator!');
    });
}