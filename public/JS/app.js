$(document).ready(function(){
    $('#home-choice').addClass('selected');
    $('#profile-content').hide();
    $('#brain-feed').hide();
    $('#social-search').hide();
    $('#assess-knowledge').hide();


    profilePictureRetrieval();
    menuChoiceHndler();
    branchCreationModelhandler();
    profileToggleHandler();
    retrieveInfo();
    brainTableFunctionality();
    searchBtnHandler();
    retrieveProfileInformation();
    assessmentHandler();
    getBranchStructure();
    getBranchTopic();
    getBranchStructure();

    $('#btn-save-info').on('click', function() {
        saveProfileInformation();
    });

    $(document).on('change', '.btn-file :file', function() {
        var input = $(this),
            label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
        input.trigger('fileselect', [label]);
    });

    $('.btn-file :file').on('fileselect', function(event, label) {
        var input = $(this).parents('.input-group').find(':text'),
            log = label;

        if (input.length) {
            input.val(log);
        }
    });

    $("#imgInp").change(function() {
        var user = $.cookie("user");
        var inputFile = this;
        var reader = new FileReader();
        var file = inputFile.files[0];
        var storageRef = firebase.storage().ref();
        var imagesRef = storageRef.child('images/' + user + 'ProfImage');
        imagesRef.put(file).then(function(snapshot) {
            reader.onload = function(e) {
                $('#img-upload').attr('src', reader.result);
                $('#sm-imgInp').attr('src', reader.result);

            };
            reader.readAsDataURL(inputFile.files[0]);
        });
    });

    $("#dropdown-structure li a").click(function(){
        $('#subtopics').empty();
        $('#subtopics').append('<div class="row"><h6 id="subtopics-middle"></h6></div>');
        var currentText = $('#structure-button').text().trim();
        var noSubTopics = $('#input-range').val().trim();

        if(noSubTopics != 0){
            if(currentText === "List"){
                $('#subtopics').show();
                $('#subtopics-middle').text('Choose your list-items based on your selections');
                var i = 0;

                for(i; i<noSubTopics; i++){
                    $('#subtopics').append('<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label subtopic"><input class="mdl-textfield__input info" type="text"id="subtopic'+i+'" placeholder="Subtopic '+i+'"></div>').html();
                }
            }
            if(currentText === "Q&A"){
                $('#subtopics').show();
                $('#subtopics-middle').text('Choose your questions based on your selections');

                var i = 0;

                for(i; i<noSubTopics; i++){
                    $('#subtopics').append('<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label subtopic"><input class="mdl-textfield__input info" type="text"id="subtopic'+i+'" placeholder="Question '+i+'"></div>').html();
                }
            }
        }
        else{
            $('#subtopics').hide();
        }
    });

    $('#input-range').on('change',function(){
        $('#subtopics').empty();
        $('#subtopics').append('<div class="row"><h6 id="subtopics-middle"></h6></div>');
        var currentText = $('#structure-button').text().trim();
        var noSubTopics = $('#input-range').val().trim();
        var difference = 0;

        if(noSubTopics != 0){
            if(currentText === "List"){
                $('#subtopics').show();
                $('#subtopics-middle').text('Choose your list-items based on your selections');
                var i = 0;

                for(i; i<noSubTopics; i++){
                    $('#subtopics').append('<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label subtopic"><input class="mdl-textfield__input info" type="text"id="subtopic'+i+'" placeholder="Subtopic '+i+'"></div>').html();
                }
            }
            if(currentText === "Q&A"){
                $('#subtopics').show();
                $('#subtopics-middle').text('Choose your questions based on your selections');
                var i = 0;

                for(i; i<noSubTopics; i++){
                    $('#subtopics').append('<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label subtopic"><input class="mdl-textfield__input info" type="text"id="subtopic'+i+'" placeholder="Question '+i+'"></div>').html();
                }
            }
        }
        else{
            $('#subtopics').hide();
        }
    });
});



function resetDropdownMenus(){
    $('#structure-button').text('Brainstorming Structure');
    $('#structure-button').append(' <span class="caret"></span>').html();
    $('#structure-dropdown').css('margin-left', '3%');

    $('#topic-button').text('Type of Branch');
    $('#topic-button').append(' <span class="caret"></span>').html();
    $('#topic-dropdown').css('margin-left', '35%');

    $('#subtopics').hide();
}

function getBranchTopic() {
    var currentText = $('#topic-button').text().trim();

    $('#dropdown-topic li a').click(function () {
        var selected = $(this).text();

        $('#topic-button').text(selected);
        $('#topic-button').append('<span class="caret"></span>').html();

        if(currentText === 'Type of Branch'){
            $('#topic-dropdown').css('margin-left', '43%');
        }
    });
}


