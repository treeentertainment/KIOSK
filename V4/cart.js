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

window.onload = function() {
  try {
    firebase.database().ref('/people/data/' + number + '/state').on('value', (snapshot) => {
      const state = snapshot.val();
      if (state && Number(state.state) > 1) {
        window.location.href = "index.html"; // 첫 페이지로 이동
      } else {
       selectoption(window.data);
      }
    });
  } catch (error) {
    window.location.href = "index.html"; // 첫 페이지로 이동
  }
};



var email = JSON.parse(window.localStorage.getItem('email'));
var number = JSON.parse(window.localStorage.getItem('number'));
var name = JSON.parse(window.localStorage.getItem('name'));
const user = firebase.auth().currentUser;

document.getElementById("optionform").addEventListener("submit", function(event) {
    event.preventDefault(); // 기본 제출 동작 방지
    addorder();
});

function getOrder() {
    const order = JSON.parse(localStorage.getItem('order')) || [];
    return order;
}

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
                window.localStorage.setItem('name', JSON.stringify(data.name));
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


function selectoption(data) {
  try {
    const optionform = document.getElementById('optionform');
    const optioncontent = document.getElementById('optioncontent');

    // Clear dataset and previous content
    for (const key in optionform.dataset) delete optionform.dataset[key];
    optioncontent.innerHTML = '';

    const center = document.createElement('div');
    center.style.textAlign = 'center';

    const infowrapper = document.createElement('div');
    infowrapper.style.display = 'flex';
    infowrapper.style.alignItems = 'center'; // 수직 정렬
    infowrapper.style.gap = '16px'; // 이미지와 텍스트 사이 간격
    infowrapper.style.justifyContent = 'center';
    infowrapper.style.alignItems = 'center';
    // Image
    const image = document.createElement('img');
    image.src = `${data.image}?w=400&h=300&fm=webp&q=75&auto=compress,format`;
    image.id = "optionimg";
    image.style.width = '128px';
    image.style.height = '128px';
    image.style.objectFit = 'cover';
    image.style.borderRadius = '30px';
    infowrapper.appendChild(image);
    
    // 텍스트 wrapper
    const textWrapper = document.createElement('div');
    
    // Name (strong inside h1)
    const title = document.createElement('h1');
    title.className = 'name';
    const bold = document.createElement("strong");
    bold.innerText = data.name;
    title.appendChild(bold);
    textWrapper.appendChild(title);
    
    // 가격 wrapper
    const priceWrapper = document.createElement('div');
    priceWrapper.style.display = 'inline'; // 또는 'inline-block'
    
    const subtitle = document.createElement('h2');
    subtitle.id = 'optionprice';
    subtitle.style.display = 'inline';
    subtitle.textContent = data.price;
    priceWrapper.appendChild(subtitle);
    
    const won = document.createElement('h2');
    won.id = 'optionwon';
    won.style.display = 'inline';
    won.textContent = "원";
    priceWrapper.appendChild(won);
    
    // 가격을 텍스트 wrapper에 추가
    textWrapper.appendChild(priceWrapper);
    
    // 텍스트 wrapper를 infowrapper에 추가
    infowrapper.appendChild(textWrapper);
    
    // center 요소에 추가
    center.appendChild(infowrapper);
    

    const space = document.createElement('br');
    center.appendChild(space);


    optionform.dataset.id = data.key;
    optionform.dataset.max = data.max;
    optionform.dataset.option = JSON.stringify(data.option);

    
    // Options rendering
    if (data.option) {
      data.option.forEach((opt) => {
        
        if (opt.type === 'radio') {
          const h4 = document.createElement("h4");
          const strong = document.createElement("strong");
          strong.innerText = opt.name;
          h4.appendChild(strong);

          const chipSet = document.createElement('div');
          chipSet.id = `radio-${opt.key}`;
          
          opt.options.forEach((optVal, idx) => {
            const chip = document.createElement('button');
            chip.type = "button"; // 이 줄 추가!

            chip.innerText = optVal.toUpperCase();
            chip.classList.add("button-chips");
            chip.classList.add("btn", "btn-lg");
            if (idx === opt.default) chip.classList.add("btn-primary");
            chipSet.appendChild(chip);
          });
        
          // 단일 선택 기능 구현
          chipSet.addEventListener('click', (e) => {
            if (e.target.classList.contains('button-chips')) {
              chipSet.querySelectorAll('.button-chips').forEach(chip => {
                chip.classList.remove("btn-primary");
              });
              e.target.classList.add("btn-primary");
            }
          });
          
          center.appendChild(h4);
          center.appendChild(chipSet);
        }
        
        
        const br = document.createElement('br');
        center.appendChild(br);

        if (opt.type === 'range') {               
          const h4 = document.createElement("h4");
          const strong = document.createElement("strong");
          strong.innerText = opt.name;
          h4.style.margin = "0";
          h4.appendChild(strong);
          

          const rangeWrapper = document.createElement('div');
          rangeWrapper.id = `range-${opt.key}`;
          rangeWrapper.classList.add('input-group', 'form-group', 'text-center');
          rangeWrapper.style.justifyContent = "center"; // center horizontally
          rangeWrapper.style.display = "flex";
          rangeWrapper.style.alignItems = "center"; // optional


          const minusBtn = document.createElement('button');
          minusBtn.type = "button";
          minusBtn.classList.add("btn", "btn-lg");
          minusBtn.classList.add("input-group-btn");

          const icon = document.createElement('i');
          icon.classList.add("material-icons");
          icon.textContent = "do_not_disturb_on"; // 예: 'edit', 'delete', 'menu' 등 Material Icons 이름
          minusBtn.appendChild(icon);

          const input = document.createElement('input');
          input.type = 'number';
          input.value = 0;
          input.min = opt.min;
          input.id = `input-${opt.key}`
          input.classList.add('optionquantity', 'form-input', "input-lg", 'text-center');
          input.style.textAlign = 'center'; // 텍스트 가운데 정렬
          input.style.textAlignLast = 'center'; // 숫자 가운데 정렬 (크로스 브라우저 호환성)
          input.setAttribute('readonly', 'true');
          
          if (opt.max != null) input.max = opt.max;


          const plusBtn = document.createElement('button');
          plusBtn.type = "button";
          plusBtn.classList.add("btn", "btn-lg");
          plusBtn.classList.add("input-group-btn");

          const iconplus = document.createElement('i');
          iconplus.classList.add("material-icons");
          iconplus.textContent = "add_circle"; // 예: 'edit', 'delete', 'menu' 등 Material Icons 이름
          plusBtn.appendChild(iconplus);

          minusBtn.onclick = (e) => {
            e.preventDefault();
            let val = parseInt(input.value) || 0;
            if (val > 0) {
              input.value = val - 1;
              subtitle.textContent = Number(subtitle.textContent) - Number(opt.price);
            }
          };

          plusBtn.onclick = (e) => {
            e.preventDefault();
            let val = parseInt(input.value) || 0;
            if (val < opt.max || opt.max == null) {
              input.value = val + 1;
              subtitle.textContent = Number(subtitle.textContent) + Number(opt.price);
            }
          };

          rangeWrapper.appendChild(minusBtn);
          rangeWrapper.appendChild(input);
          rangeWrapper.appendChild(plusBtn);

          center.appendChild(h4);
          center.appendChild(rangeWrapper);
        }
      });
    }


    const br = document.createElement('br');
    center.appendChild(br);


    const quantityWrapper = document.createElement('div');
    quantityWrapper.classList.add('input-group', 'form-group', 'text-center');
    quantityWrapper.style.justifyContent = "center"; // center horizontally
    quantityWrapper.style.display = "flex";
    quantityWrapper.style.alignItems = "center"; // optional

    const h4 = document.createElement("h4");
    h4.classList.add('text-center');
    h4.style.margin = "0";
    h4.style.textAlign = 'center';   // 명시적으로 가운데 정렬

    const strong = document.createElement("strong");
    strong.innerText = "수량";

    h4.appendChild(strong);
    center.appendChild(h4);


    const minusBtn = document.createElement('button');
    minusBtn.type = "button";
    minusBtn.classList.add("btn", "btn-lg");
    minusBtn.classList.add("input-group-btn");

    const icon = document.createElement('i');
    icon.classList.add("material-icons");
    icon.textContent = "do_not_disturb_on"; // 예: 'edit', 'delete', 'menu' 등 Material Icons 이름
    minusBtn.appendChild(icon);

    const input = document.createElement('input');
    input.type = 'number';
    input.min = 1;
    input.value = 1;
    input.id = 'optionquantity';
    input.classList.add('optionquantity', 'form-input', "input-lg", 'text-center');
    input.style.textAlign = 'center'; // 텍스트 가운데 정렬
    input.style.textAlignLast = 'center'; // 숫자 가운데 정렬 (크로스 브라우저 호환성)

    input.setAttribute('readonly', 'true');

    let maxvalue = data.max;
    const existingIndex = getItemIndex(data.key.toString(), data.option);
    const order = getOrder();
    if (existingIndex !== -1 && order[existingIndex].max !== "null") {
      maxvalue = data.max - order[existingIndex].quantity;
      if (maxvalue <= 0) {
        isfull();
        return;
      } else {
        input.max = maxvalue;
      }
    } else if (maxvalue !== "null") {
      input.max = maxvalue;
    }

      if(data.status === false) {
        window.close();
      }

    const plusBtn = document.createElement('button');
    plusBtn.type = "button";
    plusBtn.classList.add("btn", "btn-lg");
    plusBtn.classList.add("input-group-btn");

    const iconplus = document.createElement('i');
    iconplus.classList.add("material-icons");
    iconplus.textContent = "add_circle"; // 예: 'edit', 'delete', 'menu' 등 Material Icons 이름
    plusBtn.appendChild(iconplus);

    minusBtn.onclick = (e) => {
      e.preventDefault();
      let val = parseInt(input.value) || 1;
      if (val > 1) {
        input.value = val - 1;
        subtitle.textContent = Number(subtitle.textContent) - Number(data.price);
      }
    };

    plusBtn.onclick = (e) => {
      e.preventDefault();
      let val = parseInt(input.value) || 1;
      if (val < maxvalue || maxvalue === "null") {
        input.value = val + 1;
        subtitle.textContent = Number(subtitle.textContent) + Number(data.price);
      }
    };

    quantityWrapper.appendChild(minusBtn);
    quantityWrapper.appendChild(input);
    quantityWrapper.appendChild(plusBtn);

    center.appendChild(quantityWrapper);
    optioncontent.appendChild(center);
  } catch (e) {
    window.close();
  }
}

