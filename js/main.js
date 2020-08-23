const selArea = document.querySelector("#area");
const tableBody = document.getElementById("countriesTableBody");
const areasList = ["Afrique", "Amerique", "Asie", "Europe", "Oceanie"];
const apiRegionsList = ["Africa", "Americas", "Asia", "Europe", "Oceania"];
for (let i = 0; i < areasList.length; i++) {
  const newOpt = createNode("option");
  newOpt.value = apiRegionsList[i];
  newOpt.text = areasList[i];
  if (newOpt.text == "Europe") {
    newOpt.selected = "selected";
  }
  selArea.add(newOpt);
}
const urlPath = "https://restcountries.eu/rest/v2/region/";
let urlSlug = selArea.value;
const urlQuery = "?fields=name;capital;population;area;flag;borders;alpha3Code";
let urlApi = urlPath + urlSlug + urlQuery;
//"./data/regionalbloc-eu.json"; //for local feed if api server out of reach
tableBody.oldHTML = tableBody.innerHTML;

selArea.addEventListener("change", () => {
  changeMapSrc(selArea.options[selArea.selectedIndex].text);
  urlSlug = selArea.value;
  urlApi = urlPath + urlSlug + urlQuery;
  tableBody.innerHTML = tableBody.oldHTML;
  loadCountries(urlApi);
});

document.onload = loadCountries(urlApi);

function loadCountries(url) {
  fetch(url)
    .then((resp) => resp.json())
    .then((jsonResp) => tableize(jsonResp))
    .catch((error) => console.log("Erreur : " + error));
}

function tableize(countries) {
  console.log(countries);
  countries.forEach((country) => {
    const flagIcon = notNullCheck(country.flag)
      ? '<img id="' + country.alpha3Code + 'FlagId" src="' + country.flag + '">'
      : "";
    const cellVal = new Array(
      notNullCheck(country.name),
      notNullCheck(country.capital),
      notNullCheck(country.population ? numFormat(country.population) : ""),
      notNullCheck(country.area ? numFormat(country.area) : ""),
      densityCalc(country.population, country.area),
      notNullCheck(country.borders.length),
      flagIcon
    );
    const tr = createNode("tr");

    for (let i = 0; i < cellVal.length; i++) {
      const el = cellVal[i];
      const td = createNode("td");
      if (i != 6) {
        td.setAttribute("class", "greyCells");
      }
      if (i == 0) {
        td.setAttribute("class", "greyCells cellsTextLeft bold");
      }
      td.innerHTML = el;
      append(tr, td);
    }

    append(tableBody, tr);

    makeFlagClickable(country.alpha3Code, country.name, country.capital);
  });
}

function makeFlagClickable(alpha3Code, name, capital) {
  document
    .getElementById(alpha3Code + "FlagId")
    .addEventListener("click", function () {
      changeMapSrc(capital + "," + name);
    });
}

function changeMapSrc(qParam) {
  document
    .getElementById("localMap")
    .setAttribute(
      "src",
      "https://www.google.com/maps/embed/v1/place?key=AIzaSyAav3RZzTVK1b3FpvMaDKEI5CNzz-vdHlc&q=" +
        qParam
    );
}

function densityCalc(pop, area) {
  if (pop == null || area == null) {
    return "N/A";
  } else return numFormat(pop / area);
}

function notNullCheck(el) {
  if (el != null) {
    return el;
  } else return "N/A";
}

function numFormat(x) {
  return new Intl.NumberFormat("en-GB", { maximumFractionDigits: 3 }).format(x);
}

function append(parent, el) {
  return parent.appendChild(el);
}

function createNode(el) {
  return document.createElement(el);
}
