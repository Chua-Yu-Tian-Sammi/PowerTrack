<template>
  <div class="home">
    <section class="hero-section" :style="{
     backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(${heroBg})`,
     backgroundSize: 'cover',
     backgroundPosition: 'center center',
     backgroundRepeat: 'no-repeat'}">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6 mb-4 mb-lg-0">
            <div class="hero-badge mb-3">
              <i class="bi bi-lightning-charge-fill me-2"></i>
              <span>Smart Fitness Platform</span>
            </div>
            <h1 class="hero-title mb-4">Track Your Fitness Journey with PowerTrack</h1>
            <p class="hero-description mb-4">
              PowerTrack is your intelligent fitness companion that helps you create personalized workout routines, 
              track your progress, and achieve your fitness goals faster. Whether you're a beginner or an advanced 
              athlete, we've got you covered.
            </p>
            <div class="hero-actions">
              <router-link to="/workout" class="btn btn-primary btn-lg">
                <i class="bi bi-lightning-charge me-2"></i>Get Started
              </router-link>
              <router-link to="/profile" class="btn btn-outline-dark btn-lg">
                <i class="bi bi-person me-2"></i>Create Profile
              </router-link>
            </div>
            <div class="hero-stats mt-5">
              <div class="stat-item">
                <div class="stat-number">50+</div>
                <div class="stat-label">Exercises</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">Progress</div>
                <div class="stat-label">Analytics</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">100%</div>
                <div class="stat-label">Customizable</div>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="hero-visual">
              <div class="visual-card">
                <div class="visual-header">
                  <i class="bi bi-calendar-check"></i>
                  <span>Your Workout Plan</span>
                </div>
                <div class="visual-content">
                  <div class="workout-item">
                    <div class="workout-icon"><i class="bi bi-circle-fill"></i></div>
                    <div class="workout-details">
                      <div class="workout-name">Full Body Strength</div>
                      <div class="workout-meta">45 min | 8 exercises</div>
                    </div>
                  </div>
                  <div class="workout-item">
                    <div class="workout-icon"><i class="bi bi-circle-fill"></i></div>
                    <div class="workout-details">
                      <div class="workout-name">Cardio & Endurance</div>
                      <div class="workout-meta">30 min | 6 exercises</div>
                    </div>
                  </div>
                  <div class="workout-item">
                    <!-- <div class="workout-icon"><i class="bi bi-circle"></i></div> -->
                    <div class="workout-icon"><i class="bi bi-circle-fill"></i></div>
                    <div class="workout-details">
                      <div class="workout-name">Core & Flexibility</div>
                      <div class="workout-meta">20 min | 5 exercises</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="features-section">
      <div class="container">
        <div class="section-header text-center mb-5">
          <h2 class="section-title">Everything You Need to Succeed</h2>
          <p class="section-description">Powerful features designed to help you reach your fitness goals</p>
        </div>
        
        <div class="row g-4">
          <div class="col-md-6 col-lg-3">
            <div class="feature-card">
              <div class="feature-icon">
                <i class="bi bi-lightning-charge"></i>
              </div>
              <h5 class="feature-title">Smart Generation</h5>
              <p class="feature-description">Personalized workout routines tailored to your goals, experience level, and available time.</p>
            </div>
          </div>
          
          <div class="col-md-6 col-lg-3">
            <div class="feature-card">
              <div class="feature-icon">
                <i class="bi bi-graph-up"></i>
              </div>
              <h5 class="feature-title">Progress Tracking</h5>
              <p class="feature-description">Monitor your performance with detailed analytics and visual progress charts.</p>
            </div>
          </div>
          
          <div class="col-md-6 col-lg-3">
            <div class="feature-card">
              <div class="feature-icon">
                <i class="bi bi-book"></i>
              </div>
              <h5 class="feature-title">Exercise Library</h5>
              <p class="feature-description">Access a comprehensive database of exercises with detailed instructions.</p>
            </div>
          </div>
          
          <div class="col-md-6 col-lg-3">
            <div class="feature-card">
              <div class="feature-icon">
                <i class="bi bi-sliders"></i>
              </div>
              <h5 class="feature-title">Custom Routines</h5>
              <p class="feature-description">Build and save your own workout routines with full control over every detail.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="how-it-works-section">
      <div class="container">
        <div class="section-header text-center mb-5">
          <h2 class="section-title">How It Works</h2>
          <p class="section-description">Get started with PowerTrack in three simple steps</p>
        </div>
        
        <div class="row g-4">
          <div class="col-lg-4">
            <div class="step-card">
              <div class="step-number">1</div>
              <div class="step-content">
                <h5 class="step-title">Create Your Profile</h5>
                <p class="step-description">Tell us about your fitness level, goals, and preferences to get personalized recommendations.</p>
                <router-link to="/profile" class="step-link">
                  Set up profile <i class="bi bi-arrow-right ms-1"></i>
                </router-link>
              </div>
            </div>
          </div>
          
          <div class="col-lg-4">
            <div class="step-card">
              <div class="step-number">2</div>
              <div class="step-content">
                <h5 class="step-title">Generate Workouts</h5>
                <p class="step-description">Generate custom workout routines or build your own from our exercise library.</p>
                <router-link to="/workout" class="step-link">
                  Generate workout <i class="bi bi-arrow-right ms-1"></i>
                </router-link>
              </div>
            </div>
          </div>
          
          <div class="col-lg-4">
            <div class="step-card">
              <div class="step-number">3</div>
              <div class="step-content">
                <h5 class="step-title">Track Progress</h5>
                <p class="step-description">Log your workouts, monitor your performance, and watch your progress grow over time.</p>
                <router-link to="/progress" class="step-link">
                  View progress <i class="bi bi-arrow-right ms-1"></i>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="reviews-section">
      <div class="container">
        <div class="section-header text-center mb-5">
          <h2 class="section-title">Real People, Real Results</h2>
          <p class="section-description">Join thousands who have achieved their goals with PowerTrack</p>
        </div>

        <div id="reviewsCarousel" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-inner">
            <div class="carousel-item active">
              <div class="review-card mx-auto">
                <div class="review-stars mb-2">
                  <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star"></i>
                </div>
                <p class="review-text">PowerTrack's custom routines kept me motivated every single week.</p>
                <p class="review-author">— Emily R.</p>
              </div>
            </div>

            <div class="carousel-item">
              <div class="review-card mx-auto">
                <div class="review-stars mb-2">
                  <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>
                </div>
                <p class="review-text">The progress tracker is a game-changer. Seeing my gains on a chart keeps me focused.</p>
                <p class="review-author">— James L.</p>
              </div>
            </div>

            <div class="carousel-item">
              <div class="review-card mx-auto">
                <div class="review-stars mb-2">
                  <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star"></i>
                </div>
                <p class="review-text">I love the exercise library. Detailed instructions mean no guesswork in my workouts.</p>
                <p class="review-author">— Sophia T.</p>
              </div>
            </div>

            <div class="carousel-item">
              <div class="review-card mx-auto">
                <div class="review-stars mb-2">
                  <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>
                </div>
                <p class="review-text">Creating my own routine was so intuitive. I hit new PRs within a month!</p>
                <p class="review-author">— Michael S.</p>
              </div>
            </div>

            <div class="carousel-item">
              <div class="review-card mx-auto">
                <div class="review-stars mb-2">
                  <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>
                </div>
                <p class="review-text">Joined PowerTrack six months ago and I've never felt stronger or more confident.</p>
                <p class="review-author">— Olivia M.</p>
              </div>
            </div>
          </div>

          <button class="carousel-control-prev" type="button" data-bs-target="#reviewsCarousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true" style="filter: invert(1); width: 40px; height: 40px;"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#reviewsCarousel" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true" style="filter: invert(1); width: 40px; height: 40px;"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container">
        <div class="cta-card">
          <div class="row align-items-center">
            <div class="col-lg-8 mb-4 mb-lg-0">
              <h3 class="cta-title">Ready to Transform Your Fitness?</h3>
              <p class="cta-description">Join PowerTrack today and start your journey to a healthier, stronger you.</p>
            </div>
            <div class="col-lg-4 text-lg-end">
              <router-link to="/workout" class="btn btn-primary btn-lg">
                <i class="bi bi-lightning-charge me-2"></i>Start Now
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import heroBg from '@/images/core-strength-fitness.jpg';

export default {
  name: 'HomePage',
 data() {
  return { heroBg };
 }
};
</script>

<style scoped>
.hero-section .hero-title{
  color:cornflowerblue;
}
.hero-section .stat-number,
.hero-section .btn,
.hero-section .btn i,
.hero-visual .workout-meta{
  color: #fff;
}
.hero-visual .workout-name{
  color:blanchedalmond;
}
.hero-section {
  /* full screen background image */
  color: #fff;
  position: relative;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
}
.hero-section .hero-description{
  color: #fff;
  font-weight: 500;
}
.hero-section .stat-label  {
  color: rgba(255, 255, 255, 0.8);
}
.hero-visual .visual-card {
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  padding: 1.5rem;
  color: #fff;
}
.hero-visual .visual-header,
.hero-visual .visual-header i,
.hero-visual .visual-header span {
  color:#fff;
  font-weight: 600;
  font-size: 1.25rem;      
  margin-bottom: 1rem;
}
.hero-visual .workout-item {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
}
.hero-visual .workout-icon i {
  color: #fff;
  font-size: 0.75rem;
  margin-right: 0.75rem;
}

.reviews-section {
  padding: 60px 0;
}
.review-card {
  background-color: rgba(230, 247, 255, 0.8);
  padding: 25px;
  max-width: 500px;
  border-radius: 8px;
  text-align: center;
}
.review-stars i {
  color: #ffc107;
  margin-right: 2px;
}
.review-text {
  font-size: 1rem;
  margin-bottom: 10px;
}
.review-author {
  font-weight: 600;
  color: #333;
}

.carousel-control-prev,.carousel-control-next{
    margin-left: 0;
    margin-right: 0;
  }

@media (min-width:769px) and (max-width:992px) {
  .carousel-control-prev,.carousel-control-next{
    margin-left: -50px;
    margin-right: -50px;
  }
}

/*for small screen , adjust the button for next and prev for carousel */
@media (min-width:577px) and (max-width:768px){
  .carousel-control-prev,.carousel-control-next{
    margin-left: -50px;
    margin-right: -50px;
  }
}

/*for extra small screen */
@media(max-width:576px){
  .carousel-control-prev,.carousel-control-next{
    margin-left: -50px;
    margin-right: -50px;
  }
}
</style>