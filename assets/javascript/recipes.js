// initialize variable for user's search query
var choice = '';
var cocktails = [];
var glass = '';
var shopRecos;

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
  $.ajax({
      url: qURL,
      dataType: "json",
      method: "GET"
  }).done(function(response) {
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
        $.ajax({
            url: qURL2,
            dataType: "json",
            method: "GET"
        }).done(function(response) {
          var dHtml = "";
          var results2 = response.drinks[0];
          console.log(results2);
          cocktails.push(results2);
          dHtml += '<div class="drink-img" style="display: inline-block; vertical-align: top;">\n' +
                    '<img src="' + results2.strDrinkThumb.trim() + '" style="width: 120px; height: 120px;">\n' +
                    '</div>\n' +
                    '<div class="drink-info" style="display: inline-block; vertical-align: top;">\n' +
                    '<div class="drink-name"><strong>' + results2.strDrink.trim() + '</strong></div>\n';
          // loop through the result's ingredients list to build the ingredients  details
          for (k = 1; k <= 15; k++) {
            // if an ingredients item is not null
            if (!(results2["strIngredient" + k] == null)) {
              // and is greater than 0 characters in length
              if (results2["strIngredient" + k].trim().length > 0) {
                // add a paragraph element to dHtml
                dHtml += '<p class="drink-ingr">';
                // if there is a specified measurement
                if (results2["strMeasure" + k].trim().length > 0) {
                  // add the measurement info to dHtml
                  dHtml += results2["strMeasure" + k].trim() + ' ';
                } // then add the ingredient item to the dHtml
                dHtml += results2["strIngredient" + k].trim() + '</p>\n';
              }
            }
          }
          // add the instructions to dHtml
          dHtml += '<p class="drink-inst"><strong>Instructions</strong>: ' + results2.strInstructions.trim() + '</p>\n';
          // if a glass type exists, add it to the dHtml
          if (results2.strGlass.length > 0) {
            dHtml += '<p class="drink-glass"><strong>Glass</strong>: <span class="glass-val">' + results2.strGlass.trim() + '</span> - <button id="shop">Shop for Glass</button></p>\n';
          }
          dHtml += '</div><div class="shop-results"></div>';

          // TO DO: HANDLE MISSING INGREDIENTS (INCLUDED IN RECIPE, NOT IN SEARCH)
          var newDiv = document.createElement('div');
          newDiv.classList.add("drink-recipe");
          newDiv.innerHTML = dHtml;
          console.log(newDiv);
          document.getElementById("drink-list").appendChild(newDiv);
          //console.log(dHtml);

        });
      }
    }
  });  
});

// Shop for glass type
$(document).on("click", "#shop", function() {
  var drinkOfChoice = $(this).parent().parent().next();
  glass = $(this).prev().text();
  console.log(glass);
  console.log(drinkOfChoice);
  console.log("i clicked");
  // builds the API request URL to get cocktail name results
  var queryURL = "https://api.walmartlabs.com/v1/search?apiKey=vcn53dyhzmzmxzmg2krfxddy&query=" + glass + "&categoryId=4044&sort=bestseller";
  // AJAX request
  $.ajax({
      url: queryURL,
      method: "GET",
      dataType: "jsonp"
  }).done(function(response) {
      var products = response.items;
      shopRecos = products;
      console.log(shopRecos);
      // display shopping results
      var newUL = $("<ul>");
      for (s = 0; s < shopRecos.length; s++) {
        if (shopRecos[s].availableOnline) {
          var resultLI = $("<li>");
          resultLI.addClass("recommendation");
          resultLI.text(shopRecos[s].name + " : " + shopRecos[s].salePrice);
          newUL.append(resultLI);
         }
      };
      drinkOfChoice.html(newUL);
  });
});