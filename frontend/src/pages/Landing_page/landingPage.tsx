import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

import {
  ArrowRight,
  TrendingUp,
  Shield,
  Users,
  DollarSign,
  BarChart3,
  Eye,
  Handshake,
  Target,
  PieChart,
  CheckCircle,
  Star,
} from "lucide-react"
import { Link } from "react-router-dom"

// Custom Button Component
const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  className?: string
  [key: string]: any
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"

  const variants = {
    primary: "bg-black text-white hover:bg-gray-800 focus:ring-gray-500",
    secondary: "bg-white text-black border border-gray-300 hover:bg-gray-50 focus:ring-gray-500",
    outline: "border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
    ghost: "text-gray-600 hover:text-black hover:bg-gray-100 focus:ring-gray-500",
  }

  const sizes = {
    sm: "px-3 py-2 text-sm rounded-md",
    md: "px-4 py-2 text-sm rounded-md",
    lg: "px-6 py-3 text-base rounded-lg",
  }

  return (
    <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}

// Custom Card Component
const Card = ({
  children,
  className = "",
  ...props
}: { children: React.ReactNode; className?: string; [key: string]: any }) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`} {...props}>
      {children}
    </div>
  )
}

// Custom Badge Component
const Badge = ({
  children,
  className = "",
  ...props
}: { children: React.ReactNode; className?: string; [key: string]: any }) => {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${className}`} {...props}>
      {children}
    </span>
  )
}

