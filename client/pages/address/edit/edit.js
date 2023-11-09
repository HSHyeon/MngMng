import '../../../index.css';
import { init } from '../../main.js';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const content = document.querySelector('#content');
const token = localStorage.getItem('token');

async function renderContent() {
  console.dir(location);
  const id = location.search.split('=')[1];
  const res = await getAddressById(id);

  if (res.status === 200) {
    const template = generatorTemplate(res.address);
    content.innerHTML = template;

    const form = content.querySelector('form');

    bindEvent(form, id);

    const addressBtn = document.getElementById('getAddress');

    //daum 주소 입력받기
    addressBtn.addEventListener('click', function() {
      new daum.Postcode({
          oncomplete: function(data) {
              form.zipCode.value = data.zonecode;    
              form.mainAddress.value = data.address;
          }
      }).open();
    })
  }
}


function bindEvent(document, id) {
  document.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.name.value;
    const phone = document.phone.value;
    const zipCode = document.zipCode.value;
    const detailAddress = document.detailAddress.value;
    const mainAddress = document.mainAddress.value;

    fetch(`${API_BASE_URL}/addresses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: name,
        zipCode:zipCode,
        detailAddress:`${mainAddress}+${detailAddress}`,
        phone: phone,
      }),
    })
      .then(() => {
        location.href = '/address/';
      })
      .catch((err) => console.err(err));
  });

}

function generatorTemplate(address) {
  const {recipient ,phone,zipCode, name, detailAddress } = address;
  let detailAddr = detailAddress.split('+')
  let template = `
  <section class="w-3/5">
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
          배송지 정보
        </h1>
        <form id='address-form' class="space-y-3 md:space-y-6" method='POST'>

          <div>  
            <label
              for="name"
              class="block mb-2 text-sm font-medium text-gray-900"
              >라벨</label
            >
            <input
              type="text"
              name="name"
              id="name"
              value='${name}'
              class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              required=""
            />
          </div>


          <div>  
            <label
              for="phone"
              class="block mb-2 text-sm font-medium text-gray-900"
              >전화번호</label
            >
            <input
              type="tel"
              name="phone"
              id="phone"
              value='${phone}'
              class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              required=""
            />
          </div>     
          
       <div>
        <label
              for="zipCode"
              class="block text-sm mb-2 font-medium text-gray-900"
              >주소</label>
          <div class='flex'>  
        
         
            <input
              type="text"
              name="zipCode"
              id="zipCode"
              value = "${zipCode}"
              class="flex-1 mr-1 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600  w-3/4 p-2.5"
              required=""
              readonly
            />  
            <input class='w-[70px] bg-gray-400 p-2 text-sm rounded-lg text-white' id='getAddress' value='주소찾기' readonly></input>
             
          </div>
  
        
          <div>
            <label
              for="mainAddress"
              class="block mb-2 text-sm font-medium text-gray-900"
              ></label
            >
            <input
              type="text"
              name="mainAddress"
              id="mainAddress"
              value="${detailAddr[0]}"
              class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              readonly
              required=""
            ></input>

          </div>
          <div>
            <label
              for="detailAddress"
              class="block mb-2 text-sm font-medium text-gray-900"
              ></label
            >
            <input
              type="text"
              name="detailAddress"
              id="detailAddress"
              class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              required=""
              value="${detailAddr[1]}"
              placeholder='상세주소'
            />
          </div></div>
          <button
            type="submit"
            class="w-full text-white bg-blue-800 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            배송지 등록하기
          </button>
    
   
        </form>
      </div>
    </div>
  </div>
</section>
  `;

  return template;
}

async function getAddressById(id) {
  console.log(`${API_BASE_URL}/addresses/${id}`);
  const res = await fetch(`${API_BASE_URL}/addresses/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  console.log(data)
  return data;
}

document.addEventListener('DOMContentLoaded', () => {
  init();
  renderContent();
});
