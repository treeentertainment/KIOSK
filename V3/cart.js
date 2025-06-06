const cart = document.getElementById("cart-list");
let order = JSON.parse(localStorage.getItem('order')) || []; // Load from localStorage or initialize

// Appwrite 클라이언트 초기화
const client = new Appwrite.Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Appwrite 엔드포인트
    .setProject('treekiosk'); // 프로젝트 ID

const account = new Appwrite.Account(client);
const database = new Appwrite.Databases(client);

function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('id');
    const description = urlParams.get('description');
    const image = urlParams.get('image');
    const price = parseFloat(urlParams.get('price'));
    const quantity = parseInt(urlParams.get('quantity'));

    if (itemId && description && image && !isNaN(price) && !isNaN(quantity)) {

        addItemToOrder({ id: itemId, image, description, price , quantity });
        saveOrder(); // Save order to localStorage
        window.close();
        }
    cartshow();
}

window.addEventListener('load', init);

const cartshow = debounce(function () {
    renderCart();
}, 300);

function renderCart() {
    cart.innerHTML = order.length === 0 ? `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <div>장바구니가 비어있습니다.</div>
        </li>` : order.map((item, index) => `
        <li class="list-group-item d-flex justify-content-between align-items-center item cart">
            <img src="${item.image}" alt="${item.description}">
            <span class="info">${item.description}</span>
            <div class="input-group mb-3">
                <input type="number" min="1" value="${item.quantity}" id="${index}" class="form-control" placeholder="quantity">
                <button type="button" class="btn btn-outline-danger" onclick="deleteItem(${index})">삭제</button>
            </div>
        </li>
    `).join('');

    order.forEach((item, index) => {
        document.getElementById(index).addEventListener("change", debounce(event => {
            updateItemQuantity(item.description, parseInt(event.target.value));
        }, 300));
    });
}

function updateItemQuantity(description, newQuantity) {
    const itemIndex = getItemIndex(description);
    if (itemIndex !== -1 && newQuantity > 0) {
        const originalPrice = order[itemIndex].price / order[itemIndex].quantity;
        order[itemIndex].quantity = newQuantity;
        order[itemIndex].price = newQuantity * originalPrice;
        console.log('Updated Order:', order); // Debugging: Log updated order
        saveOrder(); // Save order to localStorage
        renderCart(); // 카트 화면을 새로 고침
    }
}

function saveOrder() {
    localStorage.setItem('order', JSON.stringify(order));
}

function deleteItem(index) {
    order.splice(index, 1);
    saveOrder(); // Save order to localStorage after deletion
    cartshow();
    console.log('Deleted Item:', order); // Debugging: Log current order
}

function addItemToOrder({ id, image, description, price, quantity }) {
    const existingIndex = getItemIndex(description);
    if (existingIndex !== -1) {
        order[existingIndex].quantity += quantity;
        order[existingIndex].price += quantity * (price / quantity);
    } else {
        order.push({ id, image, description, quantity, price });
    }
    console.log('Current Order:', order); // Debugging: Log current order
}

function getItemIndex(description) {
    return order.findIndex(item => item.description === description);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function openwindow(name) {
    var url = `${name}`;
    var win = window.open(url, '_blank');
    win.focus();
  }
  
  async function setLocal(email) {
    try {
        const response = await database.listDocuments(
          'tree-kiosk',        // 데이터베이스 ID
          'owner',             // 컬렉션 ID
            [Appwrite.Query.equal('email', email)] // 이메일 주소 사용
        );
  
        if (response.documents.length === 0) {
            location.href = "index.html";
            return;
        }
  
        const doc = response.documents[0]; // 첫 번째 검색 결과
        if (doc.active) {
            localStorage.setItem("name", doc.name);
            localStorage.setItem("email", email);
        } else {
            location.href = "index.html";
        }
    } catch (error) {
        location.href = "index.html";
    }
  }
  
  
  document.addEventListener("DOMContentLoaded", function () {
    const email = localStorage.getItem('email');
    if (email) {
      setLocal(email);
    }
  });