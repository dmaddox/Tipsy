// initialize variable for user's search query
var choice = '';

// when user clicks an ingredients button, the variable is set
$(".ingredient").on("click", function(event){
  // prevent the button from refreshing the page
  event.preventDefault();
  // store the name of the button in the 'choice' var
  choice = $(this).text().toString();
  console.log(choice);
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
  console.log(qText);
  // builds the API request URL to get cocktail name results
  var qURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + qText;
  console.log(qURL);
  // AJAX request
  $.get(qURL).done(function(response) {
      var results = response.drinks;
      var drinkIds = [];
      for (i = 0; i < results.length; i++) {
        drinkIds.push(results[i].idDrink);
    }
    console.log(drinkIds);
    document.getElementById("drink-list").innerHTML = "";
    if (drinkIds.length > 0) {
      console.log("drinksIds array has stuff");
      for (j = 0; j < drinkIds.length; j++) {
        // 2nd API call to get recipe details
        var qURL2 = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + drinkIds[j];
        $.get(qURL2).done(function(response) {
          var dHtml = "";
          var results2 = response.drinks[0];
          console.log(results2);
          dHtml += '<div class="drink-img" style="display: inline-block; vertical-align: top;">\n' +
                    '<img src="' + results2.strDrinkThumb.trim() + '" style="width: 120px; height: 120px;">\n' +
                    '</div>\n' +
                    '<div class="drink-info" style="display: inline-block; vertical-align: top;">\n' +
                    '<div class="drink-name"><strong>' + results2.strDrink.trim() + '</strong></div>\n';
          for (k = 1; k <= 15; k++) {
            if (!(results2["strIngredient" + k] == null)) {
              if (results2["strIngredient" + k].trim().length > 0) {
                dHtml += '<p class="drink-ingr">';
                if (results2["strMeasure" + k].trim().length > 0) {
                  dHtml += results2["strMeasure" + k].trim() + ' ';
                }
                dHtml += results2["strIngredient" + k].trim() + '</p>\n';
              }
            }
          }
          dHtml += '<p class="drink-inst"><strong>Instructions</strong>: ' + results2.strInstructions.trim() + '</p>\n';
          if (results2.strGlass.length > 0) {
            dHtml += '<p drink-glass"><strong>Glass</strong>: <div class="glass-val">' + results2.strGlass.trim() + '</div></p>\n';
          }
          dHtml += '</div>';
          // TO DO: HANDLE MISSING INGREDIENTS (INCLUDED IN RECIPE, NOT IN SEARCH)
          var newDiv = document.createElement('div');
          newDiv.innerHTML = dHtml;
          console.log(newDiv);
          document.getElementById("drink-list").appendChild(newDiv);
          //console.log(dHtml);
        });
      }
    }
  });
});