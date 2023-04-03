const emojisSad = document.querySelectorAll(".emoji--sad--1")
for(let emojiSad of emojisSad)
    if (emojiSad) {
        emojiSad.onmouseover = (event) => {
            emojiSad.classList.add("animated-sad")
            
        }
        emojiSad.onmouseout = (event) => {
            emojiSad.classList.remove("animated-sad")
            
        }
    }

const emojisLowSad = document.querySelectorAll(".emoji--angry")
for(let emojiLowSad of emojisLowSad)
    if (emojiLowSad) {
        emojiLowSad.onmouseover = (event) => {
            emojiLowSad.classList.add("animated-low-sad")
        }
        emojiLowSad.onmouseout = (event) => {
            emojiLowSad.classList.remove("animated-low-sad")
        }
    }

const emojisGetHappy = document.querySelectorAll(".emoji--sad--3")
for(let emojiGetHappy of emojisGetHappy)
    if (emojiGetHappy) {
        emojiGetHappy.onmouseover = (event) => {
            emojiGetHappy.classList.add("animated-low-sad")
        }
        emojiGetHappy.onmouseout = (event) => {
            emojiGetHappy.classList.remove("animated-low-sad")
        }
    }

const emojisHappy = document.querySelectorAll(".emoji--yay-2")
for(let emojiHappy of emojisHappy)
    if (emojiHappy) {
        
        emojiHappy.onmouseover = (event) => {
            emojiHappy.classList.add("animated-happy")
        }
        emojiHappy.onmouseout = (event) => {
        
            emojiHappy.classList.remove("animated-happy")
        }
    }

const emojisVeryHappy = document.querySelectorAll(".emoji--yay")
for(let emojiVeryHappy of emojisVeryHappy)
    if (emojiVeryHappy) {
    
        emojiVeryHappy.onmouseover = (event) => {
            
            emojiVeryHappy.classList.add("animated-very-happy")
        }
        emojiVeryHappy.onmouseout = (event) => {
            
            emojiVeryHappy.classList.remove("animated-very-happy")
        }
    }