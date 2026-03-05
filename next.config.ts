import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // 상위 폴더에 package-lock.json이 있으면 워크스페이스 루트를 잘못 인식하므로 명시
    root: path.resolve(__dirname),
  },
  // 네트워크 IP(10.10.9.112) 등에서 dev 접속 시 _next/* 리소스·HMR WebSocket cross-origin 허용
  // 프로토콜/포트 없이 호스트만 지정 (Next.js 검증 형식)
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "10.10.9.112",
  ],
};

export default nextConfig;
