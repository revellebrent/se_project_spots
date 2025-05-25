import { setButtonText } from "../utils/helpers.js";
import "./index.css";
import {
  enableValidation,
  settings,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "c3b82294-7f76-473f-8320-aa5ed73746ca",
    "Content-Type": "application/json",
  },
});

const profileEditButton = document.querySelector(".profile__edit-button");
const cardModalButton = document.querySelector(".profile__add-button");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const profileAvatar = document.querySelector(".profile__avatar");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteModalCloseBtn = deleteModal.querySelector(".modal__close");
const deleteModalCancelBtn = deleteModal.querySelector(
  ".modal__submit_button-white"
);

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

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
    profileAvatar.src = userInfo.avatar;

    cards.forEach((item) => renderCard(item, "append"));
  })
  .catch((err) => {
    console.error(err);
  });

function handleDeleteSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  submitBtn.textContent = "Deleting...";

  api
    .removeCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
      selectedCard = null;
      selectedCardId = null;
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = "Delete";
    });
}

function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data._id || data.id;
  openModal(deleteModal);
}

let selectedCard;
let selectedCardId;

function handleLike(evt) {
  const likeButton = evt.target;
  const card = likeButton.closest(".card");
  const cardId = card.dataset.cardId;
  const isLiked = likeButton.classList.contains("card__like-button_liked");

  api
    .changeLikeStatus(cardId, !isLiked)
    .then((updatedCard) => {

      if (updatedCard.isLiked) {
        likeButton.classList.add("card__like-button_liked");
      } else {
        likeButton.classList.remove("card__like-button_liked");
      }

      const likeCountEl = card.querySelector(".card__like-count");
      if (likeCountEl && updatedCard.likes) {
        likeCountEl.textContent = updatedCard.likes.length;
      }
    })
    .catch((err) => {
      console.error("Error updating like status:", err);
    });
}

function getCardElement(data) {
  const cardElement = cardTemplateElement.cloneNode(true);
  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardElement.dataset.cardId = data._id || data.id;

  if (data.isLiked) {
    likeButton.classList.add("card__like-button_liked");
  }

  likeButton.addEventListener("click", (evt) => handleLike(evt, data));

  deleteButton.addEventListener("click", () => {
    handleDeleteCard(cardElement, data);
  });

  return cardElement;
}

function handleCardInteractions(evt) {
  if (evt.target.classList.contains("card__image")) {
    previewModalImageEl.src = evt.target.src;
    previewModalImageEl.alt = evt.target.alt;
    previewModalCaptionEl.textContent = evt.target.alt;
    openModal(previewModal);
  }
}

cardsList.addEventListener("click", handleCardInteractions);

deleteForm.addEventListener("submit", handleDeleteSubmit);

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

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleAddCardFormSubmit(event) {
  event.preventDefault();

  const submitBtn = event.submitter;
  setButtonText(submitBtn, true);

  const inputValues = {
    name: cardNameInput.value,
    link: cardLinkInput.value,
  };

  api
    .addCard(inputValues)
    .then((newCard) => {
      renderCard(newCard, "prepend");
      closeModal(addModal);
      cardForm.reset();
      disableButton(submitBtn, settings);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .editAvatarInfo({ avatar: avatarInput.value })
    .then((data) => {
      profileAvatar.src = data.avatar;
      console.log(data.avatar);
      closeModal(avatarModal);
      avatarForm.reset();
      disableButton(submitBtn, settings);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
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

deleteModalCloseBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

deleteModalCancelBtn.addEventListener("click", () => {
  closeModal(deleteModal);
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
