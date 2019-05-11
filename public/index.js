'use strict';

function wasResponseSuccessful(response) {
  if (response.ok) return response;

  response.json().then(res => {
    updateMessage(res.error);
  });
  return Promise.reject(response.status);
}

function readResponseAsJson(response) {
  return response.json();
}

function logError(error) {
  console.log('There was an error!', error);
}

function updateMessage(message = '') {
  document.getElementById('message').innerHTML = message;
}

function clearForm() {
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
}

function login(response) {
  window.localStorage.setItem('username', response.username);
  window.localStorage.setItem('token', response.token);
  updateMessage();
  window.location.href = 'private.html';
}

function onClickLogin() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const body = { username, password };
  const init = {
    method: 'post',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(body)
  };
  fetch('http://localhost:8080/users/login', init)
    .then(wasResponseSuccessful)
    .then(readResponseAsJson)
    .then(login)
    .catch(logError);
  clearForm();
}

function register(response) {
  updateMessage('User successfully registered, please log in!');
}

function onClickRegister() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const body = {username, password};
  const init = {
    method: 'post',
    headers: {'Content-type': 'application/json'},
    body: JSON.stringify(body)
  };
  fetch('http://localhost:8080/users/register', init)
    .then(wasResponseSuccessful)
    .then(readResponseAsJson)
    .then(register)
    .catch(logError);
  clearForm();
}
