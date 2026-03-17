document.addEventListener("DOMContentLoaded", event => {
    const app = firebase.app();
    console.log(app);
});

let confirmationResult;

function sendOTP() {
    const phoneNumber = document.getElementById('phone').value;
    const auth = firebase.auth();

    auth.signInWithPhoneNumber(phoneNumber, new firebase.auth.RecaptchaVerifier('recaptcha-container'))
        .then((result) => {
            confirmationResult = result;
            document.getElementById('phone-form').classList.add('hidden');
            document.getElementById('otp-form').classList.remove('hidden');
            document.getElementById('message').innerText = 'OTP sent to your phone.';
        })
        .catch((error) => {
            document.getElementById('message').innerText = 'Error sending OTP: ' + error.message;
        });
}

function verifyOTP() {
    const code = document.getElementById('otp').value;
    confirmationResult.confirm(code)
        .then((result) => {
            const user = result.user;
            document.getElementById('otp-form').classList.add('hidden');
            document.getElementById('password-form').classList.remove('hidden');
            document.getElementById('message').innerText = 'OTP verified. Create your password.';
        })
        .catch((error) => {
            document.getElementById('message').innerText = 'Invalid OTP: ' + error.message;
        });
}

function createAccount() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const auth = firebase.auth();

    // Since user is already signed in with phone, we can update the email and password
    const user = auth.currentUser;
    if (user) {
        user.updateEmail(email)
            .then(() => {
                return user.updatePassword(password);
            })
            .then(() => {
                document.getElementById('message').innerText = 'Account created successfully!';
                // Optionally, sign out and sign in with email/password
            })
            .catch((error) => {
                document.getElementById('message').innerText = 'Error creating account: ' + error.message;
            });
    }
}
