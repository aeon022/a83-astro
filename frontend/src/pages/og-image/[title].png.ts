import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import type { APIRoute } from 'astro';

// Fonts laden (Pfade müssen zu deinen lokalen Files in /public/fonts passen)
const fontBold = await fetch(new URL('../../../public/fonts/Inter-Black.ttf', import.meta.url)).then(res => res.arrayBuffer());
const fontMono = await fetch(new URL('../../../public/fonts/JetBrainsMono-Bold.ttf', import.meta.url)).then(res => res.arrayBuffer());

export const GET: APIRoute = async ({ params }) => {
  const title = params.title || 'DIGITAL_SYSTEMS';

  // Das HTML-Template im Bone-White Look
  const html = {
    type: 'div',
    props: {
      style: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        backgroundColor: '#f2f2f0', // Bone White
        padding: '60px',
        fontFamily: 'Inter',
        position: 'relative',
      },
      children: [
        // Corner Marks (Taktisches Detail)
        { type: 'div', props: { style: { position: 'absolute', top: '20px', left: '20px', width: '40px', height: '40px', borderTop: '4px solid #ff4b12', borderLeft: '4px solid #ff4b12' } } },
        { type: 'div', props: { style: { position: 'absolute', bottom: '20px', right: '20px', width: '40px', height: '40px', borderBottom: '4px solid #ff4b12', borderRight: '4px solid #ff4b12' } } },

        // Top Header
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'center', gap: '15px' },
            children: [
              { type: 'div', props: { style: { width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#22c55e' } } },
              { type: 'span', props: { style: { fontSize: '20px', fontFamily: 'JetBrains Mono', color: 'rgba(0,0,0,0.4)', letterSpacing: '0.2em' }, children: 'NODE: GRAZ_CENTRAL' } }
            ]
          }
        },

        // Main Title
        {
          type: 'h1',
          props: {
            style: { fontSize: '90px', fontWeight: 900, color: '#000', textTransform: 'uppercase', lineHeight: 0.9, margin: '40px 0' },
            children: title.replace(/_/g, ' ')
          }
        },

        // Footer Row
        {
          type: 'div',
          props: {
            style: { display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '2px solid rgba(0,0,0,0.1)', paddingTop: '40px' },
            children: [
              { type: 'span', props: { style: { fontSize: '24px', fontWeight: 700, color: '#000' }, children: 'const firma = "ABTEILUNG83";' } },
              { type: 'span', props: { style: { fontSize: '18px', fontFamily: 'JetBrains Mono', color: '#ff4b12', fontWeight: 900 }, children: '// LESS_NOISE. NICE_DATA.' } }
            ]
          }
        }
      ]
    }
  };

  const svg = await satori(html as any, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Inter', data: fontBold, weight: 900, style: 'normal' },
      { name: 'JetBrains Mono', data: fontMono, weight: 700, style: 'normal' },
    ],
  });

  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return new Response(pngBuffer, {
    headers: { 'Content-Type': 'image/png' },
  });
};