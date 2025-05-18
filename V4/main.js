const firebaseConfig = {
    apiKey: "AIzaSyBsUla3VNIn6wccJ43Ui5Dzw9mwIAHcdKE",
    authDomain: "auth.appwebsite.tech",
    databaseURL: "https://treeentertainment-default-rtdb.firebaseio.com",
    projectId: "treeentertainment",
    storageBucket: "treeentertainment.appspot.com",
    messagingSenderId: "302800551840",
    appId: "1:302800551840:web:1f7ff24b21ead43cc3eec5"
};

// Firebase 초기화
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();    
const realtimeDb = firebase.database();

var email = JSON.parse(window.localStorage.getItem('email'));
var number = JSON.parse(window.localStorage.getItem('number'));
var name = JSON.parse(window.localStorage.getItem('name'));
const user = firebase.auth().currentUser;
let orderwindow;

window.addEventListener("hashchange", updatePage);
window.addEventListener("load", updatePage);
window.addEventListener("load", () => setHash('all'));

// 탭 클릭 시 해시 변경
document.getElementById('all-tab').addEventListener('click', () => setHash('all'));
document.getElementById('drinks-tab').addEventListener('click', () => setHash('drinks'));
document.getElementById('foods-tab').addEventListener('click', () => setHash('foods'));
document.getElementById('services-tab').addEventListener('click', () => setHash('services'));


document.addEventListener("DOMContentLoaded", () => display());

window.onload = function() {
  try {
    firebase.database().ref('/people/data/' + number + '/state').on('value', (snapshot) => {
      const state = snapshot.val();
      if (state && Number(state.state) > 1) {
        window.location.href = "index.html"; // 첫 페이지로 이동
      }
    });
  } catch (error) {
    window.location.href = "index.html"; // 첫 페이지로 이동
  }
};



window.addEventListener('message', (event) => {  
  if (event.data.type === 'UpdateOrder' && event.origin === window.location.origin) {
    updatequantity(Number(event.data.id), event.data.quantity);
  } else if(event.data.type === 'newOrder' && event.origin === window.location.origin) {
    displayorders(event.data.number);
  } else if(event.data === 'noselect' && event.origin === window.location.origin) {
    if(orderwindow) {
      orderwindow.close(); // 기존 창 닫기
      orderwindow = null; // 참조 초기화
    }
  } else if(event.data === 'original' && event.origin === window.location.origin) {
    window.location.href = "index.html"; // 첫 페이지로 이동
  }
}, false);

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        var originalEmail = user.email;
        var fixedemail = originalEmail.replace(".", "@");

        window.localStorage.setItem('email', JSON.stringify(fixedemail));

        firebase.database().ref('/people/admin/' + fixedemail).once('value').then((snapshot) => {
          const data = snapshot.val();
          if (data && data.enabled === true) {

            firebase.database().ref('/people/data/' + data.store).once('value').then((snapshot) => {
              const data = snapshot.val();
              if (data && data.email === fixedemail) {
             firebase.database().ref('/people/data/' + datacheck.store + '/state').on('value', (snapshot) => {
              const state = snapshot.val();
              if (state && Number(state.state) > 1) {
               window.location.href = "index.html"; // 첫 페이지로 이동
              } else {
                window.localStorage.setItem('name', JSON.stringify(data.name));
              }
            });           
           } else {
                window.location.href = "index.html"; // 로그인 페이지로 이동
              }
            });
  
          } else {
            window.location.href = "index.html"; // 로그인 페이지로 이동
        }
      });    
    } else {
      console.log("사용자 없음, 로그인 페이지로 이동");
      window.location.href = "index.html"; // 로그인 페이지로 이동
    }
});
    
