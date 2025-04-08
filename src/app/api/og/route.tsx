import { NextRequest } from 'next/server';
import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url || '');

  const title = searchParams.get('title') || 'Modern Coding';
  const description = searchParams.get('description') || 'Zero Bullshit AI, tooling and projects. Just code that ships.';

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundImage: 'linear-gradient(to right, rgba(30, 64, 175, 0.95), rgba(55, 48, 163, 0.95))',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Network background pattern */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.2,
          backgroundImage: `
            radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.4) 1px, transparent 3px),
            radial-gradient(circle at 30% 65%, rgba(255, 255, 255, 0.4) 1px, transparent 3px),
            radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.4) 1px, transparent 3px),
            radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.4) 1px, transparent 3px),
            radial-gradient(circle at 90% 40%, rgba(255, 255, 255, 0.4) 1px, transparent 3px)
          `,
          backgroundSize: '180px 180px',
        }}
      />
      
      {/* Simple card layout - left side text, right side image */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: '100%',
        padding: '40px',
        position: 'relative',
        zIndex: 10,
      }}>
        {/* Left section with content */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '50%',
          paddingRight: '32px',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
          }}>
            <h1 style={{
              fontSize: '64px',
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'left',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              maxWidth: '600px',
              margin: 0,
            }}>
              {title}
            </h1>

            <p style={{
              fontSize: '32px',
              fontWeight: '500',
              color: 'rgb(191, 219, 254)',
              textAlign: 'left',
              wordBreak: 'break-word',
              maxWidth: '600px',
              margin: 0,
              paddingTop: '24px',
            }}>
              {description}
            </p>
          </div>
        </div>
        
        {/* Right section with logo */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '50%',
          paddingLeft: '32px',
        }}>
          <div style={{
            display: 'flex',
            width: '450px',
            height: '450px',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          }}>
            <img
              src="/modern-coding-logo.webp"
              alt="Modern Coding Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [],
      emoji: 'twemoji',
    }
  );
}
