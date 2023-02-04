# starbucks backend working

1) git clone
2) npm init
3) nodemon app.js



# Using PostMan or any get/post request method

1) post request to REGISTER
url : http://localhost:3000/register
body:{
  username: "YourName"
  password: "YourPassword"
}


2) post request to LOGIN
url : http://localhost:3000/login
body:{
  username: "YourName"
  password: "YourPassword"
}
// A Token will be generated


3) get request to see MENU
url : http://localhost:3000/menu


4) post request to PLACE_ORDER
set a field in header -> autherization : oken(generated in LOGIN)

url : http://localhost:3000/placeorder
body:[
 {
  name: "foodName1"
  quantity: "yourQuantity"
 },
 {
  name: "foodName2"
  quantity: "yourQuantity"
 }
]


5) get request to see PREVIOUS_ORDERS
url : http://localhost:3000/previousorders
set a field in header -> autherization : token(generated in LOGIN)


