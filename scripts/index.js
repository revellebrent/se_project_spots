const initialCards = [
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const profileEditButton = document.querySelector(".profile__edit-button");
const cardModalButton = document.querySelector(".profile__add-button");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

const editModal = document.querySelector("#edit-modal");
const editFormElement = document.forms["edit-profile"]; // Modified
const editModalCloseButton = editModal.querySelector(".modal__close-button");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

const addModal = document.querySelector("#add-card-modal");
const cardForm = document.forms["add-card-form"]; // Modified
const cardSubmitBtn = addModal.querySelector(".modal__submit-button");
const cardModalCloseButton = addModal.querySelector(".modal__close-button");
const cardNameInput = addModal.querySelector("#add-card-name-input");
const cardLinkInput = addModal.querySelector("#add-card-link-input");

const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalCloseButton = previewModal.querySelector(".modal__close");

const cardTemplate = document.querySelector("#card-template");
const cardTemplateElement = cardTemplate.content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

function getCardElement(data) {
  const cardElement = cardTemplateElement.cloneNode(true);
  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__delete-button"); //delete button

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  return cardElement;
}

function handleCardInteractions(evt) {
  if (evt.target.classList.contains("card__like-button")) {
    evt.target.classList.toggle("card__like-button_liked");
  } else if (evt.target.classList.contains("card__delete-button")) {
    const cardElement = evt.target.closest(".card");
    cardElement.remove();
  } else if (evt.target.classList.contains("card__image")) {
    previewModalImageEl.src = evt.target.src;
    previewModalImageEl.alt = evt.target.alt;
    previewModalCaptionEl.textContent = evt.target.alt;
    openModal(previewModal);
  }
}

cardsList.addEventListener("click", handleCardInteractions); //

function fillProfileForm() {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscKey); // added
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscKey); // added
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescriptionInput.value;
  closeModal(editModal);
}

function handleAddCardFormSubmit(event) {
  event.preventDefault();

  const inputValues = {
    name: cardNameInput.value,
    link: cardLinkInput.value,
  };

  renderCard(inputValues, "prepend"); // Modified to use the new function

  closeModal(addModal);
  cardForm.reset();
  resetValidation(cardForm, settings); // added and modified
}

profileEditButton.addEventListener("click", () => {
  fillProfileForm();
  resetValidation(editFormElement, settings); // added and modified
  openModal(editModal);
});

editModalCloseButton.addEventListener("click", () => {
  closeModal(editModal);
});

cardModalButton.addEventListener("click", () => {
  openModal(addModal); // Modified
});

cardModalCloseButton.addEventListener("click", () => {
  closeModal(addModal);
});

previewModalCloseButton.addEventListener("click", () => {
  closeModal(previewModal);
});

// Updated function to handle Escape key
function handleEscKey(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

// updated function to handle overlay click
function handleOverlayClick(evt) {
  if (evt.target.classList.contains("modal")) {
    closeModal(evt.target);
  }
}

editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardFormSubmit);

function renderCard(item, method = "prepend") {
  const cardElement = getCardElement(item); // Modified
  cardsList[method](cardElement);
}

initialCards.forEach((item) => renderCard(item, "append")); // Modified

// updated event listener for overlay click
document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", handleOverlayClick);
});
