import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // 상위 폴더에 package-lock.json이 있으면 워크스페이스 루트를 잘못 인식하므로 명시
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
