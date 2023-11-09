import '../../index.css';
import { init } from '../main.js';
import Swal from 'sweetalert2';

init();
const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const token = localStorage.getItem('token');
const deletBtn = document.getElementById('deleteUser');


if (!token) {
    location.href = '/';
  }
  

const deleteUser = () => {
    fetch(`${API_BASE_URL}/users` , {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
      })
        .then((response) => 
          response.json())
        .then((data) => {
          console.log(data);
          if(data.state ===200){
            new Swal(data.message, '', 'success').then(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('id');
                location.href="/";
        });}
        else{
            new Swal(data.message, '', 'error').then(() => {
            });
        }
        })
        .catch(error => console.log(error));
}

deletBtn.addEventListener('click', function(){
   
    new Swal({title:'정말 탈퇴하시겠습니까?',showDenyButton: true ,denyButtonText:'취소', confirmButtonText:'확인', icon:'warning'}).then((result) => {
        if(result.isConfirmed) deleteUser()
        
    });
    
})