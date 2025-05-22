import "./index.css";
import { enableValidation, settings, resetValidation } from "../scripts/validation.js";
import Api from "../utils/Api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "c3b82294-7f76-473f-8320-aa5ed73746ca",
    "Content-Type": "application/json"
  }
});

  api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
    cards.forEach((item) => renderCard(item, "append"));
  })
  .catch((err) => {
    console.error(err);
});

const profileEditButton = document.querySelector(".profile__edit-button");
const cardModalButton = document.querySelector(".profile__add-button");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const profileAvatar = document.querySelector(".profile__avatar");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

const editModal = document.querySelector("#edit-modal");
const editFormElement = document.forms["edit-profile"];
const editModalCloseButton = editModal.querySelector(".modal__close-button");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

const addModal = document.querySelector("#add-card-modal");
const cardForm = document.forms["add-card-form"];
const cardSubmitBtn = addModal.querySelector(".modal__submit-button");
const cardModalCloseButton = addModal.querySelector(".modal__close-button");
const cardNameInput = addModal.querySelector("#add-card-name-input");
const cardLinkInput = addModal.querySelector("#add-card-link-input");

// Avatar form elements
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-button");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-button");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

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
  const deleteButton = cardElement.querySelector(".card__delete-button");

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

cardsList.addEventListener("click", handleCardInteractions);

function fillProfileForm() {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscKey);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscKey);
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  api
  .editUserInfo({ name: editModalNameInput.value, about: editModalDescriptionInput.value })
  .then((data) => {
  profileName.textContent = data.name; //using data argument instead of input values
  profileDescription.textContent = data.about;
  closeModal(editModal);
})
.catch(console.error);
}

function handleAddCardFormSubmit(event) {
  event.preventDefault();

  const inputValues = {
    name: cardNameInput.value,
    link: cardLinkInput.value,
  };

  renderCard(inputValues, "prepend");

  closeModal(addModal);
  cardForm.reset();
  resetValidation(cardForm, settings);
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  api.editAvatarInfo ({ avatar: avatarInput.value })
  .then((data) => {
    profileAvatar.src = data.avatar;
    console.log(data.avatar);
    closeModal(avatarModal);
    avatarForm.reset();
  })
  .catch(console.error);
}

profileEditButton.addEventListener("click", () => {
  fillProfileForm();
  openModal(editModal);
  resetValidation(editFormElement, settings);
});

editModalCloseButton.addEventListener("click", () => {
  closeModal(editModal);
});

cardModalButton.addEventListener("click", () => {
  openModal(addModal);
});

cardModalCloseButton.addEventListener("click", () => {
  closeModal(addModal);
});

previewModalCloseButton.addEventListener("click", () => {
  closeModal(previewModal);
});

avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarModalCloseBtn.addEventListener("click", () => {
  closeModal(avatarModal);
});

function handleEscKey(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

function handleOverlayClick(evt) {
  if (evt.target.classList.contains("modal")) {
    closeModal(evt.target);
  }
}

editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardFormSubmit);

avatarForm.addEventListener("submit", handleAvatarSubmit);

document.addEventListener("reset", (event) => {
  if (event.target.matches(settings.formSelector)) {
    resetValidation(event.target, settings);
  }
});

function renderCard(item, method = "prepend") {
  const cardElement = getCardElement(item);
  cardsList[method](cardElement);
}

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", handleOverlayClick);
});

enableValidation(settings);