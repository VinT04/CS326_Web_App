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
  p.addEventListener("mouseout", () => clearTooltipDisplay(name));
}
