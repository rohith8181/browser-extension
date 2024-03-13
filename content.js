let isCommandActive = false;
let spanstringlen = 1;

var ClickInput = "";

function simulateClick(element) {
    var event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
    });
    element.dispatchEvent(event);
}
function handleKeyDown(event) {
    if (isCommandActive && event.ctrlKey && event.key === '/') {
        isCommandActive = false;
        removeSpans();
    } else if (!isCommandActive && event.ctrlKey && event.key === '/') {
        isCommandActive = true;
        const ViewportTags = getTags();
        addspans(ViewportTags);
    } else if (isCommandActive) {
        ClickInput += event.key;
        if (ClickInput.length === spanstringlen) {
            const array = document.querySelectorAll('.no-pointer')
            for (let index = 0; index < array.length; index++) {
                if (array[index].textContent === ClickInput) {
                    var rect = array[index].getBoundingClientRect();
                    isCommandActive = false;
                    removeSpans();
                    var elementAtPosition = document.elementFromPoint(rect.left, rect.top);
                    simulateClick(elementAtPosition);
                    break;
                }
            }
            ClickInput = "";
        }
    }
}
function getTags() {
    var tags = document.querySelectorAll('a, button,input[type="submit"],[onclick]');
    var resultArray = [];
    tags.forEach((element, index) => {
        if (isInViewPort(element)) {
            resultArray.push(element);
        }
    })
    return resultArray;
}
function getEntiredimensions(element) {
    var rect = element.getBoundingClientRect();

    var scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    var scrollTop = window.scrollY || document.documentElement.scrollTop;

    var position = {
        top: rect.top + scrollTop,
        left: rect.left + scrollLeft
    };

    return position;
}
function getViewPortdimensions(element) {
    var rect = element.getBoundingClientRect();
    var position = {
        top: rect.top,
        left: rect.left,
        bottom: rect.bottom,
        right: rect.right,
    };

    return position;
}
function generateString(spanstringlen, number) {
    let result = '';
    if (spanstringlen == 1) {
        result += (String.fromCharCode(97 + number));
    } else if (spanstringlen == 2) {
        result += (String.fromCharCode(97 + number / 26));
        number = number % 26;
        result += (String.fromCharCode(97 + number));
    }
    return result;
}
function addspans(HtmlTags) {
    var pointerContainer = document.createElement('div');
    pointerContainer.id = 'pointer-container';
    document.body.appendChild(pointerContainer);
    const mainDiv = document.getElementById('pointer-container');
    if (HtmlTags.length > 25) {
        spanstringlen = 2;
    }
    HtmlTags.forEach((element, index) => {
        const positions = getEntiredimensions(element);

        const spanTag = document.createElement('span');
        spanTag.className = 'no-pointer'
        spanTag.style.background = 'red'
        spanTag.style.position = 'absolute'
        spanTag.style.paddingLeft = '3px'
        spanTag.style.paddingRight = '3px'
        spanTag.style.fontSize = '13px'
        spanTag.style.height = '15px'
        spanTag.style.color = 'white'
        spanTag.textContent = generateString(spanstringlen, index);
        spanTag.style.top = `${positions.top}px`
        spanTag.style.left = `${positions.left}px`
        spanTag.style.zIndex = '100'
        mainDiv.appendChild(spanTag);
    });
}
function removeSpans() {
    const mainContainer = document.getElementById('pointer-container');
    mainContainer.remove();
}
function isInViewPort(element) {
    var rect = getViewPortdimensions(element);
    return (
        rect.top > 0 &&
        rect.left > 0 &&
        rect.bottom < (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right < (window.innerWidth || document.documentElement.clientWidth)
    )
}


document.addEventListener('keydown', handleKeyDown);

