class Api {
  constructor(options) {
    // constructor body
  }

  getInitialCards() {
    return fetch("https://around-api.en.tripleten-services.com/v1/cards", {
      headers: {
        authorization: "c3b82294-7f76-473f-8320-aa5ed73746ca"
      }
    })
      .then(res => res.json())
  }

  // other methods for working with the API
}

export default Api;