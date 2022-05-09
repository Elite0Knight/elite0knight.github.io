let experimentStage = -1; // -1 = before start, 0-2 = tests, 3 = screen with measured data
let stimulusCurrentlyVisible = false; // false -> user input is an error, true -> user can react to stimulus

let stimulusTimestamp; // time at which the stimulus last appeared (in milliseconds, see Date.now())
let timeoutsEx2 = [];

let times1 = []; // recorded reaction times in milliseconds
let times2 = []; // recorded reaction times in milliseconds
let times3 = []; // recorded reaction times in milliseconds

let orderOfTests = []; // order in which the tests will be presented to the user. // contains values from 0 to 2
let orderOfFood = []; // order in which the food will be presented to the user. // contains shuffeled values from 0 to 29
let foodLinks = []; // Links in the form of Strings to the images of food // 0-9:italien, 10-19:chinese, 20-29:mexican
let foodImage = document.querySelector('img');
let randomImage;

let iterationsOfCurrentTest = 0;
let maxIterations = 3;

// DOM elements
let timeElement = document.getElementById('timeOfLastExperiment');
let instructionElement = document.getElementById('instruction');
let instructionHelperElement = document.getElementById('instructionHelper');
let stimulusElement = document.getElementById('stimulus');
let contextElement = document.getElementById('context');
let progressElement = document.getElementById('progress');
let resultsElement = document.getElementById('results');

//exercise 1 elements
let ex1Elements = document.getElementById('ex1');
let ex1Circle = document.getElementById('circle1');

//exercise 2 elements
let ex2Elements = document.getElementById('ex2');
let ex2CircleRed = document.getElementById('circle2_red');
let ex2CircleYellow = document.getElementById('circle2_yellow');
let ex2TriangleRed = document.getElementById('triangle_red');
let ex2TriangleYellow = document.getElementById('triangle_yellow');

//exercise 3 elements
let ex3Elements = document.getElementById('ex3');

//code thats executed the first time the website is loaded
setup();

function setup() {
    for (let i = 0; i < 3; i++) {
        orderOfTests[i] = i + 1;
    }
    shuffle(orderOfTests);
    for (let i = 0; i < 29; i++) {
        orderOfFood[i] = i + 1;
    }
    shuffle(orderOfFood);
    fillFoodLinks();
    timeElement.hidden = true;
    resultsElement.hidden = true;
    ex1Elements.hidden = true;
    ex2Elements.hidden = true;
    ex3Elements.hidden = true;
    instructionHelperElement.hidden = true;
    times1.push("Experiment 1");
    times2.push("Experiment 2");
    times3.push("Experiment 3");
}

function error() {
    alert("Error");

    switch (orderOfTests[experimentStage]) {
        case 1:
            times1.push(-1);
            break;
        case 2:
            times2.push(-1);
            break;
        case 3:
            times3.push(-1);
            break;
        default:
            break;
    }

    console.log("error occured in experiment " + orderOfTests[experimentStage]);
    timeElement.textContent = 'Time: - ms';
}

function recordStimulusReactionTime() {
    let deltaTime = Date.now() - stimulusTimestamp;
    switch (orderOfTests[experimentStage]) {
        case 1:
            times1.push(deltaTime);
            break;
        case 2:
            times2.push(deltaTime);
            break;
        case 3:
            times3.push(deltaTime);
            break;
        default:
            break;
    }
    console.log("recorded time, completed iteration");
    timeElement.textContent = 'Time: ' + deltaTime + 'ms';
}

function executeIterationOfCurrentExperiment() {
    switch (orderOfTests[experimentStage]) {
        case 1:
            experiment1();
            break;
        case 2:
            experiment2();
            break;
        case 3:
            experiment3();
            break;
        default:
            console.log("Could not find a matching Experiment.");
            break;
    }
}

function nextExperiment() {
    while (timeoutsEx2.length > 0) {
        clearTimeout(timeoutsEx2.pop())
    }
    instructionHelperElement.hidden = true;
    experimentStage++;
    if (experimentStage < 3) {
        executeIterationOfCurrentExperiment();
    } else {
        instructionElement.hidden = true;
        instructionHelperElement.textContent = "Please send the collected Data to us via this mail adress: 'st167417@stud.uni-stuttgart.de'. Also, if you wish for your data to be evaluated by us, please include your age and gender in the mail, as we need to include this data in the documentation of our study design and analysis.";
        instructionHelperElement.hidden = false;
        timeElement.hidden = true;
        console.log("now: read out data from the times[] arrays.");
        createCSV();
    }
}