// Animated Section Component
const AnimatedSection = ({
  children,
  className = "",
  delay = 0,
  ...props
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  [key: string]: any
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default function MicroVestLanding() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-black">MicroVest</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
              How It Works
            </a>
            <a href="#benefits" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
              Benefits
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to='/signup'>
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 lg:px-6 py-20 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <AnimatedSection delay={200}>
            <Badge className="mb-8 bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300 text-base px-6 py-3">
              🚀 Revolutionizing Crowdfunding
            </Badge>
          </AnimatedSection>
          
          <AnimatedSection delay={400}>
            <h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-8 text-black leading-tight">
              Transparent Investing
              <br />
              Made Simple
            </h1>
          </AnimatedSection>
          
          <AnimatedSection delay={600}>
            <p className="text-2xl lg:text-3xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Connect entrepreneurs with investors through our transparent crowdfunding platform. Start with minimal
              investments, track every transaction, and share dividends fairly.
            </p>
          </AnimatedSection>
          
          <AnimatedSection delay={800}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button size="lg" className="text-xl px-10 py-4">
                Start Investing
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-xl px-10 py-4 border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Raise Funds
                <Target className="ml-3 w-6 h-6" />
              </Button>
            </div>
          </AnimatedSection>

          {/* Stats */}
          <AnimatedSection delay={1000}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-black mb-3">$2.5M+</div>
                <div className="text-lg text-gray-600">Funds Raised</div>
              </div>
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-black mb-3">1,200+</div>
                <div className="text-lg text-gray-600">Active Investors</div>
              </div>
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-black mb-3">350+</div>
                <div className="text-lg text-gray-600">Funded Projects</div>
              </div>
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-black mb-3">98%</div>
                <div className="text-lg text-gray-600">Transparency Rate</div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 lg:px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection delay={200}>
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-black">Why Choose MicroVest?</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Built for transparency, designed for growth, and optimized for fair returns.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatedSection delay={300}>
              <Card className="border-2 border-gray-200 hover:border-gray-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 p-6">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">Complete Transparency</h3>
                <p className="text-gray-600 text-sm">
                  Every transaction, business update, and financial record is logged and accessible to investors in
                  real-time.
                </p>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={400}>
              <Card className="border-2 border-gray-200 hover:border-gray-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 p-6">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">Minimal Investment</h3>
                <p className="text-gray-600 text-sm">
                  Start investing with as little as $10. No barriers, no minimum thresholds - everyone can participate.
                </p>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={500}>
              <Card className="border-2 border-gray-200 hover:border-gray-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 p-6">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <PieChart className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">Fair Dividend Sharing</h3>
                <p className="text-gray-600 text-sm">
                  Dividends are distributed proportionally based on your investment amount. Fair, transparent, and
                  automated.
                </p>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={600}>
              <Card className="border-2 border-gray-200 hover:border-gray-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 p-6">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">Secure Platform</h3>
                <p className="text-gray-600 text-sm">
                  Bank-level security with encrypted transactions and verified business profiles for your peace of mind.
                </p>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={700}>
              <Card className="border-2 border-gray-200 hover:border-gray-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 p-6">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">Real-time Analytics</h3>
                <p className="text-gray-600 text-sm">
                  Track your investments with detailed analytics, performance metrics, and growth projections.
                </p>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={800}>
              <Card className="border-2 border-gray-200 hover:border-gray-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 p-6">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">Community Driven</h3>
                <p className="text-gray-600 text-sm">
                  Join a community of like-minded investors and entrepreneurs building the future together.
                </p>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="px-4 lg:px-6 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection delay={200}>
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-black">How MicroVest Works</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Simple steps for both entrepreneurs and investors to get started.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* For Entrepreneurs */}
            <AnimatedSection delay={300}>
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <h3 className="text-2xl font-bold mb-8 text-center text-black">For Entrepreneurs</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-black">Create Your Business Profile</h4>
                      <p className="text-gray-600">
                        Set up your business profile with detailed information, goals, and funding requirements.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-black">Launch Your Campaign</h4>
                      <p className="text-gray-600">
                        Present your business case and start attracting investors with transparent documentation.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-black">Maintain Transparency</h4>
                      <p className="text-gray-600">
                        Keep investors updated with regular reports, financial logs, and business milestones.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-black">Share Success</h4>
                      <p className="text-gray-600">
                        Distribute dividends fairly based on investment amounts as your business grows.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* For Investors */}
            <AnimatedSection delay={400}>
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <h3 className="text-2xl font-bold mb-8 text-center text-black">For Investors</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-black">Browse Opportunities</h4>
                      <p className="text-gray-600">
                        Explore verified businesses seeking funding with complete transparency logs.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-black">Invest Your Amount</h4>
                      <p className="text-gray-600">
                        Start with any amount you're comfortable with - no minimum investment required.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-black">Track Progress</h4>
                      <p className="text-gray-600">
                        Monitor your investments with real-time updates and transparent business reports.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-black">Earn Dividends</h4>
                      <p className="text-gray-600">
                        Receive your fair share of profits automatically based on your investment percentage.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="px-4 lg:px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection delay={200}>
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-black">The MicroVest Advantage</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Experience the future of crowdfunding with our innovative approach.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedSection delay={300}>
              <div>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-black mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2 text-black">No Hidden Fees</h4>
                      <p className="text-gray-600">Transparent pricing with no surprise charges or hidden costs.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-black mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2 text-black">Verified Businesses</h4>
                      <p className="text-gray-600">All businesses undergo thorough verification before listing.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-black mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2 text-black">Automated Dividends</h4>
                      <p className="text-gray-600">
                        Receive your dividends automatically without any manual intervention.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-black mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2 text-black">24/7 Support</h4>
                      <p className="text-gray-600">Get help whenever you need it with our dedicated support team.</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={400}>
              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="text-center">
                  <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                    <Handshake className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-black">Join Our Community</h3>
                  <p className="text-gray-600 mb-6">
                    Be part of a growing community of investors and entrepreneurs building the future together.
                  </p>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 bg-black rounded-full border-2 border-white"></div>
                      <div className="w-8 h-8 bg-gray-800 rounded-full border-2 border-white"></div>
                      <div className="w-8 h-8 bg-gray-600 rounded-full border-2 border-white"></div>
                      <div className="w-8 h-8 bg-gray-400 rounded-full border-2 border-white"></div>
                    </div>
                    <span className="text-sm text-gray-600">+1,200 members</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-black text-black" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">4.9/5 rating</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 lg:px-6 py-20 bg-black text-white">
        <AnimatedSection delay={200}>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
            <p className="text-xl mb-8 text-gray-300">
              Join thousands of investors and entrepreneurs who trust MicroVest for transparent, fair, and profitable
              crowdfunding.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" className="text-lg px-8">
                Start Investing Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 border-white text-white hover:bg-white hover:text-black"
              >
                Launch Your Campaign
                <Target className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Footer */}
      <footer className="px-4 lg:px-6 py-8 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-sm text-gray-400">
              &copy; 2024 MicroVest. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
