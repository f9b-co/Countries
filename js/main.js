const table = document.getElementById("countriesTable");
const url =
  "https://restcountries.eu/rest/v2/region/europe?fields=name;capital;population;area;flag;borders;alpha3Code";

fetch(url)
  .then((resp) => resp.json())
  .then((jsonResp) => tableize(jsonResp))
  .catch((error) => console.log("Erreur : " + error));

function tableize(countries) {
  return countries.map(function (country) {
    let tr = createNode("tr"),
      td1 = createNode("td"),
      td2 = createNode("td"),
      td3 = createNode("td"),
      td4 = createNode("td"),
      td5 = createNode("td"),
      td6 = createNode("td"),
      td7 = createNode("td");

    td1.innerHTML = notNullCheck(country.name);
    td2.innerHTML = notNullCheck(country.capital);
    td3.innerHTML = notNullCheck(numformat(country.population));
    td4.innerHTML = notNullCheck(numformat(country.area));
    td5.innerHTML = densityCalc(country.population, country.area);
    td6.innerHTML = notNullCheck(country.borders.length);
    td7.innerHTML = notNullCheck(country.flag)
      ? '<img id="' + country.alpha3Code + 'FlagId" src="' + country.flag + '">'
      : "";

    append(tr, td1);
    append(tr, td2);
    append(tr, td3);
    append(tr, td4);
    append(tr, td5);
    append(tr, td6);
    append(tr, td7);
    append(table, tr);

    document
      .getElementById(country.alpha3Code + "FlagId")
      .addEventListener("click", function () {
        document.getElementById("localMap").src =
          "https://www.google.com/maps/embed/v1/place?key=AIzaSyAav3RZzTVK1b3FpvMaDKEI5CNzz-vdHlc&q=" +
          country.capital +
          "," +
          country.name;
      });
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
  return new Intl.NumberFormat("en-GB").format(Number.parseFloat(x).toFixed(3));
}

function createNode(el) {
  return document.createElement(el);
}

function append(parent, el) {
  return parent.appendChild(el);
}