function experiment1() {
    instructionElement.textContent = "Press space when the circle appears!";
    // reset the elements for this experiment
    ex1Elements.hidden = false;
    stimulusCurrentlyVisible = false;
    ex1Circle.classList.add('fadeable');
    ex1Circle.classList.remove('fade');

    //set new random position
    ex1Circle.style.top = ((String)(Math.random() * 100)) + "%";
    ex1Circle.style.left = ((String)(Math.random() * 100)) + "%";

    // schedule the stimulus to appear after a random amount of time
    let timeToWaitInSeconds = Math.random() * 4 + 1; //1-5s
    setTimeout(unfade, timeToWaitInSeconds * 1000);
}

function unfade() {
    stimulusTimestamp = Date.now();
    stimulusCurrentlyVisible = true;
    ex1Circle.classList.add('fade');
}

function experiment2() {
    while (timeoutsEx2.length > 0) {
        clearTimeout(timeoutsEx2.pop())
    }
    instructionElement.textContent = "Press space only when a triangle appears!";
    // reset the elements for this experiment
    ex2Elements.hidden = false;
    ex2CircleRed.hidden = true;
    ex2CircleYellow.hidden = true;
    ex2TriangleRed.hidden = true;
    ex2TriangleYellow.hidden = true;
    stimulusCurrentlyVisible = false;

    // choose randomly the next item to display
    let randomObject = Math.random() * 4;
    console.log(randomObject);
    //choose randomly a new size for the upcoming element
    let size = Math.random() * 200 + 100;

    if (randomObject > 3) {
        setSize(ex2CircleRed, size.toString(), (size / 2).toString());
        makeVisibleAfterTime(ex2CircleRed);
    } else if (randomObject > 2) {
        setSize(ex2CircleYellow, size.toString(), (size / 2).toString());
        makeVisibleAfterTime(ex2CircleYellow);
    } else if (randomObject > 1) {
        setSize(ex2TriangleRed, size.toString(), (size / 2).toString());
        makeVisibleAfterTime(ex2TriangleRed);
    } else {
        setSize(ex2TriangleYellow, size.toString(), (size / 2).toString());
        makeVisibleAfterTime(ex2TriangleYellow);
    }
}

function setSize(object, size, halfSize) {
    if (object === ex2CircleRed || object === ex2CircleYellow) {
        object.style.width = size + "px";
        object.style.height = size + "px";
        object.style.borderRadius = halfSize + "px";
    }
    if (object === ex2TriangleRed || object === ex2TriangleYellow) {
        object.style.borderLeft = halfSize + "px solid transparent";
        object.style.borderRight = halfSize + "px solid transparent";
        object.style.borderBottom = size + "px solid rgb(255, 225, 0)";
    }
}

function makeVisibleAfterTime(object) {
    let timeToWaitInSeconds = Math.random() * 4 + 1; // 1-5s
    timeoutsEx2.push(setTimeout(unhide, timeToWaitInSeconds * 1000, object));

    function unhide(object) {
        object.hidden = false;
        stimulusTimestamp = Date.now();
        if (object === ex2TriangleRed || object === ex2TriangleYellow) {
            stimulusCurrentlyVisible = true;
        } else {
            timeoutsEx2.push(setTimeout(experiment2, 2000));
        }
    }
}

function experiment3() {
    instructionElement.textContent = "Press different keys based on the origin of the food!";
    instructionHelperElement.textContent = "('1' = Italien dish, '2' = Chinese dish, '3' = Mexican dish)";
    instructionHelperElement.hidden = false;
    // reset the elements for this experiment
    ex3Elements.hidden = false;
    //stimulusCurrentlyVisible does not need to be set, as there is no delay between the images

    // choose randomly the next item to display, randomImage gets assigned a random number between (inclusive) 0 and 29
    randomImage = Math.floor(Math.random() * 30);
    foodImage.setAttribute('src', foodLinks[randomImage]);
    stimulusTimestamp = Date.now();
}

