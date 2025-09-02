const btnEmosongi = document.getElementById('btnEmosongi');
const formEmojis = document.getElementById('formEmojis');
const feedback = document.getElementById('feedback');

window.addEventListener('pageshow', function(event) {

    if (event.persisted) {

        if(btnEmosongi.disabled) {

            enableButtonInteraction();
        }
    }
});

function resetFeedbackText() {

    feedback.innerText = '';
}

function disableButtonInteraction() {

    btnEmosongi.innerHTML = "Loading... <span class='inline-flex'><svg class='w-6 h-6 stroke-pink-400 animate-spin' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><g><path d='M14.6437 2.05426C11.9803 1.2966 9.01686 1.64245 6.50315 3.25548C1.85499 6.23817 0.504864 12.4242 3.48756 17.0724C6.47025 21.7205 12.6563 23.0706 17.3044 20.088C20.4971 18.0393 22.1338 14.4793 21.8792 10.9444' stroke='stroke-current' stroke-width='3.4' stroke-linecap='round'></path></g></svg></span>";
    btnEmosongi.toggleAttribute('disabled');
    btnEmosongi.classList.remove('bg-indigo-500');
    btnEmosongi.classList.remove('hover:bg-fuchsia-500');
    btnEmosongi.classList.add('bg-gray-600');
    resetFeedbackText();
}

 function enableButtonInteraction() {

     btnEmosongi.innerText = 'Give me a song';
     btnEmosongi.toggleAttribute('disabled');
     btnEmosongi.classList.add('bg-indigo-500');
     btnEmosongi.classList.add('hover:bg-fuchsia-500');
     btnEmosongi.classList.remove('bg-gray-600');
     resetFeedbackText();
 }

 function validateEmojiSelection() {

     const radioButtons = document.getElementsByName('my_emotion');
     let isSelected = false;

     for (let i = 0; i < radioButtons.length; i++) {

         if (radioButtons[i].checked) {

             isSelected = true;
             break;
         }
     }

     if (!isSelected) {

         feedback.innerText = 'Please select one emoji and then click "Give me a song" at the top to obtain a song recommendation.';
         return false;
     }

     disableButtonInteraction();
     return true;
 }