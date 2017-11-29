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
    var products = response.items;
    var search = true;
    var p = 0;
    do {
        if (products[p].availableOnline) {
          console.log("You can buy " + products[p].name + " at Walmart here: " + products[p].productUrl ); 
          search = false;
        } else {
          p++;
        }
    } while (search);
    console.log(products);
});