function updatePage() {
  let hash = location.hash.substring(1) || "all";

  const drinks = document.getElementsByClassName("drink");
  const foods = document.getElementsByClassName("food");
  const services = document.getElementsByClassName("service");

  if (hash === "all") {
    // 모든 항목 보이기
    [...drinks, ...foods, ...services].forEach(el => el.style.display = "grid");
  } else {
    // 모든 항목 숨기기
    [...drinks, ...foods, ...services].forEach(el => el.style.display = "none");

    // 해당 항목만 보이기
    if (hash === 'drinks') {
      Array.from(drinks).forEach(el => el.style.display = "grid");
    } else if (hash === 'foods') {
      Array.from(foods).forEach(el => el.style.display = "grid");
    } else if (hash === 'services') {
      Array.from(services).forEach(el => el.style.display = "grid");
    }
  }
}
// 해시를 수동으로 변경하는 함수
function setHash(hash) {
  const tabs = ['all', 'drinks', 'foods', 'services'];

  tabs.forEach(tab => {
    const tabElement = document.getElementById(`${tab}-tab`);
    if (tab === hash) {
      tabElement.classList.add('btn-primary');
    } else {
      tabElement.classList.remove('btn-primary');
    }
  });

  location.hash = hash; // 해시 변경
}

function getOrder() {
    return JSON.parse(localStorage.getItem('order')) || [];
}

function display() {
  window.localStorage.removeItem('order');

  firebase.database().ref('/people/data/' + number + '/menu').once('value').then((snapshot) => {
    const allcontent = document.getElementById("all");
    // 초기화
    [allcontent].forEach(container => {
      container.innerHTML = '';
      container.className = 'menu-grid page'; // page 클래스 유지
    });

    function createMenuItem(item) {
      const card = document.createElement('div');
      card.classList.add("card");
      card.classList.add(item.type);
      card.setAttribute('interactive', '');
      card.style.height = "300px";
      card.style.width = "100px";

      card.onclick = function(event) {
        selectoption(event, item);
      };

      const cardimage = document.createElement('div');
      cardimage.classList.add("card-image");
      
      const img = document.createElement('img');
      img.src = `${item.image}?w=400&h=300&fm=webp&q=75&auto=compress,format`;
      img.loading = 'lazy';
      img.decoding = 'async'; // ✅ 여기 추가
      img.style.willChange = 'filter'; // ✅ 여기 추가
      
      img.style.width = '100%';
      img.style.height = '100px';
      img.style.objectFit = 'cover';
      img.style.borderTopLeftRadius = '12px';
      img.style.borderTopRightRadius = '12px';
      img.style.filter = 'blur(8px)';
      img.style.transition = 'filter 0.3s ease';
      
      img.onload = () => {
        img.style.filter = 'none';
      };     

      cardimage.appendChild(img);

      const content = document.createElement('div');
      content.style.padding = '12px';
      content.style.textAlign = 'center';
      content.classList.add("card-body");

      const name = document.createElement('div');
      name.textContent = item.name;
      name.style.fontWeight = 'bold';
      name.classList.add("card-header");

      content.appendChild(name);

      if (item.price) {
        const price = document.createElement('div');
        price.textContent = item.price + '원';
        price.style.color = '#666';
        content.appendChild(price);
      }

      const hotIceOption = item.option?.find(option =>
        option.name.includes('HOT/ICE') && Array.isArray(option.options)
      );
      
      if (hotIceOption) {
        const hasHot = hotIceOption.options.includes('hot');
        const hasIce = hotIceOption.options.includes('ice');
      
        if (hasHot || hasIce) {
          const tagWrap = document.createElement('div');
          tagWrap.style.marginTop = '4px';
          tagWrap.style.display = 'flex';
          tagWrap.style.justifyContent = 'center';
          tagWrap.style.gap = '4px';
          tagWrap.classList.add("card-footer");
      
          if (hasHot) {
            const hotTag = document.createElement('button');
            hotTag.textContent = 'HOT';
            hotTag.classList.add("btn");
            hotTag.style.backgroundColor = "red";
            hotTag.style.color = "white";
            hotTag.setAttribute('disabled', '');
            tagWrap.appendChild(hotTag);
          }
      
          if (hasIce) {
            const iceTag = document.createElement('button');
            iceTag.textContent = 'ICE';
            iceTag.classList.add("btn");
            iceTag.style.backgroundColor = "blue";
            iceTag.style.color = "white";
            iceTag.setAttribute('disabled', '');
            tagWrap.appendChild(iceTag);
          }
      
          content.appendChild(tagWrap);
        }
      }
      

      card.appendChild(cardimage);
      card.appendChild(content);
      return card;
    }

    const cafe = snapshot.val().cafe;
    const allItems = [
      ...(cafe.drinks || []).map(item => ({ ...item, type: 'drink' })),
      ...(cafe.foods || []).map(item => ({ ...item, type: 'food' })),
      ...(cafe.service || []).map(item => ({ ...item, type: 'service' }))
    ];

    const fragment = document.createDocumentFragment();

    allItems.forEach(item => {
      const card = createMenuItem(item);
      fragment.appendChild(card);
    });
    
    allcontent.appendChild(fragment);
    
  });
}

