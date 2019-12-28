"use strict";

/* Global variables */

var glVarObj = {
    gpaValue: 0.00, // Will hold the value of GPA, (aka A)
    inputA: 0.00,
    numberOfGallonsIHave: 0.00, // Will hold the user provided value of Gallons You Have, (aka B)
    squareFootage: 0.00,
    acresGpaMultiplier: 0.00,
    numGallonsNeeded: 0.00, // Will hold the user provided value of Gallongs Needed, (aka C)
    numGallonsToMix: 0.00, // Will hold the computed number of gallons to mix, (aka D)
    acresToMixUpFor: 0.00, // Will hold the computed number of acres you are mixing up for (aka E)
    minGallonsIHave: 0,
    maxGallonsIHave: 290,
    minSqFt: 5000,
    maxSqFt: 154150
};

// Treatment Object
var treatObj = {
    resoluteTreat: "",
    princepTreat: "",
    msmTreat: "",
    certaintyTreat: "",
    changeUpTreat: "",
    attazineTreat: "",
    specticleTreat: "",
    atrazineTreat: "",
    trimecSouthernTreat: "",
    liqFertTreat: "",
    earthMaxxTreat: "",
    prosedgeTreat: "",
    tripletTreat: "",
    treatmentName: "",
    surfactantQuantity: 0.00
};

// Strings of Units for treatment functions
const ozOf = {
    res: "&nbsp;oz of Resolute",
    princ: "&nbsp;oz of Princep",
    atta: "&nbsp;oz of Attazine",
    tSouth: "&nbsp;oz Trimec Southern",
    triplet: "&nbsp;oz of Triplet",
    lFert: "&nbsp;oz of Liq Fert",
    eMaxx: "&nbsp;oz of Earth Maxx",
    pros: "&nbsp;oz of Prosedge",
    msm: "&nbsp;oz of MSM",
    cUp: "&nbsp;oz of ChangeUp",
    cert: "&nbsp;oz of Certainty",
    spec: "&nbsp;oz of Specticle"
};


/* Some utility functions */

// Function to convert to two decimal places
function toTwoDec(beforeConversion) {
    return beforeConversion.toFixed(2);
}
// Function to toggle a given element to become visible
function revealNextStep(qs) {
    var nextStepElement = document.querySelector(qs);
    if (nextStepElement.style.display == "none"){
        nextStepElement.style.display = 'block';
    }
}

// Function to use if ever needed to hide a given div
// function hideGivenDiv(qs) {
//     var nextStepElement = document.querySelector(qs);
//     if (nextStepElement.style.display == "block"){
//         nextStepElement.style.display = 'none';
//     }
// }

// This function reloads the page and starts over.
function reloadPage() {
    location.reload();
}

//This function captures the input for a GPA other than the default two GPAs
function whenOtherGPA() {
    var inputOtherGpaValue = document.getElementById("inputOtherGPA").value;

    // Equivalent of glVarObj.inputA for the preset GPA's
    glVarObj.gpaValue = parseFloat(inputOtherGpaValue);

}

//The chosenGPA function is fired in step one when one choses a number of GPA.
function chosenGPA(event) {
    if ((this.options[this.selectedIndex].value) === "Other GPA") {
        // Reveal the div that receives the other GPA input.
        revealNextStep("#otherGPADiv");

    } else {
        // Go ahead and get the value embedded in the dropdown menu.
        glVarObj.inputA = (this.options[this.selectedIndex].value);
        glVarObj.gpaValue = parseFloat(glVarObj.inputA);
    }
    revealNextStep("#gallonsIHaveDiv");
}

/* Main functions */

function chosenTreatment(event) {
    var chosenTreatmentValue = this.options[this.selectedIndex].value;
    switch (chosenTreatmentValue) {
        case "Pick one...": alert("Please select a Treatment Option"); break;
        case "Bermuda 1PPE": bermudaOnePPE(); break;
        case "CSA 1PPE": csaOnePPE(); break;
        case "1PPE": onePPE(); break;
        case "Burmuda 2PPE": bermudaTwoPPE(); break;
        case "CSA 2PPE": csaTwoPPE(); break;
        case "2PPE": twoPPE(); break;
        case "Berm SW": bermSW(); break;
        case "General SW": generalSW(); break; //ask for this formula from Jay
        case "SW Main": SWMain(); break;
        case "FW Sept": FWSept(); break;
        case "FW Oct": FWOct(); break;
        case "FW Oct Specticle": fwOctSpecticle(); break;
        case "FW Sept Specticle": fwSeptSpecticle(); break;
        default:
            alert("Please pick a valid treatment option");

    }
}

