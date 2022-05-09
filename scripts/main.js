let experimentStage = -1; // -1 = before start, 0-2 = tests, 3 = screen with measured data
let stimulusCurrentlyVisible = false; // false -> user input is an error, true -> user can react to stimulus

let stimulusTimestamp; // time at which the stimulus last appeared (in milliseconds, see Date.now())

let times1 = []; // recorded reaction times in milliseconds
let times2 = []; // recorded reaction times in milliseconds
let times3 = []; // recorded reaction times in milliseconds

let orderOfTests = []; // order in which the tests will be presented to the user. // contains values from 0 to 2
let orderOfFood = []; // order in which the food will be presented to the user. // contains values from 0 to 29

let iterationsOfCurrentTest = 0;

// DOM elements
let timeElement = document.getElementById('timeOfLastExperiment');
let instructionElement = document.getElementById('instruction');
let stimulusElement = document.getElementById('stimulus');
let contextElement = document.getElementById('context');
let progressElement = document.getElementById('progress');
let resultsElement = document.getElementById('results');

let ex1Elements = document.getElementById('ex1');
let ex1Circle = document.getElementById('circle1');
let ex2Elements = document.getElementById('ex2');
let ex3Elements = document.getElementById('ex3');

//code thats executed the first time the website is loaded
setup();

function setup() {
    for (let i = 0; i < 3; i++) {
        orderOfTests[i] = i + 1;
    }
    shuffle(orderOfTests);
    timeElement.hidden = true;
    resultsElement.hidden = true;
    ex2Elements.hidden = true;
    ex3Elements.hidden = true;
    ex1Elements.hidden = true;
}

function getMean(data) {
    let sum = 0;
    for (let value of data) sum += value;
    return sum / data.length;
}

function getStandardDeviation(data) {
    let mean = getMean(data);
    let squareSum = 0;
    for (let value of data) squareSum += (value - mean) ** 2;
    return Math.sqrt(squareSum / data.length);
}

function showResults() {
    let meanDeltaTime = getMean(times1);
    let stdDev = getStandardDeviation(times1);

    /*
    countElement.textContent = 'Count: ' + times1.length;
    meanElement.textContent = 'Mean: ' + Math.round(meanDeltaTime) + ' ms';
    stdDevElement.textContent = 'SD: ' + Math.round(stdDev) + ' ms';
    */
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
    console.log("hii");
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
    experimentStage++;
    executeIterationOfCurrentExperiment();
}

function experiment1() {
    // reset the elements for this experiment
    ex1Elements.hidden = false;
    instructionElement.textContent = "Press space when the circle appeares!";
    stimulusCurrentlyVisible = false;
    ex1Circle.classList.add('fadeable');
    ex1Circle.classList.remove('fade');

    // schedule the stimulus to appear after a random amount of time
    let timeToWaitInSeconds = Math.random() * 4 + 2; // 2 - 6s
    setTimeout(unfade, timeToWaitInSeconds * 1000);
}

function unfade() {
    stimulusTimestamp = Date.now();
    stimulusCurrentlyVisible = true;
    ex1Circle.classList.add('fade');
}

function experiment2() {
    instructionElement.textContent = "Experiment 2, not implemented yet.";
}
function experiment3() {
    instructionElement.textContent = "Experiment 3, not implemented yet.";
}

window.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        // the user pressed the space key
        if (experimentStage === -1) {
            // start the experiment if it wasn't active
            // clear results of any previous tests
            // reset data and start tests
            times1 = [];
            times2 = [];
            times3 = [];

            contextElement.hidden = true; // set the required elements for the experiments
            timeElement.hidden = false;

            nextExperiment();
            return;
        }

        if ((orderOfTests[experimentStage] === 1 || orderOfTests[experimentStage] === 2) && stimulusCurrentlyVisible) {
            // record reaction time
            recordStimulusReactionTime();
            iterationsOfCurrentTest++;
            // start next trial until condition of 30 iterations is met
            if (iterationsOfCurrentTest < 30) {
                executeIterationOfCurrentExperiment();
            } else {
                iterationsOfCurrentTest = 0;
                ex1Elements.hidden = true;
                ex2Elements.hidden = true;
                nextExperiment();
            }
        }
        if ((orderOfTests[experimentStage] === 1 || orderOfTests[experimentStage] === 2) && !stimulusCurrentlyVisible) {
            // error, because user pressed Space, but stimulus is not visible
        }
    } else if (event.key === '1') {
        //
    } else if (event.key === '2') {
        // ...
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