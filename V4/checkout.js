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

var sendButton = document.getElementById('sendButton');
var input = document.getElementById('numberDisplay');
var email = JSON.parse(window.localStorage.getItem('email'));
var number = JSON.parse(window.localStorage.getItem('number'));

window.onload = function() {
    firebase.database().ref('/people/data/' + number + '/state').on('value', (snapshot) => {
    const state = snapshot.val();
    if (state && Number(state.state) > 1) {
      window.location.href = "index.html"; // 첫 페이지로 이동
    } else {
      window.localStorage.setItem('name', JSON.stringify(data.name));
    }
  }).catch((error) => {
     window.location.href = "index.html"; // 첫 페이지로 이동
    }); 
};

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

function getOrder() {
  return JSON.parse(localStorage.getItem('order')) || [];
  }

  function appendNumber(num) {
    if (input.value === '010-') {
        // '010-' 뒤에 숫자를 추가
        input.value = `010-${num}`;
    } else if (input.value.length < 13) {
        input.value = formatPhoneNumber(input.value + num);
    }
    toggleSendButton();
}

  function clearDisplay() {
    input.value = '010-';
    toggleSendButton();
  }

  function backspace() {
    if (input.value.length > 4) {
        let newValue = input.value.slice(0, -1);

        // 010 다음에 '-'가 자동으로 추가되도록 보정
        if (newValue === '010' || newValue === '010-') {
            input.value = '010-';
        } 
        // '-'로 끝나면 한 글자 더 삭제
        else if (newValue.endsWith('-')) {
            input.value = newValue.slice(0, -1);
        } 
        else {
            input.value = newValue;
        }
    }
    toggleSendButton();
}



  function toggleSendButton() {
    sendButton.style.display = (input.value.length === 13) ? 'block' : 'none';
  }

  function formatPhoneNumber(value) {
    value = value.replace(/[^0-9]/g, '');
    if (value.length > 4) {
        value = value.slice(0, 3) + '-' + value.slice(3);
    }
    if (value.length > 8) {
        value = value.slice(0, 8) + '-' + value.slice(8, 12);
    }
    return value;
  }

document.addEventListener("keydown", (event) => {
  if (event.key >= "0" && event.key <= "9") {
      document.getElementsByClassName(event.key)[0].click();  // 숫자 버튼 클릭
  } else if (event.key === "Enter") {  // 엔터를 누르면 제출출
      if(sendButton.style.display === 'block') {
          sendButton.click();
      }
  } else if (event.key === "Backspace") {  // 마지막 숫자 삭제
    document.getElementsByClassName(event.key)[0].click(); 
  }
});


document.getElementById('sendButton').addEventListener('click', function() {
  const div = document.querySelector('.keypad'); // 또는 적절한 div 선택자
  const buttons = div.querySelectorAll('button');
 
  buttons.forEach(button => {
    button.disabled = true;
  });

  var order = getOrder();
    firebase.database().ref('/people/data/' + number + '/number').once('value').then((snapshot) => {
      var ordernumber = snapshot.val();
      orderlist = [];
      orderlist.push(document.getElementById('numberDisplay').value);
      order.forEach((item) => {
         orderlist.push({id: item.id, quantity: item.quantity, name: item.name, options: item.options});
      });

      firebase.database().ref('people/data/' + number + '/order/' + ordernumber).set(orderlist, (error) => {
        if (error) {
          console.error("Error saving data:", error);
        } else {
          const updates = {};
          updates[`/people/data/${number}/number`] = firebase.database.ServerValue.increment(1);
          firebase.database().ref().update(updates, (error) => {
            if (!error) {
              console.log("Data saved successfully!");
              window.localStorage.removeItem('order');
              window.opener.postMessage("original", window.location.origin); // 부모 창에 메시지 전송
              window.close(); // 창 닫기
            } else {
              console.error("Error saving data:", error);
            }
          });
        }
      });
    
    });

  });
