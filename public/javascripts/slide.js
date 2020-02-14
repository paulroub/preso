document.body.addEventListener('keydown', (evt) => {
    if (evt.ctrlKey || evt.metaKey || evt.altKey) {
        return;
    }

    const code = evt.which;

    const forwards = [
        32, // space
        74, // j
        39, // right
        40, // down
        34 // pgdn
    ];
    const backs = [
        75, // k
        8, // backspace
        37, // left
        38, // up
        33 // pgup
    ];

    if (forwards.indexOf(code) >= 0) {
        evt.stopPropagation();
        evt.preventDefault();

        window.opener.moveNext();
    }
    else if (backs.indexOf(code) >= 0) {
        evt.stopPropagation();
        evt.preventDefault();

        window.opener.movePrev();
    }
});

function adjustHeight() { // eslint-disable-line no-unused-vars
    const winHeight = window.innerHeight;
    const slide = document.body;
    const slideHeight = slide.offsetHeight;

    const excess = (slideHeight + 1) - winHeight;
    const leeway = 10;

    if (excess <= leeway) {
        return;
    }

    const preBlocks = [...slide.querySelectorAll('pre')];

    const largest = preBlocks.reduce((prevLargest, pre) => {
        console.log(prevLargest);
        console.log(pre);

        if (prevLargest) {
            return pre.offsetHeight > prevLargest.offsetHeight ? pre : prevLargest;
        }

        return pre;
    }, null);

    if (largest) {
        const newHeight = Math.max(largest.offsetHeight - excess, 100);

        if (newHeight < largest.offsetHeight) {
            largest.style.height = `${newHeight}px`;
        }
    }
}
