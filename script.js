import { Chart } from "@/components/ui/chart"
import { gsap } from "gsap"
import { bootstrap } from "bootstrap"
import { AOS } from "aos"

// Initialize AOS (Animate On Scroll)
AOS.init({
  duration: 1000,
  once: true,
  offset: 100,
})

// Theme Management
let currentTheme = "purple"

function setTheme(theme) {
  currentTheme = theme
  document.body.setAttribute("data-theme", theme)

  // Update active theme button
  document.querySelectorAll(".theme-btn").forEach((btn) => {
    btn.classList.remove("active")
  })
  document.querySelector(`[data-theme="${theme}"]`).classList.add("active")

  // Save theme preference
  localStorage.setItem("preferred-theme", theme)

  // Update charts with new theme colors
  updateChartColors()
}

// Load saved theme
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("preferred-theme") || "purple"
  setTheme(savedTheme)

  initializeApp()
})

function initializeApp() {
  initializeAnimations()
  initializeFundingTracker()
  initializeCharts()
  initializeCounters()
  initializeParallax()
  initializeNavigation()
  initializeModals()
  enhanceInteractions()
}

// Parallax Effects
function initializeParallax() {
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const parallaxBg = document.querySelector(".parallax-bg")
    const heroSection = document.querySelector(".hero-section")

    if (parallaxBg && scrolled < window.innerHeight) {
      parallaxBg.style.transform = `translateY(${scrolled * 0.5}px)`
    }

    if (heroSection && scrolled < window.innerHeight) {
      heroSection.style.transform = `translateY(${scrolled * 0.3}px)`
    }
  })
}

// Navigation Enhancement
function initializeNavigation() {
  const navbar = document.querySelector(".navbar")

  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      navbar.style.background = "rgba(15, 23, 42, 0.95)"
      navbar.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.3)"
    } else {
      navbar.style.background = "rgba(15, 23, 42, 0.8)"
      navbar.style.boxShadow = "none"
    }
  })

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
}

// Funding Tracker Animation
function initializeFundingTracker() {
  const progressBar = document.getElementById("funding-progress")
  const fundingAmount = document.getElementById("funding-amount")

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          progressBar.style.width = "75%"
          animateCounter(6.3, fundingAmount, "$", "M raised")
        }, 500)
        observer.unobserve(entry.target)
      }
    })
  })

  observer.observe(document.querySelector(".funding-section"))
}

// Counter Animation
function animateCounter(target, element, prefix = "", suffix = "") {
  if (!element) return

  let current = 0
  const increment = target / 100
  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      current = target
      clearInterval(timer)
    }

    if (suffix.includes("x")) {
      element.textContent = `${current.toFixed(1)}${suffix}`
    } else if (suffix.includes("days")) {
      element.textContent = `${Math.floor(current)} ${suffix}`
    } else {
      element.textContent = `${prefix}${current.toFixed(1)}${suffix}`
    }
  }, 20)
}

// Initialize all counters
function initializeCounters() {
  const counterElements = document.querySelectorAll("[data-counter]")

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target
        const target = Number.parseFloat(element.getAttribute("data-counter"))

        if (element.textContent.includes("$") && element.textContent.includes("M")) {
          animateCounter(target, element, "$", "M")
        } else if (element.textContent.includes("x")) {
          animateCounter(target, element, "", "x")
        } else if (element.textContent.includes("days")) {
          animateCounter(target, element, "", " days")
        } else if (element.textContent.includes("%")) {
          animateCounter(target, element, "", "%")
        } else if (element.textContent.includes("K")) {
          animateCounter(target, element, "$", "K")
        } else {
          animateCounter(target, element)
        }

        observer.unobserve(element)
      }
    })
  })

  counterElements.forEach((el) => observer.observe(el))
}

// Chart Initialization
let revenueChart, userChart, financialChart

