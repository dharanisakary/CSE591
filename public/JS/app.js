$(document).ready(function(){
    $('#home-choice').addClass('selected');
    $('#profile-content').hide();
    $('#brain-feed').hide();
    $('#social-search').hide();
    

    profilePictureRetrieval();
    menuChoiceHndler();
    branchCreationModelhandler();
    retrieveInfo();
    brainTableFunctionality();
    searchBtnHandler();
    retrieveProfileInformation();
    retrieveBranches();
    
    //getAssessments();
    getBranchStructure();
    getBranchTopic();
    getBranchStructure();
    btnNextHandler();
    btnCreateBranchHandler();
    profileTagsHandler();
    handleContributionsSelection();

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
                    $('#subtopics').append('<div id= "subtopic'+i + '-div'+'" class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label subtopic"><input class="mdl-textfield__input info" type="text"id="subtopic'+i+'" placeholder="Subtopic '+i+'"></div>').html();
                }
            }
            if(currentText === "Q&A"){
                $('#subtopics').show();
                $('#subtopics-middle').text('Choose your questions based on your selections');

                var i = 0;

                for(i; i<noSubTopics; i++){
                    $('#subtopics').append('<div id= "subtopic'+i + '-div'+'" class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label subtopic"><input class="mdl-textfield__input info" type="text"id="subtopic'+i+'" placeholder="Question '+i+'"></div>').html();
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
                    $('#subtopics').append('<div id= "subtopic'+i + '-div'+'" class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label subtopic"><input class="mdl-textfield__input info" type="text"id="subtopic'+i+'" placeholder="Subtopic '+i+'"></div>').html();
                }
            }
            if(currentText === "Q&A"){
                $('#subtopics').show();
                $('#subtopics-middle').text('Choose your questions based on your selections');
                var i = 0;

                for(i; i<noSubTopics; i++){
                    $('#subtopics').append('<div id= "subtopic'+i + '-div'+'" class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label subtopic"><input class="mdl-textfield__input info" type="text"id="subtopic'+i+'" placeholder="Question '+i+'"></div>').html();
                }
            }
        }
        else{
            $('#subtopics').hide();
        }
    });
});

function retrieveBranches(){
    firebase.database().ref('branches').once('value', function(snapshot) {
        var exists = (snapshot.val() !== null);
        var count = 0;
        if (exists) {
            for (var key in snapshot.val()) {
                var template = $('#branch-table-element').html();
                var html = Mustache.render(template, snapshot.val()[key]);
                var output = $('#branch-table-container');
                output.append(html);
            }
        }
    });
}

function btnNextHandler(){
    $('#saveImage').on('click',function(){
        if($('#topic-name').val() === '' || $('#topic-purpose').val() === '' || $('#new-branch-description').val() === '' || $('#topic-button').text().trim() === 'Type of Branch'){
            alert('Please enter all the necessary information in order to continue!');
        }
        else{
            $('#modal-branches .modal-title').text('Brainstorm Branch Structure');
            $('#preScreen').parent().removeClass('hidden');
            $('#branch-info').hide();
            $('#brainstorm-format').show();
            $('#pre-screening').hide();
            $(this).parent().addClass('hidden');
        }
    });
}

function btnCreateBranchHandler(){
    $('#btn-create-branch').on('click', function(){
        $('#topic-name').val('');
        $('#topic-purpose').val('');
        $('#new-branch-description').val('');
        var currentText = $('#topic-button').text().trim();
        var currentText1 = $('#structure-button').text().trim();
        var noSubTopics = $('#input-range').val().trim();

        if(currentText !== 'Type of Branch'){
            $('#topic-button').text('Type of Branch');
            $('#topic-button').append(' <span class="caret"></span>').html();
            $('#topic-dropdown').css('margin-left', '35%');
        }
        if(currentText1 !== 'Brainstorming Structure'){
            $('#structure-button').text('Brainstorming Structure');
            $('#structure-button').append(' <span class="caret"></span>').html();
            $('#structure-dropdown').css('margin-left', '3%');
        }
        if(noSubTopics !=0){
            $('#subtopics').hide();
            $('#input-range').val(0);
            $('#structureRange').val(0);
        }
    });
}

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
    var count2 = 0;
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


    $('#profile-info-tags').empty();
    $('#profile-info-tags').append('<span class="mdl-chip mdl-chip--contact mdl-chip--deletable"> <a id="add-branch-button" class="mdl-chip__contact"><i class="material-icons">add</i></a> <span class="mdl-chip__text add-branch-chip">Add a new branch</span> <!--<a class="mdl-chip__action"><i class="material-icons">cancel</i></a>--> </span>').html();

    retrieveBranchTags();
}

function retrieveProfileInformation(){
    var user = $.cookie('user');
    $('#profile-info').empty();
    $('#user-info').empty();
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

            retrieveBranchTags();
        });
    }
    else{
        alert('Error in retrieving user info!');
    }
}