function selectoption(event, item) {
  event.preventDefault(); // 기본 제출 동작 방지

  if(orderwindow) {
    orderwindow.close(); // 기존 창 닫기
    orderwindow = null; // 참조 초기화
  }
  orderwindow = window.open(`cart.html`, '_blank'); // 새 탭에서 열기
  orderwindow.data = item; // 데이터 전달
}

function displayorders(number) {
  let order = getOrder(); // 최신 값 가져오기
  console.log(number); // 디버깅을 위한 로그 출력
  console.log(order); // 디버깅을 위한 로그 출력
  const menupan = document.getElementById('menupan');

  let container = menupan.querySelector('.child');
  if (!container) {
    container = document.createElement('div');
    container.className = 'child';
    container.style.display = 'flex';
    container.style.flexWrap = 'nowrap';
    container.style.overflowX = 'auto';
    menupan.appendChild(container); // 최초에만 추가
  }


  function createOrderItem(item) {
      const cellBox = document.createElement('div');
      cellBox.className = 'box boxes menupan';
      cellBox.style.flexShrink = '0'; // 크기 유지
      cellBox.style.width = '500px'; // 요소 크기 조정
      cellBox.style.height = '130px';
      cellBox.style.margin = '5px';

      const center = document.createElement('div');
      center.className = 'center';

      // 이미지 생성
      const figure = document.createElement('figure');
      figure.className = 'image';
      const img = document.createElement('img');
      img.src = `${item.image}?w=400&h=300&fm=webp&q=75&auto=compress,format`;
      img.style.width = '200px';
      img.style.height = '100px';
      img.style.borderRadius = '30px';
      img.style.objectFit = 'cover';

      const figcaption = document.createElement('figcaption');
      figcaption.textContent = item.name;
      figcaption.classList.add('figure-caption','text-center'); // figcaption에 클래스 추가
      
      
      figure.appendChild(img);
      figure.appendChild(figcaption);

      center.appendChild(figure);

      item.options.forEach(option => {
        if (option.name.includes('HOT/ICE')) {
          const chip = document.createElement('span');
          chip.textContent = option.value;
          chip.style.color = 'white';
          chip.className = 'chip';  
      
          // 배경색 및 텍스트 색상 지정
          if (option.value === 'HOT') {
            chip.style.backgroundColor = 'red';

          } else {
            chip.style.backgroundColor = 'blue';
          }
      
          center.appendChild(chip);
        }
      });
      
      // 수량 조절 필드 생성
      const field = document.createElement('div');
      field.className = 'field basket input-group form-group'; 

      function createIconButton(iconName, className, clickHandler) {
        const button = document.createElement('button');
        button.className = className;
        button.addEventListener('click', clickHandler);
      
        const icon = document.createElement('i');
        icon.className = 'material-icons'; // Material Icons 클래스
        icon.textContent = iconName; // 예: 'edit', 'delete', 'menu' 등 Material Icons 이름
        button.appendChild(icon);
      
        return button;
      }
      
    
    
      function createInput() {
        const input = document.createElement('input');
        input.type = 'number';
        input.setAttribute('placeholder', '수량');
        input.setAttribute('value', item.quantity);
        input.setAttribute('min', '1');
      
        if (item.max != null) {
          input.setAttribute('max', item.max);
        }
      
        input.className = `input basket-${item.id} form-input`;
        input.setAttribute('readonly', 'true');
      
        input.addEventListener('input', function () {
          enforceMinMax(this);
        });
      
        return input;
      }
      
      const input =  createInput();

      const minusButton = createIconButton('do_not_disturb_on', 'btn btn-primary input-group-btn', (event) => {
          event.preventDefault();
          let currentValue = parseInt(input.value) || 0;
          if (currentValue > 1) {
              updatequantity(item.id, currentValue - 1);
          } else if (currentValue === 1) {
              const index = order.findIndex(order => order.id === item.id);
              order.splice(index, 1);
              localStorage.setItem('order', JSON.stringify(order));
              cellBox.remove();
          }
      });

      const plusButton = createIconButton('add_circle', 'btn btn-primary input-group-btn', (event) => {
          event.preventDefault();
          let currentValue = parseInt(input.value) || 0;
          if (currentValue < item.max || item.max === "null") {
              updatequantity(item.id, currentValue + 1);
          }
      });

      field.appendChild(minusButton);
      field.appendChild(input);
      field.appendChild(plusButton);
      center.appendChild(field);

      cellBox.appendChild(center);
      return cellBox;
  }
  
  var list = order.filter(item => item.itemnumber === number); // 필터링된 주문 목록
  console.log(list); // 디버깅을 위한 로그 출력
  container.appendChild(createOrderItem(list[0]));


  menupan.appendChild(container);
}

