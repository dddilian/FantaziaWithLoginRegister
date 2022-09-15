let userManager = (function () {

    class UserManager {

        constructor() {

            this.users = [];
            this.currentUser = undefined;

            if (!localStorage.getItem("users")) { //ако няма юзъри в localStorage
                localStorage.setItem("users", JSON.stringify(defaultUsers)); //сетни default-ните в localStorage
            }

            JSON.parse(localStorage.getItem("users")).forEach(user => {

                //за да имат всички функции на class User, след десериализация трябва да се вкарат в this.users, като обекти от клас User
                this.users.push(new User(...Object.values(user)));

                //this.users.push(user); //или пък да се вкара като class User само currentUser
            });

            console.log(this.users);


            if (localStorage.getItem("currentUser")) {
                this.currentUser = this.getLoggedUser();
            }

        }

        getLoggedUser() {

            let loggedUser = JSON.parse(localStorage.getItem("currentUser"));

            if (loggedUser) {
                let user = this.getUser(loggedUser.username)
                // user.orderHistory = [
                //     ...loggedUser.orderHistory
                // ]

                return user;
                //return new User(...Object.values(user)); //или пък да се вкара като class User само currentUser
            }

            return false;
        }


        getUser(username) {
            return this.users.find(u => u.username === username);
        }


        loginUser(username, password) {

            if (userManager.validUser(username, password)) {

                this.currentUser = this.getUser(username);
                //this.currentUser = new User(...Object.values(this.getUser(username))); //или пък да се вкара като class User само currentUser

                localStorage.setItem("currentUser", JSON.stringify(this.currentUser));

                return true;
            }

            return false;
        }


        //проверка дали вече регистриран юзър си е въвел правилно името и паролата
        validUser(username, password) {
            return this.users.some(user => user.username === username && user.password === password);
        }


        //проверка дали юзъра е регистриран
        isRegistered(username) {
            return this.users.some(user => user.username === username);
        }

        
        registerUser(username, password) {
            //ако няма такъв user, регистрирай го
            if (!this.isRegistered(username)) {

                this.users.push(new User(username, password));
                localStorage.setItem('users', JSON.stringify(this.users));

                return true;
            }

            return false;
        }

        updateUser(user) {
            localStorage.setItem("currentUser", JSON.stringify(user));
            localStorage.setItem('users', JSON.stringify(this.users));
        }

        logout() {
            //презапиши всички юзъри в localStorage, заедно с последно модифицирания, за да може да се запази актуалното му състояние
            // localStorage.setItem('users', JSON.stringify(this.users));
            //след това разкарай юзъра, с който последно е работено
            localStorage.removeItem("currentUser");
            this.currentUser = undefined;
        }


    }


    return new UserManager();

})();