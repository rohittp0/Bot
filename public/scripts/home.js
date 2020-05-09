const WORD = "FLAMES";
const WORD_MAP = ["You are <big>F</big>riends", "You are <big>L</big>overs",
    "You have an <big>A</big>ffection", "You will <big>M</big>arry",
    "You are <big>E</big>nemies", "You are <big>S</big>iblings"
];

function getFlame(count, pos, text) {
    pos = (pos + count - 1) % text.length;
    return text.length > 1 ? getFlame(count, pos, text.slice(0, pos) + text.slice(pos + 1)) : text;
}

function getResult(text) {
    let count = 0;
    text = text.trim().toUpperCase();
    let reverse = text.split('').reverse().join('');

    for (let i = 0; i < text.length; i++)
        if (text.indexOf(text.charAt(i)) + reverse.indexOf(text.charAt(i)) == text.length - 1)
            count++;
    if (count < 1) return "You are the same person";
    return WORD_MAP[WORD.indexOf(getFlame(count, 0, WORD))];
}

{
    //------------------------Forntend----------------------
    //flip the card to the back and change UI
    const card = document.getElementsByClassName('card').item(0);
    const play = document.getElementById('btn-card-flip');
    const close = document.getElementById('close');
    const match = document.getElementById('btn-card-send');
    const result = document.getElementById('result');

    play.onclick = function () {
        // 'Play' button is pressed
        card.classList.add('flip');
        play.classList.add('hidden'); // 'Play' button goes invisible//
        close.classList.remove('hidden');
        match.classList.remove('hidden')
    };

    //send the card
    match.onclick = function () {
        document.getElementById('text').innerHTML =
            getResult(document.getElementsByTagName('input').item(0).value.trim() +
                document.getElementsByTagName('input').item(1).value.trim());
        // 'send' button is pushed
        card.classList.add('whoosh'); // slides card up out of view
        card.classList.add('hidden');
        result.classList.add('visible'); // show success message
        match.classList.add('hidden');
        close.classList.add('full')
        setTimeout(() => {
            document.getElementsByTagName('input').item(0).value = "";
            document.getElementsByTagName('input').item(1).value = "";
            card.classList.remove('whoosh');
        }, 2700); //scrub the input fields when card when is off canvas
    };

    //flip the card to the front and change UI
    close.onclick = function () {
        // 'close' button is pressed
        card.classList.remove('hidden');
        card.classList.remove("flip"); // card flips over
        play.classList.remove("hidden"); // 'customise' button becomes visible //
        match.classList.add("hidden"); // 'send/close' buttons go invisible //
        result.classList.remove("visible");
        close.classList.remove('full')
    };
}