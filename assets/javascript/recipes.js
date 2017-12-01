// initialize variable for user's search query
var choice = '';
var cocktails = [];
var glass = '';
var shopRecos;
var filterAlc = [], filterMix = [];

// handle add alcohol button
$("#alcoholAdd").on("click",function(event){
  event.preventDefault();
  var atype = $("#alcohol").val().trim();
  if (atype.length > 0) {
    var newAlc = $("<li>");
    newAlc.text(atype);
    $("#liquors").append(newAlc);
    $("#alcohol").val("");
    filterAlc.push(atype);
  }
});

// handle add mixer button
$("#mixerAdd").on("click",function(event){
  event.preventDefault();
  var mtype = $("#mixer").val().trim();
  if (mtype.length > 0) {
    var newMix = $("<li>");
    newMix.text(mtype);
    $("#mixers").append(newMix);
    $("#mixer").val("");
    filterMix.push(mtype);
  }
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
          dHtml += '<div class="drink-img" >\n' +
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
          dHtml += '</ul></div><div class="drink-inst"><h5>Instructions</h5>' + results2.strInstructions.trim() + '</div>\n';
          // if a glass type exists, add it to the dHtml
          if (results2.strGlass.length > 0) {
            dHtml += '<div class="drink-glass"><h5>' + results2.strGlass.trim() + '</h5></div>\n';
          }
          dHtml += '<div class="shop-results"></div>';

          // TO DO: HANDLE MISSING INGREDIENTS (INCLUDED IN RECIPE, NOT IN SEARCH)
          var newDiv = document.createElement('div');
          newDiv.classList.add("drink-recipe");
          newDiv.classList.add("col-md-4");
          newDiv.classList.add("col-sm-5");
          newDiv.classList.add("mx-2");
          newDiv.classList.add("px-0");
          newDiv.innerHTML = dHtml;
          console.log(newDiv);
          document.getElementById("drink-list").appendChild(newDiv);
          //console.log(dHtml);
          $(".drink-info, .drink-inst, .drink-glass, .shop-results").hide();
        });
      }
    }
  });  
  // hide all blah
});


// When a user clicks a recipe, toggle between show/hide all recipe details & shopping details 
$(document).on("click", ".drink-recipe", function() {
  var drinkOfChoice = $(this).find(".shop-results");
  // save the glass type text which precedes the button
  glass = $(this).find(".drink-glass").text();
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
  $(this).find(".drink-info, .drink-inst, .drink-glass, .shop-results").toggle();
});