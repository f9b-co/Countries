const table = document.getElementById("countriesTable");
const urlApi =
  "https://restcountries.eu/rest/v2/region/europe?fields=name;capital;population;area;flag;borders;alpha3Code";

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
      notNullCheck(numformat(country.population)),
      notNullCheck(numformat(country.area)),
      densityCalc(country.population, country.area),
      notNullCheck(country.borders.length),
      flagIcon
    );
    const tr = createNode("tr");


    for (let i = 0; i < cellVal.length; i++) {
      const el = cellVal[i];
      const td = createNode("td");
      td.innerHTML = el;
      append(tr, td);
    }

    append(table, tr);

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
      window.location = "#map";
    });
}

function densityCalc(pop, area) {
  if (pop == null || area == null) {
    return "N/A";
  } else return numformat(pop / area);
}

function notNullCheck(el) {
  if (el != null) {
    return el;
  } else return "N/A";
}

function numformat(x) {
  return new Intl.NumberFormat("en-GB", { maximumFractionDigits: 3 }).format(x);
}

function createNode(el) {
  return document.createElement(el);
}

function append(parent, el) {
  return parent.appendChild(el);
}