function getBranchStructure(){
    var currentText = $('#structure-button').text().trim();
    var title = $('#subtopics-middle').text().trim();

    $("#dropdown-structure li a").click(function(){
        var selected = $(this).text();

        $('#structure-button').text(selected);
        $('#structure-button').append('<span class="caret"></span>').html();

        if(currentText === "Brainstorming Structure"){
            $('#structure-dropdown').css('margin-left', '15%');
        }
    });
}


function profilePictureRetrieval(){
    var user = $.cookie("user");

    //Picture data retrieval
    var storageRef = firebase.storage().ref();
    storageRef.child('images/' + user + 'ProfImage').getDownloadURL().then(function(url) {
        $('#img-upload').attr('src', url);
        $('#sm-imgInp').attr('src', url);
    }).catch(function(error) {
        console.log(error);
    });
}

function saveProfileInformation() {
    var user = $.cookie("user");
    var ref = firebase.database().ref('users/' + user);

    var name = $('#full-name').val();
    var hometown = $('#hometown').val();
    var email = $('#email').val();
    var age = $('#age').val();
    var university = $('#university').val();
    var highest_education = $('#highest-education').val();
    var job_title = $('#job-title').val();

    ref.update({
        name: name,
        hometown: hometown,
        email: email,
        age: age,
        university: university,
        highest_education: highest_education,
        job_title: job_title
    });

    var count = 0;
    var count1 = 0;
    $('#user-info >div').each(function() {
        count += 1;
        if (count > 1) {
            $(this).remove();
        }
    });
    $('#profile-info >div').each(function() {
        count1 += 1;
        if (count1 > 2) {
            $(this).remove();
        }
    });
}

