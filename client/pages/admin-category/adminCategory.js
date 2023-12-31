import '../../index.css';
import { init } from '../main.js';
import Swal from 'sweetalert2';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;
const btn = document.querySelector('form');

const token = localStorage.getItem('token');

if (!token) {
  location.href = '/';
}

const name = document.getElementById('name');

const categoryListEl = document.querySelector('#category-list');
const categoryAddBtn = document.querySelector('.category-add-btn');
const modal = document.querySelector('#modal');

modal.addEventListener('click', (e) => {
  if (e.target.id === 'modal') {
    modal.classList.toggle('hidden');
  }
});

categoryAddBtn.addEventListener('click', () => {
  modal.classList.remove('hidden');
});

btn.addEventListener('submit', function (e) {
  e.preventDefault();

  postCategory();
});

const postCategory = () => {
  fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: name.value,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 201) {
        location.href = '/admin-category/';
      }
    })
    .catch((error) => console.error(error));
};

const getCategory = async () => {
  return fetch(`${API_BASE_URL}/categories`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => console.error(error));
};

const renderList = async () => {
  let template = ``;

  const data = await getCategory();

  if (!data.list.length) {
    template += `<div class='w-full border-b border-b-zinc-400 py-10 flex justify-between items-center px-10 text-center'>
    <div class='flex-1'>카테고리 정보가 없습니다.</div>
    </div>`;
    localStorage.setItem('category', 0);
    categoryListEl.insertAdjacentHTML('beforeend', template);
    return;
  } else localStorage.setItem('category', 1);

  for (const [index, category] of data.list.entries()) {
    template += `<div class='w-full border-b border-b-zinc-400 px-10 py-4 flex justify-between items-center px-10 text-center'>
    <div class='w-[100px]'>${index + 1}</div>
    <div class='flex-1'>${category.name}</div>
    <div class='w-[100px]'><button id="${
      category._id
    }" class="update-btn text-red-600 hover:underline" name="${
      category.name
    }" >수정하기</button></div>
    <div class='w-[100px]'><img id="${
      category._id
    }" class='category-id mx-auto hover:cursor-pointer' src="/images/trash.svg"/></div>
  </div>`;
  }

  categoryListEl.insertAdjacentHTML('beforeend', template);
  bindEvents(categoryListEl);
};

const bindEvents = (document) => {
  const rows = document.querySelectorAll('.category-id');
  const updateBtns = document.querySelectorAll('.update-btn');

  for (const btn of updateBtns) {
    btn.addEventListener('click', (e) => {
      location.href = `/admin-category/edit/?categoryName=${e.target.name}&id=${e.target.id}`;
    });
  }

  for (const row of rows) {
    row.addEventListener('click', (e) => {
      fetch(`${API_BASE_URL}/categories/${e.target.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 200) location.href = '/admin-category/';
        })
        .catch((error) => console.error(error));
    });
  }
};

renderList();
