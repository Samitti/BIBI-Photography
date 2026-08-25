import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const galleryModules = import.meta.glob('../assets/Gallery/*.{jpg,jpeg,png}', {
  eager: true,
  import: 'default',
})

const allPhotos = Object.keys(galleryModules)
  .sort()
  .map((path) => galleryModules[path])

const categories = ['Wedding Narratives', 'Family Sessions', 'Brand Portraits']

// Photos aren't named by category, so distribute them evenly across the three collections.
const photosByCategory = categories.reduce((acc, category, categoryIndex) => {
  acc[category] = allPhotos.filter((_, idx) => idx % categories.length === categoryIndex)
  return acc
}, {})

function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState(categories[0])
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const photos = useMemo(() => photosByCategory[activeCategory], [activeCategory])

  useEffect(() => {
    setLightboxIndex(null)
  }, [activeCategory])

  useEffect(() => {
    if (lightboxIndex === null) {
      return undefined
    }

    function handleKeydown(event) {
      if (event.key === 'Escape') {
        setLightboxIndex(null)
      }
      if (event.key === 'ArrowRight') {
        setLightboxIndex((current) => (current + 1) % photos.length)
      }
      if (event.key === 'ArrowLeft') {
        setLightboxIndex((current) => (current - 1 + photos.length) % photos.length)
      }
    }

    window.addEventListener('keydown', handleKeydown)
    return () => {
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [lightboxIndex, photos])

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
              <Link to="/" className="transition hover:text-[#a3653e]">
                Home
              </Link>
            </li>
            <li>
              <Link to="/gallery" className="text-[#a3653e]">
                Gallery
              </Link>
            </li>
            <li>
              <a href="/#contact" className="transition hover:text-[#a3653e]">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 md:px-10">
        <section className="py-14">
          <p className="text-sm uppercase tracking-[0.3em] text-[#8b6a57]">Gallery</p>
          <h1 className="heading-font mt-2 text-4xl text-[#2e1c14] md:text-5xl">
            Browse by category
          </h1>

          <div className="mt-8 flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`category-tab ${activeCategory === category ? 'category-tab-active' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="photo-grid mt-8">
            {photos.map((photo, idx) => (
              <button
                key={photo}
                type="button"
                onClick={() => setLightboxIndex(idx)}
                className="photo-thumb interactive-card"
                aria-label={`Open ${activeCategory} photo ${idx + 1}`}
              >
                <img
                  src={photo}
                  alt={`${activeCategory} photo ${idx + 1}`}
                  loading="lazy"
                  className="image-zoom h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </section>
      </main>

      {lightboxIndex !== null ? (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${activeCategory} photo ${lightboxIndex + 1} of ${photos.length}`}
          onClick={() => setLightboxIndex(null)}
        >
          <div className="lightbox-panel" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.25em] text-[#dcb89a]">
                {activeCategory} · Photo {lightboxIndex + 1} / {photos.length}
              </p>
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="lightbox-close"
                aria-label="Close gallery"
              >
                Close
              </button>
            </div>
            <div className="lightbox-stage">
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex((current) => (current - 1 + photos.length) % photos.length)
                }
                className="lightbox-nav lightbox-nav-prev"
                aria-label="Previous photo"
              >
                ‹
              </button>
              <img
                src={photos[lightboxIndex]}
                alt={`${activeCategory} photo ${lightboxIndex + 1}`}
                className="lightbox-image"
              />
              <button
                type="button"
                onClick={() => setLightboxIndex((current) => (current + 1) % photos.length)}
                className="lightbox-nav lightbox-nav-next"
                aria-label="Next photo"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default GalleryPage
