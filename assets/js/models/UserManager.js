let userManager = (function () {

    class UserManager {

        constructor() {

            this.users = [];
            this.currentUser = undefined;

            //!ако няма юзъри в localStorage - вземи дефолтните и ги сетни в localStorage
            if (!localStorage.getItem("users")) {
                localStorage.setItem("users", JSON.stringify(defaultUsers));
            }

            //!вземи юзърите от localStorage и всеки от тях го превърни в User и го набутай в this.users
            JSON.parse(localStorage.getItem("users")).forEach(user => {

                this.users.push(new User(...Object.values(user)));

                //this.users.push(user); //или пък да се вкара като class User само currentUser
            });

            // console.log(this.users);

            //!ако има текущо логнат юзър в localStorage - вземи го чрез 
            if (localStorage.getItem("currentUser")) {
               
                let userInLocalStorage = JSON.parse(localStorage.getItem("currentUser"));
                this.currentUser = this.getUser(userInLocalStorage.username);
            }

        }

        getUser(username) {
            return this.users.find(u => u.username === username);
        }


        loginUser(username, password) { //вика се в login controller

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


        registerUser(username, password) { //вика се в register controller
            //ако няма такъв user, регистрирай го
            if (!this.isRegistered(username)) {

                this.users.push(new User(username, password));
                localStorage.setItem('users', JSON.stringify(this.users));

                return true;
            }

            return false;
        }

        //това се вика всеки път, когато на текущо логнатия юзър се прави някаква промяна по пропъртитата му от някой контролер, различен от login и register
        //в текущия контролер му се подава userManager.currentUser
        updateUser(user) {
            localStorage.setItem("currentUser", JSON.stringify(user));
            localStorage.setItem('users', JSON.stringify(this.users));
        }

        logout() {
            //!в момента долното закоментирано е излишно, защото където правим промени, веднага викаме updateUser, така че при изход винаги
            //е сигурно, че всички промени са вече записани
            //презапиши всички юзъри в localStorage, заедно с последно модифицирания, за да може да се запази актуалното му състояние
            // localStorage.setItem('users', JSON.stringify(this.users));

            //след това разкарай юзъра, с който последно е работено
            localStorage.removeItem("currentUser");
            this.currentUser = undefined;
        }


    }


    return new UserManager();

})();