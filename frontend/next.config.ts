import type { NextConfig } from "next";
import path from "path";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
    output: "standalone",
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    turbopack: {
        root: path.resolve(__dirname),
    },
    async rewrites() {
        // En Next.js 'standalone', esto se evalúa durante 'next build'.
        // Como el build de Docker inyecta NODE_ENV=production, fijamos la ruta interna de Docker.
        const destinationBase = process.env.NODE_ENV === 'production' 
            ? 'http://orbit_backend:3000' 
            : 'http://localhost:3000';
            
        return [
            {
                source: '/api/:path*',
                destination: `${destinationBase}/api/:path*`,
            },
        ];
    },
};

export default withNextIntl(nextConfig);