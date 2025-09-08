import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Container, Section, Heading, Text, Button } from './index'
import { BauhausCircle, BauhausSquare, BauhausTriangle } from './bauhaus-elements'

interface HeroData {
  title?: string
  subtitle?: string
  description?: string
  image?: string
  video?: string
  text_color?: string
  background_color?: string
  cta_text?: string
  cta_href?: string
}

interface HeroProps {
  hero: HeroData | null
  className?: string
  variant?: 'default' | 'minimal' | 'fullscreen' | 'split'
  showBauhausElements?: boolean
  showGlassEffect?: boolean
}

const Hero: React.FC<HeroProps> = ({ 
  hero, 
  className,
  variant = 'default',
  showBauhausElements = true,
  showGlassEffect = true
}) => {
  if (!hero) {
    return (
      <Section className="min-h-screen flex items-center justify-center bg-gray-100">
        <Container>
          <div className="text-center">
            <Heading level={1} color="muted">No Hero Content</Heading>
          </div>
        </Container>
      </Section>
    )
  }

  const {
    title = '',
    subtitle = '',
    description = '',
    image = '',
    video = '',
    text_color = '#ffffff',
    background_color = '#000000',
    cta_text = 'Get Started',
    cta_href = '#contact',
  } = hero

  const sectionStyle = {
    backgroundColor: background_color || '#000000',
    color: text_color || '#ffffff',
  }

  const renderBauhausElements = () => {
    if (!showBauhausElements) return null

    return (
      <>
        {/* Large half-circle at the top right */}
        <BauhausCircle
          size="xl"
          color="yellow"
          opacity={0.4}
          position="absolute"
          className="top-0 right-0 rounded-bl-full"
        />

        {/* Quarter circle at the bottom left */}
        <BauhausCircle
          size="lg"
          color="lightBlue"
          opacity={0.4}
          position="absolute"
          className="bottom-0 left-0 rounded-tr-full"
        />

        {/* Overlapping circles */}
        <BauhausCircle
          size="md"
          color="orange"
          opacity={0.4}
          position="absolute"
          className="top-[40vh] left-[10vw]"
          animation="float"
        />

        <BauhausCircle
          size="sm"
          color="navy"
          opacity={0.3}
          position="absolute"
          className="top-[35vh] left-[5vw]"
          animation="floatDelay1"
        />

        {/* Diagonal rectangle */}
        <BauhausSquare
          size="lg"
          color="red"
          opacity={0.3}
          position="absolute"
          className="top-[60vh] right-[15vw] rotate-12"
        />

        {/* Small geometric elements */}
        <BauhausSquare
          size="sm"
          color="green"
          opacity={0.3}
          position="absolute"
          className="top-[20vh] right-[30vw] rotate-45"
        />

        <BauhausCircle
          size="sm"
          color="yellow"
          opacity={0.4}
          position="absolute"
          className="bottom-[15vh] right-[10vw]"
          variant="outline"
          borderWidth="thick"
        />
      </>
    )
  }

  const renderContent = () => {
    const content = (
      <div className="relative z-10">
        {subtitle && (
          <Text 
            size="large" 
            color="white" 
            className="mb-4 opacity-90"
          >
            {subtitle}
          </Text>
        )}
        
        {title && (
          <Heading 
            level={1} 
            color="white" 
            className="mb-6"
          >
            {title}
          </Heading>
        )}
        
        {description && (
          <Text 
            size="large" 
            color="white" 
            className="mb-8 opacity-90"
          >
            {description}
          </Text>
        )}
        
        {cta_text && (
          <Button
            variant="primary"
            size="lg"
            href={cta_href}
            className="group"
          >
            {cta_text}
          </Button>
        )}
      </div>
    )

    if (variant === 'minimal') {
      return (
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            {content}
          </div>
        </Container>
      )
    }

    if (variant === 'split') {
      return (
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              {content}
            </div>
            <div className="relative">
              {image && (
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <Image
                    src={image}
                    alt={title || 'Hero image'}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}
            </div>
          </div>
        </Container>
      )
    }

    // Default and fullscreen variants
    return (
      <Container>
        <div className="text-center max-w-4xl mx-auto">
          {content}
        </div>
      </Container>
    )
  }

  const getSectionClasses = () => {
    const baseClasses = 'relative overflow-hidden'
    
    switch (variant) {
      case 'fullscreen':
        return cn(baseClasses, 'min-h-screen flex items-center')
      case 'minimal':
        return cn(baseClasses, 'py-16 md:py-24')
      case 'split':
        return cn(baseClasses, 'py-16 md:py-24')
      default:
        return cn(baseClasses, 'min-h-[80vh] flex items-center')
    }
  }

  return (
    <Section 
      className={cn(getSectionClasses(), className)}
      style={sectionStyle}
      container={false}
    >
      {/* Background Image */}
      {image && !video && variant !== 'split' && (
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
      {video && variant !== 'split' && (
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-30"
          >
            <source src={video} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
      )}

      {/* Glass effect overlay */}
      {showGlassEffect && variant !== 'minimal' && (
        <div className="absolute inset-0 z-5">
          <div className="glass absolute inset-0 opacity-20" />
        </div>
      )}

      {/* Bauhaus Elements */}
      {renderBauhausElements()}

      {/* Content */}
      {renderContent()}
    </Section>
  )
}

export default Hero
