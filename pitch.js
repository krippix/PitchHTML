class Word {
    constructor(word) {
        this.word = word;
        this.pitch = new Array(word.length).fill(false);
    }
  
    reset() {
        this.pitch = [];
        this.word = "";
    }
  
    setWord(word) {
        if (this.word !== word) {
            this.word = word;
            this.pitch = new Array(word.length).fill(false);
        }
    }
  
    setPitch(fromPos, toPos, pitch) {
        for (let x = fromPos; x < toPos; x++) {
            this.pitch[x] = pitch;
        }
    }
  
    toString() {
        let result = "";
        if (this.word === "") {
            return result;
        }
        if (this.pitch[0]) {
            result = `<span style="border-top: 1px dotted;">${this.word[0]}`;
        } else {
            result = `<span style="border-bottom: 1px dotted;">${this.word[0]}`;
        }
        for (let x = 1; x < this.word.length; x++) {
            if (this.pitch[x] === this.pitch[x - 1]) {
                result += this.word[x];
            } else if (this.pitch[x]) {
                result += `</span><span style="border-top: 1px dotted; border-left: 1px dotted">${this.word[x]}`;
            } else {
                result += `</span><span style="border-bottom: 1px dotted; border-left: 1px dotted">${this.word[x]}`;
            }
        }
        result += '</span><br>';
        return result;
    }
}

// word object to manipulate
var word = new Word("");

// Update result whenever input changes
const kanaInput        = document.getElementById('kana');
const buttonUp         = document.getElementById('up');
const buttonDown       = document.getElementById('down');
const buttonReset      = document.getElementById('button-reset');
const translationInput = document.getElementById('translation');
const outputRaw        = document.getElementById('output-raw');
const outputExample    = document.getElementById('preview');

// handler
const inputHandler = function() {
    word.setWord(kanaInput.value);
    display();
};

const clickUp = function() {
    word.setPitch(kanaInput.selectionStart, kanaInput.selectionEnd, true);
    display();
};

const clickDown = function() {
    word.setPitch(kanaInput.selectionStart, kanaInput.selectionEnd, false);
    display();
};

const clickReset = function() {
    kanaInput.value = "";
    translationInput.value = "";
    outputRaw.value = "";
    outputExample.value = "";
    word.setWord("");
    display();
}


// event listeners
kanaInput.addEventListener('input', inputHandler);
buttonUp.addEventListener('click', clickUp);
buttonDown.addEventListener('click', clickDown);
buttonReset.addEventListener('click', clickReset);
translationInput.addEventListener('input', inputHandler);

// functions
function display() {
    currentWord = word.toString()+String(translationInput.value);
    currentWord = currentWord.replace(/(?:\r\n|\r|\n)/g, '<br>');
    outputRaw.value         = currentWord;
    outputExample.innerHTML = currentWord;
    console.log(outputRaw.scrollHeight);
    outputRaw.style.height = outputRaw.scrollHeight;
}

// draw in case anything was in the cache
if (kanaInput) {
    word.setWord(kanaInput.value);
    display();
}

/*
function moveUp() {
    console.log(window.getSelection());
    var textbox1 = document.getElementById("kana");
    var textbox2 = document.getElementById("translation");
    var outputTextbox = document.querySelector(".output-textbox");
    
    outputTextbox.value = textbox1.value + "\n" + textbox2.value;
}

function moveDown() {
    var textbox1 = document.getElementById("kana");
    var textbox2 = document.getElementById("translation");
    var outputTextbox = document.querySelector(".output-textbox");
    
    outputTextbox.value = textbox2.value + "\n" + textbox1.value;
}
*/