function fillFoodLinks() {
    foodLinks[0] = "images/italien_0.png";
    foodLinks[1] = "images/italien_1.png";
    foodLinks[2] = "images/italien_2.png";
    foodLinks[3] = "images/italien_3.png";
    foodLinks[4] = "images/italien_4.png";
    foodLinks[5] = "images/italien_5.png";
    foodLinks[6] = "images/italien_6.png";
    foodLinks[7] = "images/italien_7.png";
    foodLinks[8] = "images/italien_8.png";
    foodLinks[9] = "images/italien_9.png";
    foodLinks[10] = "images/china_0.png";
    foodLinks[11] = "images/china_1.png";
    foodLinks[12] = "images/china_2.png";
    foodLinks[13] = "images/china_3.png";
    foodLinks[14] = "images/china_4.png";
    foodLinks[15] = "images/china_5.png";
    foodLinks[16] = "images/china_6.png";
    foodLinks[17] = "images/china_7.png";
    foodLinks[18] = "images/china_8.png";
    foodLinks[19] = "images/china_9.png";
    foodLinks[20] = "images/mexico_0.png";
    foodLinks[21] = "images/mexico_1.png";
    foodLinks[22] = "images/mexico_2.png";
    foodLinks[23] = "images/mexico_3.png";
    foodLinks[24] = "images/mexico_4.png";
    foodLinks[25] = "images/mexico_5.png";
    foodLinks[26] = "images/mexico_6.png";
    foodLinks[27] = "images/mexico_7.png";
    foodLinks[28] = "images/mexico_8.png";
    foodLinks[29] = "images/mexico_9.png";
}

function createCSV() {
    const matrix = [times1, times2, times3];
    const rows = transpose(matrix);
    //lines below are from stackoverflow
    let csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reactionTest.csv");
    document.body.appendChild(link); // Required for FF

    link.click();
}

//from stackoverflow
function transpose(a) {
    return Object.keys(a[0]).map(function (c) {
        return a.map(function (r) { return r[c]; });
    });
}

window.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        // the user pressed the space key
        if (experimentStage === -1) {
            // start the experiment if it wasn't active

            contextElement.hidden = true; // set the required elements for the experiments
            timeElement.hidden = false;

            nextExperiment();
            return;
        }

        if ((orderOfTests[experimentStage] === 1 || orderOfTests[experimentStage] === 2)) {

            if (!stimulusCurrentlyVisible) {
                error();
            } else {
                // record reaction time
                recordStimulusReactionTime();
            }

            iterationsOfCurrentTest++;
            // start next trial until condition of 30 iterations is met
            if (iterationsOfCurrentTest < maxIterations) {
                executeIterationOfCurrentExperiment();
            } else {
                progressElement.textContent = "Completed Reaction Tests: " + (experimentStage + 1).toString() + "/3";
                iterationsOfCurrentTest = 0;
                ex1Elements.hidden = true;
                ex2Elements.hidden = true;
                nextExperiment();
            }
        }

    } else if (event.key === '1' || event.key === '2' || event.key === '3') {
        if (orderOfTests[experimentStage] === 3) {

            if (randomImage < 10) {
                //presented image is italian, button 1 would be correct
                if (event.key === '1') {
                    recordStimulusReactionTime();
                } else {
                    error();
                }
            } else if (randomImage < 20) {
                //presented image is chinese, button 2 would be correct
                if (event.key === '2') {
                    recordStimulusReactionTime();
                } else {
                    error();
                }
            } else {
                //presented image is mexican, button 3 would be correct
                if (event.key === '3') {
                    recordStimulusReactionTime();
                } else {
                    error();
                }
            }

            iterationsOfCurrentTest++;
            // start next trial until condition of 30 iterations is met
            if (iterationsOfCurrentTest < maxIterations) {
                executeIterationOfCurrentExperiment();
            } else {
                progressElement.textContent = "Completed Reaction Tests: " + (experimentStage + 1).toString() + "/3";
                iterationsOfCurrentTest = 0;
                ex3Elements.hidden = true;
                instructionHelperElement.hidden = true;
                nextExperiment();
            }
        }
    }
});

// http://stackoverflow.com/questions/962802#962890
function shuffle(array) {
    var tmp, current, top = array.length;
    if (top) while (--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
    }
    return array;
}