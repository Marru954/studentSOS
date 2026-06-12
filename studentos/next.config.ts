import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // node-saml è server-only (xml-crypto, xmldom): non va impacchettato dal bundler
  serverExternalPackages: ["@node-saml/node-saml"],
};

export default nextConfig;
