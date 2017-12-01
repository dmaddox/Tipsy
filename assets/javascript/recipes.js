// initialize variable for user's search query
var choice = '';
var cocktails = [];
var glass = '';
var shopRecos;

$("#alcoholAdd").on("click",function(event){
  event.preventDefault();
  var atype = $("#alcohol").val().trim();
  var newAlc = $("<li>");
  newAlc.text(atype);
  $("#liquors").append(newAlc);
  $("#alcohol").val("");
});
$("#mixerAdd").on("click",function(event){
  event.preventDefault();
  var mtype = $("#mixer").val().trim();
  var newMix = $("<li>");
  newMix.text(mtype);
  $("#mixers").append(newMix);
  $("#mixer").val("");
});
// load alcohol filters into first dropdown
for (i = 0; i < alcList.length; i++) {
  var alcInput = document.getElementById('sel-alcohol');
  var newOpt = document.createElement('option');
  newOpt.value = alcList[i];
  alcInput.appendChild(newOpt);
}

// load mixer filters into second dropdown
for (j = 0; j < mixList.length; j++) {
  var mixInput = document.getElementById('sel-mixer');
  var newOpt = document.createElement('option');
  newOpt.value = mixList[j];
  mixInput.appendChild(newOpt);
}

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
                    '<img src="' + results2.strDrinkThumb.trim() + '" ">\n' +
                    '</div>\n' +
                    '<div class="drink-name"><h4>' + results2.strDrink.trim() + '</h4></div>\n' +
                    '<div class="drink-info" style="display: inline-block; vertical-align: top;">\n' +
                    '<h5>Ingredients:</h5><ul>\n';
          // loop through the result's ingredients list to build the ingredients  details
          for (k = 1; k <= 15; k++) {
            // if an ingredients item is not null
            if (!(results2["strIngredient" + k] == null)) {
              // and is greater than 0 characters in length
              if (results2["strIngredient" + k].trim().length > 0) {
                // add a paragraph element to dHtml
                dHtml += '<li class="drink-ingr">';
                // if there is a specified measurement
                if (results2["strMeasure" + k].trim().length > 0) {
                  // add the measurement info to dHtml
                  dHtml += results2["strMeasure" + k].trim() + ' ';
                } // then add the ingredient item to the dHtml
                dHtml += results2["strIngredient" + k].trim() + '</li>\n';
              }
            }
          }
          // add the instructions to dHtml
          dHtml += '</ul></div><p class="drink-inst"><h5>Instructions</h5>' + results2.strInstructions.trim() + '</p>\n';
          // if a glass type exists, add it to the dHtml
          if (results2.strGlass.length > 0) {
            dHtml += '<p class="drink-glass"><h5>Glass</h5><span class="glass-val">' + results2.strGlass.trim() + '</span> - <button id="shop">Shop for Glass</button></p>\n';
          }
          dHtml += '<div class="shop-results"></div>';

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
  // save .drink-recipe class that is the great-grand-parent of the clicked shop button
  var drinkOfChoice = $(this).parent().parent().next();
  // save the glass type text which precedes the button
  glass = $(this).prev().text();
  // builds the API request URL to get cocktail name results
  var queryURL = "https://api.walmartlabs.com/v1/search?apiKey=vcn53dyhzmzmxzmg2krfxddy&query=" + glass + "&categoryId=4044&sort=bestseller";
  // AJAX request
  $.ajax({
      url: queryURL,
      method: "GET",
      dataType: "jsonp"
  }).done(function(response) {
    // store the response object
      shopRecos = response.items;
      // build the html that will display the shopping recommendations
      var newUL = $("<ul>");
      // loop through each recommendation
      for (s = 0; s < shopRecos.length; s++) {
        // verify the recommendation is available for online purchase
        if (shopRecos[s].availableOnline) {
          // build a new LI
          var resultLI = $("<li>");
          // add the .recommendation class to the li
          resultLI.addClass("recommendation");
          // build the text for the li
          resultLI.text(shopRecos[s].name + " : " + shopRecos[s].salePrice);
          // append the li to the ul parent
          newUL.append(resultLI);
         }
      };
      // append the parent ul, now with all each of the recommendations, to the .drink-recipe class
      drinkOfChoice.html(newUL);
  });

});