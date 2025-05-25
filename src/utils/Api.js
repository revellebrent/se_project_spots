class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _checkResponse = (res) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  };

  _request(url, options) {
    return fetch(url, options).then(this._checkResponse);
  }

  getAppInfo() {
    return Promise.all([
      this.getInitialCards(),
      this.getUserInfo()
    ]);
  }

  getInitialCards() {
    return this._request(`${this._baseUrl}/cards`, {
      headers: this._headers,
    });
  }

  getUserInfo() {
    return this._request(`${this._baseUrl}/users/me`, {
      headers: this._headers,
    });
  }

addCard({ name, link }) {
  return this._request(`${this._baseUrl}/cards`, {
    method: "POST",
    headers: this._headers,
    body: JSON.stringify({ name, link }),
  });
}


editUserInfo({ name, about }) {
  return this._request(`${this._baseUrl}/users/me`, {
    method: "PATCH",
    headers: this._headers,
    // Send the data in the body as a JSON string.
    body: JSON.stringify({ name, about }),
  });
}

  removeCard(cardId) {
    return this._request(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers,
    });
  }

  editAvatarInfo({ avatar }) {
    return this._request(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({ avatar }),
    });
  }

    changeLikeStatus(cardId, isLiked) {
      return this._request(`${this._baseUrl}/cards/${cardId}/likes`, {
        method: isLiked ? "PUT" : "DELETE",
        headers: this._headers,
      });
    }
}

export default Api;