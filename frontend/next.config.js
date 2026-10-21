const fs = require('node:fs');
const path = require('node:path');

// Miniatures fabriquées par `npm run build` (scripts/thumbnails.mjs) et choisies par lib/image-loader.ts ; sans elles
// (next dev, next build seul), les photos sont servies telles quelles. Jamais par l'optimisation d'images de Vercel,
// dont le quota de l'offre gratuite (5 000 transformations par mois) ne suffit pas pour 1 300 photos.
const miniatures = fs.existsSync(path.join(__dirname, 'public', '_thumbs'));

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: miniatures ? { loader: 'custom', loaderFile: './lib/image-loader.ts' } : { unoptimized: true },
    // Ancienne adresse du simulateur, encore citée dans des liens partagés
    async redirects() {
        return [{ source: '/simulation/starting', destination: '/simulation', permanent: true }];
    },
    async rewrites() {
        return [
            {
                
                source: '/api/:path*',
                destination: `${process.env.BACKEND_URL || 'http://localhost:5001'}/:path*`,
            },
        ];
    },
};

module.exports = nextConfig;
