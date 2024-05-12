const URL = "http://localhost:3260";

async function sectionDisplay(name) {
  // To hide all other sections when using navbar
  const sections = document.getElementsByClassName("main-sections");
  for (const s of sections) {
    if (s.id !== name) s.style.display = "none";
    else {
      s.style.removeProperty("display");
      updateToDB("current-view", name);
    }
  }
}

// Displays tooltips for the resources page
function tooltipDisplay(name) {
  const tipElement = document.getElementById("tip");
  switch (name) {
    case "UNFCCC": {
      tipElement.innerText =
        "The UN process for negotiating\n an agreement to limit dangerous\n climate change.";
      break;
    }
    case "IPCC": {
      tipElement.innerText =
        "An intergovernmental body of the United Nations made to\n advance scientific knowledge\n about climate change.";
      break;
    }
    case "WMO": {
      tipElement.innerText =
        "Agency of the United Nations\n responsible for promoting\n international cooperation on\n atmospheric science.";
      break;
    }
    case "World-Bank": {
      tipElement.innerText =
        "The World Bank Group is the\n biggest multilateral funder\n of climate investments in\n developing countries.";
      break;
    }
    case "UNEP": {
      tipElement.innerText =
        "Responsible for coordinating\n responses to environmental issues\n within the United Nations system.";
      break;
    }
    case "GCF": {
      tipElement.innerText =
        "Accelerates transformative\n climate action in\n developing countries";
      break;
    }
    case "CAN": {
      tipElement.innerText =
        "A global network of over 1,300\n environmental non-governmental\n organisations";
      break;
    }
    case "Climate-Group": {
      tipElement.innerText =
        "A non-profit organisation that\n works with businesses and\n government leaders aiming\n to address climate change. ";
      break;
    }
    case "GGGI": {
      tipElement.innerText =
        "Intergovernmental organization\n based in Seoul, South Korea.\n It is dedicated to promoting\n green growth around\n the world.";
      break;
    }
    case "IRENA": {
      tipElement.innerText =
        "Intergovernmental organization\n mandated to facilitate\n cooperation of renewable energy.";
      break;
    }
  }
}

// Clears tooltips for the resources page
function clearTooltipDisplay() {
  document.getElementById("tip").innerText = "";
}

document
  .getElementById("homeBtn")
  .addEventListener("click", () => sectionDisplay("home-section"));
document
  .getElementById("mapBtn")
  .addEventListener("click", () => sectionDisplay("map-section"));
document
  .getElementById("simBtn")
  .addEventListener("click", () => sectionDisplay("simulation-section"));
document
  .getElementById("resourcesBtn")
  .addEventListener("click", () => sectionDisplay("resources-section"));

const cardPictures = document.getElementsByClassName("card-picture");
for (const p of cardPictures) {
    const name = p.id;
    p.addEventListener("mouseover", () => tooltipDisplay(name));
    p.addEventListener("mouseout", () => clearTooltipDisplay());
}

const electricityRangeVal = document.getElementById("electricityRangeValue");
const transportationRangeVal = document.getElementById("transportationRangeValue");
const agricultureRangeVal = document.getElementById("agricultureRangeValue");
const industryRangeVal = document.getElementById("industryRangeValue");
const otherRangeVal = document.getElementById("otherRangeValue");

/**
 * Generates the simulation chart based on the values of the sliders. It takes the values in each of the sliders and uses them to apply a formula to the initial data.
 * The chart then displays the original data and the projected data side by side, to allow the user to the consequences of their choices.
 */
