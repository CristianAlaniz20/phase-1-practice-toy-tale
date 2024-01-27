let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  getRequestForToys();
})

//sends a get request and creates a div for each object of the response.
function getRequestForToys() {
  fetch("http://localhost:3000/toys")
  .then(res => res.json())
  .then(data => {
    data.forEach(toy => {
      const div = makeDivElement()
      addChildElements.call(toy, div)
    })
  })
  .catch(error => console.log(error))
};

//makes div element
function makeDivElement() {
  const div = document.createElement("div")
  const divToAppend = document.getElementById("toy-collection")
  div.classList.add("card")
  divToAppend.appendChild(div)
  return div
}

//creates 4 elements, gives them attributes and text content, and appends them to a passed in element.
function addChildElements(divElement) {
  const h2 = document.createElement("h2")
  const img = document.createElement("img")
  const p = document.createElement("p")
  const button = document.createElement("button")

  h2.textContent = this.name;
  img.setAttribute("src", this.image)
  img.classList.add("toy-avatar");
  p.textContent = `likes: ${this.likes}`;
  button.classList.add("like-btn")
  button.setAttribute("id", this.id)
  button.textContent = "like"
  button.addEventListener("click", e => buttonCallback(e))
  const elementsArray = [h2, img, p, button]
  elementsArray.forEach(element => {
    divElement.appendChild(element)
  })
};

function buttonCallback(event) {
  const btn = event.target
  const btnID = btn.id 
  const p = btn.previousElementSibling
  const likeNumber = p.textContent.split(" ")
  console.log(likeNumber[1]++)
  fetch(`http://localhost:3000/toys/${btnID}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "likes": likeNumber[1]
    })
  })
  .then(res => res.json())
  //update # of likes
  .then(data => p.textContent = `likes: ${data.likes}`)
  .catch(error => console.log(error))
  
}


//adds event listener and makes a POST request every time event is triggered
document.addEventListener("submit", event => {
  event.preventDefault()
  const name = document.getElementsByClassName("input-text")[0].value;
  const img = document.getElementsByClassName("input-text")[1].value;
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "name": name,
      "image": img,
      "likes": 0
    })
  })
  .then(res => res.json())
  //makes new toy card for POST info
  .then(data => {
    const div = makeDivElement()
    addChildElements.call(data, div) 
  })
  .catch(error => console.log(error))
});

