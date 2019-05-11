'use strict';

function wasResponseSuccessful(response) {
  if (response.ok) return response;

  redirectUser();
  return Promise.reject(response.status);
}

function readResponseAsJson(response) {
  return response.json();
}

function logError(error) {
  console.log('There was an error!', error);
}

function redirectUser() {
  window.localStorage.removeItem('username');
  window.localStorage.removeItem('token');
  window.location.href = 'index.html';
}

function updateUser(username) {
  document.getElementById('user').innerHTML = username;
}

function handleAuthResponse(response) {
  updateUser(response.username);
}

function authUser() {
  const username = window.localStorage.getItem('username');
  const token = window.localStorage.getItem('token');
  const body = { username, token };
  const init = {
    method: 'post',
    headers: {'Content-type': 'application/json'},
    body: JSON.stringify(body)
  };
  fetch('http://localhost:8080/users/confirmToken', init)
    .then(wasResponseSuccessful)
    .then(readResponseAsJson)
    .then(handleAuthResponse)
    .catch(logError);
}

function onClickLogout() {
  const username = window.localStorage.getItem('username');
  if (username) {
    const body = { username };
    const init = {
      method: 'post',
      headers: {'Content-type': 'application/json'},
      body: JSON.stringify(body)
    };
    fetch('http://localhost:8080/users/logout', init)
      .catch(logError);
  }
  redirectUser();
}

document.addEventListener('DOMContentLoaded', authUser);