function createSimulationChart() {
    // Get the values of the 5 slides
    const electricityChange = parseFloat(electricityRangeVal.innerText);
    const transportationChange = parseFloat(transportationRangeVal.innerText);
    const agricultureChange = parseFloat(agricultureRangeVal.innerText);
    const industryChange = parseFloat(industryRangeVal.innerText);
    const otherChange = parseFloat(otherRangeVal.innerText);

    // Apply a formula to the initial data using the slider values
    const countryCode = getLocation();
    const data = getLocationData(countryCode);
    
    const initialData = [data, data + 0.5, data + 1, data + 1.5, data + 2, data + 2.5, data + 3, data + 3.5, data + 4, data + 4.5, data + 5, data + 5.5, data + 6, data + 6.5, data + 7, data + 7.5];
    const xValues = [2025, 2030, 2035, 2040, 2045, 2050, 2055, 2060, 2065, 2070, 2075, 2080, 2085, 2090, 2095, 2100];
    const yValues = initialData.map(x => x + 0.05 * electricityChange + 0.03 * transportationChange + 0.05 * agricultureChange + 0.04 * industryChange + 0.03 * otherChange);
    const projColor = yValues[0] > initialData[0] ? "red" : "green"; // The projected data will be red if temperature is higher, and green otherwise
    
    new Chart('predictionChart', {
        type: 'bar',
        data: {
            labels: xValues,
            datasets: [{
                label: 'Current Temperature',
                backgroundColor: "yellow",
                data: initialData,
                stack: 'Stack 0'
            }, 
            {
                label: 'Projected Temperature',
                backgroundColor: projColor,
                data: yValues,
                stack: 'Stack 1'
            }]
        },       
        options: {
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Year'
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Temperature (°F)'
                    },
                    ticks: {
                        min: 20, 
                        max:80, 
                        stepSize: 5
                    }
                }],
            },
        }
    });
}
const simButton = document.getElementById("simulateButton");
simButton.addEventListener('click', createSimulationChart);
const clearButton = document.getElementById("clearBtn");
clearButton.addEventListener("click", clearDB);

async function getLocation() {
    // Get user's location
    let latitude = null;
    let longitude = null;
    const successHandler = (position) => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
    };
    const errorHandler = (_) => {
      // Amherst is default location
      latitude = -72.5199;
      longitude = 42.3732;
    };
    navigator.geolocation.getCurrentPosition(successHandler, errorHandler);
    const url = "http://api.geonames.org/countryCodeJSON?lat=" + latitude + "&lng=" + longitude + "&username=bionic";
    
    const response = await fetch(url);
    if (response.ok) {
      const json = response.json();
      return json.countryCode;
    }
    else {
      return "US";
    }
}

async function getLocationData(alpha2) {
  const csv = await d3.csv(`data/CountryInfo.csv`)
  const row = csv.filter(row => row.alpha2 === alpha2);
  const temp = row.map(row => parseFloat(row.avgtemp));
  return (9 / 5 * temp) + 32;
}

async function loadFromDB(name) {
  const resp = await fetch(URL + `/getData?name=${name}`);
  const data = await resp.json();
  return data;
}

async function saveToDB(name, value) {
  fetch(URL + "/saveData", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({name, value})
  });
}

async function updateToDB(name, value) {
  fetch(URL + "/updateData", {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({name, value})
  });
}

async function collectPageData(pageData) {
  const resp = await fetch(URL + "/getAll");
  const dbVals = await resp.json();
  dbVals.forEach(e => pageData[e._id] = parseInt(e.value));
}

const sliders = document.getElementsByClassName("slider");
const pageData = {}
await collectPageData(pageData);

if (!("current-view" in pageData)) saveToDB("current-view", "home-section");
const currView = await loadFromDB("current-view");
sectionDisplay(currView.value);

for (const s of sliders) {
  if (!(s.id in pageData)) saveToDB(s.id, 0);
  else {
    s.value = pageData[s.id];
    document.getElementById(s.id + "RangeValue").innerHTML = s.value;
  }
  s.oninput = () => {
    document.getElementById(`${s.id}RangeValue`).innerText = s.value;
    updateToDB(s.id, s.value);
  } 
}

createSimulationChart();

function clearDB() {
  for (const key of Object.keys(pageData)) {
    if (key !== "current-view") {
      updateToDB(key, 0);
    }
  }
  for (const s of sliders) {
      s.value = 0;
      document.getElementById(s.id + "RangeValue").innerHTML = 0;
  }
  createSimulationChart();
}


// map section

/**
 * Initializes the buttons for customizing the color scheme of the map.
 * Adds radio button functionality and updates the map and color scale.
 */
function initColorBtns() {
  for (const btnElement of colorBtns) {
    // set color of each button according to custom element attribute
    btnElement.style.background = colorKey[btnElement.getAttribute("data-color")];
    btnElement.addEventListener("click", () => {
      for (const otherBtn of colorBtns) {
        // mark clicked button as selected and unmark all other buttons
        if (otherBtn === btnElement) {
          otherBtn.classList.add("selected");
          otherBtn.style.borderWidth = "2px";
          otherBtn.opacity = "0.6";
        } else {
          otherBtn.classList.remove("selected");
          otherBtn.style.borderWidth = "0px";
          otherBtn.opacity = "1";
        }
        // update the color scale with the clicked button's color
        currentColor = btnElement.getAttribute("data-color")
        updateColorScale();
      }
      // update map to display color change
      updateMap();
    });
  }
}

