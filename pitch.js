class Word {
    constructor(word) {
        this.word = word;
        this.pitch = new Array(word.length).fill(false);
        this.last = false; // true if ending differs from pitch of last symbol
    }
  
    reset() {
        this.pitch = [];
        this.word = "";
        this.last = false;
    }
  
    setWord(word) {
        if (this.word !== word) {
            this.word = word;
            this.pitch = new Array(word.length).fill(false);
            this.last = false;
        }
    }
  
    setPitch(fromPos, toPos, pitch) {
        for (let x = fromPos; x < toPos; x++) {
            this.pitch[x] = pitch;
        }
        if (fromPos == this.word.length) {
            if (pitch != this.pitch[this.word.length-1]){
                this.last = true;
            } else {
                this.last = false;
            }
        }
    }
  
    toString() {
        var lastChange = 0;
        var right = "";
        let result = "";

        if (this.last) {
            // go through the word backwards
            for (let x = this.word.length-1; x > 0; x--) {
                if (this.pitch[x] != this.pitch[x-1]) {
                    lastChange = x;
                    break;
                }
            }
        }        
        
        if (lastChange == 0 && this.last) {
            right = "border-right: 1px dotted;";
        }

        if (this.word === "") {
            return result;
        }
        if (this.pitch[0]) {
            result = `<span style="border-top: 1px dotted; ${right}">${this.word[0]}`;
        } else {
            result = `<span style="border-bottom: 1px dotted; ${right}">${this.word[0]}`;
        }

        right = "";
        for (let x = 1; x < this.word.length; x++) {
            // used in the last run
            if (this.last && (x == lastChange)) {
                right = "border-right: 1px dotted;";
            }
            if (this.pitch[x] === this.pitch[x - 1]) {
                result += this.word[x];
            } else if (this.pitch[x]) {
                result += `</span><span style="border-top: 1px dotted; border-left: 1px dotted; ${right}">${this.word[x]}`;
            } else {
                result += `</span><span style="border-bottom: 1px dotted; border-left: 1px dotted; ${right}">${this.word[x]}`;
            }
        }
        result += '</span><br>';
        return result;
    }
}

// word object to manipulate
var word = new Word("");

// check if clipboard is usable

// Update result whenever input changes
const kanaInput = document.getElementById('kana');
const buttonUp = document.getElementById('btn_up');
const buttonDown = document.getElementById('btn_down');
const buttonReset = document.getElementById('btn_x');
const translationInput = document.getElementById('translation');
const outputRaw = document.getElementById('output-raw');
const outputExample = document.getElementById('preview_pitch');
const outputExampleTranslation = document.getElementById('preview_translation');
const buttonCopy = document.getElementById('btn_copy');

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
    outputExampleTranslation.value = "";
    word.setWord("");
    display();
}

const copyToClipboard = async () => {
    await navigator.clipboard.writeText(outputRaw.value);
}


// event listeners
kanaInput.addEventListener('input', inputHandler);
buttonUp.addEventListener('click', clickUp);
buttonDown.addEventListener('click', clickDown);
buttonReset.addEventListener('click', clickReset);
translationInput.addEventListener('input', inputHandler);
buttonCopy.addEventListener('click', copyToClipboard);

// functions
function display() {
    currentWord = word.toString();
    currentWord = currentWord.replace(/(?:\r\n|\r|\n)/g, '<br>');
    currentTranslation = String(translationInput.value).replace(/(?:\r\n|\r|\n)/g, '<br>');
    
    outputRaw.value = currentWord;
    outputExample.innerHTML = currentWord;
    outputExampleTranslation.value = currentTranslation;
    outputExampleTranslation.innerHTML = currentTranslation;
}

// draw in case anything was in the cache
if (kanaInput) {
    word.setWord(kanaInput.value);
    display();
}
