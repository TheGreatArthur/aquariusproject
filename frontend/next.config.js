/** @type {import('next').NextConfig} */
const nextConfig = {
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
