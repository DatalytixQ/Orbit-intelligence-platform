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
        return [
            {
                source: '/api/:path*',
                // Si la variable BACKEND_URL existe en Docker, la usa, sino asume que el backend está corriendo local en 3000
                destination: `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/:path*`,
            },
        ];
    },
};

export default withNextIntl(nextConfig);