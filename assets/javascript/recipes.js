// initialize variable for user's search query
var choice = '';
var qGlass;
// create an empty array, locally
var drinkIds = [];
// create an empty array that will contain returned objects
var drinks = [];
var qURL2;

// when user clicks an ingredients button, the variable is set
$(".ingredient").on("click", function(event){
  // prevent the button from refreshing the page
  event.preventDefault();
  // store the name of the button in the 'choice' var
  choice = $(this).text().toString();
  console.log("User Choice: " + choice);
  // confirm user's choice by displaying in html
  $("#submission-details").html("<h4>You are about to search for cocktails made with: <strong>" + choice + "</strong>.</h4>");
});

// selected choice becomes the query text variable 'qText'
var qText = choice;

// submit button queries API
$("#submit").on("click", function() {
  // prevents submit button from refreshing page
  event.preventDefault();

  qText = choice;
  // check API for recipes
  drinkIdQuery();
});

// API Request to get Recipe names & ID's
function drinkIdQuery() {
  console.log("API Query qTtext: " + qText);
  // builds the API request URL to get cocktail name results
  var qURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + qText;
  console.log("API query URL: " + qURL);
  // AJAX request
  $.get(qURL).done(function(response) {
    // store the drinks array in results variable
    var results = response.drinks;
    // loop through the results array
    for (i = 0; i < results.length; i++) {
      // push each drink ID into our local drinkIds array
      drinkIds.push("https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + results[i].idDrink);
    };
    // once we have the drinksIds array & it has something in it, we can query the API again for recipes of each drink ID
    if (drinkIds.length > 0) {
      console.log(drinkIds);
      drinkIdLoop();
    };
  });
};

// API Request to get recipe details
function drinkIdLoop() {
  console.log("running recipeQuery()");
  // loop through the drinkIds array
  for (j = 0; j < drinkIds.length; j++) {
    console.log("Requesting drink iD: " + drinkIds[j]);
    console.log("still in the loop");
    // query the API to get that drink ID's recipe details
    $.get(drinkIds[j]).done(function(response) {
      console.log(response.drinks[0]);
      // store each drink object in an array
      drinks.push(response.drinks[0]);
    });
  }; 
  console.log(drinks);
  displayResults();
};


// display all the results on the screen
function displayResults() {
  // reset the innerHTML of the #drink-list
  document.getElementById("drink-list").innerHTML = "";
  // empty dHtml variable that will house the html we play to display
  var dHtml = "";
  // loop through the drinks array and print details to screen
  for (d = 0; d < drinks.length; d++) {
    // add the image
    dHtml += '<div class="drink-img" style="display: inline-block; vertical-align: top;">\n' +
                      '<img src="' + drinks[d].strDrinkThumb.trim() + '" style="width: 120px; height: 120px;">\n' +
                      '</div>\n' +
                      // add the drink info
                      '<div class="drink-info" style="display: inline-block; vertical-align: top;">\n' +
                      // add the drink name
                      '<div class="drink-name"><strong>' + drinks[d].strDrink.trim() + '</strong></div>\n';
    // check the ingredients length
    for (k = 1; k <= 15; k++) {
      var ingredient = "strIngredient" + k;
      var mesaurement = "strMeasure" + k;
      // if the ingredients index is empty
      if (!(drinks[d].ingredient == null)) {
        // and if it is longer than 0
        if (drinks[d].ingredient + k.trim().length > 0) {
          // then add drink ingredients
          dHtml += '<p class="drink-ingr">';
          // and if measurements are available
          if (drinks[d].mesaurement.trim().length > 0) {
            // add the mesaurement
            dHtml += drinks[d].mesaurement.trim() + ' ';
          }; // add the ingredient name
        dHtml += drinks[d].ingredient.trim() + '</p>\n';
        };
      };
    };
  }
  // display
  var newDiv = document.createElement('div');
//           newDiv.innerHTML = dHtml;
//           document.getElementById("drink-list").appendChild(newDiv);

};



// 



//           dHtml += '<p class="drink-inst"><strong>Instructions</strong>: ' + results2.strInstructions.trim() + '</p>\n';
//           // If a glass exists, display the glass type
//           if (results2.strGlass.length > 0) {
//             // Display glass type result in html
//             dHtml += '<p class="drink-glass"><strong>Glass</strong>: <span class="glass-val">' + results2.strGlass.trim() + '</span></p>\n';
//             // setup a variable with the name of the glass type
//             qGlass = results2.strGlass.trim();
//             // run the function from shop.js that queries the WalMart API to search for the glass
//             shopGlass();
//           }
//           dHtml += '</div>';
//           // TO DO: HANDLE MISSING INGREDIENTS (INCLUDED IN RECIPE, NOT IN SEARCH)
//           var newDiv = document.createElement('div');
//           newDiv.innerHTML = dHtml;
//           document.getElementById("drink-list").appendChild(newDiv);
//           console.log(dHtml);
//         });
//       }
//     }
//   });
// });