function addorder() {
    const form = document.getElementById('optionform');
    const itemId = form.dataset.id;
    const max = form.dataset.max;
    const name = document.querySelector('.name')?.innerText;
    const image = document.querySelector('#optionimg').src;
    const price = Number(document.querySelector('#optionprice').textContent);
    const quantity = Number(document.querySelector('#optionquantity').value);
    let jsons; 
    try {
      jsons = JSON.parse(form.dataset.option);
    } catch (error) {
      jsons = [];
    }
    
    var newjsons = [];

    console.log(jsons.length);
    for(let i = 0; i < jsons.length; i++) {

      if (jsons[i].type === "radio") {
        const optionele = document.querySelector(`#radio-${jsons[i].key}`);
        const selectedChip = optionele.querySelector('.btn-primary');
        var values = selectedChip ? selectedChip.innerText : null;
      } else if (jsons[i].type === "range") {
        const optionele = document.querySelector(`#range-${jsons[i].key}`);
        var values = optionele.querySelector(".optionquantity").value;
      }
      

      newjsons.push({ name: jsons[i].name, value: values });
    };

    addItemToOrder({ id: itemId, name, image, price, quantity, options: newjsons, max });  
}

function addItemToOrder({ id, image, name, price, quantity, options, max }) {
  const existingIndex = getItemIndex(id, options);
  let order = getOrder(); // Get the latest order

    if (existingIndex !== -1) {
        // Update existing item: add quantity and recalculate total price
        order[existingIndex].quantity += quantity;
        order[existingIndex].price = order[existingIndex].pricePerUnit * order[existingIndex].quantity;
    } else {
       var itemnumber = order.length + 1;
      order.push({ itemnumber, id, image, name, quantity, price: price * quantity, pricePerUnit: price, options, max });
    }

    localStorage.setItem('order', JSON.stringify(order)); // Save to localStorage

    if(existingIndex !== -1) {
      window.opener.postMessage({ type: "UpdateOrder", id: id, quantity: order[existingIndex].quantity }, window.location.origin);
    } else {
      window.opener.postMessage({type: "newOrder", number: order.length}, window.location.origin);
    }
    window.close(); // Close the window
}

  // Get item index based on id and options (first match by id, then by options)
  function getItemIndex(id, option) {
    let order = getOrder(); // Get the latest order
    return order.findIndex(item => {
      return item.id === id && JSON.stringify(item.options) === JSON.stringify(option);
    });
  }
  
  

function isfull() {
  const optionform = document.getElementById('optionform');
  const optioncontent = document.getElementById('optioncontent');
  optioncontent.innerHTML = ''; // Clear existing content

  const center = document.createElement('center');
  const title = document.createElement('h1');

  title.className = 'title';
  title.textContent = "최대 주문 개수를 초과하였습니다.";
  center.appendChild(title);
  optioncontent.appendChild(center);

  var optionbuttons = document.getElementById('submitbutton');
  optionbuttons.style.display = 'none';
}

document.getElementById('closeform').addEventListener('click', function() {
  window.opener.postMessage("noselect", window.location.origin);
});