// // stores all data, with keys being numberic IDs corresponding to each data file (see dataNameKey)
// const data = {};

// stores the domain (min, max) for each data file
const domainKey = {};

// stores mapping between numeric IDs and data names
const dataNameKey = {};

/**
 * Initializes the data and domainKey objects by reading data files from /data.
 * Reads data and creates an object for each data file with country ISO3 codes
 * as keys and the corresponding data as values. These objects are stored in the
 * data object.
 */
async function initData() {
  const data_files = [
    {
      filename: "avg_temp_change", source: "FAOSTAT", 
      units: "°C", title: "Average Temp. Change since 1951-1980", label: "Temperature Change"
    },
    {
      filename:"ghg-emissions", source: "Climate Watch",
      units: "MtCO2e per person", title: "Carbon Dioxide Emissions Per Capita", label: "CO2 Emissions"
    },
    {
      filename:"Forest_and_Carbon", source: "FAO",
      units: "%", title: "Forest Cover Index (relative to 1992)", label: "Forest Cover"
    },
    {
      filename:"Climate-related_Disasters_Frequency", source: "The Emergency Events Database (EM-DAT)", units: "disasters",
      title: "Frequency of Climate-related Disasters", label: "Climate-related Disasters"},
  ];
  let population_data = await d3.csv(`data/population.csv`);
  const object_index = {};
  population_data.forEach(row => {
    if (!(row["ISO3"] in object_index)) {
      object_index[row["ISO3"]] = {};
    }
    object_index[row["ISO3"]][row["Year"]] = row["Population (historical estimates)"];
  });
  population_data = object_index;
  return Promise.all(data_files.map(async (fileInfo, idx) => {
    let rawData = await d3.csv(`data/${fileInfo.filename}.csv`);
    rawData = rawData.filter(row => {
      if (fileInfo.filename == "Forest_and_Carbon") {
        if (row["Indicator"] === "Index of forest extent" && row["ISO3"].length === 3) {
          return true;
        }
        return false;
      }
      else if (fileInfo.filename === "Climate-related_Disasters_Frequency") {
        if (row["Indicator"] === "Climate related disasters frequency, Number of Disasters: TOTAL") {
          return true;
        }
        return false;
      }
      return true;
    });
    if (fileInfo.filename === "ghg-emissions") {
      rawData.map(row => {
        if (row["ISO3"].length === 3) {
          for (const key in row) {
            if (!isNaN(key) && !isNaN(row[key])) {
              row[key] = (parseFloat(row[key])*1000000/parseFloat(population_data[row["ISO3"]][key])).toFixed(3);
            }
          }
        }
      });
    }
    let [minYear, maxYear] = [Infinity, -Infinity];
    const [min, max, parsedData] = rawData.reduce((acc, elem) => {
      acc[2][elem["ISO3"]] = elem;
      const [currMin, currMax] = Object.entries(elem).reduce((domain, keyVal) => {
        // only want to look at values which have a year as a key
        if (isNaN(keyVal[0]) || keyVal[1] === '') {
          return domain;
        }
        minYear = Math.min(minYear, keyVal[0]);
        maxYear = Math.max(maxYear, keyVal[0]);
        return [Math.min(domain[0], +keyVal[1]), Math.max(domain[1], +keyVal[1])];
      }, [acc[0], acc[1]]);
      return [currMin, currMax, acc[2]];
    }, [Infinity, -Infinity, {}]);
    parsedData["domain"] = {min: Math.floor(min), max: Math.ceil(max)};
    parsedData["yearRange"] = {min: minYear, max: maxYear};
    parsedData["source"] = fileInfo.source;
    parsedData['units'] = fileInfo.units;
    parsedData['title'] = fileInfo.title;
    parsedData["label"] = fileInfo.label;
    return parsedData;
  }))
}

/**
 * Loads processed data from JSON file. Data was first processed with initData(),
 * then stored as a JSON file to skip data processing for future. Data object loaded in stores an array
 * of data objects, each containing values per country measuring a particular metric/type of data.
 * Also updates the dataNameKey.
 */
