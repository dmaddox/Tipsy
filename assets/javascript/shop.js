var qGlass = "martini glass"

// builds the API request URL to get cocktail name results
  var queryURL = "http://api.walmartlabs.com/v1/search?apiKey=vcn53dyhzmzmxzmg2krfxddy&query=" + qGlass + "&categoryId=4044&sort=bestseller";
  console.log(queryURL);
  // AJAX request
  $.ajax({
      url: queryURL,
      method: "GET",
      dataType: "jsonp"
    }).done(function(response) {


     console.log(response);
 });