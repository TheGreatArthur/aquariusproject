/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api',
                destination: process.env.BACKEND_URL,
            },
        ]
    },
}

module.exports = nextConfig
