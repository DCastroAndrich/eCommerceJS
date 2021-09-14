// ========== Constantes =========

const cartContainer = document.querySelector(".cart__container");
const productList = document.querySelector(".product__list");
const cartList = document.querySelector(".cart__list");
const cartTotalValue = document.getElementById("cart__total--value");
const cartCountInfo = document.getElementById("cart__count--info");

let cartItemID = 1;


// vaciar localStorage

localStorage.removeItem("productos")


/* ======== Eventos ====== */

eventListeners();

function eventListeners() {

    $(document).ready( () => {
       loadJSON();
       loadCart();
    });


    // toogle navbar

    document.querySelector(".navbar__toggler").addEventListener("click", ()=> {
        document.querySelector(".navbar__collapse").classList.toggle("show__navbar");
    });


    // mostrar/ocultar carrito

    document.getElementById("cart__btn").addEventListener("click", () => {
        cartContainer.classList.toggle("show__cart__container");
    });

    productList.addEventListener("click", purchaseProduct);

    cartList.addEventListener("click", deleteProduct);
}


// actualizar carrito

function updateCartInfo(){
    let cartInfo = findCartInfo();
    cartCountInfo.textContent = cartInfo.productCount;
    cartTotalValue.textContent = cartInfo.total;
}


// listado de productos JSON

function loadJSON() {
    fetch("productos.json")
    .then(response => response.json())
    .then(data => {
        let html = "";
        data.forEach(product => {
            html += `
                
                <div class="product__item">
                    <div class="product__img">
                        <img src="${product.img}" alt="${product.marca} ">
                        <button type="button" class="add__to__cart--btn">
                            <i class="fas fa-cart-arrow-down"></i>Añadir al carrito
                        </button>
                    </div>

                    <div class="product__content">
                        <h3 class="product__name">${product.marca}</h3>
                        <span class="product__category">${product.tipo}</span>
                        <p class="product__price">$${product.precio}</p>
                    </div>

                </div>

            `;
        });
        productList.innerHTML = html;
    })
    .catch(error => {
        alert("Usar live server o local server")
    })
}



// compra de productos


function purchaseProduct(e){
    if(e.target.classList.contains("add__to__cart--btn")){
        let product = e.target.parentElement.parentElement;
        getProductInfo(product);
    }
}

function getProductInfo(product){
    let productInfo = {
        id: cartItemID,
        img: product.querySelector(".product__img img").src,
        name: product.querySelector(".product__name").textContent,
        category: product.querySelector(".product__category").textContent,
        price: product.querySelector(".product__price").textContent
    }
    cartItemID++;
    addToCartList(productInfo);
    saveProductInStorage(productInfo);
}


// agregar productos al carrito
/* 
function addToCartList(product){
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart__item");
    cartItem.setAttribute("data-Id", `${product.id}`);
    cartItem.innerHTML = `
        
            <img src="${product.img}" alt="${product.name} ">
        
            <div class="cart__item--info">
                <h3 class="cart__item--name">${product.name}</h3>
                <span class="cart__item--category">${product.category}</span>
                <span class="cart__item--price">${product.price}</span>
            </div>
                
            <button type="button" class="cart__item--del-btn">
                <i class="fas fa-times"></i>
            </button>
        
    `;
    cartList.appendChild(cartItem);
}

 */


// agregar prodcutos al carrito jQuery

function addToCartList(product){
    $(cartList).append(`
        <div class="cart__item" data-Id=${product.id}>
            <img src="${product.img}" alt="${product.name} ">
            
            <div class="cart__item--info">
                <h3 class="cart__item--name">${product.name}</h3>
                <span class="cart__item--category">${product.category}</span>
                <span class="cart__item--price">${product.price}</span>
            </div>
                
            <button type="button" class="cart__item--del-btn">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `);
}



// guardar productos en storage

function saveProductInStorage(item){
    let products = getProductFromStorage();
    products.push(item);
    localStorage.setItem("products", JSON.stringify(products));
    updateCartInfo();
}

function getProductFromStorage(){
    return localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [];

}



// productos en el carrito

function loadCart(){
    let products = getProductFromStorage();
    if(products.length < 1){
        cartItemID = 1;
    }else {
        cartItemID = products[products.length - 1].id;
        cartItemID++;
    }
    products.forEach(product => addToCartList(product));

    updateCartInfo();

}




// precio total

function findCartInfo(){
    let products = getProductFromStorage();
    let total = products.reduce((acc, product) => {
        let price = parseFloat(product.price.substr(1));
        return acc += price;
    }, 0);
    
    return{
        total: total.toFixed(2),
        productCount: products.length
    }
    
}



// borrar productos del carrito

function deleteProduct(e){
    let cartItem;
    if(e.target.tagName === "BUTTON"){
        cartItem = e.target.parentElement;    
    } else if(e.target.tagName === "I"){
        cartItem = e.target.parentElement.parentElement;
    }

    let products = getProductFromStorage();
    let updatedProducts = products.filter(({id}) => id !== parseInt(cartItem.dataset.id));
        
    cartItem.remove();
    
    localStorage.setItem("products", JSON.stringify(updatedProducts));
    updateCartInfo();
}
