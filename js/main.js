const tableBody = document.getElementById("countriesTableBody");
const urlApi = "./data/regionalbloc-eu.json";
//"https://restcountries.eu/rest/v2/region/europe?fields=name;capital;population;area;flag;borders;alpha3Code";

document.onload = loadCountries(urlApi);

function loadCountries(url) {
  fetch(url)
    .then((resp) => resp.json())
    .then((jsonResp) => tableize(jsonResp))
    .catch((error) => console.log("Erreur : " + error));
}

function tableize(countries) {
  countries.forEach((country) => {
    const flagIcon = notNullCheck(country.flag)
      ? '<img id="' + country.alpha3Code + 'FlagId" src="' + country.flag + '">'
      : "";
    const cellVal = new Array(
      notNullCheck(country.name),
      notNullCheck(country.capital),
      notNullCheck(numFormat(country.population)),
      notNullCheck(numFormat(country.area)),
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
      document
        .getElementById("localMap")
        .setAttribute(
          "src",
          "https://www.google.com/maps/embed/v1/place?key=AIzaSyAav3RZzTVK1b3FpvMaDKEI5CNzz-vdHlc&q=" +
            capital +
            "," +
            name
        );
    });
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
