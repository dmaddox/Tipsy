// initialize variable for user's search query
var choice = '';
var cocktails = [];
var glass = '';
var shopRecos;
var filterAlc = [], filterMix = [];
var thisVar;
var productRecoUL;

$("#alcoholAdd").on("click",function(event){
  event.preventDefault();
  addAlcohol();
});

$("#alcoholAdd").on("keyup",function(event){
  event.preventDefault();
  if (event.keyCode == 13) {
    addAlcohol();
  }
});

$("#mixerAdd").on("click",function(event){
  event.preventDefault();
  addMixer();
});

$("#mixerAdd").on("keyup",function(event){
  event.preventDefault();
  if (event.keyCode == 13) {
    addMixer();
  }
});

function addAlcohol() {
  var atype = $("#alcohol").val().trim();
  if (atype.length > 0) {
    var newAlc = $("<li>");
    newAlc.text(atype);
    $("#liquors").append(newAlc);
    newAlc.append(" " + '<img src="assets/glyphicons-198-remove-circle.png" class="alcIcon">');
    $("#alcohol").val("");
    filterAlc.push(atype);
  }
}

function addMixer() {
  var mtype = $("#mixer").val().trim();
  if (mtype.length > 0) {
    var newMix = $("<li>");
    newMix.text(mtype);
    $("#mixers").append(newMix);
    newMix.append(" " + '<img src="assets/glyphicons-198-remove-circle.png" class="mixIcon">');
    $("#mixer").val("");
    filterMix.push(mtype);
  }
}

$(document.body).on("click", ".alcIcon", function() {
  var takeOffAlc = $(this).parent().text()
  console.log(takeOffAlc)
  var AlcIndex = filterAlc.indexOf(takeOffAlc)
  filterAlc.splice(AlcIndex, 1);
   $(this).parent().remove();
  });

$(document.body).on("click", ".mixIcon", function() {
  var takeOffMix = $(this).parent().text()
  console.log(takeOffMix)
  var mixIndex = filterMix.indexOf(takeOffMix)
  filterMix.splice(mixIndex, 1)
  $(this).parent().remove();
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
var qText = "";

// submit button queries API
$("#submit").on("click", function() {
  // prevents submit button from refreshing page
  event.preventDefault();
  // only run if at least 1 alcohol has been added to the search list
  if (filterAlc.length > 0) {
    qText = filterAlc[0];
    // builds the API request URL to get cocktail name results
    var qURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + qText;
    // console.log(qURL);
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
      // console.log(drinkIds);
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
            var results2 = response.drinks[0];
            // START: LOOP TO FILTER RESULTS THAT DON'T INCLUDE ALL SEARCHED-FOR INGREDIENTS
            var bFound = true, bTemp = false;
            if (filterAlc.length > 1 || filterMix.length > 0) {
              // filterAlc search loop
              for (n1 = 1; (n1 < filterAlc.length && bFound); n1++) {
                bTemp = false;
                for (k1 = 1; (k1 <= 15 && !bTemp); k1++) {
                  if (!(results2["strIngredient" + k1] == null)) {
                    if (results2["strIngredient" + k1].trim().length > 0) {
                      if (results2["strIngredient" + k1].trim().toLowerCase() == filterAlc[n1].toLowerCase()) {
                        bTemp = true;
                      }
                    }
                  }
                }
                if (!bTemp) {
                  bFound = false;
                }
              }
              // filterMix search loop
              for (n2 = 0; (n2 < filterMix.length && bFound); n2++) {
                bTemp = false
                for (k2 = 1; (k2 <= 15 && !bTemp); k2++) {
                  if (!(results2["strIngredient" + k2] == null)) {
                    if (results2["strIngredient" + k2].trim().length > 0) {
                      if (results2["strIngredient" + k2].trim().toLowerCase() == filterMix[n2].toLowerCase()) {
                        bTemp = true;
                      }
                    }
                  }
                }
                if (!bTemp) {
                  bFound = false;
                }
              }
              // END: FILTER LOOP
            }
            // only add result2 if bFound == true
            if (bFound) {
              var dHtml = "";
              cocktails.push(results2);
              dHtml += '<div class="drink-name"><h4>' + results2.strDrink.trim() + '</h4></div>\n' +
                        '<div class="drink-img">\n' +
                        '<img class="img-fluid" src="' + results2.strDrinkThumb.trim() + '" ">\n' +
                        '</div>\n' +
                        '<div class="drink-info">\n' +
                        '<h5>Ingredients:</h5><ul>\n';
              // loop through the result's ingredients list to build the ingredients  details
              for (k2 = 1; k2 <= 15; k2++) {
                // if an ingredients item is not null
                if (!(results2["strIngredient" + k2] == null)) {
                  // and is greater than 0 characters in length
                  if (results2["strIngredient" + k2].trim().length > 0) {
                    // add a paragraph element to dHtml
                    dHtml += '<li class="drink-ingr">';
                    // if there is a specified measurement
                    if (results2["strMeasure" + k2].trim().length > 0) {
                      // add the measurement info to dHtml
                      dHtml += results2["strMeasure" + k2].trim() + ' ';
                    } // then add the ingredient item to the dHtml
                    dHtml += results2["strIngredient" + k2].trim() + '</li>\n';
                  }
                }
              }
              // add the instructions to dHtml
              dHtml += '</ul></div><div class="drink-inst"><h5>Instructions:</h5><p>' + results2.strInstructions.trim() + '</p></div>\n';
              // if a glass type exists, add it to the dHtml
              if (results2.strGlass.length > 0) {
                dHtml += '<div class="drink-glass"><h5>Shop for <span class="shp">' + results2.strGlass.trim().toLowerCase() + '</span></h5></div>\n';
              }
              dHtml += '<div class="shop-results"></div>';

              // TO DO: HANDLE MISSING INGREDIENTS (INCLUDED IN RECIPE, NOT IN SEARCH)
              var newDiv = document.createElement('div');
              newDiv.classList.add("drink-recipe");
              newDiv.classList.add("mx-2");
              newDiv.classList.add("px-0");
              newDiv.innerHTML = dHtml;
              document.getElementById("drink-list").appendChild(newDiv);
              $(".drink-info, .drink-inst, .drink-glass, .shop-results").hide();
            }
          });
        }
      }
    });
  }
});


