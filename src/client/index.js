function displayTooltip() {
    tooltip = document.get
}


function close(id) {
    const tooltip = document.getElementById(id);
    tooltip.style.display = hidden;
    const text = tooltip.children[0];
    text.style.display = hidden;
}


function sectionDisplay(name) {
    // To hide all other sections when using navbar
    sections = document.getElementsByClassName("main-sections");
    for (s of sections) {
        if (s.id != name) s.style.display = none;
        else s.style.removeProperty("display");
    }
}

function tooltipDisplay(name) {
    const tooltip = document.getElementById(name + "-tooltip")
    const text = document.getElementById(name + "-tooltip-text")
    tooltip.style.visibility = tooltip.style.visibility === "visible" ? "hidden" : "visible";
    tooltip.style.opacity = 1 - tooltip.style.opacity;
    text.style.visibility = tooltip.style.visibility;
    text.style.opacity = tooltip.style.opacity;
}


document.getElementById("mapBtn").addEventListener("click", () => sectionDisplay("map-section"));
document.getElementById("simBtn").addEventListener("click", () => sectionDisplay("simulation-section"));
document.getElementById("resourcesBtn").addEventListener("click", () => sectionDisplay("resources-section"));
document.getElementById("uviewBtn").addEventListener("click", () => sectionDisplay("uview-section"));

cardPictures = document.getElementsByClassName("card-picture");
for (p of cardPictures) {
    const name = p.id;
    p.addEventListener("mouseover", () => tooltipDisplay(name));
    p.addEventListener("mouseout", () => tooltipDisplay(name));
}