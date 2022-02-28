console.log("Welcome Folks....");

// Initialize no of parameters
let addedParamCount = 0;

// Utility function to get DOM element from string
function getElementFromString(string) {
    let div = document.createElement('div');
    div.innerHTML = string;
    return div.firstElementChild;
    // return div; // this will also work
}

// getting the parameters div
const parametersBox = document.getElementById('parametersBox');

// getting the json div
const jsonBox = document.getElementById('requestJsonBox');

// hiding the parameters div initially, if user selects custom parameters option, then we can unhide it
parametersBox.style.display = 'none';

// If the user clicks on custom paramters, hide the json box

const paramsRadio = document.getElementById('paramsRadio');

paramsRadio.addEventListener('click', () => {
    jsonBox.style.display = 'none'; // hiding the json box
    parametersBox.style.display = 'block'; // showing the parameters box
});

// If the user clicks on json box, hide the params box

const jsonRadio = document.getElementById('jsonRadio');

jsonRadio.addEventListener('click', () => {
    parametersBox.style.display = 'none'; // hiding the parametersBox
    jsonBox.style.display = 'block'; // showing the json box
});

// If the user clicks on + button add more parameters

const addParam = document.getElementById("addParam");

addParam.addEventListener('click', () => {
    const paramsDiv = document.getElementById("paramsDiv");

    let params_html = `
    <div class="form-row my-2">
    <label for="url" class="col-sm-2 col-form-label">Parameter ${addedParamCount + 2}</label>
    <div class="col-md-4">
        <input type="text" class="form-control" id="parameterKey${addedParamCount + 2}" placeholder="Enter Parameter ${addedParamCount + 2} Key">
    </div>
    <div class="col-md-4">
        <input type="text" class="form-control" id="parameterValue${addedParamCount + 2}" placeholder="Enter Parameter ${addedParamCount + 2} Value">
    </div>
    <button class="btn btn-primary deleteParam">-</button>
</div>
`;
    // convert the element string to DOM node

    let paramElement = getElementFromString(params_html);

    paramsDiv.appendChild(paramElement);

    // Add an event listenre to reomve the parameter on clicking - button

    // whenever an element will be created this eventListener will be embedded over it
    let deleteParam = document.getElementsByClassName('deleteParam');

    // iterating over each div, which we added
    for (item of deleteParam) {
        item.addEventListener('click', (event) => {

            // deleting the div, on which - is pressed
            event.target.parentElement.remove();

        });
    }

    addedParamCount++;

});

// If the user click on submit button

const submit = document.getElementById('submit');
submit.addEventListener('click', () => {

    // Show please wait in the response box, to request patience from user

    document.getElementById('responsePrism').innerHTML = "Hold Up!....Your request is being processed";

    // Fetch all the values user has entered

    let url = document.getElementById('url').value;

    let requestType = document.querySelector("input[name='requestType']:checked").value; // basically it will give us, GET or POST, any one of em' which is checked

    let contentType = document.querySelector("input[name='contentType']:checked").value; // similarily getting, content type, JSON or custom parameters

    // Logging the values to the console
    console.log(url, requestType, contentType);


    // If user has used params option instead of json, collet all the parameters in an object
    if (contentType == "params") {
        data = {};
        // this loop will iterate for number of parameter times
        for (let i = 0; i < addedParamCount + 1; i++) {
            // this check is used, because if we added new parameter list and then deleted it, then it will give undefined, cuz we can't access it using getElementById, if that doesn't happen only then we can create our object, using key and value
            if (document.getElementById(`parameterKey${i + 1}`) != undefined) {

                let key = document.getElementById(`parameterKey${i + 1}`).value; // getting the key of ith parameter list
                let value = document.getElementById(`parameterValue${i + 1}`).value; // getting the corresponding value of ith parameter list

                data[key] = value;
            }
        }
        data = JSON.stringify(data); // converting the data into a valid json string

    }
    // if the seleceted type is JSON
    else {
        data = document.getElementById('requestJsonText').value;

        // if user didnt' gave us stringified version of data, we need to convert it to stringify version to create a error free post Request

        // basically we can just, parse it and if it parsed successfully, then it means user gave stringified version of data, else we need to stringify it ourself

        try {
            JSON.parse(data);
            // if it is parsed successfully then, we are good to go, else
        } catch (error) { // if syntax error occured, then we need to stringify it ourself
            
            console.log(data);
            data = JSON.stringify(data).replace(/\\n/g, ''); // replacing the new line character
        }
    }
    // logging our data into console
    console.log(data);

    // If my request type is GET, then we have to create a GET request

    if (requestType == 'GET') {
        // creating a get request using fetch API
        fetch(url, { // fetch will return a promise
            method: 'GET'
        }).then(response => response.text()).then((text) => { // response.text will also return a promise

            // inserting our data to our responsePrism, where it was supposed to be
            document.getElementById('responsePrism').innerHTML = text;
            Prism.highlightAll();
        });
    }
    // creating a POST request
    else { 
        fetch(url, { // fetch will return a promise
            method: 'POST',
            body: data, // sending the data as a string
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(response => response.text()).then((text) => { // response.text will also return a promise

            // inserting our data to our responsePrism, where it was supposed to be
            document.getElementById('responsePrism').innerHTML = text;
            Prism.highlightAll();
        });

    }
});

// for post request, https://jsonplaceholder.typicode.com/posts