// When a user clicks a recipe, toggle between show/hide all recipe details & shopping details 
$(document).on("click", ".drink-recipe", function() {
  thisVar = $(this);
  shopForGlass();

  // $(this).find(".drink-info, .drink-inst, .drink-glass, .shop-results").toggle();
});

// function to switch classes
function openModal() {
  // place the clicked recipe card's html into the pop-up modal
  $(".modal-inner").html(thisVar.html());
  // add the product recommendations to the modal
  $(".modal-inner").find(".shop-results").html(productRecoUL);
  // display all parts
  $(".modal-inner").find(".drink-info, .drink-inst, .drink-glass, .shop-results").toggle();
  // add wrapping div around name & ingredients
  $(".modal-inner").find(".drink-info").wrap("<div class='modal-right col-sm-6 col-xs-12 pl-sm-5 pl-sm-0 pr-0'></div>");
  // add a wrapping div around .drink-img and the newly created .modal-right
  $(".modal-inner").find(".drink-img, .modal-right").wrapAll("<div class='row mx-0 px-0'></div>");
  $(".modal-inner").find(".drink-img").addClass("col-sm-6 col-xs-12 px-0");
    // setup modal
      // measure witdh
      var scrollBarWidth = window.innerWidth - document.body.offsetWidth;
      $("body").css('margin-right', scrollBarWidth);
      // add overflow: hidden; to the body
      $("body").addClass("showing-modal");
      // display modal
      $('#modal').show();
  // Slick carousel Initialization
  $(".modal-inner").find(".shopper").slick({
    swipeToSlide: true,
    infinite: true,
    centerMode: true,
    slidesToShow: 3,
    slidesToScroll: 2,
  });
};

// Clicking outside the inner modal content should close it.
$('#modal').find('.modal-inner').click(function (event) {
    // prevent parent element from running off event
    event.stopPropagation();
  });
$('#modal').click(function () {
    //close modal
    $('body').css('margin-right', '').removeClass('showing-modal');
    $('#modal').hide();
  })


// function to run Walmart shopping API query
function shopForGlass() {
  // save the drink type
  var drinkOfChoice = thisVar.find(".shop-results");
  // save the glass type text which precedes the button
  glass = thisVar.find(".shp").text();
  console.log(glass);
  // builds the API request URL to get cocktail name results
  var queryURL = "https://api.walmartlabs.com/v1/search?apiKey=vcn53dyhzmzmxzmg2krfxddy&query=" + glass + "&categoryId=4044&sort=bestseller";
   console.log(queryURL);
  // AJAX request
  $.ajax({
      url: queryURL,
      method: "GET",
      dataType: "jsonp"
  }).done(function(response) {
    // store the response object
      shopRecos = response.items;
      console.log(shopRecos);
      // build the html that will display the shopping recommendations
      productRecoUL = $("<div>");
      productRecoUL.addClass("shopper");
      // productRecoUL.addClass("owl-theme");
      // loop through each recommendation
      for (s = 0; s < shopRecos.length; s++) {
        // verify the recommendation is available for online purchase
        if (shopRecos[s].availableOnline) {

          // create a new img element
          var resultImg = ($("<img>"));
          // add the API's product image URL to the img element
          resultImg.attr("src", shopRecos[s].imageEntities[0].largeImage);

          // create a new p element for the product name
          var name = ($("<p>"));
          // add the API's product text to the p element
          if (shopRecos[s].name.length > 40) {
            name.text((shopRecos[s].name).substring(0, 40) + "...");
          } else {
            name.text((shopRecos[s].name));
          };
          

          // create a new p element for the price
          var price = ($("<p>"));
          price.text("$" + (shopRecos[s].salePrice).toFixed(2));

          //create the a href element & append to productRecoUL
          var recoLink = $('<a>',{
              href: shopRecos[s].productUrl,
              target: "_blank"
          });

          // build a new div
          var resultDiv = $("<div>", {
            class: "reccomendation"
          });

          // Append/prepend everything
          recoLink.append(resultImg).append(name);
          resultDiv.append(recoLink).append(price);
          productRecoUL.prepend(resultDiv);

         }; // if statement
      }; //end loop
      // console.log(productRecoUL.html());
      // call the openModal function
      openModal();
  });
  //open modal
   
};