function initializeCharts() {
  // Revenue Chart
  const revenueCtx = document.getElementById("revenueChart")
  if (revenueCtx) {
    revenueChart = new Chart(revenueCtx, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Revenue ($K)",
            data: [12, 19, 25, 32, 45, 58],
            borderColor: getThemeColor("primary"),
            backgroundColor: getThemeColor("primary") + "20",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: "#e2e8f0",
            },
          },
        },
        scales: {
          y: {
            ticks: {
              color: "#94a3b8",
            },
            grid: {
              color: "rgba(148, 163, 184, 0.2)",
            },
          },
          x: {
            ticks: {
              color: "#94a3b8",
            },
            grid: {
              color: "rgba(148, 163, 184, 0.2)",
            },
          },
        },
      },
    })
  }

  // User Acquisition Chart
  const userCtx = document.getElementById("userChart")
  if (userCtx) {
    userChart = new Chart(userCtx, {
      type: "bar",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "New Users",
            data: [150, 230, 180, 320, 450, 380],
            backgroundColor: getThemeColor("secondary") + "80",
            borderColor: getThemeColor("secondary"),
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: "#e2e8f0",
            },
          },
        },
        scales: {
          y: {
            ticks: {
              color: "#94a3b8",
            },
            grid: {
              color: "rgba(148, 163, 184, 0.2)",
            },
          },
          x: {
            ticks: {
              color: "#94a3b8",
            },
            grid: {
              color: "rgba(148, 163, 184, 0.2)",
            },
          },
        },
      },
    })
  }

  // Financial Chart for Investor Portal
  const financialCtx = document.getElementById("financialChart")
  if (financialCtx) {
    financialChart = new Chart(financialCtx, {
      type: "line",
      data: {
        labels: ["Q1 2023", "Q2 2023", "Q3 2023", "Q4 2023", "Q1 2024", "Q2 2024"],
        datasets: [
          {
            label: "Revenue",
            data: [45, 52, 68, 84, 95, 120],
            borderColor: getThemeColor("success"),
            backgroundColor: getThemeColor("success") + "20",
            tension: 0.4,
            fill: true,
          },
          {
            label: "Expenses",
            data: [35, 38, 42, 48, 52, 58],
            borderColor: getThemeColor("warning"),
            backgroundColor: getThemeColor("warning") + "20",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: "#e2e8f0",
            },
          },
        },
        scales: {
          y: {
            ticks: {
              color: "#94a3b8",
              callback: (value) => "$" + value + "K",
            },
            grid: {
              color: "rgba(148, 163, 184, 0.2)",
            },
          },
          x: {
            ticks: {
              color: "#94a3b8",
            },
            grid: {
              color: "rgba(148, 163, 184, 0.2)",
            },
          },
        },
      },
    })
  }
}

// Get theme colors
function getThemeColor(type) {
  const themes = {
    purple: {
      primary: "#8b5cf6",
      secondary: "#ec4899",
      accent: "#06b6d4",
      success: "#10b981",
      warning: "#f59e0b",
    },
    blue: {
      primary: "#3b82f6",
      secondary: "#06b6d4",
      accent: "#8b5cf6",
      success: "#10b981",
      warning: "#f59e0b",
    },
    green: {
      primary: "#10b981",
      secondary: "#059669",
      accent: "#34d399",
      success: "#10b981",
      warning: "#f59e0b",
    },
    orange: {
      primary: "#f59e0b",
      secondary: "#d97706",
      accent: "#fbbf24",
      success: "#10b981",
      warning: "#f59e0b",
    },
    pink: {
      primary: "#ec4899",
      secondary: "#db2777",
      accent: "#f472b6",
      success: "#10b981",
      warning: "#f59e0b",
    },
  }

  return themes[currentTheme][type]
}

// Update chart colors when theme changes
function updateChartColors() {
  if (revenueChart) {
    revenueChart.data.datasets[0].borderColor = getThemeColor("primary")
    revenueChart.data.datasets[0].backgroundColor = getThemeColor("primary") + "20"
    revenueChart.update()
  }

  if (userChart) {
    userChart.data.datasets[0].backgroundColor = getThemeColor("secondary") + "80"
    userChart.data.datasets[0].borderColor = getThemeColor("secondary")
    userChart.update()
  }

  if (financialChart) {
    financialChart.data.datasets[0].borderColor = getThemeColor("success")
    financialChart.data.datasets[0].backgroundColor = getThemeColor("success") + "20"
    financialChart.data.datasets[1].borderColor = getThemeColor("warning")
    financialChart.data.datasets[1].backgroundColor = getThemeColor("warning") + "20"
    financialChart.update()
  }
}