function retrieveBranchTags(){
    var user = $.cookie('user');
    if(user) {
        var ref = firebase.database().ref('users/' + user + '/branchTags');
        ref.on('value', function (snapshot) {
            for(var key in snapshot.val()){
                var template = $('#branch-tag').html();
                var html = Mustache.render(template, snapshot.val()[key]);
                var output = $('#profile-info-tags');
                output.append(html);
            }
        });
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

    $(document).on('click', '.media', function(){
        $('#btn-create-branch').hide();
        var key = $(this).attr("id").split('/')[0];
        var user = $.cookie('user');
        firebase.database().ref('branches/' + key).once('value', function(snapshot) {
            var exists = (snapshot.val() !== null);
            if (exists) {
                var pendingCheck = 0;

                if(snapshot.val()["branch_status"] == "pending"){
                    var subtopicNo  = 0;
                    var contributionNo = 0;
                    pendingCheck = 1;

                    var exists = (snapshot.val()["contributors"][user] !== undefined);
                    if(exists){
                        for(var coVal in snapshot.val()["subtopics"]){
                            subtopicNo+=1;
                        }

                        for(var value in snapshot.val()["contributors"][user]){
                            contributionNo+=1;
                        }

                        if(contributionNo-2 == subtopicNo || contributionNo-3 == subtopicNo){
                            pendingCheck = 3;
                        }
                    }
                    else{
                        pendingCheck = -1;
                    }
                }
                if(snapshot.val()["branch_status"] == "completed"){
                    var check = false;
                    for (var contributorKey in snapshot.val()["contributors"]){
                        if(contributorKey == user){
                            check = true;
                        }
                    }
                    if(!check){
                        pendingCheck = -2;
                    }
                    else{
                        pendingCheck = 2;
                    }
                }

                if(pendingCheck == -2){
                    $('#catalog-body-placeholder').empty();
                    var template = $('#catalog-information').html();
                    var html = Mustache.render(template, snapshot.val());
                    var output = $('#catalog-body-placeholder');
                    output.append(html);

                    $('#brain-feed #catalog-body').removeClass('hidden');
                    if(!$('#brain-feed #brain-feed-branch').hasClass('hidden')){
                        $('#brain-feed #brain-feed-branch').addClass('hidden');
                    }
                    if(!$('#brain-feed #catalog').hasClass('hidden')){
                        $('#brain-feed #catalog').addClass('hidden');
                    }
                    $('#btn-error-branch').show();
                    $('#btn-error-branch').html('  Aw snap! This branch is completed, but you are not enrolled, so you cannot proceed');
                }

                if(pendingCheck == -1){
                    $('#catalog-body-placeholder').empty();
                    var template = $('#catalog-information').html();
                    var html = Mustache.render(template, snapshot.val());
                    var output = $('#catalog-body-placeholder');
                    output.append(html);

                    $('#brain-feed #catalog-body').removeClass('hidden');
                    if(!$('#brain-feed #brain-feed-branch').hasClass('hidden')){
                        $('#brain-feed #brain-feed-branch').addClass('hidden');
                    }
                    if(!$('#brain-feed #catalog').hasClass('hidden')){
                        $('#brain-feed #catalog').addClass('hidden');
                    }
                    $('#btn-error-branch').show();
                    $('#btn-error-branch').html('  Aw snap! This branch is currently in progress and you have not enrolled in it yet...');
                }

                if(pendingCheck == 1){
                    var timePerContributor = snapshot.val()["timePerContributor"];
                    var numberOfContributors = snapshot.val()["numberOfContributors"];

                    $('#brain-feed #brain-feed-branch').removeClass('hidden');
                    if(!$('#brain-feed #catalog').hasClass('hidden')){
                        $('#brain-feed #catalog').addClass('hidden');
                    }
                    if(!$('#brain-feed #catalog-body').hasClass('hidden')){
                        $('#brain-feed #catalog-body').addClass('hidden');
                    }

                    var subtopicOrder = [];
                    var nameOrder = -1;

                    for(var name in snapshot.val()["contributors"]){
                        nameOrder+=1;
                        if(name == user){
                            break;
                        }
                    }
                    subtopicOrder.push("subtopic"+nameOrder);

                    for(var subtopic in snapshot.val()["subtopics"]){
                        if(subtopic != "subtopic"+nameOrder){
                            subtopicOrder.push(subtopic);
                        }
                    }
                    timer(timePerContributor, numberOfContributors, subtopicOrder, snapshot.val()["id"].split('/')[0]);
                }

                if(pendingCheck == 0){
                    $('#catalog-body-placeholder').empty();
                    var template = $('#catalog-information').html();
                    var html = Mustache.render(template, snapshot.val());
                    var output = $('#catalog-body-placeholder');
                    output.append(html);

                    var contributorCount = 0;
                    var contributorCheck = false;
                    var checkForError = false;
                    var checkForAuthor = false;
                    var numberOfContributors = snapshot.val()["numberOfContributors"];
                    for (var key in snapshot.val()['contributors']){
                        if(key == user){
                            contributorCheck = true;
                        }
                        contributorCount+= 1;
                    }

                    if(snapshot.val()["creator"] == user){
                        checkForAuthor = true;
                        if(contributorCount != numberOfContributors){
                            $('#btn-error-branch').show();
                            $('#btn-error-branch').html('  Necessary number of contributors not yet reached. Cannot start the branch just yet...');
                        }
                        else{
                            $('#btn-start-branch').show();
                            checkForError = true;
                        }
                    }
                    else{
                        if(contributorCount != numberOfContributors){
                            $('#btn-enroll-branch').show();
                        }
                        else{
                            $('#btn-error-branch').show();
                            // $('#btn-assess-branch').show();
                            // $('#btn-review-branch').show();
                            $('#btn-error-branch').html('  Maximum number of contributors reached.Waiting for the author to start this branch...');
                        }
                    }

                    if(contributorCheck && !checkForError && !checkForAuthor){
                        $('#btn-enroll-branch').hide();
                        $('#btn-error-branch').show();
                        $('#btn-error-branch').html('  You already enrolled in this branch. Waiting for people to sign up or for the branch start...');
                    }

                    $('#brain-feed #catalog-body').removeClass('hidden');
                    if(!$('#brain-feed #brain-feed-branch').hasClass('hidden')){
                        $('#brain-feed #brain-feed-branch').addClass('hidden');
                    }
                    if(!$('#brain-feed #catalog').hasClass('hidden')){
                        $('#brain-feed #catalog').addClass('hidden');
                    }
                }

                if(pendingCheck == 2){
                    $('#catalog-body-placeholder').empty();
                    var template = $('#catalog-information').html();
                    var html = Mustache.render(template, snapshot.val());
                    var output = $('#catalog-body-placeholder');
                    output.append(html);

                    $('#brain-feed #catalog-body').removeClass('hidden');
                    if(!$('#brain-feed #brain-feed-branch').hasClass('hidden')){
                        $('#brain-feed #brain-feed-branch').addClass('hidden');
                    }
                    if(!$('#brain-feed #catalog').hasClass('hidden')){
                        $('#brain-feed #catalog').addClass('hidden');
                    }
                    $('#btn-error-branch').show();
                    $('#btn-error-branch').html('  Congratulations! Everyone contributed to this branch. Please follow the instructions below...');
                    $('#btn-download-branch').show();
                    $('#btn-assess-branch').show();
                    $('#btn-review-branch').show();
                    $('#btn-review-branch').addClass(snapshot.val()["id"]);
                    $('#btn-show-results').addClass(snapshot.val()["id"]);
                    $('#btn-assess-branch').addClass(snapshot.val()["id"]);
                    $('#btn-review-author-branch').addClass(snapshot.val()["id"]);
                    $('#btn-confirm-comment').addClass(snapshot.val()["id"]);
                    $('#post-completion-message').show();
                    $('#post-completion-message2').show();
                    $('#separator').show();

                    $('#btn-review-branch').attr('disabled', false);
                    determineReviewingStatus(snapshot.val()["id"].split('/')[0]);
                }

                if(pendingCheck == 3){
                    $('#catalog-body-placeholder').empty();
                    var template = $('#catalog-information').html();
                    var html = Mustache.render(template, snapshot.val());
                    var output = $('#catalog-body-placeholder');
                    output.append(html);

                    $('#brain-feed #catalog-body').removeClass('hidden');
                    if(!$('#brain-feed #brain-feed-branch').hasClass('hidden')){
                        $('#brain-feed #brain-feed-branch').addClass('hidden');
                    }
                    if(!$('#brain-feed #catalog').hasClass('hidden')){
                        $('#brain-feed #catalog').addClass('hidden');
                    }
                    $('#btn-error-branch').show();

                    $('#btn-error-branch').html('  Congratulations! You have now finished contributing. Wait until this branch is completed...');
                }

            }
        });
    });

    $(document).on('click', '#go-back', function(){
        $('#brain-feed #catalog').removeClass('hidden');
        $('#btn-review-author-branch').hide();
        $('#btn-show-results').hide();

        if(!$('#brain-feed #assess-knowledge').hasClass('hidden')){
            $('#brain-feed #assess-knowledge').addClass('hidden')
        }
        if(!$('#brain-feed #all-knowledge').hasClass('hidden')){
            $('#brain-feed #all-knowledge').addClass('hidden')
        }
        if(!$('#brain-feed #all-author-knowledge').hasClass('hidden')){
            $('#brain-feed #all-author-knowledge').addClass('hidden')
        }
        $('#catalog-body-placeholder').empty()
        if(!$('#brain-feed #brain-feed-branch').hasClass('hidden')){
            $('#brain-feed #brain-feed-branch').addClass('hidden');
        }
        if(!$('#brain-feed #catalog-body').hasClass('hidden')){
            $('#brain-feed #catalog-body').addClass('hidden');
        }

        $('#btn-create-branch').show();
        $('#btn-assess-branch').hide();
        $('#btn-review-branch').hide();
        $('#post-completion-message').hide();
        $('#post-completion-message2').hide();
        $('#separator').hide();

        $('#branch-table-container').empty();
        retrieveBranches();
    });

    $(document).on('click', '#go-back-assess', function(){
        if($('#brain-feed #catalog-body').hasClass('hidden')){
            $('#brain-feed #catalog-body').removeClass('hidden');
        }
        if(!$('#brain-feed #all-author-knowledge').hasClass('hidden')){
            $('#brain-feed #all-author-knowledge').addClass('hidden')
        }
        if(!$('#brain-feed #branch-knowledge').hasClass('hidden')){
            $('#brain-feed #branch-knowledge').addClass('hidden')
        }
        if(!$('#brain-feed #all-knowledge').hasClass('hidden')){
            $('#brain-feed #all-knowledge').addClass('hidden')
        }
        if(!$('#brain-feed #assess-knowledge').hasClass('hidden')){
            $('#brain-feed #assess-knowledge').addClass('hidden')
        }
        $('#post-completion-message').show();
        $('#post-completion-message2').show();
        $('#separator').show();
    });

    $(document).on('click', '#go-back-from-res', function(){
        if($('#brain-feed #catalog').hasClass('hidden')){
            $('#brain-feed #catalog').removeClass('hidden');
        }
        if(!$('#brain-feed #catalog-body').hasClass('hidden')){
            $('#brain-feed #catalog-body').addClass('hidden');
        }
        if(!$('#brain-feed #all-author-knowledge').hasClass('hidden')){
            $('#brain-feed #all-author-knowledge').addClass('hidden')
        }
        if(!$('#brain-feed #branch-knowledge').hasClass('hidden')){
            $('#brain-feed #branch-knowledge').addClass('hidden')
        }
        if(!$('#brain-feed #all-knowledge').hasClass('hidden')){
            $('#brain-feed #all-knowledge').addClass('hidden')
        }
        if(!$('#brain-feed #assess-knowledge').hasClass('hidden')){
            $('#brain-feed #assess-knowledge').addClass('hidden')
        }
        $('#post-completion-message').hide();
        $('#post-completion-message2').hide();
        $('#separator').hide();

    });

    $(document).on('click', '#go-back-assess', function(){
        if($('#brain-feed #catalog-body').hasClass('hidden')){
            $('#brain-feed #catalog-body').removeClass('hidden');
        }
        if(!$('#brain-feed #all-author-knowledge').hasClass('hidden')){
            $('#brain-feed #all-author-knowledge').addClass('hidden')
        }
        if(!$('#brain-feed #branch-knowledge').hasClass('hidden')){
            $('#brain-feed #branch-knowledge').addClass('hidden')
        }
        if(!$('#brain-feed #all-knowledge').hasClass('hidden')){
            $('#brain-feed #all-knowledge').addClass('hidden')
        }
        if(!$('#brain-feed #assess-knowledge').hasClass('hidden')){
            $('#brain-feed #assess-knowledge').addClass('hidden')
        }
        $('#post-completion-message').show();
        $('#post-completion-message2').show();
        $('#separator').show();
    });

    $(document).on('click', '#btn-assess-branch', function(){
        var key = $(this).attr("class").split("default")[1].split('/')[0].trim();
        $('#assess-knowledge').removeClass('hidden');
        if(!$('#brain-feed #catalog-body').hasClass('hidden')){
            $('#brain-feed #catalog-body').addClass('hidden');
        }
        if(!$('#brain-feed #all-knowledge').hasClass('hidden')){
            $('#brain-feed #all-knowledge').addClass('hidden')
        }
        if(!$('#brain-feed #all-author-knowledge').hasClass('hidden')){
            $('#brain-feed #all-author-knowledge').addClass('hidden')
        }
        $('#post-completion-message').hide();
        $('#post-completion-message2').hide();
        $('#separator').hide();

        assessmentHandler(key);
        getAssessments(key);
    });

    $(document).on('click', "#btn-confirm-comment", function(){
        var key = $(this).attr("class").split("default")[1].split('/')[0].trim();
        var user = $.cookie('user');

        firebase.database().ref('branches/' + key).once('value', function(snapshot) {
            var exists = (snapshot.val() !== null);
            if (exists) {
                var subtopic = $('#contributor-author-subtopic').text().split(' ')[1];

                firebase.database().ref('branches/' + key).child('comments').child(subtopic).set({
                    "contributorName": user,
                    "comment":  $('#comment-area').val()
                });
                $('#btn-confirm-comment').attr('disabled', true);
            }
        });
    });

    $(document).on('click',"#btn-review-author-branch",function(){
        var key = $(this).attr("class").split("default")[1].split('/')[0].trim();
        var user = $.cookie('user');
        $('#btn-review-author-branch').removeClass($(this).attr("class").split("default")[1]);

        firebase.database().ref('branches/' + key).once('value', function(snapshot) {
            var exists = (snapshot.val() !== null);
            if (exists) {
                var subtopicOrder = [];
                var nameOrder = -1;

                for(var name in snapshot.val()["contributors"]){
                    nameOrder+=1;
                    if(name == user){
                        break;
                    }
                }
                subtopicOrder.push("subtopic"+nameOrder);

                for(var subtopic in snapshot.val()["subtopics"]){
                    if(subtopic != "subtopic"+nameOrder){
                        subtopicOrder.push(subtopic);
                    }
                }

                if(!$('#brain-feed #quiz-knowledge').hasClass('hidden')){
                    $('#brain-feed #quiz-knowledge').addClass('hidden');
                }
                if(!$('#brain-feed #catalog-body').hasClass('hidden')){
                    $('#brain-feed #catalog-body').addClass('hidden');
                }
                if($('#brain-feed #all-author-knowledge').hasClass('hidden')){
                    $('#brain-feed #all-author-knowledge').removeClass('hidden')
                }
                if(!$('#brain-feed #catalog').hasClass('hidden')){
                    $('#brain-feed #catalog').addClass('hidden');
                }

                $('#post-completion-message').hide();
                $('#post-completion-message2').hide();
                $('#separator').hide();

                authorReviewTimer(subtopicOrder, key);
            }
        });
    });

    $(document).on('click',"#btn-review-branch",function(){
        var key = $(this).attr("class").split("default")[1].split('/')[0].trim();
        var user = $.cookie('user');
        $('#btn-review-branch').removeClass($(this).attr("class").split("default")[1]);

        firebase.database().ref('branches/' + key).once('value', function(snapshot) {
            var exists = (snapshot.val() !== null);
            if (exists) {
                var subtopicOrder = [];
                var nameOrder = -1;

                for(var name in snapshot.val()["contributors"]){
                    nameOrder+=1;
                    if(name == user){
                        break;
                    }
                }
                subtopicOrder.push("subtopic"+nameOrder);

                for(var subtopic in snapshot.val()["subtopics"]){
                    if(subtopic != "subtopic"+nameOrder){
                        subtopicOrder.push(subtopic);
                    }
                }

                if(!$('#brain-feed #quiz-knowledge').hasClass('hidden')){
                    $('#brain-feed #quiz-knowledge').addClass('hidden');
                }
                if(!$('#brain-feed #catalog-body').hasClass('hidden')){
                    $('#brain-feed #catalog-body').addClass('hidden');
                }
                if(!$('#brain-feed #assess-knowledge').hasClass('hidden')){
                    $('#brain-feed #assess-knowledge').addClass('hidden')
                }
                if($('#brain-feed #all-knowledge').hasClass('hidden')){
                    $('#brain-feed #all-knowledge').removeClass('hidden')
                }
                if(!$('#brain-feed #branch-knowledge').hasClass('hidden')){
                    $('#brain-feed #branch-knowledge').addClass('hidden')
                }

                $('#post-completion-message').hide();
                $('#post-completion-message2').hide();
                $('#separator').hide();

                reviewTimer(subtopicOrder, key);
            }
        });
    });

    $(document).on('click', '#btn-start-branch', function(){
        var key = $(this).attr("class").split("default")[1].split('/')[0].trim();
        var user = $.cookie('user');

        firebase.database().ref('branches/' + key).once('value', function(snapshot) {
            var exists = (snapshot.val() !== null);
            if (exists) {
                var timePerContributor = snapshot.val()["timePerContributor"];
                var numberOfContributors = snapshot.val()["numberOfContributors"];

                if(snapshot.val()["branch_status"] == "not_started"){
                    firebase.database().ref('branches/' +key + '/branch_status').set("pending");
                }

                $('#brain-feed #brain-feed-branch').removeClass('hidden');
                if(!$('#brain-feed #catalog').hasClass('hidden')){
                    $('#brain-feed #catalog').addClass('hidden');
                }
                if(!$('#brain-feed #catalog-body').hasClass('hidden')){
                    $('#brain-feed #catalog-body').addClass('hidden');
                }
                if(!$('#brain-feed #assess-knowledge').hasClass('hidden')){
                    $('#brain-feed #assess-knowledge').addClass('hidden')
                }
                if(!$('#brain-feed #all-knowledge').hasClass('hidden')){
                    $('#brain-feed #all-knowledge').addClass('hidden')
                }
                if(!$('#brain-feed #all-author-knowledge').hasClass('hidden')){
                    $('#brain-feed #all-author-knowledge').addClass('hidden')
                }
                var subtopicOrder = [];
                var nameOrder = -1;

                for(var name in snapshot.val()["contributors"]){
                    nameOrder+=1;
                    if(name == user){
                        break;
                    }
                }
                subtopicOrder.push("subtopic"+nameOrder);

                for(var subtopic in snapshot.val()["subtopics"]){
                    if(subtopic != "subtopic"+nameOrder){
                        subtopicOrder.push(subtopic);
                    }
                }
                timer(timePerContributor, numberOfContributors, subtopicOrder, snapshot.val()["id"].split('/')[0].trim());
            }
        });
    });

    $(document).on('click', '#btn-enroll-branch', function(){
        var key = $(this).attr("class").split("default")[1].split('/')[0].trim();
        var user = $.cookie('user');
        firebase.database().ref('branches/' + key).once('value', function(snapshot) {
            var exists = (snapshot.val() !== null);
            var key1 = snapshot.val()["id"].split('/')[0];
            var numberOfContributors = snapshot.val()["numberOfContributors"];
            if (exists) {
                var contributorsRef = (snapshot.val()['contributors'] !== undefined);
                var author = snapshot.val()["creator"];
                if(contributorsRef){
                    var contributorCount = 0;
                    var contributorCheck = false;
                    for (var key in snapshot.val()['contributors']){
                        if(key == user){
                            contributorCheck = true;
                        }
                        contributorCount+= 1;
                    }

                    if(!contributorCheck && (numberOfContributors != contributorCount)){
                        firebase.database().ref('branches/' + key1).child('contributors').child(user).set({
                            "contributorName": user,
                            "reviewing_flag": false
                        });

                        if(contributorCount == 4){
                            $('#btn-enroll-branch').hide();
                            $('#btn-error-branch').show();
                            $('#btn-error-branch').html('  Maximum number of contributors reached.Waiting for the author to start this branch...');
                        }

                        else{
                            $('#btn-enroll-branch').hide();
                            $('#btn-error-branch').show();
                            $('#btn-error-branch').html('  You already enrolled in this branch. Waiting for people to sign up or for the branch start...');
                        }
                    }
                }
                else{
                    firebase.database().ref('branches/' + key1).child('contributors').child(user).set({
                        "contributorName": user,
                        "reviewing_flag": false
                    });
                    firebase.database().ref('branches/' + key1).child('contributors').child(author).set({
                        "contributorName": author,
                        "reviewing_flag": false,
                        "author_flag": false
                    });

                    $('#btn-enroll-branch').hide();
                    $('#btn-error-branch').show();
                    $('#btn-error-branch').html('  You already enrolled in this branch. Waiting for people to sign up or for the branch start...');
                }
            }
        });
    });

    $(document).on('click', '#btn-confirm-brainstorming', function(){
        var key = $(this).attr('data-button');
        var user = $.cookie("user");
        var subtopicValue = $('#brainstorming-subtopic').text().split(':')[1].trim();
        var brainstormingValue = $('#brainstorming-area').val();

        firebase.database().ref('branches/' + key).once('value', function(snapshot) {
            var exists = (snapshot.val() !== null);
            if (exists) {
                for(var subtopic in snapshot.val()["subtopics"]){
                    if(snapshot.val()["subtopics"][subtopic]["value"] == subtopicValue){
                        firebase.database().ref('branches/' + key + '/contributors/' + user).child(subtopic).set({
                            "value": brainstormingValue
                        });
                    }

                    $('#btn-confirm-brainstorming').attr('disabled', true);
                    $('#brainstorming-area').attr('disabled', true);
                }
            }
        });
    });

    $(document).on('click', '#btn-download-branch', function(){
        var key = $(this).attr("class").split("default")[1].split('/')[0].trim();
        var user = $.cookie('user');
        firebase.database().ref('branches/' + key).once('value', function(snapshot) {
            var exists = (snapshot.val() !== null);
            if (exists) {
                var creator = 'Creator:'+snapshot.val()["creator"];
                var description = 'Description:'+snapshot.val()["description"];
                var dateCreated = 'Time:'+snapshot.val()["id"].split('/')[0];
                var numberOfContributors = snapshot.val()["numberOfContributors"];
                var purpose = 'Purpose:'+snapshot.val()["purpose"];
                var structure = 'Structure:'+snapshot.val()["structure"];
                var timePerContributor = snapshot.val()["timePerContributor"];
                var title = snapshot.val()["title"];
                var topic = snapshot.val()["topic"];

                var subtopicString = 'Subtopics:\n';
                var userString = 'Contributors:\n';

                //Name of Subtopics
                var subtopics = [];
                for(var key in snapshot.val()["subtopics"]){
                    subtopics.push(snapshot.val()["subtopics"][key]["value"]);
                    console.log(snapshot.val()["subtopics"][key]["value"]);
                    subtopicString+=snapshot.val()["subtopics"][key]["value"]+'\n';
                }

                //Name of contributors
                var contributorNames = [];

                //This contains the contributor objects, you can get their contributions from here. Print them out and look at the structure
                var contributorsObject = [];

                for(var key1 in snapshot.val()["contributors"]){
                    contributorNames.push(snapshot.val()["contributors"][key1]["contributorName"]);
                    contributorsObject.push(JSON.stringify(snapshot.val()["contributors"][key1]));
                    console.log(snapshot.val()["contributors"][key1]["contributorName"]);
                    userString+=snapshot.val()["contributors"][key1]["contributorName"]+'\n';
                }

                var contributions = {
                    "subtopic0": [],
                    "subtopic1": [],
                    "subtopic2": [],
                    "subtopic3": [],
                    "subtopic4": [],
                    "subtopic5": []
                };

                for(var contributorKey in snapshot.val()["contributors"]){
                    for(var subtopicKey in snapshot.val()["contributors"][contributorKey]){
                        for(var subtopicArray in contributions){
                            if(subtopicArray == subtopicKey){
                                contributions[subtopicArray].push(snapshot.val()["contributors"][contributorKey][subtopicKey]["value"]);
                            }
                        }
                    }
                }

                var subtopicNo = 0;
                for(var noContrKey in snapshot.val()["subtopics"]){
                    subtopicNo+=1;
                    for(var contrArray in contributions){
                        if(contributions[contrArray].length != 0){
                            if(contrArray == noContrKey){
                                contributions[contrArray].push(snapshot.val()["subtopics"][noContrKey]["value"]);
                            }
                        }
                    }
                }
                var pdf = new jsPDF();
                pdf.setFontSize(25);
                pdf.text(30, 30, title+'\n');
                pdf.setFontSize(15);
                pdf.text(30, 40, topic+'\n');
                pdf.line(20, 45, 180, 45);
                pdf.setFontSize(12);
                pdf.setFontType("bolditalic");
                pdf.text(30, 55, creator+'\n'+structure+'\n'+purpose+'\n'+dateCreated);
                pdf.line(30, 80, 170, 80);
                pdf.setFontSize(12);
                pdf.setFontType("normal");
                pdf.text(30, 90, subtopicString+'\n'+userString + '\n');

                // for(var array in contributions){
                //     if(contributions[array].length != 0){
                //         pdf.setFontSize(12);
                //         pdf.setFontType("bolditalic");
                //         pdf.text(30, 100, contributions[array][contributions[array].length-1] + '\n');
                //     }
                // }
                pdf.save(title);
            }
        });
    });

    $(document).on('click', '#btn-show-results', function(e){
        var branchkey = $(this).attr("class").split("default")[1].split('/')[0].trim();
        var ref = firebase.database().ref('branches/'+branchkey+'/');
        var contributors = 0;
        var contributorsRef = firebase.database().ref('branches/'+branchkey+"/numberOfContributors");
        var self2 = this;
        contributorsRef.once('value').then(function(snapshot){
            var self = this;
            this.contributors = snapshot.val();
            console.log("con ", this.contributors);
            ref.on('value', function(snapshot){
                var knowledgeArea = $('#branch-knowledge #branch-knowledge-container');
                knowledgeArea.empty();
                var data = snapshot.val();
                debugger;
                var quizData = data.quizzes;
                if(!$('#brain-feed #assess-knowledge').hasClass('hidden')){
                    $('#brain-feed #assess-knowledge').addClass('hidden')
                }
                if(!$('#brain-feed #all-knowledge').hasClass('hidden')){
                    $('#brain-feed #all-knowledge').addClass('hidden')
                }
                if($('#brain-feed #branch-knowledge').hasClass('hidden')){
                    $('#brain-feed #branch-knowledge').removeClass('hidden')
                }
                $('#catalog-body-placeholder').empty()
                if(!$('#brain-feed #brain-feed-branch').hasClass('hidden')){
                    $('#brain-feed #brain-feed-branch').addClass('hidden');
                }
                if(!$('#brain-feed #catalog-body').hasClass('hidden')){
                    $('#brain-feed #catalog-body').addClass('hidden');
                }
                if(!$('#brain-feed #catalog').hasClass('hidden')){
                    $('#brain-feed #catalog').addClass('hidden');
                }
                var title = "<h4> Title - "+ data.title+"</h4>";
                var topic = "<p> Topic - "+ data.topic+"</p>";
                var author = "<p> Creator - "+data.creator+"</p>";
                var desc = "<p> Description - "+data.description+"</p>";
                var createdAt = "<p> Time stamp - "+data.id.replace("/","")+"</p>";
                var purpose = "<p> Purpose - "+data.purpose+"</p>";
                var contributors = "<p> Contributors - "+data.numberOfContributors+"</p>";
                var knowledge = title + topic + author + desc + createdAt + purpose + contributors;
                var subtopics = "";
                for(var c in data.subtopics){
                    subtopics += "<p> Subtopic - "+data.subtopics[c].value+"</p>" + "<p> Contributions - </p>";
                    var selected_c = data.selected_contributions[data.subtopics[c].value];
                    var selected_contributions_keys = Object.keys(selected_c);
                    for(var s_c in selected_contributions_keys){
                        subtopics += "<li>"+selected_contributions_keys[s_c]+"</li>";
                    }
                    subtopics += "<br/>";
                }
                knowledge += subtopics;
                if(quizData){
                    
                    if(quizData.mcq){
                        var mcq = quizData.mcq;
                        var mcqContent = "<h4>Multiple Choice Stats</h4>";
                        for(var ques in mcq){
                            mcqContent = mcqContent + "<h5> Question : "+ques+"</h5>";
                            for (var op in mcq[ques].stats) {
                                if (mcq[ques].stats.hasOwnProperty(op)) {
                                    mcqContent = mcqContent + "<p>"+ mcq[ques].options[op] +"</p>";
                                    var percentContributions =  (parseInt(mcq[ques].stats[op])/parseInt(this.contributors))*100;
                                    mcqContent = mcqContent + '<div class="progress"> <div class="progress-bar bg-info" role="progressbar" style="width: '+percentContributions+'%" aria-valuenow="'+percentContributions+'" aria-valuemin="0" aria-valuemax="'+parseInt(this.contributors)+'">'+percentContributions+'%</div></div>';
                                }
                            }
                        }
                        knowledge = knowledge +mcqContent;
                    }
                    if(quizData.sq){
                        var sq = quizData.sq;
                        var sqContent = "<h4>Short Answers stats</h4>";
                        for(var ques in sq){
                            sqContent = sqContent + "<h5> Question : "+ques+"</h5>";
                            var answers = sq[ques].answers.split(",");
                            for(ans in answers)
                                if(ans != ""){
                                    sqContent = sqContent + "<p>"+answers[ans]+"</p>";
                                }
                        }
                        knowledge = knowledge + sqContent;
                    }
                    if(quizData.tf){
                        var tf = quizData.tf;
                        var tfContent = "<h4>True False Stats</h4>";
                        for(var ques in tf){
                            tfContent = tfContent + "<h5> Question : "+ques+"</h5>";
                            for (var op in tf[ques].stats) {
                                if (tf[ques].stats.hasOwnProperty(op)) {
                                    tfContent = tfContent + "<p>"+ tf[ques].options[op] +"</p>";
                                    percentContributions =  (parseInt(tf[ques].stats[op])/parseInt(this.contributors))*100;
                                    tfContent = tfContent + '<div class="progress"> <div class="progress-bar bg-info" role="progressbar" style="width: '+percentContributions+'%" aria-valuenow="'+percentContributions+'" aria-valuemin="0" aria-valuemax="'+parseInt(this.contributors)+'">'+percentContributions+'%</div></div>';
                                }
                            }
                            tfContent = tfContent + "<br/>";
                        }
                        knowledge = knowledge +tfContent;
                    }
                 
                }
                knowledgeArea.html(knowledge);
            }, self);
        }, self2);
    });
}

function authorReviewTimer(subtopicOrder, key){
    firebase.database().ref('branches/' + key).once('value', function(snapshot) {
        var exists = (snapshot.val() !== null);
        var user = $.cookie("user");
        if (exists) {
            var numberOfContributors = snapshot.val()["numberOfContributors"];
            $('#statistics').empty();
            $('#contributor-author-subtopic').text('Subtopic: ' +  snapshot.val()["subtopics"][subtopicOrder[0]]["value"]);
            $('#comment-area').val("Comment Here");
            $('#btn-confirm-comment').attr('disabled', false);

            for(var key in snapshot.val()["selected_contributions"]){
                if(key ==  snapshot.val()["subtopics"][subtopicOrder[0]]["value"]){
                    for(var contributionKey in snapshot.val()["selected_contributions"][key]){
                        var subtopicValue =  snapshot.val()["subtopics"][subtopicOrder[0]]["value"];
                        var totalNumberOfVotes = 0;
                        var contributionNumberOfVotes = 0;

                        for(var key0 in snapshot.val()["selected_contributions"][subtopicValue]){
                            for(var key1 in snapshot.val()["selected_contributions"][subtopicValue][key0]){
                                totalNumberOfVotes+=1;
                            }

                            if(key0 == contributionKey){
                                for(var contributioKey0 in snapshot.val()["selected_contributions"][subtopicValue][key0]){
                                    contributionNumberOfVotes+=1;
                                }
                            }
                        }
                        var percentage = (contributionNumberOfVotes/totalNumberOfVotes *100).toFixed(2);
                        var contributionStatistic = {
                            "percent": percentage,
                            "contribution": contributionKey
                        };

                        var template = $('#statistic').html();
                        var html = Mustache.render(template, contributionStatistic);
                        var output = $('#statistics');
                        output.append(html);
                    }
                }
            }

            subtopicOrder.shift();
            document.getElementById("countdowntimer-author-review").textContent = "";
            $("#countdowntimer-author-review").css('margin-left', '12.5%');
            var timeleft = 30;
            var timeout='Time over';

            var downloadTimer = setInterval(function(){
                if(timeleft == 0){
                    document.getElementById("countdowntimer-author-review").textContent = timeout;
                    $("#countdowntimer-author-review").css('margin-left', '8.5%');
                    numberOfContributors--;

                    if(subtopicOrder.length == 0){
                        $('#btn-confirm-comment').removeClass(snapshot.val()["id"]);

                        if($('#brain-feed #catalog-body').hasClass('hidden')){
                            $('#brain-feed #catalog-body').removeClass('hidden');
                        }
                        if(!$('#brain-feed #all-author-knowledge').hasClass('hidden')){
                            $('#brain-feed #all-author-knowledge').addClass('hidden')
                        }
                        if(!$('#brain-feed #branch-knowledge').hasClass('hidden')){
                            $('#brain-feed #branch-knowledge').addClass('hidden')
                        }
                        $('#post-completion-message').show();
                        $('#post-completion-message2').show();
                        $('#separator').show();

                        firebase.database().ref('branches/' + snapshot.val()["id"].split('/')[0] + '/contributors/' + user + '/author_flag').set(true);
                        $('#review-message').text('Congratulations. Now this branch has been reviewed. Please see the results');
                        $('#btn-review-branch').hide();
                        $('#btn-review-author-branch').hide();
                        $('#btn-show-results').show();
                    }
                }
                if(timeleft > 0){
                    document.getElementById("countdowntimer-author-review").textContent = timeleft;
                }
                if(timeleft < 0) {
                    clearInterval(downloadTimer);
                }
                timeleft--;
            },1000);

            setTimeout(function() {
                if(numberOfContributors > 0){
                    authorReviewTimer(subtopicOrder, snapshot.val()["id"].split('/')[0]);
                }
            },32000);
        }
    });
}

function reviewTimer(subtopicOrder, key){
    firebase.database().ref('branches/' + key).once('value', function(snapshot) {
        var exists = (snapshot.val() !== null);
        var user = $.cookie("user");
        if (exists) {
            var numberOfContributors = snapshot.val()["numberOfContributors"];
            $('#review-sentences').empty();
            $('#contributions-review').empty();
            $('#review-sentences').empty();
            $('#reviewing-time-left').addClass(key);

            $('#review-sentences').append('<h5>What do you think brings the most value for this particular subtopic?</h5>').html();
            for(var contributor in snapshot.val()["contributors"]){
                var testimonialCheck = (snapshot.val()["contributors"][contributor][subtopicOrder[0]] !== undefined);
                if(testimonialCheck && contributor != user){
                    var contributorData = snapshot.val()["contributors"][contributor];
                    var template = $('#contributor-review').html();
                    var html = Mustache.render(template, contributorData);
                    var output = $('#contributions-review');
                    output.append(html);

                    document.getElementById("testimonial-review-" + contributor).textContent = snapshot.val()["contributors"][contributor][subtopicOrder[0]]["value"];
                    var contributionIdeas = snapshot.val()["contributors"][contributor][subtopicOrder[0]]["value"].split('.');
                    var entireIdea = snapshot.val()["contributors"][contributor][subtopicOrder[0]]["value"];
                    $(".testimonial-writer-designation").text("Subtopic:  " + snapshot.val()["subtopics"][subtopicOrder[0]]["value"]);

                    for(var idea in contributionIdeas){
                        if(contributionIdeas[idea] != ""){
                            var contributionIdeaData = {
                                "acronym": "IDEA",
                                "sentence": contributionIdeas[idea]
                            };
                            var template = $('#review-sentence').html();
                            var html = Mustache.render(template, contributionIdeaData);
                            var output = $('#review-sentences');
                            output.append(html);
                        }
                    }
                    var entireIdeaData = {
                        "acronym": "ALL",
                        "sentence": entireIdea
                    };
                    var template = $('#review-sentence').html();
                    var html = Mustache.render(template, entireIdeaData);
                    var output = $('#review-sentences');
                    output.append(html);
                }
            }

            subtopicOrder.shift();
            document.getElementById("countdowntimer-review").textContent = "";
            $("#countdowntimer-review").css('margin-left', '12.5%');
            var timeleft = 30;
            var timeout='Time over';

            var downloadTimer = setInterval(function(){
                if(timeleft == 0){
                    document.getElementById("countdowntimer-review").textContent = timeout;
                    $("#countdowntimer-review").css('margin-left', '8.5%');
                    numberOfContributors--;

                    if(subtopicOrder.length == 0){
                        if($('#brain-feed #catalog-body').hasClass('hidden')){
                            $('#brain-feed #catalog-body').removeClass('hidden');
                        }
                        if(!$('#brain-feed #all-knowledge').hasClass('hidden')){
                            $('#brain-feed #all-knowledge').addClass('hidden')
                        }
                        if(!$('#brain-feed #branch-knowledge').hasClass('hidden')){
                            $('#brain-feed #branch-knowledge').addClass('hidden')
                        }
                        $('#post-completion-message').show();
                        $('#post-completion-message2').show();
                        $('#separator').show();

                        firebase.database().ref('branches/' + key + '/contributors/' + user + '/reviewing_flag').set(true);
                        determineReviewingStatus(key);
                    }
                }
                if(timeleft > 0){
                    document.getElementById("countdowntimer-review").textContent = timeleft;
                }
                if(timeleft < 0) {
                    clearInterval(downloadTimer);
                }
                timeleft--;
            },1000);

            setTimeout(function() {
                if(numberOfContributors > 0){
                    reviewTimer(subtopicOrder, key);
                }
            },32000);
        }
    });
}

function determineReviewingStatus(key){
    firebase.database().ref('branches/' + key).once('value', function(snapshot) {
        var exists = (snapshot.val() !== null);
        var user = $.cookie("user");
        if (exists) {
            var branchAuthor = snapshot.val()["creator"];
            var authorCheck = true;
            var contributorsCheck = true;

            for(var contributor in snapshot.val()["contributors"]){
                if(snapshot.val()["contributors"][contributor]["reviewing_flag"] == false){
                    contributorsCheck = false;
                }

                if(contributor == branchAuthor){
                    if(snapshot.val()["contributors"][contributor]["author_flag"] == false){
                        authorCheck = false;
                    }
                }
            }

            //Everyone reviewed branch contributions
            if(contributorsCheck){
                //The logged in user is the author of the branch that he reviewed
                if(user == branchAuthor){
                    //I completed his final reviewing check
                    if(authorCheck){
                        $('#review-message').text('Congratulations. Now this branch has been reviewed. Please see the results');
                        $('#btn-review-branch').hide();
                        $('#btn-review-author-branch').hide();
                        $('#btn-show-results').show();

                    }
                    else{
                        $('#review-message').text('Please make your author contribution as the final step of this whole process');
                        $('#btn-review-branch').hide();
                        $('#btn-show-results').hide();
                        $('#btn-review-author-branch').show();
                    }
                }
                else{
                    //The author completed his final reviewing check
                    if(authorCheck){
                        $('#review-message').text('Congratulations. Now this branch has been reviewed. Please see the results');
                        $('#btn-review-branch').hide();
                        $('#btn-review-author-branch').hide();
                        $('#btn-show-results').show();
                    }

                    //The author did not complete his check
                    else{
                        $('#review-message').text('Successfully reviewed this branch. Waiting for the author to do this as well');
                        $('#btn-review-branch').attr('disabled', true);
                    }
                }
            }
            //Not everyone reviewed branch contributions
            else{
                if(!snapshot.val()["contributors"][user]["reviewing_flag"] == false){
                    $('#review-message').text('Successfully reviewed this branch. Waiting for the other contributors to do it too');
                    $('#btn-review-branch').attr('disabled', true);
                }
                else{
                    $('#review-message').text('Please review all the contributions that will be included in the final document...');
                    $('#btn-review-branch').attr('disabled', false);
                }
            }
        }
    });
}

function handleContributionsSelection(){
    $(document).on('click', '.chip-sentence', function(){
        var selectedContribution =  $(this).text();
        var formattedSelectedContribution = selectedContribution.replace(/\./g, "   ");
        var key = $('#reviewing-time-left').attr('class');
        var subtopic =  $(".testimonial-writer-designation").text().split('  ')[1].split('Subtopic')[0];

        firebase.database().ref('branches/' + key + '/selected_contributions').once('value', function(snapshot) {
            var exists = (snapshot.val() !== null);
            var user = $.cookie("user");
            if (exists) {
                var contributionExists = (snapshot.val()[formattedSelectedContribution] !== undefined);

                if(contributionExists){
                    var contributorExists = (snapshot.val()[formattedSelectedContribution][user] !== undefined);
                    if(!contributorExists){
                        var branchRef = firebase.database().ref('branches/' + key + '/selected_contributions/' + subtopic);
                        branchRef.child(formattedSelectedContribution).child(user).set({
                            "contributor": user
                        });
                    }
                }
                else{
                    var branchRef = firebase.database().ref('branches/' + key + '/selected_contributions/' + subtopic);
                    branchRef.child(formattedSelectedContribution).child(user).set({
                        "contributor": user
                    });
                }
            }
            else{
                var branchRef = firebase.database().ref('branches/' + key + '/selected_contributions/' + subtopic);
                branchRef.child(formattedSelectedContribution).child(user).set({
                    "contributor": user
                });
            }
        });
    });
}

function retrieveInfo(){
    var user = $.cookie("user");
    if(!user){
        window.location.href = "/WebApp/public/404.html";
    }
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

    $('#brainfeed-choice, #get-started').on('click',function(){
        if(!$('#brainfeed-choice').hasClass('selected')){
            $('#brainfeed-choice').addClass('selected');
            $('#brain-feed').show();

            $('#brain-feed-branch').addClass('hidden');
            if($('#catalog').hasClass('hidden')){
                $('#catalog').removeClass('hidden');
            }
            if(!$('#catalog-body').hasClass('hidden')){
                $('#catalog-body').addClass('hidden');
            }
            if(!$('#brain-feed #assess-knowledge').hasClass('hidden')){
                $('#brain-feed #assess-knowledge').addClass('hidden')
            }
            if(!$('#brain-feed #all-knowledge').hasClass('hidden')){
                $('#brain-feed #all-knowledge').addClass('hidden')
            }
            if(!$('#brain-feed #all-author-knowledge').hasClass('hidden')){
                $('#brain-feed #all-author-knowledge').addClass('hidden')
            }
            if(!$('#brain-feed #branch-knowledge').hasClass('hidden')){
                $('#brain-feed #branch-knowledge').addClass('hidden')
            }
            $('#btn-create-branch').show();
            $('#btn-assess-branch').hide();
            $('#btn-review-branch').hide();
            $('#post-completion-message').hide();
            $('#post-completion-message2').hide();
            $('#separator').hide();

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

        $('#catalog-body-placeholder').empty();
        $('#brain-feed-branch-content').empty();

        $('#branch-table-container').empty();
        retrieveBranches();
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
    });

    $('#social-choice, #make-friends').on('click',function(){
        
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

 
}

function randomization(random){
    if(random == 0){
        var random = Math.floor((Math.random() * 2) + 0);
        return [random,3,4];
    }
    if(random == 1){
        var random1 = Math.floor((Math.random() * 4) + 2);
        return [random1, 0, 1];
    }
    if(random == 2){
        var random2 = Math.floor((Math.random() * 3) + 1);
        return [random2,0 ,4];
    }
}

function preScreenRandomization(){
    var currentTopic = $('#topic-button').text().trim();
    if(currentTopic === 'C++'){
        currentTopic = 'C_plus_plus';
    }
    firebase.database().ref('pre_screening/' + currentTopic).once('value', function(snapshot) {
        var exists = (snapshot.val() !== null);
        if(exists) {
            $('#question1-container').empty();
            $('#question2-container').empty();
            $('#question3-container').empty();
            var randomArray = randomization(Math.floor((Math.random() * 2) + 0));
            var question1Object = snapshot.val()["question_" + randomArray[0]];
            var question2Object = snapshot.val()["question_" + randomArray[1]];
            var question3Object = snapshot.val()["question_" + randomArray[2]];

            var template = $('#choices').html();
            var html = Mustache.render(template, question1Object);
            var output = $('#question1-container');
            output.append(html);

            var template = $('#choices').html();
            var html = Mustache.render(template, question2Object);
            var output = $('#question2-container');
            output.append(html);

            var template = $('#choices').html();
            var html = Mustache.render(template, question3Object);
            var output = $('#question3-container');
            output.append(html);
        }
    });
}

function preScreenEval(){
    var currentTopic = $('#topic-button').text().trim();
    var question1 = "", question2 = "" , question3 = "";
    var question1Answers = [],question2Answers = [], question3Answers = [];

    if(currentTopic === 'C++'){
        currentTopic = 'C_plus_plus';
    }

    $('#question1-container > p').each(function() {
        question1Answers.push(this.id.split("-")[0]);
    });
    $('#question2-container > p').each(function() {
        question2Answers.push(this.id.split("-")[0]);
    });
    $('#question3-container > p').each(function() {
        question3Answers.push(this.id.split("-")[0]);
    });
    var temp1 = splitValue(question1Answers[0], "10");
    question1 = temp1.split(',')[0];

    var temp2 = splitValue(question2Answers[0], "10");
    question2 = temp2.split(',')[0];

    var temp3 = splitValue(question3Answers[0], "10");
    question3 = temp3.split(',')[0];

    firebase.database().ref('pre_screening/' + currentTopic).once('value', function(snapshot) {
        var exists = (snapshot.val() !== null);
        var count = 0;
        if (exists) {
            for (var key in snapshot.val()) {
                if(key == question1 || key == question2 || key == question3){
                    var correctAnswer = snapshot.val()[key]["correct_answer"];
                    for(var answerKey in snapshot.val()[key]["answers"]){
                        if($("#"+key+"_"+answerKey).is(':checked')) {
                            if(correctAnswer == $("#"+key+"_"+answerKey + "-text").text()){
                                count+=1;
                            }
                        }
                    }
                }
            }
            $('#modal-branches .modal-title').text('Pre Screening Result');
            $('#branch-info').hide();
            $('#brainstorm-format').hide();
            $('#pre-screening').hide();
            $('#pre-screening-result').show();
            var answers = $("#pre-screening-questions .item input[type=radio]:checked").length;

            var content = "";

            if(count >= 2){
                brainstormingBranchDbHandler();
                $('#branch-table-container').empty();
                retrieveBranches();
                content = '<h3 class="correct"><i class="material-icons large">grade</i>Congratulations!</h3> <h5 class="br-feedback">You can now start Brain storming!</h5>';
            }
            else{
                content = '<h3 class="red"><i class="material-icons large">error</i>Oops! </h3><h5 class="br-feedback">You did not qualify for Brain Storming!</h5>';
            }

            content += '<br/><h5> Closing ..</h5>';
            $('#pre-screening-result p').html(content);
            setTimeout("$('#modal-branches').modal('hide');",3000);
            $(this).attr('disabled', true);
        }
    });
}

function brainstormingBranchDbHandler(){
    var currentTopic = $('#topic-button').text().trim();
    var topicPurpose = $('#topic-purpose').val();
    var topicTitle = $('#topic-name').val();
    var topicDescription = $('#topic-description').val();
    var noContributors = $('#rangeContributors').val();
    var timePerContributor = $('#rangeTimeContributor').val();
    var brainstormingStructure = $('#structure-button').text().trim();
    var subtopics = [];
    var currentUser = $.cookie("user");
    var currentTime = new Date();

    var count = 0;
    $('#subtopics').children().each(function() {
        if (count >= 1) {
            var divId = $(this).attr("id");
            subtopics.push($("#" + divId.split('-')[0]).val());
        }
        count += 1;
    });

    firebase.database().ref('branches/' + currentTime).set({
        "creator": currentUser,
        "topic": currentTopic,
        "title": topicTitle,
        "purpose": topicPurpose,
        "description": topicDescription,
        "numberOfContributors": noContributors,
        "timePerContributor": timePerContributor,
        "structure": brainstormingStructure,
        "id": currentTime + "/",
        "branch_status": "not_started"
    });

    var branchRef = firebase.database().ref('branches/' + currentTime).child('subtopics');
    for (var index in subtopics){
        branchRef.child("subtopic"+index).set({
            "value": subtopics[index]
        });
    }
}

function branchCreationModelhandler(){
    $('#pre-screening-questions').carousel({
        wrap:false,
        ride:false,
        interval: false
    });

    $('#preScreen').on('click', function() {
        var currentText = $('#structure-button').text().trim();
        var noSubTopics = $('#input-range').val().trim();
        var noContributors = $('#rangeContributors').val();
        var check = false;

        if(noSubTopics != noContributors){
            alert("Please match the number of subtopics/questions with your contributor number!");
            check = true;
        }

        if(currentText === "Brainstorming Structure" || noSubTopics == 0){
            alert("Please enter all the necessary information in order to continue!");
            check = true;
        }

        if(!check){
            $('#modal-branches .modal-title').text('Pre Screening');
            $('#saveImage').parent().addClass('hidden');
            $('#preScreen').attr('disabled', true);
            $('#branch-info').hide();
            $('#brainstorm-format').hide();
            $('#pre-screening').show();

            preScreenRandomization();
        }
    });


    $('#finishPreScreen').on('click', function(){
       $('#finishPreScreen').attr('disabled', true);
       preScreenEval();
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

function assessmentHandler(branchkey){

    $('#add-mcq-option').off('click').on('click', function(){
        var html = '<input class="mdl-textfield__input" type="text" >';
        $('#mcq-options').append(html);
    })
    $('#add-quiz button[type=submit]').off('click').on('click', function(){
        var questionText = $('#quiz-question')[0].value;
        var options = $('#mcq-options input[type=text]');
        var optionsText = {};
        var statsText = {};
        for(var i=0;i<options.length;i++){
            optionsText["option"+i] = options[i].value;
            statsText["option"+i] = 0;
        }
        var quizRef = firebase.database().ref('branches/'+branchkey+'/quizzes/');
        var mcqRef = quizRef.child('mcq');
        mcqRef.child(questionText).set({
            options: optionsText,
            stats : statsText,
            answeredBy: ''
        });
        $('#add-quiz').modal('hide');
        $('#quiz-question')[0].value = '';
        $('#mcq-options').empty();
    });
    $('#add-quiz2 button[type=submit]').on('click', function(){
        var questionText = $('#sa-quiz-question')[0].value;
        var quizRef = firebase.database().ref('branches/'+branchkey+'/quizzes/');
        quizRef.child('sq').child(questionText).set({answers : '', answeredBy : ''});
        $('#add-quiz2').modal('hide');
        $('#sa-quiz-question')[0].value = '';
    });
    $('#add-quiz3 button[type=submit]').on('click', function(){
        var questionText = $('#tf-quiz-question')[0].value;
        var quizRef = firebase.database().ref('branches/'+branchkey+'/quizzes/');

        var optionsText = {option0 : "true", option1: "false"};
        var statsText = {option0 : 0, option1: 0};
        quizRef.child('tf').child(questionText).set({
            options: optionsText,
            stats : statsText,
            answeredBy: ''
        });
        $('#add-quiz3').modal('hide');
        $('#tf-quiz-question')[0].value = '';
    });
    $('#view-quiz button[type=submit]').on('click', function(){
        var selected_option = $("input[name='view-quiz-quesion-modal']:checked").attr('value');
        if(selected_option){
            var optionRef = null;
            var questionText = $("#mcq-view-quiz-question").text();
            // var quizRef = firebase.database().ref('quizzes/mcq/').child(questionText).child('stats').child(selected_option);
            var quizRef = firebase.database().ref('branches/'+branchkey+'/quizzes/mcq/').child(questionText).child("options");
            quizRef.on('value', function(snapshot){
                for (var key in snapshot.val()){
                    //alert(snapshot.val()[key]);
                    if(snapshot.val()[key] === selected_option){
                        optionRef =key;
                    }
                }
            });
            //quizRef.update(option{Update);
            var quizStatRef = firebase.database().ref('branches/'+branchkey+'/quizzes/mcq/').child(questionText).child("stats").child(optionRef);
            quizStatRef.transaction(function(count){
                count = count +1;
                return count;
            });
            var quizAnsweredByRef = firebase.database().ref('branches/'+branchkey+'/quizzes/mcq/').child(questionText).child("answeredBy");
            var answeredBy = null;
            quizAnsweredByRef.on('value', function(snapshot){
                answeredBy = snapshot.val();
            });
            answeredBy = answeredBy+","+  $.cookie("user");
            firebase.database().ref('branches/'+branchkey+'/quizzes/mcq/').child(questionText).child("answeredBy").set(answeredBy);
            $('#view-quiz').modal('hide');
        }
    });

    $('#view-quiz3 button[type=submit]').on('click', function(){
        var selected_option = $("#tf-view-options input[name='view-quiz-tf-modal']:checked").attr('value');
        var optionRef = null;
        var questionText = $("#tf-view-quiz-question").text();
        var quizStatRef = firebase.database().ref('quizzes/mcq/').child(questionText).child('stats').child(selected_option);
        var quizRef = firebase.database().ref('branches/'+branchkey+'/quizzes/tf/').child(questionText).child("options");
        quizRef.on('value', function(snapshot){
            for (var key in snapshot.val()){
              //alert(snapshot.val()[key]);
                if(snapshot.val()[key] === selected_option){
                    optionRef =key;
                }
            }
        });
        //quizRef.update(option{Update);
        var quizStatRef = firebase.database().ref('branches/'+branchkey+'/quizzes/tf/').child(questionText).child("stats").child(optionRef);
        quizStatRef.transaction(function(count){
            count = count +1;
            return count;
        });
        var quizAnsweredByRef = firebase.database().ref('branches/'+branchkey+'/quizzes/tf/').child(questionText).child("answeredBy");
        var answeredBy = null;
        quizAnsweredByRef.on('value', function(snapshot){
            answeredBy = snapshot.val();
        });
        answeredBy = answeredBy+","+  $.cookie("user");
        firebase.database().ref('branches/'+branchkey+'/quizzes/tf/').child(questionText).child("answeredBy").set(answeredBy);
        $('#view-quiz3').modal('hide');
    });

    $('#view-quiz2 button[type=submit]').on('click', function(){
        var selected_option = $("#sa-view-quiz-answer").val();
        var questionText = $("#sa-view-quiz-question").text();
        // var quizRef = firebase.database().ref('quizzes/mcq/').child(questionText).child('stats').child(selected_option);

        var options = {answer: selected_option};
        var quizRef = firebase.database().ref('branches/'+branchkey+'/quizzes/sq/').child(questionText).child("answers");
        var answers = null;
        quizRef.on('value', function(snapshot){
            answers = snapshot.val();
        });
        answers = answers + "," + selected_option;
        firebase.database().ref('branches/'+branchkey+'/quizzes/sq/').child(questionText).child("answers").set(answers);
        var quizAnsweredByRef = firebase.database().ref('branches/'+branchkey+'/quizzes/sa/').child(questionText).child("answeredBy");
        var answeredBy = null;
        quizAnsweredByRef.on('value', function(snapshot){
            answeredBy = snapshot.val();
        });
        answeredBy = answeredBy+","+  $.cookie("user");
        firebase.database().ref('branches/'+branchkey+'/quizzes/sq/').child(questionText).child("answeredBy").set(answeredBy);
        $('#view-quiz2').modal('hide');
    });
}

function getAssessments(branchkey){
    var quizData = null;
    var ref = firebase.database().ref('branches/'+branchkey+'/quizzes/');
    ref.on('value', function(snapshot){
        var data = snapshot.val();
        quizData = data;
        $('#all-mcqs').empty();
        $('#all-shortAns').empty();
        $('#all-tfs').empty();
        var self = this;
        if(data && data.mcq){
            // TODO : Add Empty case
            Object.keys(data.mcq).forEach(function(key, quizData) {
                if( this.mcq[key].answeredBy.indexOf($.cookie('user')) < 0){
                    $('#all-mcqs').append('<div class="text-center" data-toggle="modal" data-target="#view-quiz" ><p class="question-item"><i class="material-icons">list</i>'+key+'</p></div>');
                }
            }, data);
        }
        if(data && data.tf){
            Object.keys(data.tf).forEach(function(key) {
                if(this.tf[key].answeredBy.indexOf($.cookie('user')) < 0){
                    $('#all-tfs').append('<div class="text-center" data-toggle="modal" data-target="#view-quiz3" ><p class="question-item"><i class="material-icons">radio_button_checked</i>'+key+'</p></div>');
                }
            }, data);
        }
        if(data && data.sq){
            Object.keys(data.sq).forEach(function(key) {
                if(this.sq[key].answeredBy.indexOf($.cookie('user')) < 0){
                    $('#all-shortAns').append('<div class="text-center" data-toggle="modal" data-target="#view-quiz2" ><p class="question-item"><i class="material-icons">menu</i>'+key+'</p></div>');
                }
            }, data);
        }
        $('#view-quiz').on('show.bs.modal', function(e){
            $('#mcq-view-quiz-question').text(e.relatedTarget.textContent.replace('list',''));
            var options = quizData.mcq[e.relatedTarget.textContent.replace('list','')];
            $('#mcq-view-options').empty();
            Object.keys(options.options).forEach(function(key) {
                $('#mcq-view-options').append('<h6> <input type="radio" class="mdl-radio__button" name="view-quiz-quesion-modal" value="'+options.options[key]+'" >'+options.options[key] +'</h6>');
            });
        });
        $('#view-quiz2').on('show.bs.modal', function(e){
            $('#sa-view-quiz-question').text(e.relatedTarget.textContent.replace('menu',''));
        });
        $('#view-quiz3').on('show.bs.modal', function(e){
            $('#tf-view-quiz-question').text(e.relatedTarget.textContent.replace('radio_button_checked',''));
            var options = quizData.tf[e.relatedTarget.textContent.replace('radio_button_checked','')];
            $('#tf-view-options').empty();
            Object.keys(options.options).forEach(function(key) {
                $('#tf-view-options').append('<h6> <input type="radio" class="mdl-radio__button" name="view-quiz-tf-modal" value="'+options.options[key]+'" >'+options.options[key] +'</h6>');
            });
        });
    });
}

function timer(timePerContributor, numberOfContributors, subtopicOrder, key){
    firebase.database().ref('branches/' + key).once('value', function(snapshot) {
        var exists = (snapshot.val() !== null);
        var user = $.cookie("user");
        if (exists) {
            $('#brain-feed-branch-content').empty();
            $('#contributors').empty();

            var template = $('#contribution').html();
            var html = Mustache.render(template, snapshot.val()["subtopics"][subtopicOrder[0]]);
            var output = $('#brain-feed-branch-content');
            output.append(html);

            $('#btn-confirm-brainstorming').attr('data-button', key);

            for(var contributor in snapshot.val()["contributors"]){
                var testimonialCheck = (snapshot.val()["contributors"][contributor][subtopicOrder[0]] !== undefined);
                if(testimonialCheck && contributor != user){
                    var contributorData = snapshot.val()["contributors"][contributor];
                    var template = $('#contributor').html();
                    var html = Mustache.render(template, contributorData);
                    var output = $('#contributors');
                    output.append(html);

                    document.getElementById("testimonial-" + contributor).textContent = snapshot.val()["contributors"][contributor][subtopicOrder[0]]["value"];
                }
            }

            $('#brain-feed-branch-content').append($('#contributors').html());
            subtopicOrder.shift();

            document.getElementById("countdowntimer").textContent = "";
            $("#countdowntimer").css('margin-left', '22.5%');
            var timeleft = timePerContributor;
            var timeout='Time over';

            var downloadTimer = setInterval(function(){
                if(timeleft == 0){
                    var subtopicValue = $('#brainstorming-subtopic').text().split(':')[1].trim();
                    var brainstormingValue = $('#brainstorming-area').val();

                    for(var subtopic in snapshot.val()["subtopics"]){
                        if(snapshot.val()["subtopics"][subtopic]["value"] == subtopicValue){
                            firebase.database().ref('branches/' + key + '/contributors/' + user).child(subtopic).set({
                                "value": brainstormingValue
                            });
                        }

                        $('#btn-confirm-brainstorming').attr('disabled', true);
                        $('#brainstorming-area').attr('disabled', true);
                    }

                    document.getElementById("countdowntimer").textContent = timeout;
                    $("#countdowntimer").css('margin-left', '15%');
                    numberOfContributors--;

                    if(subtopicOrder.length == 0){
                        $('#brain-feed-branch').hide();
                        $('#catalog').removeClass('hidden');

                        $('#branch-table-container').empty();
                        retrieveBranches();

                        var contributions = 0;
                        var subtopicNo = 0;

                        for(var subtopicKey in snapshot.val()["subtopics"]){
                            subtopicNo+=1;
                        }

                        for(var contributorKey in snapshot.val()["contributors"]){
                            var contributionsNo = 0;

                            for(var contributorSubKey in snapshot.val()["contributors"][contributorKey]){
                                contributionsNo+=1;
                            }

                            if(contributionsNo == 5){
                                if(contributionsNo-3 == subtopicNo){
                                    firebase.database().ref('branches/' +key + '/branch_status').set("completed");
                                }
                                if(contributionsNo-2 == subtopicNo){
                                    firebase.database().ref('branches/' +key + '/branch_status').set("completed");
                                }
                            }
                        }
                    }
                }
                if(timeleft > 0){
                    document.getElementById("countdowntimer").textContent = timeleft;
                }
                if(timeleft < 0) {
                    clearInterval(downloadTimer);
                }
                timeleft--;
            },1000);

            setTimeout(function() {
                if(numberOfContributors > 0){
                    timer(timePerContributor, numberOfContributors, subtopicOrder, key);
                }
            },(timePerContributor * 1000) + 2000);
        }
    });
}

function splitValue(value, index) {
    return value.substring(0, index) + "," + value.substring(index);
}

function profileTagsHandler(){
    $(document).on('click', '#add-branch-button, .add-branch-chip', function(){
        var user = $.cookie("user");
        var tag = prompt("Please something that you have background knowledge about:", "");
        if (!(tag == null || tag == "")) {
            var acronym = tag.substring(0, 2).toUpperCase();

            var branchRef = firebase.database().ref('users/' + user).child('branchTags');
            branchRef.child(tag).set({
                "value": tag,
                "acronym": acronym
            });

            retrieveProfileInformation();
        }
    });
}