//This function toggles the div for where the final results appear
function toggleDisplayFinalResults() {
    var finalResultsDivElement = document.getElementById("finalResultsGoHere");
    if (finalResultsDivElement.style.display === "none") {
        finalResultsDivElement.style.display = "block";
    } else {
        finalResultsDivElement.style.display = "none";
    }
    treatObj.surfactantQuantity = surfactantCalculation(); //Compute the surfactant value
}

function validateGallonsIHaveInput() {
    //Enter method to validate input that is between 5 and 290
    var possessed = document.getElementById("inputGallonsIHave").value;
    possessed = parseInt(possessed, 10);
    if (possessed >= glVarObj.minGallonsIHave && possessed <= glVarObj.maxGallonsIHave) {
        document.getElementById("valueofBtoUse").innerHTML = possessed;
        document.getElementById("valueOfBIsOutOfRange").innerHTML = "";
        toggleDisplayEnterSquareFootageDiv();
    } else {
        document.getElementById("valueofBtoUse").innerHTML = "";
        document.getElementById("valueOfBIsOutOfRange").innerHTML =
            "The value you entered is out of range. It has to be between 0 and 290.";
    }
}

function validateSquareFootageInput() {
    //Enter method to validate input that is between 5000 and 155000
    var squareFootageInput = document.getElementById("inputSquareFootage").value;
    glVarObj.squareFootage = parseFloat(squareFootageInput);
    if (glVarObj.squareFootage >= glVarObj.minSqFt && glVarObj.squareFootage <= glVarObj.maxSqFt) {
        document.getElementById("valueOfSqFt").innerHTML = glVarObj.squareFootage;
        document.getElementById("valueOfSqFtIsOutOfRange").innerHTML = "";
        computeNumberOfGallonsNeeded();
    } else {
        document.getElementById("valueOfSqFt").innerHTML = "";
        document.getElementById("valueOfSqFtIsOutOfRange").innerHTML =
            "The value you entered is out of range."
            + "It has to be between " + glVarObj.minSqFt + " and " + glVarObj.maxSqFt;
    }
}

function computeNumberOfGallonsNeeded() {
    glVarObj.acresGpaMultiplier = (glVarObj.squareFootage / 43560); // sqft divided by number of sqft per acre gives us acres
    glVarObj.numGallonsNeeded = (glVarObj.acresGpaMultiplier * glVarObj.gpaValue); // acres times gallons per acres gives us gallons.
    revealNextStep("#gallonsYouNeedDiv");
    //toggleDisplayGallonsNeededDiv();
    document.getElementById("autofillGallonsINeed").innerHTML =
        toTwoDec(glVarObj.numGallonsNeeded) + "&nbsp;Gallons";
}

function toggleDisplayEnterSquareFootageDiv() {
    var enterSqftDivElement = document.getElementById("enterSquareFootageDiv");
    if (enterSqftDivElement.style.display === "none") {
        enterSqftDivElement.style.display = "block";
    } else {
        enterSqftDivElement.style.display = "none";
    }
}

function computeGallonsToMix() {

    glVarObj.numberOfGallonsIHave = document.getElementById("inputGallonsIHave").value;
    glVarObj.numberOfGallonsIHave = parseInt(glVarObj.numberOfGallonsIHave, 10);

    glVarObj.numGallonsToMix = (glVarObj.numGallonsNeeded - glVarObj.numberOfGallonsIHave);

    document.getElementById("outputForNumberOfGallonsToMixFor").innerHTML = toTwoDec(glVarObj.numGallonsToMix)
    + "&nbsp;Gallons to MIX for.";
    revealNextStep("#GallonsToMixDiv");
}

function computeAcresYouAreFillingUpFor() {
    //glVarObj.numGallonsToMix is the output from the computeGallonsToMix function
    glVarObj.acresToMixUpFor = glVarObj.numGallonsToMix / glVarObj.gpaValue;

    revealNextStep("#acresYouAreMixingUpForDiv");

    document.getElementById("outputAcresYouAreMixingUpFor").innerHTML =
        "You are MIXING up for &nbsp;<bold>" 
        + toTwoDec(glVarObj.acresToMixUpFor)
        + "</bold>&nbsp;Acres <br/>";
}

//Treatment Functions and Their DOM outputs
function displayDateAndTime() {
    return new Date().toString();
}

function insertTimeAndDateInDom() {
    document.getElementById("resultTimeStamp").innerHTML =
        displayDateAndTime();
}

