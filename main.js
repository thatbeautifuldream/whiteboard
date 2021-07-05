// Getting the canvas
const board = document.getElementById('canvas');
board.height = window.innerHeight - 10;
board.width = window.innerWidth - 20;
const ctx = board.getContext('2d');
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.lineJoin = "round";
ctx.lineCap = "round";
let active = "";
let color = "";
let working = false;
let x_initial, y_initial;
let flag = 0;
const undoStack = [];
const redoStack = [];
// Pencil Input........
const pencil = document.querySelector('.slider-pencil');
// Thickness of pencil
ctx.lineWidth = pencil.value;
let pencilWidth = pencil.value;

// Updating the thickness of the pencil on changing pencil input slider
pencil.oninput = () => {
    pencilWidth = pencil.value
    if (active === 'marker') {
        ctx.lineWidth = pencil.value;
    }
}
const theme = document.querySelector("#theme")

theme.addEventListener('click', () => {
        ctx.fillStyle = "Black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        theme.classList.toggle("fa-sun");
        theme.classList.toggle("fa-moon");

        if (theme.classList.contains("fa-moon")) {
            console.log(theme);
            ctx.fillStyle = "White";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            // theme.classList.toggle("fa-moon")
        }
        // document.body.classList.toggle("fa-sun");
    })
    // Eraser Input.......
const eraser = document.querySelector('.slider-eraser');
// Thickness of eraser
ctx.lineWidth = eraser.value;
let eraserWidth = eraser.value;

// Updating the thickness of the eraser on changing eraser input silder
eraser.oninput = () => {
    eraserWidth = eraser.value;
    if (active === 'eraser') {
        ctx.lineWidth = eraser.value;
    }
}

// Changing the strokestyle color
document.querySelector('.dropdown-content').addEventListener('click', (e) => {
    console.log(e.target.parentElement.getAttribute('value'));
    ctx.strokeStyle = e.target.parentElement.getAttribute('value');
})

// Handling event when pencil is clicked
document.querySelector('.fa-marker').addEventListener('click', () => {
    // If Eraser is active
    if (active !== "" && active !== "marker") {
        working = false;
        document.querySelector('.active').classList.remove('active');
        ctx.strokeStyle = 'black';
        active = "";
    }
    ctx.lineWidth = pencilWidth;
    // Toggling pencil button
    working = !working;
    color = 'not-white';

    // If pencil is turned on
    if (working === true) {
        document.querySelector('.fa-marker').classList.add('active');
        active = 'marker';
    }
    // If pencil is turned off
    else {
        document.querySelector('.fa-marker').classList.remove('active');
        active = "";
    }
});

// Handling event when eraser is clicked
document.querySelector('.fa-eraser').addEventListener('click', () => {
    // Pencil is active
    if (active !== "" && active !== 'eraser') {
        working = false;
        document.querySelector('.active').classList.remove('active');
        active = "";
    }

    ctx.lineWidth = eraserWidth;
    // Toggling eraser button
    working = !working;
    color = 'white';

    // If eraser is turned on
    if (working === true) {
        document.querySelector('.fa-eraser').classList.add('active');
        active = 'eraser';
        ctx.strokeStyle = 'white';
    } else {
        document.querySelector('.fa-eraser').classList.remove('active');
        active = "";
        ctx.strokeStyle = 'black';
    }
});

// Drawing on the screen

// Setting initial values when the event mousedown is occured on the board
document.getElementById('canvas').addEventListener('mousedown', (e) => {
    ctx.beginPath();
    const DOMRect = board.getBoundingClientRect();
    x_initial = e.clientX - DOMRect.left;
    y_initial = e.clientY - DOMRect.top;
    const x = x_initial;
    const y = y_initial;
    flag = 1;

    const point = {
        x,
        y,
        color: ctx.strokeStyle,
        width: ctx.lineWidth,
        type: 'begin'
    };

    // Push the properties of initial point into the undo stack
    undoStack.push(point);
});

// Capturing the mousemove event on board
document.getElementById('canvas').addEventListener('mousemove', (e) => {
    if (flag === 1 && working === true) {
        if (color === 'white')
            ctx.strokeStyle = 'white';

        const DOMRect = board.getBoundingClientRect();
        const x = e.clientX - DOMRect.left;
        const y = e.clientY - DOMRect.top;

        // Creating line from initial to current position
        ctx.moveTo(x_initial, y_initial);
        ctx.lineTo(x, y);
        ctx.stroke();

        // Setting previous position equal to the current position
        x_initial = x;
        y_initial = y;

        const point = {
            x,
            y,
            color: ctx.strokeStyle,
            width: ctx.lineWidth,
            type: 'end'
        }

        // Pushing the properties of the current position into the undoStack
        undoStack.push(point);
    }
});

