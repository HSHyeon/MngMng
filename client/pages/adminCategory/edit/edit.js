import '../../../index.css';
import { init } from '../../main.js';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const content = document.querySelector('#content');
console.log(content);
const token = localStorage.getItem('token');

async function renderContent() {
  console.dir(location);
  const id = location.search.split('=')[1];
  const res = await getCategoryById(id);
  console.log('===', res);
  if (res.status === 200) {
    console.log('sdfdsfdsfdsfdsf', res);
    const template = generatorTemplate(res.category);
    console.log(template);
    content.innerHTML = template;
    const form = content.querySelector('form');
    bindEvent(form, id);
  }
}

function bindEvent(document, id) {
  document.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.name.value;

    fetch(`${API_BASE_URL}categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    })
      .then(() => {
        location.href = '/adminCategory/';
      })
      .catch((err) => console.err(err));
  });
}

function generatorTemplate(category) {
  console.log(category);
  const { name } = category;

  let template = `
  <section class="w-2/5">
      <div
        class="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0"
      >
        <div
          class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0"
        >
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1
              class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl"
            >
              카테고리명
            </h1>
            <form id='admincategory-form' class="space-y-4 md:space-y-6" method='POST'>
 
              <div>  
                <label
                  for="name"
                  class="block mb-2 text-sm font-medium text-gray-900"
                  >이름</label
                >
                <input
                  type="text"
                  name="name"
                  id="name"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  required=""
                  value="${name}"
                />
              </div>
      
            
              <button
                type="submit"
                class="w-full text-white bg-blue-800 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                카테고리명 수정하기
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  `;

  return template;
}

async function getCategoryById(id) {
  const res = await fetch(`${API_BASE_URL}categories/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();

  return data;
}

document.addEventListener('DOMContentLoaded', () => {
  init();
  renderContent();
});
