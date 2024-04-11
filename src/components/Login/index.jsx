function BigLogin() {
  return (
    <div class="form-block bg-lightest-gray">
      <h3 class="mb-48">Login</h3>
      <div class="row mb-24">
        <div class="col-sm-6">
          <h6>
            <a
              href="http://localhost:7236/member-login"
              class="link-btn mb-24 mb-sm-0"
            >
              <img src="static/picture/google-icon.png" alt="" /> Sign up with
              Google
            </a>
          </h6>
        </div>
        <div class="col-sm-6">
          <h6>
            <a href="http://localhost:7236/member-login" class="link-btn">
              <img src="static/picture/fb-icon.png" alt="" /> Sign up with
              Facebook
            </a>
          </h6>
        </div>
      </div>
      <h5 class="or mb-24">or</h5>
      <form action="signup.html">
        <div class="mb-24">
          <input
            type="email"
            class="form-control"
            id="login-email"
            name="login-email"
            required=""
            placeholder="Email"
          />
        </div>
        <div class="mb-24">
          <input
            type="password"
            class="form-control"
            id="login-password"
            name="login-password"
            required=""
            placeholder="Password"
          />
        </div>
        <button type="submit" class="b-unstyle cus-btn w-100 mb-24">
          <span class="icon">
            <img src="static/picture/click-button.png" alt="" />
          </span>
          Create Account
        </button>
      </form>
      <div class="register-bottom">
        <h6>
          If you don’t have account?{" "}
          <a href="signup.html" class="color-primary">
            Register
          </a>
        </h6>
        <h6 class="text-end">
          <a href="signup.html" class="color-primary">
            Forgot Password?
          </a>
        </h6>
      </div>
    </div>
  );
}

export default BigLogin;
