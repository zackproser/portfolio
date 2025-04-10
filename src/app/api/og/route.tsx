import { NextRequest } from 'next/server';
import { ImageResponse } from '@vercel/og';
import React from 'react';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'AI Engineering Mastery for Teams That Ship';
    const description = searchParams.get('description') || 'Modern development techniques, AI tools, projects, videos, tutorials and more';
    
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            backgroundColor: '#1e3a8a',
            backgroundImage: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
            padding: '48px',
          }}
        >
          {/* Header with logo */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
            <div style={{ marginRight: '12px', display: 'flex' }}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="20" fill="white" />
                <path d="M14 20C14 16.6863 16.6863 14 20 14C23.3137 14 26 16.6863 26 20C26 23.3137 23.3137 26 20 26" stroke="#1E40AF" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M20 26C16.6863 26 14 23.3137 14 20" stroke="#1E40AF" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
              Modern Coding
            </div>
          </div>

          {/* Main content area */}
          <div style={{ display: 'flex', height: '75%', width: '100%' }}>
            {/* Text side */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              width: '50%', 
              justifyContent: 'center',
              paddingRight: '32px'
            }}>
              <div style={{ 
                fontSize: '42px', 
                fontWeight: 'bold', 
                color: 'white', 
                lineHeight: 1.2, 
                marginBottom: '24px' 
              }}>
                {title}
              </div>
              
              {description && (
                <div style={{ 
                  fontSize: '22px', 
                  color: '#dbeafe', 
                  marginBottom: '24px' 
                }}>
                  {description}
                </div>
              )}
              
              <div style={{ 
                fontSize: '18px', 
                color: '#dbeafe' 
              }}>
                zackproser.com
              </div>
            </div>
            
            {/* Logo side with custom SVG */}
            <div style={{ 
              display: 'flex', 
              width: '50%', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: 'rgba(17, 24, 39, 0.7)', 
              borderRadius: '12px',
              padding: '32px'
            }}>
              {/* Modern Coding stylized logo - simple SVG version */}
              <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="100" fill="white" />
                <path d="M50 100C50 72.3858 72.3858 50 100 50C127.614 50 150 72.3858 150 100C150 127.614 127.614 150 100 150" stroke="#1E40AF" strokeWidth="10" strokeLinecap="round" />
                <path d="M100 150C72.3858 150 50 127.614 50 100" stroke="#1E40AF" strokeWidth="10" strokeLinecap="round" />
                <path d="M85 75L115 75M85 100L115 100M85 125L115 125" stroke="#1E40AF" strokeWidth="6" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Footer */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginTop: 'auto',
            alignItems: 'center'
          }}>
            <div style={{ 
              color: 'white', 
              fontSize: '14px',
              opacity: 0.8,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '4px 12px',
              borderRadius: '4px'
            }}>
              Trusted by Industry Leaders
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630
      }
    );
  } catch (error: any) {
    console.log(`OG image error: ${error.message}`);
    return new Response(`Failed to generate image: ${error.message}`, {
      status: 500,
    });
  }
}
