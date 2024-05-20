export async function rewrites() {
  return [
    {
      source: '/:path*',
      destination: 'http://localhost:3000/:path*',
    },
  ]
}
