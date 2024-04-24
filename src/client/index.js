function sectionDisplay(name) {
  // To hide all other sections when using navbar
  sections = document.getElementsByClassName("main-sections");
  for (s of sections) {
    if (s.id != name) s.style.display = none;
    else s.style.removeProperty("display");
  }
}

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
        "responsible for coordinating\n responses to environmental issues\n within the United Nations system.";
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
        "intergovernmental organization\n mandated to facilitate\n cooperation of renewable energy.";
      break;
    }
  }
}

function clearTooltipDisplay() {
  document.getElementById("tip").innerText = "";
}

document
  .getElementById("mapBtn")
  .addEventListener("click", () => sectionDisplay("map-section"));
document
  .getElementById("simBtn")
  .addEventListener("click", () => sectionDisplay("simulation-section"));
document
  .getElementById("resourcesBtn")
  .addEventListener("click", () => sectionDisplay("resources-section"));
document
  .getElementById("uviewBtn")
  .addEventListener("click", () => sectionDisplay("uview-section"));

cardPictures = document.getElementsByClassName("card-picture");
for (p of cardPictures) {
    const name = p.id;
    p.addEventListener("mouseover", () => tooltipDisplay(name));
    p.addEventListener("mouseout", () => tooltipDisplay(name));
}

function createSimulationChart() {
    const electricityChange = document.getElementById("electricityRangeValue").innerText;
    const transportationChange = document.getElementById("transportationRangeValue").innerText;

    const barColor = "green";
    const initialData = [49.5, 50, 50.5, 51, 51.5, 52, 52.5, 53, 53.5, 54, 54.5, 55, 55.5, 56, 56.5, 57];
    const xValues = [2025, 2030, 2035, 2040, 2045, 2050, 2055, 2060, 2065, 2070, 2075, 2080, 2085, 2090, 2095, 2100];
    const yValues = initialData.map(data => data + 0.05 * parseFloat(electricityChange) + 0.05 * parseFloat(transportationChange));
    // [0.5, 0.75, 0.5, 1, 0.5, 0.2554, 0.5, 0.333, 0.5, 0.65, 0.5, 0.89, 0.5, 0.56, 0.5, 0.57];

    new Chart('predictionChart', {
        type: 'bar',
        data: {
            labels: xValues,
            datasets: [{
                label: 'Temperature',
                backgroundColor: barColor,
                data: yValues
            }]
        },       
        options: {
            scales: {
              yAxes: [{ticks: {min: 35, max:70}}],
            }
          }
    });
}
createSimulationChart();
const button = document.getElementById("simulateButton");
button.addEventListener('click', createSimulationChart);
>>>>>>> Stashed changes
