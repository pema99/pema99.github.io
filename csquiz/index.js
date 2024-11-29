
const urlParams = new URLSearchParams(window.location.search);

function pickRandomQuestion() {
    var candidates = [];
    for (let i = 0; i < questions.length; i++) {
        if (!localStorage.getItem(`question-${i}`)) {
            candidates.push(i);
        }
    }
    if (candidates.length === 0) {
        return Math.floor(Math.random() * questions.length);
    }
    return candidates[Math.floor(Math.random() * candidates.length)];
}

// get num or pick a random number
const num = urlParams.get('num') || pickRandomQuestion();

function updateAnswered() {
    let answered = 0;
    for (let i = 0; i < questions.length; i++) {
        if (localStorage.getItem(`question-${i}`)) {
            answered++;
        }
    }
    document.getElementById("answered").innerHTML = answered;
}

document.getElementById("total").innerHTML = questions.length;
updateAnswered();


document.getElementById("button-submit").addEventListener("click", function() {
    const answer = document.getElementById("text-output").value;
    if (answer === questions[num].answer) {
        document.getElementById("explanation-alert").classList.remove("d-none");
        document.getElementById("explanation-correct").classList.remove("d-none");
        document.getElementById("incorrect").classList.add("d-none");
        document.getElementById("nav").classList.add("d-none");

        document.getElementById("explanation-content").innerHTML = questions[num].explanation;

        // Save that the user has answered this specific question
        localStorage.setItem(`question-${num}`, true);
        updateAnswered();
    } else {
        document.getElementById("incorrect").classList.remove("d-none");
    }
});

document.getElementById("button-reveal").addEventListener("click", function() {
    document.getElementById("explanation-alert").classList.remove("d-none");
    document.getElementById("incorrect").classList.add("d-none");
    document.getElementById("nav").classList.add("d-none");

    document.getElementById("text-output").value = questions[num].answer;

    document.getElementById("explanation-content").innerHTML = questions[num].explanation;
});

document.getElementById("button-hint").addEventListener("click", function() {
    document.getElementById("hint-alert").classList.remove("d-none");
    document.getElementById("hint-content").innerHTML = questions[num].hint;
});

document.getElementById("button-skip").addEventListener("click", function() {
    window.location.href = `?num=${Math.floor(Math.random() * questions.length)}`;
});

document.getElementById("button-next").addEventListener("click", function() {
    window.location.href = `?num=${Math.floor(Math.random() * questions.length)}`;
});

document.getElementById("code-box").innerHTML = questions[num].question;
