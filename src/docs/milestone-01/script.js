const pictures = {"victor": ["images/baby_victor.jpg", "images/mid_victor.jpg", "images/old_victor.jpg"], 
"aarav": ["images/Baby_Aarav.JPG", "images/eyes_aarav.jpg", "images/Modern_Aarav.JPG"], 
"vin": ["images/Baby_Vin.jpg", "images/Mid_Vin.jpg", "images/Bio_Image_Vin_1.jpg"],
"manu": ["images/Manu_Baby_Picture.jpg", "images/Mid_Manu.jpg", "images/Modern_Manu.jpg"]}

function shufflePictures(person) {
    const card = document.getElementById(person + "-picture");
    const img = card.children[0];
    let index = -1
    for (let image of pictures[person]) {
        if (img.src.includes(image)) index = pictures[person].indexOf(image);
    }
    img.src = pictures[person][(index + 1) % 3];
}


const cards = document.getElementsByClassName("card");
for (const card of cards) {
    card.addEventListener("click", () => shufflePictures(card.id));
}