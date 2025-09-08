import Image from 'next/image'

interface HeroData {
  title?: string
  subtitle?: string
  image?: string
  video?: string
  text_color?: string
  background_color?: string
}

interface HeroProps {
  hero: HeroData | null
}

const Hero: React.FC<HeroProps> = ({ hero }) => {
  if (!hero) {
    return (
      <section data-testid="hero-section" className="min-h-screen flex items-center justify-center bg-gray-100">
        <div data-testid="hero-content" className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">No Hero Content</h1>
        </div>
      </section>
    )
  }

  const {
    title = '',
    subtitle = '',
    image = '',
    video = '',
    text_color = '#ffffff',
    background_color = '#000000',
  } = hero

  const sectionStyle = {
    backgroundColor: background_color || '#000000',
  }

  const contentStyle = {
    color: text_color || '#ffffff',
  }

  return (
    <section 
      data-testid="hero-section" 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={sectionStyle}
    >
      {/* Background Image */}
      {image && !video && (
        <div className="absolute inset-0 z-0">
          <Image
            src={image}
            alt={title || 'Hero image'}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
      )}

      {/* Background Video */}
      {video && (
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={video} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
      )}

      {/* Content */}
      <div 
        data-testid="hero-content" 
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        style={contentStyle}
      >
        {title && (
          <h1 className="text-5xl md:text-7xl font-bold mb-6 font-raleway">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="text-xl md:text-2xl mb-8 font-inter">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}

export default Hero