async function loadMapData() {

}

/**
 * Initializes map slider in side panel that controls the year displayed.
 * Also sets up animation button next to the slider that automatically 
 * moves through the entire range of years.
 */
function initMapSlider() {
  let sliderUpdates = undefined;
  let btnState = 0;
  // helper function to switch the state of the button and slider
  function updateAnimateBtn() {
    btnState = 1 - btnState;
    animateBtn.innerText = ["Play","Stop"][btnState];
    slider.disabled = btnState === 1;
  }
  animateBtn.onclick = () => {
    updateAnimateBtn();
    // when button is clicked, automatically increment year and update the side panel and text
    if (btnState === 1) {
      slider.value = slider.value % slider.max;
      sliderUpdates = setInterval(() => {
        if (slider.value === slider.max) {
          updateAnimateBtn();
          clearInterval(sliderUpdates);
        } else {
          slider.value++; 
        }
        sliderYear = slider.value;
        year.innerText = slider.value;
        updateMap();
      }, 200);
    } else {
      clearInterval(sliderUpdates);
    }
  }
  slider.min = data[currentData].yearRange.min;
  slider.max = data[currentData].yearRange.max;
  slider.value = data[currentData].yearRange.min;
  year.innerText = slider.value;
}

/**
 * Creates and initializes the data for the map, providing a view of various data metrics
 * to the user
 * @returns path which can be used to update the map and retrieve new data
 */
function initMap() {
  const svg = d3.select("#map").append("svg")
    .attr("preserveAspectRatio", "xMinYMin")
    .attr("viewBox", "0 0 960 500")
    .attr("z-index", "1")
    .classed("svg-responsive", true);

  const projection = d3.geoMercator()
    .center([0,0])
    .scale(150)
    .rotate([0,0]);

  const path = d3.geoPath()
    .projection(projection);

  const g = svg.append("g");

  const zoom = d3.zoom()
    .scaleExtent([1,10])
    .on("zoom",function(e) {
        g.attr("transform", e.transform)
    });

  svg.call(zoom);
  return [path, g];
}

/**
 * Creates the map using the TopoJSON data for the world and adding attributes to all 
 * elements created using this data (in this case countries), including color.
 * 
 * @param {*} topology TopoJSON data for creating and displaying a map.
 */
function makeMap(topology) {
  const topoInfo = topojson.feature(topology, topology.objects.countries);
  g.selectAll("path")
  .data(topoInfo.features)
  .enter()
  .append("path")
  .attr("d", path)
  .style("opacity", 1)
  .attr("fill", d => {
    const countryObj = countryCodes[d.id] || {}
    const countryData = data[currentData][countryObj["alpha-3"]] || {};
    return colorScale(countryData[sliderYear] || data[currentData].domain.min);
  })
  .on("mouseover", mouseOver)
  .on("mouseleave", mouseLeave)
}

/**
 * Updates the country which is being hovered upon to highlight it and update the data 
 * for the specified country
 * @param {*} event the event activating the eventListener, generally "MouseOver"
 */
function mouseOver(event) {
  d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", 0.8)
  d3.select(this)
      .transition()
      .duration(100)
      .style("opacity", 0.8)
      .style("stroke-width", "0.25px")
  const countryID = event.srcElement.__data__.id;
  const countryObj = countryCodes[countryID] || {};
  currCountry = countryObj["alpha-3"];
  const countryData = data[currentData][currCountry] || {};
  country.innerText = countryObj["name"] || "N/A";
  currData.innerText = countryData[sliderYear] ? `${countryData[sliderYear]} ${data[currentData].units}` : "No data available";
}
/**
 * Returns the country highlighted to normal hue and reverts the data display
 */
function mouseLeave() {
  d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", 1);
  d3.select(this)
      .transition()
      .duration(100)
      .style("opacity", 1)
      .style("stroke-width", "0.1px");
  country.innerText = "None";
  currData.innerText = "None";
  currCountry = "";
}

/**
 * Generates the d3 color scale corresponding to the currently chosen color scheme.
 * @returns A d3 color scale object corresponding to the current color scheme.
 */
function currColorScale() {
  return d3.scaleSequential()
      .domain([data[currentData]["domain"]["min"], data[currentData]["domain"]["max"]])
      .interpolator(scaleKey[currentColor]);
}
const updateColorScale = () => colorScale = currColorScale();

