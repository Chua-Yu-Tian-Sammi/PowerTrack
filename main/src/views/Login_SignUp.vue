<script setup>
import { ref } from 'vue';
import '../styles/auth.css'


const isLogin = ref(true);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const loginForm = ref({
  email: '',
  password: ''
});

const signupForm = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const handleLogin = () => {
  console.log('Login:', loginForm.value);
  alert('Login functionality to be implemented!');
};

const handleSignup = () => {
  if (signupForm.value.password !== signupForm.value.confirmPassword) {
    alert('Passwords do not match!');
    return;
  }
  console.log('Signup:', signupForm.value);
  alert('Signup functionality to be implemented!');
};
</script>

<template>
  <div class="auth-wrapper">
    <div class="auth-container">
      <!-- Left Side - Form -->
      <div class="form-section">
        <div class="form-content">
          <h1 class="title">{{ isLogin ? 'Log In' : 'Sign Up' }}</h1>
          <p class="subtitle">
            {{ isLogin ? 'Welcome back! Please enter your details' : 'Create your account to get started' }}
          </p>

          <!-- Login Form -->
          <form v-if="isLogin" @submit.prevent="handleLogin" class="auth-form">
            <div class="form-group">
              <label for="login-email">Email</label>
              <input 
                type="email" 
                id="login-email"
                v-model="loginForm.email"
                placeholder="Enter your email"
                required
              />
            </div>

            <div class="form-group">
              <label for="login-password">Password</label>
              <div class="password-input">
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  id="login-password"
                  v-model="loginForm.password"
                  placeholder="Enter your password"
                  required
                />
                <button 
                  type="button" 
                  class="toggle-password"
                  @click="showPassword = !showPassword"
                >
                  👁
                </button>
              </div>
            </div>

            <a href="#" class="forgot-link">forgot password?</a>

            <button type="submit" class="submit-btn">Log in</button>

            <div class="divider">
              <span>Or continue with</span>
            </div>

            <div class="social-buttons">
              <button type="button" class="social-btn">
                <img src="https://www.google.com/favicon.ico" alt="Google" />
                Google
              </button>
              <button type="button" class="social-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877f2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>

            <p class="switch-text">
              Don't have account? <a href="#" @click.prevent="isLogin = false">Sign up</a>
            </p>
          </form>

          <!-- Signup Form -->
          <form v-else @submit.prevent="handleSignup" class="auth-form">
            <div class="form-group">
              <label for="signup-name">Full Name</label>
              <input 
                type="text" 
                id="signup-name"
                v-model="signupForm.name"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div class="form-group">
              <label for="signup-email">Email</label>
              <input 
                type="email" 
                id="signup-email"
                v-model="signupForm.email"
                placeholder="Enter your email"
                required
              />
            </div>

            <div class="form-group">
              <label for="signup-password">Password</label>
              <div class="password-input">
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  id="signup-password"
                  v-model="signupForm.password"
                  placeholder="Create a password"
                  required
                  minlength="6"
                />
                <button 
                  type="button" 
                  class="toggle-password"
                  @click="showPassword = !showPassword"
                >
                  👁
                </button>
              </div>
            </div>

            <div class="form-group">
              <label for="signup-confirm">Confirm Password</label>
              <div class="password-input">
                <input 
                  :type="showConfirmPassword ? 'text' : 'password'" 
                  id="signup-confirm"
                  v-model="signupForm.confirmPassword"
                  placeholder="Confirm your password"
                  required
                />
                <button 
                  type="button" 
                  class="toggle-password"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  👁
                </button>
              </div>
            </div>

            <button type="submit" class="submit-btn">Sign up</button>

            <div class="divider">
              <span>Or continue with</span>
            </div>

            <div class="social-buttons">
              <button type="button" class="social-btn">
                <img src="https://www.google.com/favicon.ico" alt="Google" />
                Google
              </button>
              <button type="button" class="social-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877f2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>

            <p class="switch-text">
              Already have account? <a href="#" @click.prevent="isLogin = true">Log in</a>
            </p>
          </form>
        </div>
      </div>

      <!-- Right Side - Image -->
      <div class="image-section">
        <div class="image-content">
          <img 
            src="https://i0.wp.com/www.muscleandfitness.com/wp-content/uploads/2019/07/Hands-Clapping-Chaulk-Kettlebell.jpg?quality=86&strip=all" 
            alt="put workout image here"
          />
        </div>
      </div>
    </div>
  </div>
</template>

