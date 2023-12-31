// reference to form element
var userFormEl = document.querySelector("#user-form");

// refernce to input element
var nameInputEl = document.querySelector("#username");

// reference empty div data will be written to
var repoContainerEl = document.querySelector("#repos-container");

// refernce To username that was searched in form
var repoSearchTerm = document.querySelector("#repo-search-term");

//making the call to the API every time the buttons are clicked 
var  languageButtonsEl = document.querySelector("#language-buttons");

// Fetch's username and repos on event (form submision - button clicked - with userinput)
// executed upon a form submission browser event
var formSubmitHandler = function(event) {
    event.preventDefault();

    // get value from input element
    var username = nameInputEl.value.trim();

    // send value over to getUserRepos()
    if (username) {
        getUserRepos(username);
        // clears form out
        nameInputEl.value = "";
        // No HTTP request without a username, if we accidentally left the <input> field blank!
    } else {
        alert("Please enter a Github username");
    }
};

// Fetches repos from the github api
var getUserRepos = function(user) {
    //format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

// make a request to the url
  fetch(apiUrl)
  .then(function(response) {
    // Up To GitHub's API to tell us If they couldn't find that user and to send a response back
    if (response.ok) {
    // When the response data is converted to JSON, it will be sent from getUserRepos() to displayRepos()
    response.json().then(function(data) {
        displayRepos(data, user);
    });
    // custom alert message to let the user know that their search was unsuccessful
  } else {
    alert("Error: Github User Not Found");
  }
})
//Catch Network Errors (notify user to ensure they don't this the app is broken)
.catch(function(error) {
    // Notice this `.catch()` getting chained onto the end of the `.then()` method
    alert("Unable to connect to Github");
});
};

//Display Repository Data
// accept both the array of repository data and the term we searched for as parameters
var displayRepos = function(repos, searchTerm) {

    // check if api returned any repos or if User Has No Repositories
    if (repos.length === 0) {
        repoContainerEl.taxtContent = "No repositories found.";
        return;
    }

    // clear old content before displaying new content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    // loop over repos (To display on page)
    for (var i = 0; i< repos.length; i++) {
        //format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // Each repo is clickable
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";

        // links to second page (and links to the repo issues clicked using query parameters)
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);


        // create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // append container (for repo names)
        repoEl.appendChild(titleEl);
        
// To Display Repo Issues on the Page
        // create a status element 
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML =
            //display the number of issues and add a red X icon next to it
            "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            // If there are no issues, we'll display a blue check mark instead
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        //append to container (beside repo name)
        repoEl.appendChild(statusEl);

        // append container to the dom (repos)
        repoContainerEl.appendChild(repoEl);
    }
};

// fetch data based of sorted conditions
var getFeaturedRepos = function (language) {
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

    // log the response to the console
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            //extract the JSON from the response
            response.json().then(function(data) {
                //featured repos appear on the page by passing the parameters values to displayrepo and calling (getFeaturedRepos("javascript"); in console.
                displayRepos(data.items, language);
            });
        //error handling
        } else {
            alert('Error: Github User Not Found');
        }
    });
};

//  function should use event delegation to handle all clicks on buttons.
var buttonClickHandler = function (event) {
    var language = event.target.getAttribute("data-language");
    //log the value of language for testing purposes.
    console.log(language);

    //call the getFeaturedRepos() function and pass the value we just retrieved from data-language as the argument, why we make sure data exists (The delegated event will still trigger on other elements that don’t have a data-* attribute)
    if (language) {
        getFeaturedRepos(language);
        // to clear out any remaining text from the repo container  Even though this line comes after getFeaturedRepos(), it will always execute first, because getFeaturedRepos() is asynchronous and will take longer to get a response from GitHub's API.()
        repoContainerEl.textContent = "";
    }
};
// submit event listener
userFormEl.addEventListener("submit", formSubmitHandler);

// event delegation (activate on click of langauge buttons)
languageButtonsEl.addEventListener("click", buttonClickHandler);



