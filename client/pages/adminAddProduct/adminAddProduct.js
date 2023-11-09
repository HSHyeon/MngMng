import '../../index.css';
import { uploadImage } from '../common.js';
import { init } from '../main.js';

init();

const API_BASE_URL = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem('token');
const form = document.querySelector('form');
const imgEl = document.querySelector('#image_preview');
const fileInput = document.querySelector('#file_input');

const categoryInput = document.querySelector('#category');
const nameInput = document.querySelector('#name');
const descriptionInput = document.querySelector('#description');
const priceInput = document.querySelector('#price');
const manufacturerInput = document.querySelector('#manufacturer');

fileInput.addEventListener('input', (e) => {
  const { name, value, files } = e.target;
  const fileReader = new FileReader();
  fileReader.readAsDataURL(fileInput.files[0]);

  fileReader.onload = function () {
    const incodedImg = fileReader.result;
    imgEl.setAttribute('src', incodedImg);
  };
});
// const submitBtn = document.querySelector('#submit-btn');

// submitBtn.addEventListener('click', () => {
//   console.log('click');
// });

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fileInput = e.target[0].files[0];
  const name = nameInput.value;
  const category = categoryInput.value;
  const price = parseInt(priceInput.value.replace(',', ''));
  const desc = descriptionInput.value;
  const manufacturer = manufacturerInput.value;

  const img_url = await uploadImage(fileInput)
    .then((url) => {
      console.log(url);
      return url;
    })
    .catch((err) => console.err(err));

  addProduct({ name, category, price, desc, manufacturer, img_url });
});

async function addProduct({
  name,
  category,
  price,
  desc,
  manufacturer,
  img_url,
}) {
  fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      category,
      price,
      desc,
      manufacturer,
      img_url,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.status === 200) {
        location.href = '/adminProductlist/';
      }
    })
    .catch((error) => console.log(error));
}

// 가격 세자릿수마다 콤마 붙이기
function numberWithCommas(x) {
  return x.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
const getCategories = async () => {
  return await fetch(`${API_BASE_URL}/categories/`, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => console.log(error));
};

window.onload = async () => {
  const priceInput = document.getElementById('price');

  priceInput.addEventListener('input', (e) => {
    const originalValue = e.target.value;
    const cleanedValue = originalValue.replace(/[^0-9,]/g, '');
    const formattedValue = numberWithCommas(cleanedValue);

    e.target.value = formattedValue;
  });

  const data = await getCategories();
  const categories = data.list;

  for (let i = 0; i < categories.length; i++) {
    const optionEl = document.createElement('option');
    optionEl.innerText = categories[i].name;
    optionEl.setAttribute('value', categories[i]._id);

    categoryInput.append(optionEl);
  }
};