// Team Member Data
const teamMembers = {
  alex: {
    name: "Alex Chen",
    role: "CEO & Co-Founder",
    bio: "Alex brings over 15 years of experience in SaaS and enterprise software. Previously VP of Product at Salesforce, where he led a team of 200+ engineers and product managers. Stanford MBA with a focus on technology entrepreneurship. Passionate about building products that solve real problems for distributed teams.",
    linkedin: "https://linkedin.com/in/alexchen",
    twitter: "https://twitter.com/alexchen",
    email: "alex@flowsync.com",
    achievements: [
      "Led Salesforce product team through $2B revenue milestone",
      "Featured in Forbes 30 Under 30",
      "Speaker at TechCrunch Disrupt 2023",
    ],
  },
  sarah: {
    name: "Sarah Kim",
    role: "CTO & Co-Founder",
    bio: "Sarah is a former Google AI researcher with a PhD in Machine Learning from MIT. She has 10+ years of experience building scalable systems that serve millions of users. Expert in distributed systems, AI/ML, and cloud architecture. Published 15+ papers in top-tier conferences.",
    linkedin: "https://linkedin.com/in/sarahkim",
    github: "https://github.com/sarahkim",
    email: "sarah@flowsync.com",
    achievements: [
      "Led Google AI team that developed breakthrough NLP models",
      "PhD in Machine Learning from MIT",
      "15+ publications in top AI conferences",
    ],
  },
  marcus: {
    name: "Marcus Johnson",
    role: "VP of Growth",
    bio: "Marcus was the growth lead at Stripe, where he helped scale revenue from $1M to $100M ARR. Harvard Business School graduate with expertise in growth hacking, product-led growth, and international expansion. Built and led growth teams at 3 successful startups.",
    linkedin: "https://linkedin.com/in/marcusjohnson",
    twitter: "https://twitter.com/marcusjohnson",
    email: "marcus@flowsync.com",
    achievements: [
      "Scaled Stripe revenue from $1M to $100M ARR",
      "Harvard Business School MBA",
      "Built growth teams at 3 successful startups",
    ],
  },
}

// Show team member details
function showTeamMember(memberId) {
  const member = teamMembers[memberId]
  if (!member) return

  const modalTitle = document.getElementById("teamModalTitle")
  const modalBody = document.getElementById("teamModalBody")

  modalTitle.textContent = member.name

  modalBody.innerHTML = `
    <div class="row">
      <div class="col-md-4 text-center mb-4">
        <img src="/placeholder.svg?height=200&width=200" alt="${member.name}" 
             class="img-fluid rounded-circle mb-3" style="width: 200px; height: 200px; object-fit: cover;">
        <h5 class="text-white">${member.name}</h5>
        <p class="text-primary">${member.role}</p>
        <div class="d-flex justify-content-center gap-3">
          ${member.linkedin ? `<a href="${member.linkedin}" class="text-primary"><i class="fab fa-linkedin fa-lg"></i></a>` : ""}
          ${member.twitter ? `<a href="${member.twitter}" class="text-primary"><i class="fab fa-twitter fa-lg"></i></a>` : ""}
          ${member.github ? `<a href="${member.github}" class="text-primary"><i class="fab fa-github fa-lg"></i></a>` : ""}
          ${member.email ? `<a href="mailto:${member.email}" class="text-primary"><i class="fas fa-envelope fa-lg"></i></a>` : ""}
        </div>
      </div>
      <div class="col-md-8">
        <h6 class="text-white mb-3">Biography</h6>
        <p class="text-light mb-4">${member.bio}</p>
        <h6 class="text-white mb-3">Key Achievements</h6>
        <ul class="text-light">
          ${member.achievements.map((achievement) => `<li>${achievement}</li>`).join("")}
        </ul>
      </div>
    </div>
  `
}

