// IIFE to not pollute the global context
(function (global) {

var dc = {};

var homeHtmlUrl = "snippets/home-snippet.html";
var allCategoriesUrl = "https://davids-restaurant.herokuapp.com/categories.json";
var categoriesTitleHtml = "snippets/categories-title-snippet.html";
var categoryHtml = "snippets/category-snippet.html";
var menuItemsUrl = "https://davids-restaurant.herokuapp.com/menu_items.json?category=";
var menuItemsTitleHtml = "snippets/menu-items-title.html";
var menuItemHtml = "snippets/menu-item.html";

// Convenience function for inserting innerHTML for 'select'
var insertHtml = function (selector, html) {
  var targetElem = document.querySelector(selector);
  targetElem.innerHTML = html;
};

// Show loading icon inside element identified by 'selector'.
var showLoading = function (selector) {
  var html = "<div class='text-center'>";
  html += "<img src='images/ajax-loader.gif'></div>";
  insertHtml(selector, html);
};

// Return substitute of '{{propName}}'
// with propValue in given 'string'
var insertProperty = function (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  string = string.replace(new RegExp(propToReplace, "g"), propValue);
  return string;
};

// On page load (before images or CSS)
document.addEventListener("DOMContentLoaded", function (event) {
  // On first load, show home view
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    homeHtmlUrl,
    function (responseText) {
      document.querySelector("#main-content")
        .innerHTML = responseText;
    },
    false);
});

// STEP 1: Set up a random category generator function
function chooseRandomCategory(categories) {
  var randomArrayIndex = Math.floor(Math.random() * categories.length);
  return categories[randomArrayIndex];
}

// STEP 2: Add the function into the global context so it can be called from other places
global.$dc = dc;
dc.chooseRandomCategory = chooseRandomCategory;

// STEP 3: Load the categories JSON file and set up the click event
dc.loadMenuCategories = function () {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowCategoriesHTML);
};

function buildAndShowCategoriesHTML (categories) {
  // Load title snippet of categories page
  $ajaxUtils.sendGetRequest(
    categoriesTitleHtml,
    function (categoriesTitleHtml) {
      // Retrieve single category snippet
      $ajaxUtils.sendGetRequest(
        categoryHtml,
        function (categoryHtml) {
          var categoriesViewHtml =
            buildCategoriesViewHtml(categories,
                                    categoriesTitleHtml,
                                    categoryHtml);
          insertHtml("#main-content", categoriesViewHtml);
        },
        false);
    },
    false);
}

// Builds HTML for the categories page based on the data
// from the server
function buildCategoriesViewHtml(categories,
                                 categoriesTitleHtml,
                                 categoryHtml) {
  var finalHtml = categoriesTitleHtml;
  finalHtml += "<section class='row'>";

  // Loop over categories
  for (var i = 0; i < categories.length; i++) {
    // Insert category values
    var html = categoryHtml;
    var name = "" + categories[i].name;
    var short_name = categories[i].short_name;
    html =
      insertProperty(html, "name", name);
    html =
      insertProperty(html, "short_name", short_name);
    finalHtml += html;
  }

  finalHtml += "</section>";
  return finalHtml;
}

// STEP 4: Modify the home HTML to load random category
$ajaxUtils.sendGetRequest(
  allCategoriesUrl,
  function (categories) {
    var randomCategoryShortName = 
      chooseRandomCategory(categories).short_name;

    // Load the home snippet HTML
    $ajaxUtils.sendGetRequest(
      homeHtmlUrl,
      function (homeHtml) {
        var homeHtmlToInsertIntoMainPage = 
          insertProperty(homeHtml, 
                         "randomCategoryShortName", 
                         randomCategoryShortName);
        insertHtml("#main-content", homeHtmlToInsertIntoMainPage);
      },
      false);
  },
  true); // JSON=true

})(window);