function retrieveProfileInformation(){
    var user = $.cookie('user');
    if(user){
        var ref = firebase.database().ref('users/' + user);
        ref.on('value', function(snapshot) {
            var data = snapshot.val();
            $("#user-email").text(data.email);

            var template = $('#profile-information').html();
            var html = Mustache.render(template, data);
            var output = $('#profile-info');
            output.append(html);


            var template = $('#user-information').html();
            var html = Mustache.render(template, data);
            var output = $('#user-info');
            output.append(html);
        });
    }
    else{
        alert('Error in retrieving user info!');
    }
}


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

    $('#brain-feed .media').on('click', function(e){
         $('#brain-feed #catalog-body').removeClass('hidden');
        if(!$('#brain-feed #brain-feed-branch').hasClass('hidden')){
            $('#brain-feed #brain-feed-branch').addClass('hidden');
        }
        if(!$('#brain-feed #catalog').hasClass('hidden')){
            $('#brain-feed #catalog').addClass('hidden');
        }

    });

    $('#go-back').on('click', function(){
        $('#brain-feed #catalog').removeClass('hidden');
        if(!$('#brain-feed #brain-feed-branch').hasClass('hidden')){
            $('#brain-feed #brain-feed-branch').addClass('hidden');
        }
        if(!$('#brain-feed #catalog-body').hasClass('hidden')){
            $('#brain-feed #catalog-body').addClass('hidden');
        }
    });

    $('#go-back2').on('click', function(){
        $('#brain-feed #catalog-body').removeClass('hidden');
        if(!$('#brain-feed #catalog').hasClass('hidden')){
            $('#brain-feed #catalog').addClass('hidden');
        }
        if(!$('#brain-feed #brain-feed-branch').hasClass('hidden')){
            $('#brain-feed #brain-feed-branch').addClass('hidden');
        }
     });

     $('#btn-start-branch').on('click', function(){
        $('#brain-feed #brain-feed-branch').removeClass('hidden');
        if(!$('#brain-feed #catalog').hasClass('hidden')){
            $('#brain-feed #catalog').addClass('hidden');
        }
        if(!$('#brain-feed #catalog-body').hasClass('hidden')){
            $('#brain-feed #catalog-body').addClass('hidden');
        }
        timer();
    });

    $('#btn-done-brainstorm').on('click', function(){
        // Handle post Brainstorm action
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
        if($('#assess-choice').hasClass('selected')){
           $('#assess-choice').removeClass('selected');
            $('#assess-knowledge').hide();
        }
    });

    $('#brainfeed-choice, #get-started').on('click',function(){
        if(!$('#brainfeed-choice').hasClass('selected')){
            $('#brainfeed-choice').addClass('selected');
            $('#brain-feed').show();
            resetDropdownMenus();
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
        if($('#assess-choice').hasClass('selected')){
           $('#assess-choice').removeClass('selected');
            $('#assess-knowledge').hide();
        }
    });

    $('#profile-choice, #find-out-now').on('click',function(){
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
        if($('#assess-choice').hasClass('selected')){
           $('#assess-choice').removeClass('selected');
            $('#assess-knowledge').hide();
        }
    });

    $('#social-choice, #make-friends').on('click',function(){
        if($('#assess-choice').hasClass('selected')){
           $('#assess-choice').removeClass('selected');
            $('#assess-knowledge').hide();
        }
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

    $('#assess-choice').on('click',function(){
        if(!$('#assess-choice').hasClass('selected')){
            $('#assess-choice').addClass('selected');
            $('#assess-knowledge').show();
        }
        if($('#social-choice').hasClass('selected')){
            $('#social-choice').removeClass('selected');
            $('#social-search').hide();
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
}

function branchCreationModelhandler(){
    $('#pre-screening-questions').carousel({
        wrap:false,
        ride:false,
        interval: false
    });

    $('#preScreen').on('click', function() {
        $('#modal-branches .modal-title').text('Pre Screening');
        $('#saveImage').parent().addClass('hidden');
        $('#preScreen').attr('disabled', true);
        $('#branch-info').hide();
        $('#brainstorm-format').hide();
        $('#pre-screening').show();
    });

    $('#saveImage').on('click', function(){
        $('#modal-branches .modal-title').text('Brainstorm Branch Structure');
        $('#preScreen').parent().removeClass('hidden');
        $('#branch-info').hide();
        $('#brainstorm-format').show();
        $('#pre-screening').hide();
        $(this).parent().addClass('hidden');
    });

    $('#finishPreScreen').on('click', function(){
        // TODO : Check answers
        $('#modal-branches .modal-title').text('Pre Screening Result');
        $('#branch-info').hide();
        $('#brainstorm-format').hide();
        $('#pre-screening').hide();
        $('#pre-screening-result').show();
        var answers = $("#pre-screening-questions .item input[type=radio]:checked").length;

        var content = "";
        if(answers > 1){
            content = '<h3 class="correct"><i class="material-icons large">grade</i>Congratulations!</h3> <h5 class="br-feedback">You can now start Brain storming!</h5>';
        }else{
            content = '<h3 class="yellow"><i class="material-icons large">error</i>Oops! </h3><h5 class="br-feedback">You did not qualify for Brain Storming!</h5>';
        }
        content += '<br/><h5> Closing ..</h5>';
        $('#pre-screening-result p').html(content);
        setTimeout("$('#modal-branches').modal('hide');",3000);
        $(this).attr('disabled', true);
    });

    $('#pre-screening-questions').on('slid.bs.carousel', function(){ 
        if ($('.carousel-inner .item:last').hasClass('active')){
            $(this).find(".carousel-control-next").hide();
            //$('#preScreen').attr('disabled', false);
            $('#preScreen').parent().addClass('hidden');
            $('#finishPreScreen').parent().removeClass('hidden');
        }
    });

    $('#modal-branches').on('show.bs.modal', function (e) {
        // Reset Model
        answers = 0;
        $('#branch-info').show();
        $('#brainstorm-format').hide();
        $('#pre-screening').hide();
        $('#pre-screening-result').hide();
        $('#pre-screening-questions').carousel(0);
        $('#saveImage').parent().removeClass('hidden');
        $('#preScreen').parent().addClass('hidden');
        $('#preScreen').attr('disabled', false);
        $('#finishPreScreen').attr('disabled', false);
        $('#finishPreScreen').parent().addClass('hidden');
        $('#pre-screening-result p').empty();
        $(this).find(".carousel-control-next").show();
        $('#modal-branches .modal-title').text('Welcome to the Branch Creator!');
        $('input[type=radio]').prop('checked', false);

    });

    $('#input-range').change(function(){
        $('output#rangeWarning-input').text(this.value);
    });
}

function assessmentHandler(){
    $('#add-mcq-option').on('click', function(){
        var html = '<input class="mdl-textfield__input" type="text" >';
        $('#mcq-options').append(html);
    })
}

function timer(){
    var timeleft = 4;
    var timeout='Time over';
    var downloadTimer = setInterval(function(){
        timeleft--;
        if(timeleft==0){
            document.getElementById("countdowntimer").textContent = timeout;


        }
        else{
            document.getElementById("countdowntimer").textContent = timeleft;
        }
        if(timeleft <= 0)
            clearInterval(downloadTimer);
    },1000);
 }
