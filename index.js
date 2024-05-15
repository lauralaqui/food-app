import { menuArray } from '/data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid'

const menuItem = document.getElementById('menu-items')
const cartSummary = document.getElementById('cart-container')
const cartItems = document.getElementById('cart-items')
const total = document.getElementById('total')
const paymentModal = document.getElementById('modal')
const paymentCloseBtn = document.querySelector('[data-close-btn="modal-close-btn"]')
const paymentForm = document.getElementById('payment-form')
const thankYouMsg = document.getElementById('thank-you-msg')
let cart = []
let cartCount = {} // Object to store the count of each item in the cart

//event listeners
document.addEventListener('click', function(e){
    if (e.target.dataset.btnId) {
        addToCart(e.target.dataset.btnId, e.target.dataset.btnName, parseFloat(e.target.dataset.btnPrice))
    } else if (e.target.dataset.remove){
        removeItem(e.target.dataset.remove)
    } else if (e.target.dataset.submitBtn) {
        paymentModal.style.display = 'block'
    } else if (e.target.dataset.closeBtn) {
        paymentModal.style.display = 'none'
    }
})

paymentForm.addEventListener('submit', function(e){
    e.preventDefault()
    const paymentFormData = new FormData(paymentForm)
    const name = paymentFormData.get('name')
    paymentModal.style.display = 'none'
    cartSummary.style.display = 'none'
    thankYouMsg.style.display = 'block'
    
    thankYouMsg.innerHTML = `<h3>Thank you, ${name}!<h3><h4>Your order is on its way<h4>`
})

function renderMenuArray(menu){
    let items = ``
    for (let menuItems of menu){
        items += `
        <div class="menu-item">
            <img class="food-img" src="${menuItems.image}" />
            <div class="food-description">
                <h4>${menuItems.name}</h4>
                <p>${[...menuItems.ingredients].join(', ')}<p>
                <p>$${menuItems.price}</p>
            </div>
            
            <hr class="menu-item-line">

                <button 
                class="add-btn" 
                data-btn-id=${menuItems.id}
                data-btn-name=${menuItems.name}
                data-btn-price=${menuItems.price}
                >+</button>
        </div>   
         `
    }
    menuItem.innerHTML = items
}

renderMenuArray(menuArray)

function addToCart(id, name, price){
    // Check if the item already exists in the cart
    const existingCartItem = cart.find(item => item.id === id);
    if (existingCartItem) {
        cartCount[id]++; // Increment the count if the item exists
    } else {
        //assigns a uuid to the added menu item object so that this element can be targeted for removeItem function
        let uuid = uuidv4()
        cart.push({id, name, price, uuid}) // Store the id along with other details in the cart
        cartCount[id] = 1; // Initialize count to 1 if the item is being added for the first time
    }

    if (cart.length > 0) {
        cartSummary.classList.remove('hidden')
    } 
    renderCartArray()
    calculateTotal(cart)
}

function removeItem(item){
    // Find the cart item corresponding to the UUID
    const cartItem = cart.find(cartItem => cartItem.uuid === item);
    
    // Decrease the count of the item
    cartCount[cartItem.id]--;
    
    // Remove the item from the cart only if the count is zero
    if (cartCount[cartItem.id] === 0) {
        const index = cart.findIndex(cartItem => cartItem.uuid === item);
        cart.splice(index, 1); // Remove the item from the cart
        delete cartCount[cartItem.id]; // Remove the item from the count object
    }
    
    if(cart.length === 0){
        cartSummary.classList.add('hidden')
    }
    renderCartArray() 
    calculateTotal(cart)
}


function renderCartArray () {
    cartItems.innerHTML = cart.map(cartItem => {
        return `
        <div class="cart-item-container">
            <div class="cart-item-details">
                <div class="cart-item-name">${cartItem.name} (${cartCount[cartItem.id] || 0})</div>
                <button class="remove-btn" data-remove=${cartItem.uuid}>remove</button>
            </div>
            <div>$${cartItem.price}</div>
        </div>
        `
    }).join('')
}

function calculateTotal(cartArray) {
    const sum = cart.reduce(function (total, cartItem){
        return total + cartItem.price
    },0)
    return total.innerHTML = "$" + sum
}
