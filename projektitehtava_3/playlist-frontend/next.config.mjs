export async function rewrites() {
  return [
    {
      source: '/:path*',
      destination: `${process.env.API_URI}/:path*`,
    },
  ]
}
