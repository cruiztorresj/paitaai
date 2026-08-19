'use strict';

document.addEventListener('DOMContentLoaded', function emosongiApp() {

    const LOADING_CSS_CLASS = 'emosongi-fieldset-legend-loading';
    const RESULTS_EMOJIS = '\u{1F3A7} \u{1F3B9} \u{1F941} \u{1F3B8} \u{1FA88}';

    const formEmojis = document.getElementById('formEmojis');
    const emojis = document.getElementsByName('my-emotion');
    const secret = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    const resultsDialog = document.getElementById('results-dialog');
    const emosongiLegend = document.getElementById('emosongi-fieldset-legend');
    const song = document.getElementById('sing-a-song');
    const artist = document.getElementById('artist');
    const extraInfo = document.getElementById('extra-info');

    let controller;
    let isNewEmosongiRequest = true

    function emosongi(event) {

        if(isNewEmosongiRequest) {

            giveUserLoadingVisualClue();
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
                        extraInfo.innerText = RESULTS_EMOJIS;
                        artist.innerText = music.singer;
                        updateDialogBackdrop('error-dialog-backdrop', 'good-dialog-backdrop');
                        resultsDialog.showModal();
                    });
                } else {

                    switch(response.status) {
                        case 401:
                            extraInfo.innerText = String.fromCodePoint('128683');
                            artist.innerText = 'UNAUTHORIZED';
                            break;
                        case 402:
                            extraInfo.innerText = String.fromCodePoint('128176');
                            artist.innerText = 'PAYMENT REQUIRED';
                            break;
                        case 429:
                            extraInfo.innerText = String.fromCodePoint('127881');
                            artist.innerText = 'TOO MANY REQUESTS';
                            break;
                        default:
                            extraInfo.innerText = String.fromCodePoint('128165');
                            artist.innerText = 'BROKEN APPLICATION';
                    }

                    song.innerText = '';
                    updateDialogBackdrop('good-dialog-backdrop', 'error-dialog-backdrop');
                    resultsDialog.showModal();
                }
            }).catch(error => {

                    if(error.name === 'AbortError') {

                        console.log('Emosongi request has been cancelled.');
                    } else {

                        console.log('Error');
                    }
            });

        } else {

            controller.abort();
            cleanLegend();
            isNewEmosongiRequest = true;

            setTimeout(() => {
                emosongi.call(this, event);
            }, 150);

            event.preventDefault();
        }

        event.preventDefault();
    }

    function updateDialogBackdrop(oldBackdrop, newBackdrop) {

        resultsDialog.classList.remove(oldBackdrop);
        resultsDialog.classList.add(newBackdrop);
    }

    function submitForm(event) {

        formEmojis.requestSubmit();
    }

    function giveUserLoadingVisualClue() {

        emosongiLegend.innerText = 'Loading...';
        emosongiLegend.classList.add(LOADING_CSS_CLASS);
    }

    function cleanEmosongi() {

        cleanLegend();
        formEmojis.reset();
    }

    function cleanLegend() {

        emosongiLegend.innerText = 'Emosongi';
        emosongiLegend.classList.remove(LOADING_CSS_CLASS);
    }

    function resetEmosongiForm() {

        formEmojis.reset();
    }

    emojis.forEach(function addInteraction(emoji) {

        emoji.addEventListener('click', submitForm);

    });

    formEmojis.addEventListener('submit', emosongi);

    resultsDialog.addEventListener('close', cleanEmosongi);
});