// Modal Management
function initializeModals() {
  // Login form handling
  const loginForm = document.getElementById("loginForm")
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const email = document.getElementById("email").value
      const password = document.getElementById("password").value

      // Simple demo authentication
      if (email === "investor@demo.com" && password === "demo123") {
        // Close login modal
        const loginModal = bootstrap.Modal.getInstance(document.getElementById("loginModal"))
        loginModal.hide()

        // Show investor portal
        setTimeout(() => {
          const investorPortal = new bootstrap.Modal(document.getElementById("investorPortal"))
          investorPortal.show()
        }, 500)
      } else {
        alert("Demo credentials: investor@demo.com / demo123")
      }
    })
  }
}

// Enhanced Interactions with GSAP
function enhanceInteractions() {
  // Button hover effects
  document.querySelectorAll(".btn").forEach((button) => {
    button.addEventListener("mouseenter", function () {
      gsap.to(this, { duration: 0.3, scale: 1.05, ease: "power2.out" })
    })

    button.addEventListener("mouseleave", function () {
      gsap.to(this, { duration: 0.3, scale: 1, ease: "power2.out" })
    })

    button.addEventListener("click", function () {
      gsap.to(this, { duration: 0.1, scale: 0.95, ease: "power2.out", yoyo: true, repeat: 1 })
    })
  })

  // Card hover effects
  document.querySelectorAll(".hover-lift").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      gsap.to(this, { duration: 0.3, y: -10, rotationY: 2, ease: "power2.out" })
    })

    card.addEventListener("mouseleave", function () {
      gsap.to(this, { duration: 0.3, y: 0, rotationY: 0, ease: "power2.out" })
    })
  })

  // Metric cards pulse effect
  document.querySelectorAll(".metric-card-large").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      gsap.to(this.querySelector(".metric-number"), {
        duration: 0.5,
        scale: 1.1,
        color: getThemeColor("primary"),
        ease: "elastic.out(1, 0.3)",
      })
    })

    card.addEventListener("mouseleave", function () {
      gsap.to(this.querySelector(".metric-number"), {
        duration: 0.3,
        scale: 1,
        color: "#ffffff",
        ease: "power2.out",
      })
    })
  })
}

// Initialize entrance animations
function initializeAnimations() {
  // Stagger animation for metric cards
  gsap.from(".metric-card", {
    duration: 0.8,
    y: 50,
    opacity: 0,
    stagger: 0.2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".funding-section",
      start: "top 80%",
    },
  })

  // Team cards flip animation
  gsap.from(".team-card", {
    duration: 1,
    rotationY: 90,
    opacity: 0,
    stagger: 0.3,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".team-section",
      start: "top 80%",
    },
  })

  // Investor cards scale animation
  gsap.from(".investor-card", {
    duration: 0.6,
    scale: 0.8,
    opacity: 0,
    stagger: 0.1,
    ease: "back.out(1.7)",
    scrollTrigger: {
      trigger: ".investors-section",
      start: "top 80%",
    },
  })
}

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  // Press 'T' to cycle through themes
  if (e.key === "t" || e.key === "T") {
    const themes = ["purple", "blue", "green", "orange", "pink"]
    const currentIndex = themes.indexOf(currentTheme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  // Press 'D' to open demo modal
  if (e.key === "d" || e.key === "D") {
    const demoModal = new bootstrap.Modal(document.getElementById("demoModal"))
    demoModal.show()
  }
})

// Loading states for buttons
document.querySelectorAll(".btn").forEach((button) => {
  if (!button.hasAttribute("data-bs-toggle") && !button.hasAttribute("data-bs-target")) {
    button.addEventListener("click", function () {
      const originalText = this.innerHTML
      this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Loading...'
      this.disabled = true

      setTimeout(() => {
        this.innerHTML = originalText
        this.disabled = false
      }, 2000)
    })
  }
})

// Performance optimization
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(() => {
  // Handle scroll-based animations here
}, 16)

window.addEventListener("scroll", optimizedScrollHandler)

// Intersection Observer for better performance
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const fadeInObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in")
      fadeInObserver.unobserve(entry.target)
    }
  })
}, observerOptions)

// Observe elements for fade-in animation
document.querySelectorAll("[data-aos]").forEach((el) => {
  fadeInObserver.observe(el)
})

console.log("🚀 FlowSync Startup Showcase initialized successfully!")
console.log('💡 Press "T" to cycle through themes')
console.log('🎬 Press "D" to open demo modal')
console.log("🔐 Demo login: investor@demo.com / demo123")