/**
 * Updates the map based off of the year and recolors the map based off the new
 * statistics
 */
function updateMap() {
  if (currCountry === "") {
    currData.innerText = "None";
  } else {
    const currInfo = (data[currentData][currCountry] || {})[sliderYear];
    currData.innerText = currInfo ? `${currInfo} ${data[currentData].units}` : "No data available";
  }
  d3.selectAll("path")
    .transition()
    .duration(75)
    .attr("fill", d => {
      const countryObj = countryCodes[d.id] || {};
      const selectedData = data[currentData][countryObj["alpha-3"]] || {};
      updateColorScale();
      return colorScale(selectedData[sliderYear] || data[currentData].domain.min);
    });
}

/**
 * Initializes and creates the dropdown used to dictate which metric for data comparison is used.
 */
function initDropdown() {
  const dropdownSelection = document.getElementById("data-selector")
  const dropdownSelected = document.getElementById("data-selected")
  const dropdownArrow = document.getElementById("arrow");
  const dropdownMenu = document.getElementById("data-menu")
  const dropdownOptions = document.querySelectorAll("#data-menu li");

  title.innerText = data[currentData].title;
  dropdownSelected.innerText = data[currentData].label;

  dropdownSelection.addEventListener("click", () => {
    dropdownSelection.classList.toggle("clicked");
    dropdownArrow.classList.toggle("rotated");
    dropdownMenu.classList.toggle("open");
  });

  dropdownOptions.forEach(option => {
    option.innerText = data[option.getAttribute("data-id")]["label"];
    option.addEventListener("click", () => {
      dropdownSelected.innerText = option.innerText;
      dropdownSelection.classList.remove("clicked");
      dropdownArrow.classList.remove("rotated");
      dropdownMenu.classList.remove("open");
      dropdownOptions.forEach(otherOption => {
        otherOption.classList.remove("active");
      });
      option.classList.toggle("active");
      currentData = option.getAttribute("data-id");
      source.innerText = data[currentData].source;
      dataName.innerText = `${data[currentData].label}:`;
      title.innerText = data[currentData].title;
      slider.min = data[currentData].yearRange.min;
      slider.max = data[currentData].yearRange.max;
      slider.value = data[currentData].yearRange.min;
      sliderYear = slider.value;
      year.innerText = slider.value;
      updateMap();
    });
  });
}

let currentColor = "red";
let currentData = 0;

const country = document.getElementById("country");
const currData = document.getElementById("current-data");
const slider = document.getElementById("year-slider");
const animateBtn = document.getElementById("animate");
const year = document.getElementById("year");
const dataName = document.getElementById("data-name");
const source = document.getElementById("data-source");
const title = document.getElementById("data-title");
const colorBtns = document.getElementsByClassName("color-radio");

// define mappings for color, color scale, and metadata for the different data being displayed
const colorKey = {red:"#ed3413", green:"#03ad36", blue:"#1a9cd9", purple:"#9803a6"};
const scaleKey = {red: d3.interpolateYlOrRd, green: d3.interpolateBuGn, blue: d3.interpolateRdBu, purple: d3.interpolateMagma};
let currCountry = "";
// const dataKey = {
//   1: {title: "Title for Data 1", units: "°F", label: "Data 1"},
//   2: {title: "Title for Data 2", units: "°C", label: "Data 2"},
//   3: {title: "Title for Data 3", units: "ppm", label: "Data 3"},
//   4: {title: "Title for Data 4", units: "in", label: "Data 4"}
// };

// load and process data
let data = await initData();

// initialize side panel features
initColorBtns();
initMapSlider();
initDropdown();
updateMap();

// initialize the map, storing references for updating the map later
const [path, g] = initMap();

// defining the current color scale
let colorScale = currColorScale();

// adding slider behavior for updating the map and text
let sliderYear = slider.value;
slider.oninput = () => {
    sliderYear = slider.value;
    year.innerText = slider.value;
    updateMap();
};

// getting country code to coutnry name mapping for all countries
const countryCodes = await d3.json("data/countryCodes.json")
  .then(info => {
    return info.reduce((acc, elem) => {
      acc[parseInt(elem["country-code"])] = elem;
      return acc;
    }, {});
  });

// read in world topojson data, then create the map
d3.json("data/world-110m2.json").then(makeMap);
