import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure Next picks the correct project root (avoids the lockfile mis-detection warning)
  outputFileTracingRoot: __dirname,
  webpack: (config) => {
    // Map the '@' alias to the local 'src' directory so imports like '@/components/...'
    // resolve consistently in dev and build on Windows.
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname),
    };

    // Make sure common extensions are resolvable
    config.resolve.extensions = Array.from(new Set([
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
      ...(config.resolve.extensions || []),
    ]));

    return config;
  },
};

export default nextConfig;
