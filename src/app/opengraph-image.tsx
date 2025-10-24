import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'xgrain402-scan • Solana Payment Rail Explorer';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Load Google Font dynamically
async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}:wght@700&text=${encodeURIComponent(
    text
  )}`;

  const css = await fetch(url).then(res => res.text());

  const resource = /src: url\((.+)\) format\('(opentype|truetype)'\)/.exec(css);

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status == 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error('failed to load font data');
}

export default async function Image() {
  const fontData = await loadGoogleFont('JetBrains Mono', 'xgrain402-scan');

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          position: 'relative',
          backgroundColor: '#030712',
          backgroundImage:
            'radial-gradient(circle at 25% 25%, #1e40af20 0%, transparent 70%), radial-gradient(circle at 75% 75%, #06b6d420 0%, transparent 70%), linear-gradient(90deg, #ffffff15 1px, transparent 1px), linear-gradient(#ffffff15 1px, transparent 1px)',
          backgroundSize: '100% 100%, 100% 100%, 60px 60px, 60px 60px',
          border: '1px solid #1e293b',
          boxShadow:
            'inset 0 1px 0 0 #334155, 0 0 40px rgba(14, 165, 233, 0.1)',
        }}
      >
        {/* Main content container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '80px',
            width: '100%',
            height: '100%',
          }}
        >
          {/* Logo and brand section */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              marginBottom: 60,
            }}
          >
            <img
              src={'https://explorer.xgrain402.xyz/logo.svg'}
              width="72"
              height="72"
              alt="xgrain402-scan logo"
              style={{ borderRadius: 16 }}
            />
            <div
              style={{
                display: 'flex',
                fontSize: 84,
                fontWeight: 700,
                fontFamily: 'JetBrains Mono',
                color: '#f8fafc',
                letterSpacing: '-0.025em',
                lineHeight: 0.9,
                textShadow:
                  '0 0 20px rgba(14, 165, 233, 0.3), 0 2px 4px rgba(0, 0, 0, 0.5)',
              }}
            >
              xgrain402-scan
            </div>
          </div>

          {/* Main tagline */}
          <div
            style={{
              fontSize: 36,
              fontWeight: 600,
              color: '#e2e8f0',
              marginBottom: 24,
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
            }}
          >
            Solana Payment Rail Explorer
          </div>

          {/* Description */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: 24,
              fontWeight: 400,
              color: '#94a3b8',
              maxWidth: 600,
              lineHeight: 1.4,
              letterSpacing: '-0.005em',
            }}
          >
            <div style={{ display: 'flex' }}>
              Scaling microtransactions to machine economies.
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'JetBrains Mono',
          data: fontData,
          weight: 700,
          style: 'normal',
        },
      ],
    }
  );
}
