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
    document.getElementById("drink-list").InnerHTML = "";
    if (drinkIds.length > 0) {
      for (j = 0; j < drinkIds.length; j++) {
        // 2nd API call to get recipe details
        var qURL2 = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + drinkIds[j];
        $.get(qURL2).done(function(response) {
          var dHtml = "";
          var results2 = response.drinks[0];
          console.log(results2);
          //dHtml += '<div class="search-result">\n' +
          dHtml += '<img src="' + results2.strDrinkThumb + '" style="float: left; width: 120px; height: 120px;">\n' +
                    '<strong>' + results2.strDrink + '</strong>\n';
          for (k = 1; k <= 15; k++) {
            if (!results2["strIngredient" + k] == null) {
              if (results2["strIngredient" + k].length > 0) {
                dHtml += "<p>";
                if (results2["strMeasure" + k].length > 0) {
                  dHtml += results2["strMeasure" + k] + " ";
                }
                dHtml += results2["strIngredient" + k] + "</p>\n";
              }
            }
          }
          dHtml += '<p><strong>Ingredients</strong>: ' + results2.strInstructions + '</p>\n';
          if (results2.strGlass.length > 0) {
            dHtml += '<p><strong>Ingredients</strong>: ' + results2.strGlass + '</p>\n';
          }
          // MISSING INGREDIENTS
          //dHtml += '</div>\n';
          var newDiv = document.createElement('div');
          newDiv.innerHTML = dHtml;
          document.getElementById("drink-list").appendChild(newDiv);
          //document.getElementById("drink-list").innerHTML = dHtml;
          //console.log(dHtml);
        });
      }
    }
  });
});
