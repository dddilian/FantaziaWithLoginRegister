let userManager = (function () {

    class UserManager {

        constructor() {

            this.users = [];

            if (!localStorage.getItem("users")) { //ако няма юзъри в localStorage
                localStorage.setItem("users", JSON.stringify(defaultUsers)); //сетни default-ните в localStorage
            }


            JSON.parse(localStorage.getItem("users")).forEach(user => {

                //за да имат всички функции на class User, след десериализация трябва да се вкарат в this.users като обекти от клас User
                this.users.push(new User(...Object.values(user)));
            });

            console.log(this.users);


        }

        getLoggedUser() {

            let loggedUser = JSON.parse(localStorage.getItem("currentUser"));

            if (loggedUser) {
                let user = this.users.find(u => u.username === loggedUser.username);
                user.orderHistory = [
                    ...loggedUser.orderHistory
                ]
                return user;
            }

            return false;
        }


        getUser(username) {
            return this.users.find(u => u.username === username);
        }


        loginUser(username, password) {

            if (userManager.validUser(username, password)) {
                let user = this.getUser(username);
                localStorage.setItem("currentUser", JSON.stringify(user));

                return true;
            }

            return false;
        }

        //юзъра дали съществува и дали си е въвел паролата правилно
        validUser(username, password) {
            return this.users.some(user => user.username === username && user.password === password);
        }


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
        }


    }


    return new UserManager();

})();