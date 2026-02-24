import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // 상위 폴더에 package-lock.json이 있으면 워크스페이스 루트를 잘못 인식하므로 명시
    root: path.resolve(__dirname),
  },
  // 네트워크 IP(10.10.9.112) 등에서 dev 접속 시 _next/* 리소스 cross-origin 허용
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://10.10.9.112:3000",
  ],
};

export default nextConfig;
