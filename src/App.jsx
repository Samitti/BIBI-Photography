import { useEffect, useState } from 'react'

const portfolioItems = [
  {
    title: 'Wedding Narratives',
    details: 'Emotion-first storytelling with editorial finishing.',
    image:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Family Sessions',
    details: 'Warm and candid portraits in natural light.',
    image:
      'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Brand Portraits',
    details: 'Clean personal branding visuals for modern businesses.',
    image:
      'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=1200&q=80',
  },
]

const galleries = [
  {
    title: 'Golden Hour Love Stories',
    tag: 'Couples',
    image:
      'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1400&q=80',
  },
  {
    title: 'Studio Fine Art Portraits',
    tag: 'Portrait',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1400&q=80',
  },
  {
    title: 'Kitchener-Waterloo Urban Frames',
    tag: 'Editorial',
    image:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1400&q=80',
  },
  {
    title: 'Seasonal Family Chapters',
    tag: 'Family',
    image:
      'https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?auto=format&fit=crop&w=1400&q=80',
  },
]

const testimonials = [
  {
    quote:
      'Ema made us feel relaxed from the first minute. Every photo feels alive and true to us.',
    author: 'Nadia & Thomas',
  },
  {
    quote:
      'The final gallery was breathtaking. The colors, details, and emotion were beyond what we expected.',
    author: 'Priya R.',
  },
  {
    quote:
      'Professional, artistic, and deeply thoughtful. Our brand photos instantly elevated our website.',
    author: 'Lumen Wellness Studio',
  },
]

const pricing = [
  {
    plan: 'Essential Session',
    value: '$200',
    includes: '1 hour, 1 location, 25 edited images in digital format',
  },
  {
    plan: 'Signature Story',
    value: '$450',
    includes: '2 hours, up to 2 locations, 60 edited images in print and digital format',
  },
  {
    plan: 'Wedding Collection',
    value: '$5,880',
    includes: 'Full wedding coverage, upto 300 printed in photobook format, all high-resolution images in digital format',
  },
]

const styleChoices = [
  {
    title: 'Natural',
    details: 'Soft light, relaxed posing, true-to-life color.',
  },
  {
    title: 'Editorial',
    details: 'Clean, polished, fashion-inspired framing.',
  },
  {
    title: 'Romantic',
    details: 'Warm tones, intimate moments, gentle mood.',
  },
]

const MIN_MESSAGE_LENGTH = 20

function validateField(name, value) {
  const trimmed = value.trim()

  if (name === 'name') {
    if (!trimmed) {
      return 'Please enter your name.'
    }
    if (trimmed.length < 2) {
      return 'Name is too short.'
    }
    return ''
  }

  if (name === 'email') {
    if (!trimmed) {
      return 'Please enter your email address.'
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(trimmed)) {
      return 'Please enter a valid email address.'
    }
    return ''
  }

  if (name === 'message') {
    if (!trimmed) {
      return 'Please add a message.'
    }
    if (trimmed.length < MIN_MESSAGE_LENGTH) {
      return `Message must be at least ${MIN_MESSAGE_LENGTH} characters.`
    }
    return ''
  }

  return ''
}

function getValidationErrors(formData) {
  return {
    name: validateField('name', formData.name),
    email: validateField('email', formData.email),
    message: validateField('message', formData.message),
  }
}

