'use strict';

document.addEventListener('DOMContentLoaded', function emosongiApp() {

    const formEmojis = document.getElementById('formEmojis');
    const emojis = document.getElementsByName('my-emotion');
    const secret = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    const recommendationDialog = document.getElementById('recommendation-dialog');
    const errorDialog = document.getElementById('error-dialog');
    const emosongiLegend = document.getElementById('emosongi-fieldset-legend');
    const song = document.getElementById('sing-a-song');
    const artist = document.getElementById('artist');
    const errorEmoji = document.getElementById('error-emoji');
    const errorMessage = document.getElementById('error-message');

    let controller;
    let isNewEmosongiRequest = true

    function emosongi(event) {

        if(isNewEmosongiRequest) {

            isNewEmosongiRequest = false;
            controller = new AbortController();

            const request = new Request('/emosongi/recommend/', {

                method: 'POST',
                headers: {
                    'X-CSRFToken': secret,
                    'Accept': 'application/json'
                },
                body: new URLSearchParams(new FormData(formEmojis)),
                mode: 'same-origin',
                signal: controller.signal
            });

            
            fetch(request).then(function processResponse(response) {

                if(response.ok) {

                    response.json().then(function processData(data) {

                        const music = JSON.parse(JSON.stringify(data));

                        song.innerText = music.song;
                        artist.innerText = music.singer;
                        recommendationDialog.showModal();
                    });
                } else {

                    switch(response.status) {
                        case 401:
                            errorEmoji.innerText = String.fromCodePoint('128683');
                            errorMessage.innerText = 'UNAUTHORIZED';
                            break;
                        case 402:
                            errorEmoji.innerText = String.fromCodePoint('128176');
                            errorMessage.innerText = 'PAYMENT REQUIRED';
                            break;
                        case 429:
                            errorEmoji.innerText = String.fromCodePoint('127881');
                            errorMessage.innerText = 'TOO MANY REQUESTS';
                            break;
                        default:
                            errorEmoji.innerText = String.fromCodePoint('128165');
                            errorMessage.innerText = 'BROKEN APPLICATION';
                    }

                    errorDialog.showModal();
                }
            }).catch(error => {

                    if(error.name === 'AbortError') {

                        console.log('Emosongi request has been cancelled.');
                    } else {

                        console.log('Error');
                        console.log(error);
                    }
            });

        } else {

            controller.abort();
            isNewEmosongiRequest = true;
            emosongi.call(this, event);
            event.preventDefault();
        }

        event.preventDefault();
    }

    function submitForm(event) {

        giveUserLoadingVisualClue();
        formEmojis.requestSubmit();
    }

    function giveUserLoadingVisualClue() {

        emosongiLegend.innerText = 'Loading...';
        emosongiLegend.classList.toggle('emosongi-fieldset-legend-loading');
    }

    emojis.forEach(function addInteraction(emoji) {

        emoji.addEventListener('click', submitForm);

    });

    function cleanEmosongi() {

        emosongiLegend.innerText = 'Emosongi';
        emosongiLegend.classList.toggle('emosongi-fieldset-legend-loading');
        formEmojis.reset();
    }

    formEmojis.addEventListener('submit', emosongi);
});
