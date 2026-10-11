/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // Les photos ne changent pas d'un déploiement à l'autre : garder les versions redimensionnées un mois
        // limite les transformations, comptées par Vercel (quota mensuel de l'offre gratuite)
        minimumCacheTTL: 2678400,
        // Repli si le quota est atteint : IMAGES_UNOPTIMIZED=1 sert les photos d'origine sans les redimensionner
        unoptimized: process.env.IMAGES_UNOPTIMIZED === '1',
    },
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