function App() {
  const [activeImage, setActiveImage] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    sessionType: 'Portrait Session',
    message: '',
  })
  const [formStatus, setFormStatus] = useState({
    state: 'idle',
    message: '',
  })
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [touchedFields, setTouchedFields] = useState({
    name: false,
    email: false,
    message: false,
  })

  useEffect(() => {
    const animatedElements = document.querySelectorAll('[data-animate]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      {
        threshold: 0.22,
      },
    )

    animatedElements.forEach((element) => observer.observe(element))

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!activeImage) {
      return undefined
    }

    function closeOnEscape(event) {
      if (event.key === 'Escape') {
        setActiveImage(null)
      }
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => {
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [activeImage])

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))

    if (name in touchedFields && touchedFields[name]) {
      setFieldErrors((current) => ({
        ...current,
        [name]: validateField(name, value),
      }))
    }
  }

  function handleBlur(event) {
    const { name, value } = event.target

    if (name in touchedFields) {
      setTouchedFields((current) => ({
        ...current,
        [name]: true,
      }))
      setFieldErrors((current) => ({
        ...current,
        [name]: validateField(name, value),
      }))
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const errors = getValidationErrors(formData)
    const hasErrors = Object.values(errors).some(Boolean)

    if (hasErrors) {
      setTouchedFields({
        name: true,
        email: true,
        message: true,
      })
      setFieldErrors(errors)
      setFormStatus({
        state: 'error',
        message: 'Please fix the highlighted fields and try again.',
      })
      return
    }

    setFormStatus({
      state: 'sending',
      message: 'Sending your message now...',
    })

    try {
      const response = await fetch('https://formsubmit.co/ajax/hello@bibiphotography.ca', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          session_type: formData.sessionType,
          message: formData.message,
          _subject: 'New inquiry for BiBi Photography',
          _template: 'table',
        }),
      })

      if (!response.ok) {
        throw new Error('Unable to submit contact form')
      }

      setFormStatus({
        state: 'success',
        message: 'Message sent successfully. Ema BiBi will be in touch soon.',
      })
      setFormData({
        name: '',
        email: '',
        phone: '',
        sessionType: 'Portrait Session',
        message: '',
      })
      setTouchedFields({
        name: false,
        email: false,
        message: false,
      })
      setFieldErrors({
        name: '',
        email: '',
        message: '',
      })
    } catch {
      setFormStatus({
        state: 'error',
        message:
          'Message could not be sent right now. Please try again or email hello@bibiphotography.ca.',
      })
    }
  }

  return (
    <div className="grain pb-16">
      <header className="mx-auto max-w-6xl px-6 pt-6 md:px-10">
        <nav className="fade-in flex items-center justify-center rounded-full border border-[#8f6548]/30 bg-[#fffaf2]/75 px-4 py-3 backdrop-blur-md md:justify-between md:px-6">
          <div className="text-center md:text-left">
            <p className="heading-font text-xl tracking-[0.2em] text-[#442a1b] md:text-2xl">
              BiBi Photography
            </p>
            <p className="text-xs uppercase tracking-[0.32em] text-[#7f6657]">
              Kitchener-Waterloo
            </p>
          </div>
          <ul className="hidden items-center gap-6 text-sm font-semibold uppercase tracking-[0.16em] text-[#5f4638] md:flex">
            <li>
              <a href="#home" className="transition hover:text-[#a3653e]">
                Home
              </a>
            </li>
            <li>
              <a href="#portfolio" className="transition hover:text-[#a3653e]">
                Portfolio
              </a>
            </li>
            <li>
              <a href="#pricing" className="transition hover:text-[#a3653e]">
                Pricing
              </a>
            </li>
            <li>
              <a href="#galleries" className="transition hover:text-[#a3653e]">
                Galleries
              </a>
            </li>
            <li>
              <a href="#testimonials" className="transition hover:text-[#a3653e]">
                Testimonials
              </a>
            </li>
            <li>
              <a href="#contact" className="transition hover:text-[#a3653e]">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 md:px-10">
        <section id="home" className="grid items-center gap-12 py-20 md:grid-cols-2">
          <div className="fade-up">
            <p className="text-sm uppercase tracking-[0.32em] text-[#8c6f5c]">
              Ema BiBi
            </p>
            <h1 className="heading-font mt-4 text-5xl leading-tight text-[#2b1a12] md:text-7xl">
              Artistic Photography With Soulful Detail
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#5b473a]">
              BiBi Photography creates cinematic yet intimate imagery for couples,
              families, and brands across the Kitchener-Waterloo area.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#contact"
                className="rounded-full bg-[#4e3121] px-7 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#fff7ec] transition hover:bg-[#3d2418]"
              >
                Book A Session
              </a>
              <a
                href="#portfolio"
                className="rounded-full border border-[#7f5a44] px-7 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#5d3f2d] transition hover:bg-[#f2e6da]"
              >
                View Portfolio
              </a>
            </div>
          </div>
          <div className="fade-up-delay relative">
            <div className="floating-orb floating-orb-left" />
            <div className="floating-orb floating-orb-right" />
            <div className="interactive-card rounded-[2.5rem] border border-white/40 bg-gradient-to-br from-[#f4e7d4] to-[#d4b395] p-5 shadow-glow">
              <div className="rounded-[2rem] bg-[#2f1f16] p-6 text-[#f2ddc8]">
                <p className="text-xs uppercase tracking-[0.26em] text-[#c8a98f]">
                  Choice-Driven, Customizable Style Options
                </p>
                <p className="heading-font mt-5 text-3xl leading-tight">
                  Your style, your choice: fully customizable framing, color tones,
                  and aesthetic preferences designed around you.
                </p>
                <div className="mt-8 grid gap-3">
                  {styleChoices.map((choice) => (
                    <div
                      key={choice.title}
                      className="rounded-2xl border border-[#a77f66]/35 bg-[#41281d]/85 p-4 transition hover:border-[#d5b08f]/70 hover:bg-[#4a2e21]"
                    >
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f7dbc2]">
                        {choice.title}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-[#d9b89d]">
                        {choice.details}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="portfolio" className="reveal py-14" data-animate>
          <p className="text-sm uppercase tracking-[0.3em] text-[#8b6a57]">Portfolio</p>
          <h2 className="heading-font mt-2 text-4xl text-[#2e1c14] md:text-5xl">
            Crafted stories for real people
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {portfolioItems.map((item) => (
              <article
                key={item.title}
                className="interactive-card fade-up-delay-2 rounded-3xl border border-[#b48a6f]/35 bg-[#fffcf7]/80 p-6 backdrop-blur-sm"
              >
                <div className="image-shell mb-5 h-56 rounded-2xl">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="image-zoom h-full w-full object-cover"
                  />
                  <span className="image-overlay-label">Featured Work</span>
                </div>
                <h3 className="heading-font text-2xl text-[#3f291d]">{item.title}</h3>
                <p className="mt-3 text-[#624c3f]">{item.details}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="pricing" className="reveal py-14" data-animate>
          <p className="text-sm uppercase tracking-[0.3em] text-[#8b6a57]">Pricing</p>
          <h2 className="heading-font mt-2 text-4xl text-[#2e1c14] md:text-5xl">
            Transparent packages
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {pricing.map((tier) => (
              <div
                key={tier.plan}
                className="interactive-card rounded-3xl border border-[#9f7357]/40 bg-[#fff7ee] p-6"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-[#8f6953]">
                  {tier.plan}
                </p>
                <p className="heading-font mt-3 text-4xl text-[#3b2318]">{tier.value}</p>
                <p className="mt-4 text-[#61493a]">{tier.includes}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="galleries" className="reveal py-14" data-animate>
          <p className="text-sm uppercase tracking-[0.3em] text-[#8b6a57]">Galleries</p>
          <h2 className="heading-font mt-2 text-4xl text-[#2e1c14] md:text-5xl">
            Curated visual collections
          </h2>
          <div className="gallery-grid mt-8">
            {galleries.map((gallery, idx) => (
              <button
                key={gallery.title}
                type="button"
                onClick={() => setActiveImage(gallery)}
                className="gallery-card interactive-card"
                aria-label={`Open ${gallery.title}`}
              >
                <img
                  src={gallery.image}
                  alt={gallery.title}
                  loading="lazy"
                  className="image-zoom h-full w-full object-cover"
                />
                <div className="gallery-overlay">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#f6e1ce]">
                    Gallery {String(idx + 1).padStart(2, '0')} • {gallery.tag}
                  </p>
                  <h3 className="heading-font mt-2 text-3xl text-[#fff5ea]">{gallery.title}</h3>
                  <p className="mt-2 text-sm uppercase tracking-[0.2em] text-[#f0d8c3]">
                    Click to preview
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section id="testimonials" className="reveal py-14" data-animate>
          <p className="text-sm uppercase tracking-[0.3em] text-[#8b6a57]">Testimonials</p>
          <h2 className="heading-font mt-2 text-4xl text-[#2e1c14] md:text-5xl">
            Words from clients
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {testimonials.map((item) => (
              <blockquote
                key={item.author}
                className="interactive-card rounded-3xl border border-[#ab8167]/35 bg-[#fff8ef] p-6"
              >
                <p className="text-lg leading-relaxed text-[#4f3a2f]">“{item.quote}”</p>
                <cite className="mt-5 block text-sm font-semibold uppercase tracking-[0.2em] text-[#8b6753]">
                  {item.author}
                </cite>
              </blockquote>
            ))}
          </div>
        </section>

        <section id="contact" className="reveal py-14" data-animate>
          <div className="rounded-[2.2rem] border border-[#9c6f52]/35 bg-[#2f1e15] px-8 py-12 text-[#f8e7d5] md:px-12">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-[#d6b99e]">Contact</p>
                <h2 className="heading-font mt-2 text-4xl text-[#fff1e0] md:text-5xl">
                  Let us create your next story
                </h2>
                <p className="mt-4 max-w-2xl text-[#e4ccb7]">
                  Reach out to Ema BiBi for portrait sessions, events, and wedding
                  photography in Kitchener-Waterloo and nearby areas.
                </p>
                <div className="mt-8 grid grid-cols-1 gap-4 text-sm uppercase tracking-[0.2em]">
                  <a
                    href="mailto:hello@bibiphotography.ca"
                    className="rounded-2xl border border-[#c99e7c]/40 bg-[#422a1d] px-5 py-4 transition hover:bg-[#523527]"
                  >
                    hello@bibiphotography.ca
                  </a>
                  <a
                    href="tel:+12265550126"
                    className="rounded-2xl border border-[#c99e7c]/40 bg-[#422a1d] px-5 py-4 transition hover:bg-[#523527]"
                  >
                    +1 (226) 555-0126
                  </a>
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                noValidate
                className="interactive-card rounded-3xl border border-[#c59875]/45 bg-[#3f281b]/80 p-5"
              >
                <h3 className="heading-font text-2xl text-[#ffe9d4]">Instant Inquiry Form</h3>
                <p className="mt-1 text-sm text-[#ddbfa6]">
                  Send your message directly and get a quick response.
                </p>

                <div className="mt-5 space-y-3">
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Your Name"
                    aria-invalid={Boolean(touchedFields.name && fieldErrors.name)}
                    aria-describedby="name-error"
                    className={`contact-input ${
                      touchedFields.name && fieldErrors.name
                        ? 'border-[#ffb8b8] bg-[#5a2f2f]/35'
                        : ''
                    }`}
                  />
                  {touchedFields.name && fieldErrors.name ? (
                    <p id="name-error" className="text-sm text-[#ffb8b8]">
                      {fieldErrors.name}
                    </p>
                  ) : null}
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Email Address"
                    aria-invalid={Boolean(touchedFields.email && fieldErrors.email)}
                    aria-describedby="email-error"
                    className={`contact-input ${
                      touchedFields.email && fieldErrors.email
                        ? 'border-[#ffb8b8] bg-[#5a2f2f]/35'
                        : ''
                    }`}
                  />
                  {touchedFields.email && fieldErrors.email ? (
                    <p id="email-error" className="text-sm text-[#ffb8b8]">
                      {fieldErrors.email}
                    </p>
                  ) : null}
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="contact-input"
                  />
                  <select
                    name="sessionType"
                    value={formData.sessionType}
                    onChange={handleChange}
                    className="contact-input"
                  >
                    <option>Portrait Session</option>
                    <option>Couples Session</option>
                    <option>Family Session</option>
                    <option>Wedding Coverage</option>
                    <option>Brand Photography</option>
                  </select>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    rows={4}
                    placeholder="Tell me about your vision, date, or location."
                    aria-invalid={Boolean(touchedFields.message && fieldErrors.message)}
                    aria-describedby="message-error"
                    className={`contact-input resize-none ${
                      touchedFields.message && fieldErrors.message
                        ? 'border-[#ffb8b8] bg-[#5a2f2f]/35'
                        : ''
                    }`}
                  />
                  {touchedFields.message && fieldErrors.message ? (
                    <p id="message-error" className="text-sm text-[#ffb8b8]">
                      {fieldErrors.message}
                    </p>
                  ) : null}
                </div>

                <button
                  type="submit"
                  disabled={formStatus.state === 'sending'}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#d1a27a] px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-[#2c1a12] transition hover:bg-[#e3b487] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {formStatus.state === 'sending' ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#2c1a12]/35 border-t-[#2c1a12]" />
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>

                {formStatus.message ? (
                  <p
                    className={`mt-3 text-sm ${
                      formStatus.state === 'error' ? 'text-[#ffb6b6]' : 'text-[#caefce]'
                    }`}
                  >
                    {formStatus.message}
                  </p>
                ) : null}
              </form>
            </div>
          </div>
        </section>
      </main>

      {activeImage ? (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={activeImage.title}
          onClick={() => setActiveImage(null)}
        >
          <div className="lightbox-panel" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={() => setActiveImage(null)}
              className="lightbox-close"
              aria-label="Close image preview"
            >
              Close
            </button>
            <img src={activeImage.image} alt={activeImage.title} className="lightbox-image" />
            <div className="mt-3 px-2">
              <p className="text-xs uppercase tracking-[0.25em] text-[#dcb89a]">{activeImage.tag}</p>
              <h3 className="heading-font mt-2 text-3xl text-[#fdf0e2]">{activeImage.title}</h3>
            </div>
          </div>
        </div>
      ) : null}

      <footer className="mx-auto mt-20 w-full max-w-6xl px-6 pb-8 md:px-10">
        <div className="footer-shell rounded-[2rem] border border-[#8f6548]/35 bg-[#2a1a12] p-7 text-[#f2deca] md:p-9">
          <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
            <div>
              <p className="heading-font text-2xl tracking-[0.12em] text-[#ffe8d2]">
                BiBi Photography
              </p>
              <p className="mt-2 text-sm uppercase tracking-[0.24em] text-[#d6b79b]">
                Ema BiBi · Kitchener-Waterloo
              </p>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#e7ccb3]">
                Artistic photography for weddings, portraits, and stories that feel
                timeless.
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.26em] text-[#d6b79b]">Explore</p>
              <ul className="mt-4 space-y-3 text-sm uppercase tracking-[0.18em]">
                <li>
                  <a href="#home" className="footer-link">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#portfolio" className="footer-link">
                    Portfolio
                  </a>
                </li>
                <li>
                  <a href="#contact" className="footer-link">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.26em] text-[#d6b79b]">Social</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="social-pill"
                  aria-label="Facebook"
                >
                  <span className="social-icon" aria-hidden="true">
                    f
                  </span>
                  Facebook
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="social-pill"
                  aria-label="Instagram"
                >
                  <span className="social-icon" aria-hidden="true">
                    ig
                  </span>
                  Instagram
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="social-pill"
                  aria-label="YouTube"
                >
                  <span className="social-icon" aria-hidden="true">
                    yt
                  </span>
                  YouTube
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-[#8f6548]/35 pt-5 text-xs uppercase tracking-[0.2em] text-[#d1b093]">
            © {new Date().getFullYear()} BiBi Photography. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