/* Treatment functions */
function bermudaOnePPE() {
    treatObj.treatmentName = "Bermuda 1PPE";
    treatObj.resoluteTreat = toTwoDec((27.3 * glVarObj.acresToMixUpFor)) + ozOf.res;
    treatObj.princepTreat = toTwoDec((32 * glVarObj.acresToMixUpFor)) + ozOf.princ;

    //Tell browser how to display result
    displayTreatment2(treatObj.resoluteTreat, treatObj.princepTreat);
}

function csaOnePPE() {
    treatObj.treatmentName = "CSA 1PPE";
    treatObj.atrazineTreat = toTwoDec((25.6 * glVarObj.acresToMixUpFor)) + ozOf.atra;
    treatObj.trimecSouthernTreat = toTwoDec((20.0 * glVarObj.acresToMixUpFor)) + ozOf.tSouth;
    displayTreatment2(treatObj.atrazineTreat, treatObj.trimecSouthernTreat);
}

function bermudaTwoPPE() {
    treatObj.treatmentName = "Burmuda 2PPE";
    treatObj.resoluteTreat = toTwoDec((10.8 * glVarObj.acresToMixUpFor)) + ozOf.res;
    treatObj.tripletTreat = toTwoDec((32.0 * glVarObj.acresToMixUpFor)) + ozOf.triplet;
    displayTreatment2(treatObj.resoluteTreat, treatObj.tripletTreat);
}

function csaTwoPPE() {
    treatObj.treatmentName = "CSA 2PPE";
    treatObj.liqFertTreat = toTwoDec((174.0 * glVarObj.acresToMixUpFor)) + ozOf.lFert;
    treatObj.earthMaxxTreat = toTwoDec((128.0 * glVarObj.acresToMixUpFor)) + ozOf.eMaxx;
    displayTreatment2(treatObj.liqFertTreat, treatObj.earthMaxxTreat);
}

function bermSW() {
    treatObj.treatmentName = "Berm SW";
    treatObj.prosedgeTreat = toTwoDec((1.2 * glVarObj.acresToMixUpFor)) + ozOf.pros;
    treatObj.msmTreat = toTwoDec((0.3 * glVarObj.acresToMixUpFor)) + ozOf.msm;
    treatObj.changeUpTreat = toTwoDec((8.0 * glVarObj.acresToMixUpFor)) + ozOf.cUp;
    displayTreatment3(treatObj.prosedgeTreat, treatObj.msmTreat, treatObj.changeUpTreat);
}

function SWMain() {
    //alert("SWMain function launched"); // for testing purposes
    treatObj.treatmentName = "SW Main";
    treatObj.certaintyTreat = toTwoDec((1.15 * glVarObj.acresToMixUpFor)) + ozOf.cert;
    treatObj.msmTreat = toTwoDec((0.3 * glVarObj.acresToMixUpFor)) + ozOf.msm;
    treatObj.changeUpTreat = toTwoDec((8.0 * glVarObj.acresToMixUpFor)) + ozOf.cUp;
    displayTreatment3(treatObj.certaintyTreat, treatObj.msmTreat, treatObj.changeUpTreat);
}

function FWSept() {
    treatObj.treatmentName = "FW Sept";
    treatObj.resoluteTreat = toTwoDec((27.0 * glVarObj.acresToMixUpFor)) + ozOf.res;
    treatObj.msmTreat = toTwoDec((0.3 * glVarObj.acresToMixUpFor)) + ozOf.msm;
    displayTreatment2(treatObj.resoluteTreat, treatObj.msmTreat);
}

function FWOct() {
    treatObj.treatmentName = "FW Oct";
    treatObj.resoluteTreat = toTwoDec((27.0 * glVarObj.acresToMixUpFor)) + ozOf.res;
    treatObj.princepTreat = toTwoDec((32.0 * glVarObj.acresToMixUpFor)) + ozOf.princ;
    treatObj.msmTreat = toTwoDec((0.3 * glVarObj.acresToMixUpFor)) + ozOf.msm;
    displayTreatment3(treatObj.resoluteTreat, treatObj.princepTreat, treatObj.msmTreat);
}

function onePPE() {
    treatObj.treatmentName = "1PPE";
    treatObj.resoluteTreat = toTwoDec((13.2 * glVarObj.acresToMixUpFor)) + ozOf.res;
    treatObj.attazineTreat = toTwoDec((25.6 * glVarObj.acresToMixUpFor)) + ozOf.atta;
    treatObj.tripletTreat = toTwoDec((32.0 * glVarObj.acresToMixUpFor)) + ozOf.triplet;
    displayTreatment3(treatObj.resoluteTreat, treatObj.attazineTreat, treatObj.tripletTreat);
}