function updatequantity(id, quantity) {
  let order = getOrder(); // 최신 값 가져오기
  const existingIndex = order.findIndex(item => Number(item.id) === Number(id)); // Check if item exists based on id
  order[existingIndex].quantity = quantity;
  order[existingIndex].price = order[existingIndex].pricePerUnit * quantity;
  localStorage.setItem('order', JSON.stringify(order)); // Save to localStorage
  document.querySelector(`.basket-${id}`).value = quantity; // Update the input field directly
}

function areOptionsEqual(options1, options2) {
  if (options1.length !== options2.length) return false;

  const sorted1 = [...options1].sort((a, b) => a.name.localeCompare(b.name));
  const sorted2 = [...options2].sort((a, b) => a.name.localeCompare(b.name));

  return sorted1.every((opt1, idx) => {
    const opt2 = sorted2[idx];
    return opt1.name === opt2.name && opt1.value === opt2.value;
  });
}

function getItemIndex(id, options) {
  const order = getOrder(); // 최신 주문 가져오기

  return order.findIndex(item =>
    item.id === id &&
    areOptionsEqual(item.options, options) // item.options와 비교
  );
}

function enforceMinMax(el) {
  if (el.value !== "") {
    const value = parseInt(el.value, 10);  // Ensure to parse the value
    const min = parseInt(el.min, 10);      // Parse the min attribute
    const max = parseInt(el.max, 10);      // Parse the max attribute

    if (value < min) {
      el.value = min;  // Set to min if value is less than min
    } else if (value > max) {
      el.value = max;  // Set to max if value is greater than max
    }
  }
}

document.getElementById('gopay').addEventListener('click', function(event) {
  submitorder(event);
});

function submitorder(event) {
  event.preventDefault(); // 기본 제출 동작 방지
  if(orderwindow) {
    orderwindow.close(); // 기존 창 닫기
    orderwindow = null; // 참조 초기화
  }
  orderwindow = window.open(`checkout.html`, '_blank'); // 새 탭에서 열기
}

function gohome() {
  document.getElementById("areyousure").classList.remove("active");
  window.localStorage.removeItem('order');
  window.location.href = "index.html";
  
}

document.getElementById("gohome").addEventListener("click", function () {
 document.getElementById("areyousure").classList.add("active");
});

function gocancel() {
document.getElementById("areyousure").classList.remove("active");
}

