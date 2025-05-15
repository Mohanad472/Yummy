let nav_shown = false;

const hiddenBoxWidth = $(".hidden").outerWidth();
let isShown = false;

$(".nav-bar").css({ left: `-${hiddenBoxWidth}px` });

$(".nav-icon").click(function () {
  if (!isShown) {
    $(".nav-bar").animate({ left: `0` }, 500);
    $(".nav-icon i").removeClass("fa-bars");
    $(".nav-icon i").addClass("fa-xmark");

    // $("ul.links li")
    //   .eq(0)
    //   .slideUp(200, function () {
    //     $("ul.links li")
    //       .eq(1)
    //       .slideUp(200, function () {
    //         $("ul.links li")
    //           .eq(2)
    //           .slideUp(200, function () {
    //             $("ul.links li")
    //               .eq(3)
    //               .slideUp(200, function () {
    //                 $("ul.links li").eq(4).slideUp(200);
    //               });
    //           });
    //       });
    //   });
    isShown = true;
  } else {
    $(".nav-bar").animate({ left: `-${hiddenBoxWidth}px` }, 500);
    $(".nav-icon i").addClass("fa-bars");
    $(".nav-icon i").removeClass("fa-xmark");
    isShown = false;
  }
});

async function getData(dataType, inputValue) {
  let x;
  if (dataType == "name") {
    x = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${inputValue}`
    );
  } else if (dataType == "letter") {
    x = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=${inputValue}`
    );
  } else if (dataType == "category") {
    x = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${inputValue}`
    );
  } else if (dataType == "area") {
    x = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?a=${inputValue}`
    );
  } else if (dataType == "ingredient") {
    x = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${inputValue}`
    );
  } else if (dataType == "allAreas") {
    x = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
  } else if (dataType == "id") {
    x = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${inputValue}`
    );
  } else if (dataType == "allCategories") {
    x = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
  } else if (dataType == "allIngredients") {
    x = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list
`);
  }

  let data;
  if (x.ok) {
    data = await x.json();
  }
  return data;
}

async function display(dataType, inputValue) {
  $(".search").removeClass("d-none");
  $(".description").addClass("d-none");
  $(".categories").addClass("d-none");
  $(".ingredients").addClass("d-none");
  let cartona = "";
  let y = await getData(dataType, inputValue);
  let meals;

  if (dataType == "allCategories") {
    $(".categories").removeClass("d-none");
    $(".search").addClass("d-none");
    meals = y.categories;
  } else if (dataType == "allAreas") {
    $(".categories").addClass("d-none");
    $(".search").addClass("d-none");
    $(".area").removeClass("d-none");

    meals = y.meals;
  } else if (dataType == "allIngredients") {
    $(".description").addClass("d-none");
    $(".categories").addClass("d-none");
    $(".search").addClass("d-none");

    $(".area").addClass("d-none");
    $(".ingredients").removeClass("d-none");
    meals = y.meals;
  } else {
    meals = y.meals;
  }

  if (dataType == "area") {
    $(".area").addClass("d-none");
    $(".description").addClass("d-none");
  }

  if (dataType == "search") {
    $(".description").addClass("d-none");
    console.log("hello");
  }
  if (dataType == "ingredient") {
    $(".ingredients").addClass("d-none");
  }

  let limit = meals.length;
  if (dataType != "allAreas") {
    if (limit > 20) {
      limit = 20;
    }
  }

  if (dataType == "allCategories") {
    for (let i = 0; i < limit; i++) {
      cartona += `<div class="col-md-3 g-3">
      <div class="inner position-relative overflow-hidden rounded-2" onclick="display('category','${meals[i].strCategory}')">
                <img src="${meals[i].strCategoryThumb}" class="w-100" alt="" />
                <div
                  class="slider d-flex flex-column align-items-center overflow-hidden p-2"
                >
                  <h3>${meals[i].strCategory}</h3>
                  <p>
                     ${meals[i].strCategoryDescription}
                  </p>
                </div>
                </div>
              </div>`;
    }
    $(".categories .row").html(cartona);
  } else if (dataType == "allAreas") {
    for (let i = 0; i < limit; i++) {
      cartona += `<div class="col-md-3 text-center">
              <div class="inner" onclick="display('area','${meals[i].strArea}')">
              <i class="fa-solid fa-house fa-4x"></i>
              <h3>${meals[i].strArea}</h3>
            </div></div>`;
    }
    $(".area .row").html(cartona);
  } else if (dataType == "allIngredients") {
    for (let i = 0; i < limit; i++) {
      cartona += `<div class="col-md-3 overflow-hidden">
              <div class="inner text-center p-2" onclick="display('ingredient', '${
                meals[i].strIngredient
              }')">
                <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                <h3>${meals[i].strIngredient}</h3>
                <p>
                  ${meals[i].strDescription.split(" ").slice(0, 20).join(" ")}
                </p>
              </div>
            </div>`;
      $(".ingredients .row").html(cartona);
    }
  } else {
    for (let i = 0; i < limit; i++) {
      cartona += `<div class="col-md-3">
              <div class="inner" onclick="details(${meals[i].idMeal})">
               <img src="${meals[i].strMealThumb}" alt="" srcset="" />
               <div class="slider"><h3>${meals[i].strMeal}</h3></div>
                 </div>
              </div>`;
    }
    $(".search .row").html(cartona);
  }
}

async function details(id) {
  $(".description").removeClass("d-none");
  $(".area").addClass("d-none");
  $(".mySearch").addClass("d-none");
  let z = await getData("id", id);
  let meal = z.meals[0];
  let ingredientsHTML = "";
  for (let i = 1; i <= 20; i++) {
    let key = `strIngredient${i}`;
    let measureKey = `strMeasure${i}`;

    let value = meal[key];
    let measureValue = meal[measureKey];

    if (value == "" || value == null) {
      break;
    } else {
      ingredientsHTML += `<li class="alert alert-info">${measureValue} ${value}</li>`;
    }
  }

  let tagsHTML = "";
  let tags = meal.strTags;
  if (tags != null && tags != "") {
    tags = tags.split(",");

    for (let i = 0; i < tags.length; i++) {
      tagsHTML += `<li class="alert alert-danger">${tags[i]}</li>`;
    }
  }

  $(".search").addClass("d-none");
  $(".description").removeClass("d-none");

  $(".description .row").html(`<div class="col-md-4">
    <div class="inner photo">
    <img src="${meal.strMealThumb}" class="w-100" alt="" srcset="" />
    </div>
    <h2 class="text-white">${meal.strMeal}</h2>
    </div>
    <div class="col-md-8">
    <div class="inner text-white">
    <h2>Instructions</h2>
    <p>
    ${meal.strInstructions}
    </p>
    <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
    <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
    <h3>Recipes :</h3>
    <ul class="text-black list-unstyled d-flex flex-wrap flex-row mb-3">
    ${ingredientsHTML}
    </ul>
    <h3 class="mb-2">Tags :</h3>
                <ul
                  class="text-black list-unstyled d-flex flex-row flex-wrap mb-3"
                >
                  ${tagsHTML}
                </ul>
    
    <div>
    <a href="" class="btn btn-success">Source</a>
    <a href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
    </div>
    </div>
    </div>`);
}

$(".nav-bar ul li#search").on("click", function () {
  search();
});

$("#name").on("input", function () {
  clear();
  if ($("#name").val() == "") {
    clear();
  } else {
    display("name", $("#name").val());
  }
});

$("#letter").on("input", function () {
  let x = $("#letter").val()[$("#letter").val().length - 1];
  $("#letter").val(x);
  if ($("#letter").val() == "") {
    clear();
  } else {
    display("letter", x);
  } // if ($("#letter").val().length > 1) {
  //   clear();
  //   display("letter", $("#letter").val());
  // }
});

function search() {
  $(".mySearch").removeClass("d-none");
  $(".contact").addClass("d-none");

  $(".nav-bar").animate({ left: `-${hiddenBoxWidth}px` }, 500);
  $(".nav-icon i").addClass("fa-bars");
  $(".nav-icon i").removeClass("fa-xmark");
  isShown = false;
  clear();
  display("search", "");
}

display("name", "");

function clear() {
  $(".search .row").html("");
  $(".categories .row").html("");
}

$("#cat").on("click", function () {
  $(".mySearch").addClass("d-none");
  $(".contact").addClass("d-none");
  isShown = false;

  clear();
  $(".mySearch").addClass("d-none");
  $(".nav-bar").animate({ left: `-${hiddenBoxWidth}px` }, 500);
  $(".nav-icon i").addClass("fa-bars");
  $(".nav-icon i").removeClass("fa-xmark");

  display("allCategories", "");
});

$("#area").on("click", function () {
  $(".mySearch").addClass("d-none");
  $(".contact").addClass("d-none");
  isShown = false;

  clear();
  $(".mySearch").addClass("d-none");
  $(".categories").addClass("d-none");
  $(".nav-bar").animate({ left: `-${hiddenBoxWidth}px` }, 500);
  $(".nav-icon i").addClass("fa-bars");
  $(".nav-icon i").removeClass("fa-xmark");

  display("allAreas", "");
});

$("#ing").on("click", function () {
  $(".mySearch").addClass("d-none");
  $(".contact").addClass("d-none");
  isShown = false;

  clear();
  $(".nav-bar").animate({ left: `-${hiddenBoxWidth}px` }, 500);
  $(".nav-icon i").addClass("fa-bars");
  $(".nav-icon i").removeClass("fa-xmark");
  display("allIngredients", "");
});

$("#contact").on("click", function () {
  clear();
  $(".nav-bar").animate({ left: `-${hiddenBoxWidth}px` }, 500);
  $(".nav-icon i").addClass("fa-bars");
  $(".nav-icon i").removeClass("fa-xmark");
  $(".contact").removeClass("d-none");

  $(".mySearch").addClass("d-none");
  $(".search").addClass("d-none");
  $(".area").addClass("d-none");
  $(".ingredients").addClass("d-none");
  $(".categories").addClass("d-none");
  $(".description").addClass("d-none");
  isShown = false;
});
