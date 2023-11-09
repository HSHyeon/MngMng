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
const size = document.getElementById('size');
const age = document.getElementById('age');

const dogListEl = document.querySelector('#dog-list');
const dogAddBtn = document.querySelector('.dog-add-btn');
const modal = document.querySelector('#modal');

modal.addEventListener('click', (e) => {
  if (e.target.id === 'modal') {
    modal.classList.toggle('hidden');
  }
});

dogAddBtn.addEventListener('click', () => {
  modal.classList.remove('hidden');
});

btn.addEventListener('submit', function (e) {
  e.preventDefault();

  postDog();
});

const postDog = () => {
  fetch(`${API_BASE_URL}/dogs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: name.value,
      size: size.value,
      age: age.value,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.status === 200) {
        location.href = '/dog/';
      }
    })
    .catch((error) => console.log(error));
};

const getDog = async () => {
  return fetch(`${API_BASE_URL}/dogs`, {
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
    .catch((error) => console.log(error));
};

const renderList = async () => {
  let template = ``;

  const res = await getDog();
  console.log(res);
  if (!res.dogs.length) {
    template += `<div class='w-full border-b border-b-zinc-400 py-10 flex justify-between items-center px-10 text-center'>
    <div class='flex-1'>사용자의 강아지 정보가 없습니다.</div>
    </div>`;
    localStorage.setItem('dog', 0);
    dogListEl.insertAdjacentHTML('beforeend', template);
    return;
  } else localStorage.setItem('dog', 1);

  for (const dog of res.dogs) {
    console.log(dog);
    template += `<div class='w-full border-b border-b-zinc-400 py-10 flex justify-between items-center px-10 text-center'>
    <div class='flex-1'>${dog.name}</div>
    <div class='w-[100px]'>${dog.age}</div>
    <div class='w-[100px]'>${dog.size}</div>
    <div class='w-[100px]'><button id="${dog._id}" class="update-btn hover:underline">수정하기</button></div>
    <div class='w-[100px]'><img id="${dog._id}" class='dog-id mx-auto hover:cursor-pointer' src="/images/trash.svg"/></div>
  </div>`;
  }

  dogListEl.insertAdjacentHTML('beforeend', template);
  bindEvents(dogListEl);
};

const bindEvents = (document) => {
  const rows = document.querySelectorAll('.dog-id');
  const updateBtns = document.querySelectorAll('.update-btn');

  for (const btn of updateBtns) {
    btn.addEventListener('click', (e) => {
      console.log(e.target.id);
      location.href = `/dog/edit/?id=${e.target.id}`;
    });
  }

  for (const row of rows) {
    row.addEventListener('click', (e) => {
      fetch(`${API_BASE_URL}/dogs/${e.target.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 200) location.href = '/dog/';
        })
        .catch((error) => console.log(error));
    });
  }
};

renderList();