// Capturing the event of mouseup
document.getElementById('canvas').addEventListener('mouseup', (e) => {
    flag = 0;
});

// Clear All
document.querySelector('.fa-trash').addEventListener('click', () => {
    // Clearing the canvas 
    ctx.clearRect(0, 0, board.width, board.height);
    // Clearing the image
    if (document.querySelector('img'))
        document.querySelector('img').remove();
    // Clearing the sticky note
    if (document.querySelector('.sticky-note')) {
        document.querySelector('.sticky-note').style.display = 'none';
        document.querySelector('.fa-sticky-note').classList.remove('active');
    }
    // document.querySelector('.active').classList.remove('active');
    // active = "";
    // working = false;
});

// Sticky Note

const stickyNote = document.querySelector('.sticky-note');
const note = document.querySelector('.note-text');

// Displayig the sticky note on the screen
document.querySelector('.fa-sticky-note').addEventListener('click', () => {
    stickyNote.style.display = 'block';
    document.querySelector('.fa-sticky-note').classList.add('active');
});

// Minimizing and maximimzing the sticky note
document.querySelector('.min-note').addEventListener('click', () => {
    //Minimize
    console.log('note');
    if (note.style.display === 'block')
        note.style.display = 'none';
    //Maximize
    else if (note.style.display = 'none')
        note.style.display = 'block';
});

// Closing the sticky note
document.querySelector('.close-note').addEventListener('click', () => {
    stickyNote.style.display = 'none';
    note.value = '';
    document.querySelector('.fa-sticky-note').classList.remove('active');
});

// Moving the sticky note

let stickyX_inital, stickyY_initial;
let stickyPressed = false;

// When mouse is pressed down on sticky-note
document.querySelector('.sticky-note').addEventListener('mousedown', (e) => {
    stickyX_inital = e.clientX;
    stickyY_inital = e.clientY;
    stickyPressed = true;
});

// Handling the event of mousemove
document.querySelector('.sticky-note').addEventListener('mousemove', (e) => {
    if (stickyPressed === true) {
        const stickyX_final = e.clientX;
        const stickyY_final = e.clientY;
        const distX = stickyX_final - stickyX_inital;
        const distY = stickyY_final - stickyY_inital;
        const DOMRect = stickyNote.getBoundingClientRect();
        stickyNote.style.top = DOMRect.top + distY + 'px';
        stickyNote.style.left = DOMRect.left + distX + 'px';
        stickyX_inital = stickyX_final;
        stickyY_inital = stickyY_final;
    }
});

let imageX_inital, imageY_initial;
let imagePressed = false;


document.addEventListener('mouseup', () => {
    console.log('mouseup');
    stickyPressed = false;
});

// For Downloading
document.querySelector('.fa-download').addEventListener('click', () => {
    const el = document.createElement('a');
    el.href = board.toDataURL();
    console.log(el.href);
    el.download = 'image.png';
    el.click();
});

// Undo..................
let interval;

// Starting undo
document.querySelector('.undo').addEventListener('mousedown', () => {
    if (undoStack.length > 0) {
        interval = setInterval(() => {
            if (undoStack.length === 0)
                return;
            // Pop Out the last acrion from undoStack and push it into the redostack
            redoStack.push(undoStack.pop());
            reDraw();
        }, 0)
    }
});

// Ending undo
document.querySelector('.undo').addEventListener('mouseup', () => {
    clearInterval(interval);
});

// Redo................

// Starting redo
document.querySelector('.redo').addEventListener('mousedown', () => {
    if (redoStack.length > 0) {
        interval = setInterval(() => {
            if (redoStack.length === 0)
                return;
            // Pop Out the last acrion from undoStack and push it into the redostack
            undoStack.push(redoStack.pop());
            reDraw();
        }, 0)
    }
});

// Ending redo
document.querySelector('.redo').addEventListener('mouseup', () => {
    clearInterval(interval);
});

// Undo Redo Logic
// ReDraw the entire text after the last action has been popped out
function reDraw() {
    // For the first action
    if (undoStack.length === 0)
        return;
    ctx.clearRect(0, 0, board.width, board.height);
    undoStack.forEach(el => {
        const point = el;

        ctx.lineWidth = point.width;
        ctx.color = point.color;

        if (point.type === 'begin') {
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
        } else if (point.type === 'end') {
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
        }
    })
}