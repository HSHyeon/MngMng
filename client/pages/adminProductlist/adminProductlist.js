import '../../index.css';
import { init } from '../main.js';

init();

const tbody = document.querySelector('tbody');

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const token = localStorage.getItem('token');

const renderProductList = async () => {
  const data = await getProducts();
  const { products } = data;
  console.log(data);
  let template = ``;
  products.map(({ name, category, price }) => {
    template += `
      <tr class="border-t border-gray-300">
      <td class="px-4 py-2 checkbox-cell text-center">
        <input type="checkbox" name="product" value="select1" />
      </td>
      <td class="px-4 py-2 text-center">${name}</td>
      <td class="px-4 py-2 text-center">${category.name}</td>
      <td class="px-4 py-2 text-center">
        <a href="#" class="text-lg font-bold hover:text-gray-200">
          ${price.toLocaleString('ko-KR')}원
        </a>
      </td>
      <td class="px-4 py-2 text-center text-red-600">수정하기</td>
      </tr>
      `;
  });

  tbody.innerHTML = template;
};

const getProducts = async (api) => {
  return await fetch(`${API_BASE_URL}/products`, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => console.log(error));
};

// select box 전체선택
function selectAll(selectAll) {
  const checkboxes = document.getElementsByName('product');

  checkboxes.forEach((checkbox) => {
    checkbox.checked = selectAll.checked;
  });
}

window.onload = function () {
  const selectAllCheckbox = document.querySelector('input[value="selectall"]');
  selectAllCheckbox.addEventListener('click', function () {
    selectAll(this);
  });

  renderProductList();
};
