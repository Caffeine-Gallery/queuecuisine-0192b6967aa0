import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', async () => {
  await loadMenu();
  await loadWaitlist();
  setupWaitlistForm();
});

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
  const waitlist = await backend.getWaitlist();
  waitlistDisplay.innerHTML = waitlist.map(customer => `
    <li>${customer.name} - ${customer.phoneNumber}</li>
  `).join('');
}

function setupWaitlistForm() {
  const form = document.getElementById('waitlist-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    await backend.addToWaitlist(name, phone);
    await loadWaitlist();
    form.reset();
  });
}
