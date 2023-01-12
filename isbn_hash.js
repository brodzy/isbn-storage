// ISBN Array
var isbn = [];
var total = 0;
var msg = "";
var msgISBN = "";


// Hash Arrays
var hashL = [];
var hashQ = [];
var hashD = [];


// Stats
var collisionCount = 0;
var elapsedTime = 0;

function addISBN() {
    //Adds ISBN to array
    var isbnVal = document.getElementById("isbn");
    var val = isbnVal.value;
    if (validateISBN(val) == true) {
        isbn.push(val);
    }
    document.getElementById('isbn').value = "";
}

function validateISBN(val) {
    //Validates ISBN being the correct format and length
    if (!isANumber(val) || isEmpty(val)) {
        displayErrorMsg("Please enter numbers only for the ISBN.");
        return false;
    }
    if (val.length != 13) {
        displayErrorMsg("Make sure the ISBN is 13 digits.");
        return false;
    }
    else {
        return true;
    }
}

function upload() {
    //Uploading ISBN text files
    document.getElementById('btnUpload')
        .addEventListener('change', function () {

            var fr = new FileReader();
            fr.onload = function () {
                var text = fr.result;
                var textByLine = text.split("\n");
                isbn = textByLine;
            }

            fr.readAsText(this.files[0]);
        })
}

function displayResult() {
    //Running hash functions
    linearHash();
    quadHash();
    doubleHash();
    document.getElementById("txaResult").innerHTML = msg;

    //Display ISBNs to text area
    for (let i = 0; i < isbn.length; i++) {
        msgISBN += isbn[i] + "\n";
    }

    document.getElementById("txaISBN").innerHTML = msgISBN;
}


//Determines if value is empty inside text box
function isEmpty(val) {
    if ((val == null) || (val == "")) {
        return true
    }
    return false
}

//Determines if value is a number inside text box
function isANumber(val) {
    var digits = "0123456789.";

    var numDecimals = 0;
    for (i = 0; i < val.length; i++) {
        var c = val.charAt(i)
        if (digits.indexOf(c) == -1) {
            return false;
        }
        if (c == '.') {
            numDecimals++;
            if (numDecimals > 1) {
                return false;
            }
        }
    }

    var parsedVal = parseFloat(val);
    if (isNaN(parsedVal)) {
        return false;
    }
    return true;
}

//Console displays error message to user
function displayErrorMsg(msg, control) {
    alert(msg);
    control.focus();
    control.select();
}

function linearHash() {
    //initialize our hash arrays
    for (let i = 0; i < isbn.length; i++) {
        hashL[i] = -1;
    }

    const lStart = performance.now();

    for (let i = 0; i < hashL.length; i++) {
        //Computing hash value
        let hashV = isbn[i] % hashL.length;

        //Insert in table if there is no collision
        if (hashL[hashV] === -1) {
            hashL[hashV] = isbn[i];
        } else {
            collisionCount++;
            //If there is a collision iterate through all possible linear values
            for (let j = 0; j < hashL.length; j++) {
                //Computing new hash value
                let hv = (hashV + j) % hashL.length;
                if (hashL[hv] === -1) {
                    //Break the loop after inserting the value in table
                    hashL[hv] = isbn[j];
                    break;
                }
            }
        }
    }

    //End time - start time
    const elapsedTime = performance.now() - lStart;
    msg += "Running Linear Hash..."
    msg += "\nCollisions occured: " + collisionCount;
    msg += "\nTime Taken: " + elapsedTime + " milliseconds";
    msg += "\n------------------------------------------------";
    collisionCount = 0;

}

function quadHash() {
    //initialize our hash arrays
    for (let i = 0; i < isbn.length; i++) {
        hashQ[i] = -1;
    }

    const qStart = performance.now();

    for (let i = 0; i < hashQ.length; i++) {
        //Computing hash value
        let hashV = isbn[i] % hashQ.length;
        //Insert in table if there is no collision
        if (hashQ[hashV] === -1) {
            hashQ[hashV] = isbn[i];
        } else {
            collisionCount++;
            //If there is a collision iterate through all possible linear values
            for (let j = 0; j < hashQ.length; j++) {
                //Computing new hash value
                let hv = (hashV + j * j) % hashQ.length;
                if (hashQ[hv] === -1) {
                    //Break the loop after inserting the value in table
                    hashQ[hv] = isbn[j];
                    break;
                }
            }
        }
    }

    //End time - start time
    const elapsedTime = performance.now() - qStart;
    msg += "\nRunning Quadratic Hash...";
    msg += "\nCollisions occured: " + collisionCount;
    msg += "\nTime Taken: " + elapsedTime + " milliseconds";
    msg += "\n------------------------------------------------";
    collisionCount = 0;
}

function doubleHash() {
    //initialize our hash arrays
    for (let i = 0; i < isbn.length; i++) {
        hashD[i] = -1;
    }

    //Start time
    var dStart = performance.now();

    //Keep track of probes, insertion location, collisions, and collision loop
    var probeCount = 0;

    for (let i = 0; i < hashD.length; i++) {
        //computing hash values
        let hash1 = isbn[i] % hashD.length;
        let hash2 = isbn[i] % 3;
        let insert = hash1 + hash2 * probeCount;

        //inserting without collision
        if (hashD[hash1] === -1) {
            hashD[hash1] = isbn[i];
        }

        //inserting with collision
        else {
            collisionCount++;
            for (let j = 0; j < hashD.length; j++) {
                probeCount++;
                insert = hash1 + hash2 * probeCount;
                if (hashD[insert] === -1) {
                    hashD[insert] = isbn[i];
                    break;
                }
            }
        }
        probeCount = 0;
    }

    //End time - start time
    elapsedTime = performance.now() - dStart;
    msg += "\nRunning Double Hash...";
    msg += "\nCollisions occured: " + collisionCount;
    msg += "\nTime Taken: " + elapsedTime + " milliseconds";
}