function twoPPE() {
    treatObj.treatmentName = "2PPE";
    treatObj.resoluteTreat = toTwoDec((10.8 * glVarObj.acresToMixUpFor)) + ozOf.res;
    treatObj.tripletTreat = toTwoDec((32.0 * glVarObj.acresToMixUpFor)) + ozOf.triplet;
    displayTreatment2(treatObj.resoluteTreat, treatObj.tripletTreat);
}

function fwSeptSpecticle() {
    treatObj.treatmentName = "FW Sept Specticle";
    treatObj.specticleTreat = toTwoDec((6.5 * glVarObj.acresToMixUpFor)) + ozOf.spec;
    treatObj.msmTreat = toTwoDec((0.3 * glVarObj.acresToMixUpFor)) + ozOf.msm;
    displayTreatment2(treatObj.specticleTreat, treatObj.msmTreat);
}

function generalSW() {
    treatObj.treatmentName = "General SW";
    treatObj.certaintyTreat = toTwoDec((1.15 * glVarObj.acresToMixUpFor)) + ozOf.cert;
    treatObj.msmTreat = toTwoDec((0.3 * glVarObj.acresToMixUpFor)) + ozOf.msm;
    treatObj.changeUpTreat = toTwoDec((8.0 * glVarObj.acresToMixUpFor)) + ozOf.cUp;
    displayTreatment3(treatObj.certaintyTreat, treatObj.msmTreat, treatObj.changeUpTreat);
}

function fwOctSpecticle() {
    treatObj.specticleTreat = toTwoDec((6.5 * glVarObj.acresToMixUpFor)) + ozOf.spec;
    treatObj.princepTreat = toTwoDec((32.0 * glVarObj.acresToMixUpFor)) + ozOf.princ;
    treatObj.msmTreat = toTwoDec((0.3 * glVarObj.acresToMixUpFor)) + ozOf.msm;
    displayTreatment3(treatObj.specticleTreat, treatObj.princepTreat, treatObj.msmTreat);
}

// Surfactant Calculation
function surfactantCalculation() {
    var surfactantQty = (glVarObj.numGallonsToMix / 3); // Total gallons to MIX divided by 3.
    surfactantQty = toTwoDec(surfactantQty);
    return surfactantQty;
}

//This function will be used inside treatments that have 2 parameters
function displayTreatment2(treat1, treat2) {
    toggleDisplayFinalResults();
    document.getElementById("displayOutputHere").innerHTML =
        "<strong>" + treatObj.treatmentName +
        "&nbsp;treatment:" + "<br>" + "Have " + toTwoDec(glVarObj.numberOfGallonsIHave)
        + "&nbsp;Gallons, " + "mix&nbsp;" + toTwoDec(glVarObj.numGallonsToMix)
        + " Gallons => " + toTwoDec(glVarObj.acresToMixUpFor) + " Acres " + "<br><br>"
        + toTwoDec(glVarObj.numGallonsNeeded) + "&nbsp;Gallons of Solution <br>"
        + treat1 + "<br>" + treat2 + "<br>" + treatObj.surfactantQuantity
        + "&nbsp;oz of Surfactant </strong>";
    insertTimeAndDateInDom();
}

//This function will be used inside treatments that have 3 parameters
function displayTreatment3(treat1, treat2, treat3) {
    toggleDisplayFinalResults();
    document.getElementById("displayOutputHere").innerHTML =
        "<strong>" + treatObj.treatmentName +
        "&nbsp;treatment:" + "<br>" + "Have " + toTwoDec(glVarObj.numberOfGallonsIHave)
        + "&nbsp;Gallons, " + "mix&nbsp;" + toTwoDec(glVarObj.numGallonsToMix)
        + " Gallons => " + toTwoDec(glVarObj.acresToMixUpFor) + " Acres " + "<br><br>"
        + toTwoDec(glVarObj.numGallonsNeeded) + "&nbsp;Gallons of Solution <br>"
        + treat1 + "<br>" + treat2 + "<br>" + treat3 + "<br>"
        + treatObj.surfactantQuantity + "&nbsp;oz of Surfactant </strong>";
    insertTimeAndDateInDom();
}

//This function activates a confirmation window before users leave a step of class confirmation step.
// runForConfirmation();

// function runForConfirmation() {
//     var elems = document.getElementsByClassName('confirmation');
//     var confirmIt = function (e) {
//         if (!confirm('Are you sure?'))
//             e.preventDefault();
//     };
//     for (var i = 0, l = elems.length; i < l; i++) {
//         elems[i].addEventListener('click', confirmIt, false);
//     }
// }