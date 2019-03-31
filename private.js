'use strict';

function readResponseAsJson(response) {
  return response.json();
}

function logError(error) {
  console.log('There was an error!', error);
}

function updateUser(username) {
  document.getElementById('user').innerHTML = username;
}

function handleAuthResponse(response) {
  if (response.status !== 200) {
    return window.location.href = 'index.html';
  }
  updateUser(response.username);
}

function authUser() {
  const username = window.localStorage.getItem('username');
  const token = window.localStorage.getItem('token');
  const body = {username, token};
  const init = {
    method: 'post',
    headers: {'Content-type': 'application/json'},
    body: JSON.stringify(body)
  };
  fetch('http://localhost:8080/user/confirmToken', init)
    .then(readResponseAsJson)
    .then(handleAuthResponse)
    .catch(logError);
}

document.addEventListener('DOMContentLoaded', authUser);