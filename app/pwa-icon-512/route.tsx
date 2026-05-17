import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const SIZE = 512;
const RADIUS = Math.round(SIZE * 0.22);

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: SIZE,
          height: SIZE,
          background: '#1e40af',
          borderRadius: RADIUS,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: SIZE * 0.52,
        }}
      >
        🏦
      </div>
    ),
    { width: SIZE, height: SIZE },
  );
}
