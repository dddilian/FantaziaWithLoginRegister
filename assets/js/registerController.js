(function () {

    let registerForm = document.getElementById('registerForm');

    let regUsername = document.getElementById('regUsername');
    let regPassword = document.getElementById('regPassword');
    let regRePassword = document.getElementById('regRePassword');

    let userExistsError = document.getElementById('userExistsError');
    let passMismatchError = document.getElementById('passMismatchError');

    let registerBtn = document.getElementById('registerBtn');


    registerForm.addEventListener('submit', function (e) {

        console.log(this.elements);

        e.preventDefault();

        const {
            regUsername: {
                value: username
            },
            regPassword: {
                value: password
            }
        } = this.elements;

     
        if (userManager.registerUser(username, password)) {
            location.hash = "#login";
        } else {
            userExistsError.style.display = 'block';
        };

        this.reset();

    });


    registerForm.addEventListener('input', validateForm);

    function validateForm() {

        const regUsernameValue = regUsername.value;
        const passwordValue = regPassword.value;
        const regRepasswordValue = regRePassword.value;

        if (regUsernameValue && passwordValue && regRepasswordValue) {
            registerBtn.removeAttribute('disabled');
        } else {
            registerBtn.setAttribute('disabled', true);
        }

        if (passwordValue && regRepasswordValue && passwordValue !== regRepasswordValue) {
            passMismatchError.style.display = 'block';
            registerBtn.setAttribute('disabled', true);
        } else {
            passMismatchError.style.display = 'none';
        }

    }


})()