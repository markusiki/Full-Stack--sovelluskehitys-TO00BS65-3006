export async function rewrites() {
  return [
    {
      source: '/:path*',
      destination: `${process.env.REACT_APP_API_URI}/:path*`,
    },
  ]
}
