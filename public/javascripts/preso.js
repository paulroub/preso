let presWindow = null;
const slides = document.getElementsByClassName('slide');
let current = -1;

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

        moveNext();
    }
    else if (backs.indexOf(code) >= 0) {
        evt.stopPropagation();
        evt.preventDefault();

        movePrev();
    }
});


function moveNext() {
    const nextSlide = current + 1;
    const isNextSlide = nextSlide < slides.length;

    const nextHiddenItem = slides[current].querySelector('.hidden');

    if (nextHiddenItem) {
        nextHiddenItem.classList.remove('hidden');
        loadSlide(current);
    }
    else if (isNextSlide) {
        current = nextSlide;
        loadSlide(current, true);
    }
}

function movePrev() {
    const prevSlide = current - 1;
    const isPrevSlide = prevSlide >= 0;

    const unHidden = [...slides[current].querySelectorAll('.step')]
        .filter((item) => {
            return !item.classList.contains('hidden');
        });
    const areUnHidden = unHidden.length > 0;

    if (areUnHidden) {
        unHidden[unHidden.length - 1].classList.add('hidden');
        loadSlide(current);
    }
    else if (isPrevSlide) {
        current = prevSlide;
        loadSlide(current);
    }
}

function activate(slide) {
    checkout(slide.getAttribute('data-sha'));

    showSlide(slide);

    setTimeout(() => {
        window.focus();
    }, 100);
}

function checkout(sha) {
    if (sha) {
        const checkoutUrl = `/git/checkout?sha=${sha}`;

        ajax(checkoutUrl,
            null,
            (error) => {
                console.log(`shit: ${error}`);
            });
    }
}

function showSlideContents(slide, win) {
    const content = slide.querySelector('.slidecontent');
    const header = slide.querySelector('h2');

    const title = header ? header.innerHTML : 'Presentation';

    const demos = content.querySelectorAll('.showaclock');

    [...demos].forEach((block) => {
        block.innerHTML = '<iframe src="http://localhost:3000/tddmash/demo.html"/>';
    });

    const body = content.innerHTML;

    win.document.title = title;
    win.document.body.innerHTML = body;

    [...win.document.querySelectorAll('pre code')].forEach((block) => {
        cleanCodeBlock(win, block);
    });
}


function cleanCodeBlock(win, block) {
    const rawHtml = block.innerHTML;
    const cleaned = rawHtml
        .replace(/^[ \t\n]+/, '')
        .replace(/[ \t\n]+$/, '');

    block.innerHTML = cleaned;
    win.hljs.highlightBlock(block);
}

function showSlide(slide) {
    if (presWindow) {
        showSlideContents(slide, presWindow);
    }
    else {
        presWindow = window.open('/slideshell.html', 'tddpres');

        setTimeout(() => {
            showSlideContents(slide, presWindow);
        }, 1000);
    }
}

function ajax(url, success, failure) {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
        const DONE = 4;
        const OK = 200;

        if (xhr.readyState === DONE) {
            if (xhr.status === OK) {
                if (success) {
                    success(xhr.responseText);
                }
            }
            else if (failure) {
                failure(xhr.status);
            }
        }
    };
    xhr.open('GET', url);
    xhr.send(null);
}

function loadSlide(slideNo, hideLists) {
    const slide = slides[slideNo];

    window.history.replaceState({ slide: slideNo }, `Slide ${slideNo}`, `?slide=${slideNo}`);

    for (let i = 0; i < slides.length; ++i) {
        if (i !== slideNo) {
            slides[i].style.display = 'none';
        }
    }

    slide.style.display = 'flex';

    current = slideNo;

    if (hideLists) {
        const items = [...slide.querySelectorAll('.step')];

        items.forEach((item) => {
            item.classList.add('hidden');
        });
    }

    activate(slide);
}


function queryParam(name) {
    const str = (window.location.search || '').replace(/^\?/, '');
    const parts = str.split(/&/);

    let result = '';

    parts.forEach((part) => {
        const pair = part.split('=');

        if (pair[0] === name) {
            result = pair[1] || '';
        }
    });

    return result;
}

const slideNo = queryParam('slide') || '0';

loadSlide(Number(slideNo), true);
