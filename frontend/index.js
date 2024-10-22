import { backend } from 'declarations/backend';
import { AuthClient } from '@dfinity/auth-client';

let authClient;
let isAdmin = false;

document.addEventListener('DOMContentLoaded', async () => {
  await loadMenu();
  setupWaitlistForm();
  setupAuthButtons();
  await initAuth();
});

async function initAuth() {
  authClient = await AuthClient.create();
  const identity = await authClient.getIdentity();
  isAdmin = identity.getPrincipal().isAnonymous() === false;
  updateAuthButtons();
  await loadWaitlist();
}

function setupAuthButtons() {
  document.getElementById('login').addEventListener('click', login);
  document.getElementById('logout').addEventListener('click', logout);
}

async function login() {
  await authClient.login({
    identityProvider: 'https://identity.ic0.app/#authorize',
    onSuccess: async () => {
      isAdmin = true;
      updateAuthButtons();
      await loadWaitlist();
    },
  });
}

async function logout() {
  await authClient.logout();
  isAdmin = false;
  updateAuthButtons();
  await loadWaitlist();
}

function updateAuthButtons() {
  document.getElementById('login').style.display = isAdmin ? 'none' : 'block';
  document.getElementById('logout').style.display = isAdmin ? 'block' : 'none';
}

async function loadMenu() {
  const menuList = document.getElementById('menu-list');
  const menu = await backend.getMenu();
  menuList.innerHTML = menu.map(item => `
    <li>
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <p>Price: $${(item.price / 100).toFixed(2)}</p>
    </li>
  `).join('');
}

async function loadWaitlist() {
  const waitlistDisplay = document.getElementById('waitlist-display');
  if (isAdmin) {
    const waitlist = await backend.getWaitlist();
    waitlistDisplay.innerHTML = `
      <h4>Full Waitlist (Admin View)</h4>
      <ul>
        ${waitlist.map((customer, index) => `
          <li>${index + 1}. ${customer.name} - ${customer.phoneNumber}</li>
        `).join('')}
      </ul>
    `;
  } else {
    const phone = localStorage.getItem('userPhone');
    if (phone) {
      const position = await backend.getWaitlistPosition(phone);
      if (position.length > 0) {
        waitlistDisplay.innerHTML = `
          <p>Your position in the waitlist: ${position[0]}</p>
        `;
      } else {
        waitlistDisplay.innerHTML = `
          <p>You are not currently in the waitlist.</p>
        `;
      }
    } else {
      waitlistDisplay.innerHTML = `
        <p>Join the waitlist to see your position.</p>
      `;
    }
  }
}

function setupWaitlistForm() {
  const form = document.getElementById('waitlist-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    await backend.addToWaitlist(name, phone);
    localStorage.setItem('userPhone', phone);
    await loadWaitlist();
    form.reset();
  });
}
