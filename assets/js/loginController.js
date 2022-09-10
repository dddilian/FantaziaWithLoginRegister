(function () {

    let loginForm = document.getElementById('loginForm');
    let wrongCredentialsError = document.getElementById('loginError');

    let loginUsername = document.getElementById('loginUsername');
    let loginPassword = document.getElementById('loginPassword');

    let loginBtn = document.getElementById("loginBtn");


    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // console.log(this.elements);
        const {
            loginUsername: {
                value: username
            },
            loginPassword: {
                value: password
            }
        } = this.elements;

        if (userManager.loginUser(username, password)) {

            logoutBtn.style.display = "inline";
            menuLink.style.display = "inline";
            cartIconDiv.style.display = "block";

            registerLink.style.display = "none";
            loginLink.style.display = "none";

            location.hash = '#menu';

        } else {
            wrongCredentialsError.style.display = 'block';
        };

        this.reset();

    });


    loginForm.addEventListener('input', validateForm);

    function validateForm() {

        const loginUsernameValue = loginUsername.value;
        const loginPasswordValue = loginPassword.value;

        if (loginUsernameValue && loginPasswordValue) {
            loginBtn.removeAttribute('disabled');
        } else {
            loginBtn.setAttribute('disabled', true);
        }

    }

})()