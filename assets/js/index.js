(function () {

    let loginPageEl = document.getElementById("loginPage");
    let registerPageEl = document.getElementById("registerPage");

    let productsPageEl = document.getElementById("allProductsPage");

    let productsContainer = document.getElementById("productsContainer");
    let searchEl = document.getElementById("searchEl");

    let orderedProductsCounter = document.getElementById("orderedProductsCount");
    let cartPageEl = document.getElementById("cartPage");

    let orderPageEl = document.getElementById("orderPage");

    let cartTableEl = document.getElementById("cartTable");
    let noItemsInCartDiv = document.getElementById("noItemsInCartDiv");

    let orderForm = document.getElementById("orderForm");
    let submitBtnOrder = document.getElementById("submitBtnOrder");
    let thanksDiv = document.getElementById("thanksDiv");

    let orderHistoryTable = document.getElementById("orderHistoryTable");

    let logoutBtn = document.getElementById("logoutBtn");

    let registerLink = document.getElementById("registerLink");
    let loginLink = document.getElementById("loginLink");
    let menuLink = document.getElementById("menuLink");

    let cartIconDivEl = document.getElementById("cartIconDiv");


    window.addEventListener("load", showPage);
    window.addEventListener("hashchange", showPage);

    //!logout
    logoutBtn.addEventListener("click", function (e) {
        userManager.logout();

        location.hash = "#login";
    })

    //!2.Създай ProductManager
    let productManager = new ProductManager();

    //!3.Напълни с продукти productManager
    products.forEach(product => {
        productManager.addProduct(new Product(...Object.values(product))); //пълним productManger с продукти от class Product
    })
    // console.log(productManager.allProducts);

    //!4. hash рутер
    function showPage() {
    
        if (userManager.currentUser) {
            menuLink.style.display = "inline";
            logoutBtn.style.display = "inline";
            cartIconDivEl.style.display = "inline";

            registerLink.style.display = "none";
            loginLink.style.display = "none";
        } else {
            menuLink.style.display = "none";
            logoutBtn.style.display = "none";
            cartIconDivEl.style.display = "none";

            registerLink.style.display = "inline";
            loginLink.style.display = "inline";
        }



        let hash = location.hash.slice(1);

        if (hash === "") {
            hash = "login";
        }

        switch (hash) {
            case "menu":
                productsPageEl.style.display = "block";
                cartPageEl.style.display = "none";
                orderPageEl.style.display = "none";
                loginPageEl.style.display = "none";
                registerPageEl.style.display = "none";
                printProducts(productManager.allProducts, productsContainer);
                break;

            case "cart":
                productsPageEl.style.display = "none";
                cartPageEl.style.display = "flex";
                orderPageEl.style.display = "none";
                loginPageEl.style.display = "none";
                registerPageEl.style.display = "none";
                renderCartPage();
                break;

            case "order":
                productsPageEl.style.display = "none";
                cartPageEl.style.display = "none";
                orderPageEl.style.display = "flex";
                loginPageEl.style.display = "none";
                registerPageEl.style.display = "none";
                loadOrderPage();
                break;

            case "login":
                productsPageEl.style.display = "none";
                cartPageEl.style.display = "none";
                orderPageEl.style.display = "none";
                registerPageEl.style.display = "none";
                loginPageEl.style.display = "flex";
                break;

            case "register":
                productsPageEl.style.display = "none";
                cartPageEl.style.display = "none";
                orderPageEl.style.display = "none";
                loginPageEl.style.display = "none";
                registerPageEl.style.display = "flex";
                break;


            default:

                break;
        }

    }


    function printProducts(products, container) {

        container.innerHTML = "";

        products.forEach(product => {

            let cardDiv = document.createElement("div");
            cardDiv.classList.add("card");

            let img = document.createElement("img");
            img.classList.add("cardImg");
            img.src = product.image;

            let p1 = document.createElement("p");
            p1.classList.add("cardP");
            p1.textContent = `Name: ${product.name}`;

            let p2 = document.createElement("p");
            p2.classList.add("cardP");
            p2.textContent = `Weight: ${product.weight}`;

            let p3 = document.createElement("p");
            p3.classList.add("cardP");
            p3.textContent = `Category: ${product.category}`;

            let p4 = document.createElement("p");
            p4.classList.add("cardP");
            p4.textContent = `Price: ${product.price} лв.`;

            let lastDiv = document.createElement("div");
            lastDiv.classList.add("cardLastDiv")

            let cardInput = document.createElement("input");
            cardInput.type = "number";
            cardInput.value = 1;

            let cardBtn = document.createElement("button");
            cardBtn.textContent = "Add to cart";

            //аdd product and count to cart
            cardBtn.addEventListener("click", function (e) {
                let count = cardInput.value;

                if (count > 0) {
                    // user.addToCart(product, count)
                    userManager.currentUser.addToCart(product, count)

                    // orderedProductsCounter.innerText = user.getCountInCart();
                    orderedProductsCounter.innerText = userManager.currentUser.getCountInCart();

                    if (userManager.currentUser.getCountInCart() > 0) {
                        orderedProductsCounter.style.display = "inline";
                    }
                }

            });

            lastDiv.append(cardInput, cardBtn);

            cardDiv.append(img, p1, p2, p3, p4, lastDiv);

            container.append(cardDiv);
        })

    }


    function renderCartPage() {
       
        if (userManager.currentUser.productsInCart.length > 0) {
            cartTableEl.style.display = "block";
            noItemsInCartDiv.style.display = "none";
            populateCartTable(userManager.currentUser.productsInCart, cartTableEl);
        } else {
            cartTableEl.style.display = "none";
            noItemsInCartDiv.style.display = "block";
        }

        populateOrderHistoryTable(userManager.currentUser.orderHistory, orderHistoryTable);
    }

    function populateCartTable(cartItems, table) {
    
        table.innerHTML = "";

        let lastTr = document.createElement("tr");
        let lastTrTd1 = document.createElement("td");
        let lastTrTd2 = document.createElement("td");
        lastTrTd2.id = "totalTd";
        lastTrTd2.textContent = `Total: ${userManager.currentUser.getTotal()} лв.`;
        let lastTrTd3 = document.createElement("td");
        lastTrTd3.id = "orderTd";
        let orderLink = document.createElement("a");
        orderLink.id = "orderLink";
        orderLink.textContent = "Order";
        orderLink.href = "#order";

        cartItems.forEach(item => {

            let mainTr = document.createElement("tr");

            let nameTd = document.createElement("td");
            nameTd.textContent = item.name;

            let priceTd = document.createElement("td");
            priceTd.textContent = item.price * item.orderedCount; //В количката, цената на продуктите е за бройката, която са поръчани. Ако имам 3 дюнера по 7лв трябва да имам 21лв за този продукт.

            let countInputTd = document.createElement("td");
            let countInput = document.createElement("input");
            countInput.type = "number";
            countInput.value = item.orderedCount;

            countInput.addEventListener("input", function (e) {

                item.orderedCount = e.target.value;
                priceTd.textContent = item.price * item.orderedCount;
                item.totalProductValue = item.orderedCount * item.price;

                lastTrTd2.textContent = `Total: ${userManager.currentUser.getTotal()}`;
                orderedProductsCounter.innerText = userManager.currentUser.getCountInCart();

            })

            let deleteProductBtn = document.createElement("button");
            deleteProductBtn.textContent = "X";

            //delete from cart
            deleteProductBtn.addEventListener("click", function (e) {

                userManager.currentUser.deleteProductFromCart(item);

                e.target.parentElement.parentElement.remove();
                lastTrTd2.textContent = `Total: ${userManager.currentUser.getTotal()}`;
                orderedProductsCounter.innerText = userManager.currentUser.getCountInCart();

                if (userManager.currentUser.productsInCart.length <= 0) {
                    cartTableEl.style.display = "none";
                    noItemsInCartDiv.style.display = "block";
                }

            })

            countInputTd.append(countInput, deleteProductBtn);

            mainTr.append(nameTd, priceTd, countInputTd);

            table.append(mainTr)

        })

        lastTrTd3.append(orderLink);

        lastTr.append(lastTrTd1, lastTrTd2, lastTrTd3);

        table.append(lastTr);

    }

    function populateOrderHistoryTable(orders, table) {

        table.innerHTML = "";

        orders.forEach(order => {

            let newOrderTr = document.createElement("tr");

            let dateTimeTd = document.createElement("td");
            dateTimeTd.innerText = order.dateTime;

            let addressTd = document.createElement("td");
            addressTd.innerText = order.address;

            let productsTd = document.createElement("td");
            productsTd.innerText = order.orderedProducts.join(", ");

            let totalTd = document.createElement("td");
            totalTd.innerText = order.total + "лв.";


            newOrderTr.append(dateTimeTd, addressTd, productsTd, totalTd);

            table.append(newOrderTr);

        })


    }

    //submit order button listener function
    submitBtnOrder.addEventListener("click", function (e) {
        e.preventDefault();

        let newTime = new Date().toLocaleTimeString();
        let newDate = new Date().toLocaleDateString();

        //to do validate - ако остане време
        // let name = orderForm.name.value;
        // let phone = orderForm.phone.value;
        let address = orderForm.address.value;

        let orderedProducts = userManager.currentUser.productsInCart.map(el => el.name + " " + el.orderedCount);

        let orderObj = {
            dateTime: `${newTime} ${newDate}`,
            address,
            orderedProducts,
            total: userManager.currentUser.getTotal(),
        }


        loginPageEl.style.display = "none";
        registerPageEl.style.display = "none";
        userManager.currentUser.addOrderToHistory(orderObj);
        userManager.updateUser(userManager.currentUser);

        orderedProductsCounter.textContent = "";
        orderedProductsCounter.style.display = "none";

        orderForm.reset();

        orderForm.style.display = "none";
        thanksDiv.style.display = "block";

        let redirect = setInterval(function () {

            location.hash = "#cart";
            orderForm.style.display = "flex";
            thanksDiv.style.display = "none";
            clearInterval(redirect);
        }, 2000)


    })

    //!Load order page
    function loadOrderPage() {

        orderForm.addEventListener('input', function (e) {
            if (this.checkValidity()) {
                submitBtnOrder.removeAttribute('disabled');
            } else {
                submitBtnOrder.setAttribute('disabled', true);
            }
        });
    }


    //!search by name
    searchEl.addEventListener("input", function (e) {
        let searchStr = e.target.value;
        let results = productManager.search(searchStr);
        printProducts(results, productsContainer);
    })


})();