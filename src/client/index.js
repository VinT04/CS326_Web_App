import * as db from "./db.js";

/**
 * Displays the current section and hides all the others
 * @async
 * @param {string} name - The name of the section to display
 * @returns {null}
 */
async function sectionDisplay(name) {
  // To hide all other sections when using navbar
  const sections = document.getElementsByClassName("main-sections");
  for (const s of sections) {
    if (s.id !== name) s.style.display = "none";
    else {
      s.style.removeProperty("display");
      const currView = await db.loadData("current-view");
      currView.value = name;
      db.modifyData(currView);
    }
  }
}

/**
 * Displays the appropriate tooltip when hovered on by the user
 * @param {string} name - The name of the selected resource
 * @returns {null}
 */
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
        "Responsible for coordinating\n responses to environmental issues within the United Nations system.";
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

/**
 * Clears tooltips that aren't selected by users
 */
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
    const initialData = [49.5, 50, 50.5, 51, 51.5, 52, 52.5, 53, 53.5, 54, 54.5, 55, 55.5, 56, 56.5, 57];
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

/**
 * Takes the name and value and updates this object in the DB
 * @async
 * @param {string} name - The name of the data item in the DB
 * @param {any} value - The attribute to save with the key in the DB
 * @returns {null}
 */
async function saveToDB(name, value) {
  const val = await db.loadData(name);
  val.value = value;
  db.modifyData(val);
}

const sliders = document.getElementsByClassName("slider");
const dbVals = (await db.loadAllData());
const pageData = {}
dbVals.forEach(e => pageData[e._id] = parseInt(e.value));

if (!("current-view" in pageData)) db.saveData("current-view", "home-section");
const currView = await db.loadData("current-view");
sectionDisplay(currView.value);

for (const s of sliders) {
  if (!(s.id in pageData)) db.saveData(s.id, 0);
  else {
    s.value = pageData[s.id];
    document.getElementById(s.id + "RangeValue").innerHTML = s.value;
  }
  s.oninput = () => {
    document.getElementById(`${s.id}RangeValue`).innerText = s.value;
    saveToDB(s.id, s.value);
  } 
}

createSimulationChart();

function clearDB() {
  for (const key of Object.keys(pageData)) {
    if (key !== "current-view") {
      saveToDB(key, 0);
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

// stores all data, with keys being numberic IDs corresponding to each data file (see dataNameKey)
const data = {};

// stores the domain (min, max) for each data file
const domainKey = {};

// stores mapping between data names and numeric IDs
const dataNameKey = {"Data 1 (ex: CO2)":1, "Data 2 (ex: Avg Temp)":2, "Data 3 (ex: Avg Rainfall)":3, "Data 4 (ex: Deforestation)":4}

/**
 * Initializes the data and domainKey objects by reading data files from /data.
 * Reads data and creates an object for each data file with country ISO3 codes
 * as keys and the corresponding data as values. These objects are stored in the
 * data object.
 */
async function initData() {
  let i = 1;
  // iterate through all data IDs
  while (i <= 4) {
    data[i] = await d3.csv(`data/mock_data${i}.csv`)
      .then(rawData => {
        // obtain min and max values in the data, as well as a parsed version of the data
        // that maps country ISO3 to the desired data values
        const [min, max, parsedData] = rawData.reduce((acc, elem) => {
          acc[2][elem["ISO3"]] = elem;
          const [currMin, currMax] = Object.entries(elem).reduce((domain, keyVal) => {
            // only want to look at values which have a year as a key
            if (isNaN(keyVal[0])) {
              return domain;
            }
            return [Math.min(domain[0], +keyVal[1]), Math.max(domain[1], +keyVal[1])];
          }, [Infinity, -Infinity]);
          return [currMin, currMax, acc[2]];
        }, [Infinity, -Infinity, {}]);
        domainKey[i] = {min: Math.floor(min), max: Math.ceil(max)};
        return parsedData;
      });
    i++;
  }
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
      slider.value = slider.value % 2022;
      sliderUpdates = setInterval(() => {
        if (slider.value === "2022") {
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
    return colorScale(countryData[sliderYear] || 0);
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
  const countryData = data[currentData][countryObj["alpha-3"]] || {};
  country.innerText = countryObj["name"] || "N/A";
  currData.innerText = countryData[sliderYear] ? `${countryData[sliderYear]} ${dataKey[currentData].units}` : "No data available";
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
}

function currColorScale() {
  return d3.scaleSequential()
      .domain([domainKey[currentData].min, domainKey[currentData].max])
      .interpolator(scaleKey[currentColor]);
}
const updateColorScale = () => colorScale = currColorScale();

/**
 * Updates the map based off of the year and recolors the map based off the new
 * statistics
 */
function updateMap() {
  d3.selectAll("path")
    .transition()
    .duration(75)
    .attr("fill", d => {
      const countryObj = countryCodes[d.id] || {};
      const currData = data[currentData][countryObj["alpha-3"]] || {};
      updateColorScale();
      return colorScale(currData[sliderYear] || 0);
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

  dropdownSelection.addEventListener("click", () => {
    dropdownSelection.classList.toggle("clicked");
    dropdownArrow.classList.toggle("rotated");
    dropdownMenu.classList.toggle("open");
  });

  dropdownOptions.forEach(option => {
    option.addEventListener("click", () => {
      dropdownSelected.innerText = option.innerText;
      dropdownSelection.classList.remove("clicked");
      dropdownArrow.classList.remove("rotated");
      dropdownMenu.classList.remove("open");
      dropdownOptions.forEach(otherOption => {
        otherOption.classList.remove("active");
      });
      option.classList.toggle("active");
      currentData = dataNameKey[option.innerText];
      dataName.innerText = `${dataKey[currentData].label}:`;
      title.innerText = dataKey[currentData].title;
      updateMap();
    });
  });
}

let currentColor = "red";
let currentData = 1;

const map = document.getElementById("map");
const country = document.getElementById("country");
const currData = document.getElementById("current-data");
const slider = document.getElementById("year-slider");
const animateBtn = document.getElementById("animate");
const year = document.getElementById("year");
const dataName = document.getElementById("data-name");
const title = document.getElementById("data-title");
const colorBtns = document.getElementsByClassName("color-radio");

const colorKey = {red:"#ed3413", green:"#03ad36", blue:"#1a9cd9", purple:"#9803a6"};
const scaleKey = {red: d3.interpolateYlOrRd, green: d3.interpolateBuGn, blue: d3.interpolateRdBu, purple: d3.interpolateMagma};
const dataKey = {
  1: {title: "Title for Data 1", units: "°F", label: "Data 1"},
  2: {title: "Title for Data 2", units: "°C", label: "Data 2"},
  3: {title: "Title for Data 3", units: "ppm", label: "Data 3"},
  4: {title: "Title for Data 4", units: "in", label: "Data 4"}
};

initColorBtns();
initMapSlider();
initDropdown();
await initData();

const [path, g] = initMap();

let colorScale = currColorScale();

let sliderYear = slider.value;
slider.oninput = () => {
    sliderYear = slider.value;
    year.innerText = slider.value;
    updateMap();
};

const countryCodes = await d3.json("data/countryCodes.json")
  .then(info => {
    return info.reduce((acc, elem) => {
      acc[parseInt(elem["country-code"])] = elem;
      return acc;
    }, {});
  });

d3.json("data/world-110m2.json").then(makeMap);
