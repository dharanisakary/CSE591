$(document).ready(function() {

    timer2();


});

function timer2(){
    var countdownNumberEl = document.getElementById('countdown-number');
    var countdown = 4;
    countdownNumberEl.textContent = countdown;

    setInterval(function() {
        // countdown = --countdown <= 0 ? 10 : countdown;
        countdown--;
        if(countdown>=0){
            countdownNumberEl.textContent = countdown;
        }

        if(timeleft <= 0)
            clearInterval(downloadTimer);
        // $('circle').css({animation:'none'});
    }, 1000);

}

