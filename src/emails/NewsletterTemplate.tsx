import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Link,
  Hr,
  Font
} from '@react-email/components'
import * as React from 'react'

interface NewsletterEmailProps {
  title: string
  contentHtml: string
  previewText?: string
  newsletterSlug: string
}

export default function NewsletterEmail({
  title,
  contentHtml,
  previewText,
  newsletterSlug
}: NewsletterEmailProps) {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>{previewText || title}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Link href="https://zackproser.com" style={logoLink}>
              <Text style={logoText}>Zachary Proser</Text>
            </Link>
            <Heading style={h1}>{title}</Heading>
          </Section>

          {/* Content - render HTML from MDX */}
          <Section style={content}>
            <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
          </Section>

          {/* Read online link */}
          <Section style={readOnline}>
            <Link
              href={`https://zackproser.com/newsletter/${newsletterSlug}`}
              style={readOnlineLink}
            >
              Read this newsletter on the web →
            </Link>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              You&apos;re receiving this because you subscribed to my newsletter about AI, developer tools, and software engineering.
            </Text>
            <Text style={footerText}>
              <Link href="https://zackproser.com" style={footerLink}>
                Website
              </Link>
              {' · '}
              <Link href="https://github.com/zackproser" style={footerLink}>
                GitHub
              </Link>
              {' · '}
              <Link href="https://x.com/zackproser" style={footerLink}>
                Twitter
              </Link>
            </Text>
            <Text style={footerText}>
              <Link href="{{{RESEND_UNSUBSCRIBE_URL}}}" style={unsubscribeLink}>
                Unsubscribe
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Email-safe CSS-in-JS styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
  borderRadius: '8px',
}

const header = {
  padding: '32px 40px 24px',
  borderBottom: '1px solid #e6e6e6',
}

const logoLink = {
  textDecoration: 'none',
}

const logoText = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#0070f3',
  textDecoration: 'none',
  marginBottom: '16px',
}

const h1 = {
  color: '#1a1a1a',
  fontSize: '28px',
  fontWeight: '700',
  lineHeight: '1.3',
  margin: '16px 0 0 0',
  padding: '0',
}

const content = {
  padding: '32px 40px',
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#333333',
}

const readOnline = {
  padding: '0 40px 24px',
  textAlign: 'center' as const,
}

const readOnlineLink = {
  color: '#0070f3',
  fontSize: '14px',
  textDecoration: 'none',
  fontWeight: '500',
}

const hr = {
  borderColor: '#e6e6e6',
  margin: '0 40px',
}

const footer = {
  padding: '32px 40px',
  textAlign: 'center' as const,
}

const footerText = {
  color: '#8898aa',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '8px 0',
}

const footerLink = {
  color: '#0070f3',
  fontSize: '13px',
  textDecoration: 'none',
}

const unsubscribeLink = {
  color: '#8898aa',
  fontSize: '12px',
  textDecoration: 'underline',
}
