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
  // fetch Andy's toys
  fetch("http://localhost:3000/toys")
    .then((resp) => resp.json())
    .then((json) => buildToyCard(json));

  // Add a new toy
  const inputForm = document.querySelector("form");
  inputForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = {
      name: event.target.children[1].value,
      image: event.target.children[3].value,
      likes: 0,
    };
    const configurationObject = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formData),
    };
    fetch("http://localhost:3000/toys", configurationObject)
      .then(function (response) {
        return response.json();
      })
      .then(function (object) {
        buildToyCard(Array(object));
      });
  });
});

// build card elements
const buildToyCard = (toyData) => {
  const toyCollectionElement = document.getElementById("toy-collection");
  toyData.forEach((toy) => {
    const toyElement = document.createElement("div");
    const headerElement = document.createElement("h2");
    headerElement.innerText = toy.name;
    const imgElement = document.createElement("img");
    imgElement.setAttribute("src", toy.image);
    imgElement.setAttribute("class", "toy-avatar");
    const pElement = document.createElement("p");
    pElement.innerText = `${toy.likes} likes`;
    const buttonElement = document.createElement("button");
    buttonElement.setAttribute("class", "like-btn");
    buttonElement.setAttribute("id", toy.id);
    buttonElement.innerText = "Like ❤️";
    toyElement.appendChild(headerElement);
    toyElement.appendChild(imgElement);
    toyElement.appendChild(pElement);
    toyElement.appendChild(buttonElement);
    toyElement.setAttribute("class", "card");
    toyCollectionElement.appendChild(toyElement);
    buttonElement.addEventListener("click", function (event) {
      const url = `http://localhost:3000/toys/${event.target.id}`;
      const currentLikes = toy.likes;
      const patchData = {
        likes: currentLikes + 1,
      };
      const configurationObject = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(patchData),
      };
      fetch(url, configurationObject)
        .then(function (response) {
          return response.json();
        })
        .then(function (object) {
          pElement.innerText = `${object.likes} likes`;
        });
    });
  });
};
