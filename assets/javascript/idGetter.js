var iList = [];
var iMin = 0; var iMax = 0;
for (j = 10000; j < 14000; j++) {  // 11000 to 18000
  // 2nd API call to get recipe details
  var qURL2 = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + j;
  $.get(qURL2).done(function(response) {
    if (!(response.drinks == null)) {
      var results = response.drinks[0];
      for (k = 1; k <= 15; k++) {
        if (!(results["strIngredient" + k] == null)) {
          if (results["strIngredient" + k].trim().length > 0) {
            var ing = results["strIngredient" + k].trim();
            if (iList.indexOf(ing) == -1) {
              iList.push(ing);
              if (iMin == 0) {iMin = j;}
              iMax = j;
            }
          }
        }
      }
    }
  });
}
console.log(iList);
console.log("min: " + iMin);
console.log("max: " + iMax);
/* run in console:
iList = iList.sort();
var sList = 'var iList = [';
for (i = 0; i < iList.length; i++) {
  sList += '"' + iList[i] + '"';
  if (i < iList.length - 1) {
    sList += ', ';
  }
}
sList += '];';
console.log(sList);
*/