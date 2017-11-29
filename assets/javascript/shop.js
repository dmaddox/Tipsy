function shopGlass() {
  console.log(qGlass);
  // builds the API request URL to get cocktail name results
  var queryURL = "https://api.walmartlabs.com/v1/search?apiKey=vcn53dyhzmzmxzmg2krfxddy&query=" + qGlass + "&categoryId=4044&sort=bestseller";
  // AJAX request
  $.ajax({
      url: queryURL,
      method: "GET",
      dataType: "jsonp"
  }).done(function(response) {
      var products = response.items;
      var search = true;
      var p = 0;

      do {
        console.log(products[p].availableOnline);
        if (products[p].availableOnline) {
          // console.log("You can buy " + products[p].name + " at Walmart here: " + products[p].productUrl ); 
          // $(".drink-info").append("You can buy " + products[p].name + " at Walmart here: " + products[p].productUrl );
          $(".drink-info").append("You can buy " + products[0].name + " at Walmart here: " + products[0].productUrl + " <br> -- " + search + " <br> -- " );
          search = false;
          $(".drink-info").append( " <br> -- after search = false " +search+ " <br> -- " );
        } else {
          p++;
        };
      } while (search);
  });

};
