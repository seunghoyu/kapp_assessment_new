import HeroCtaLink from "./HeroCtaLink";

export default function ConsumerAppHomePage() {
  return (
    <div className="grid grid-cols-[70%_30%] h-screen min-h-0 bg-gray-50">
      {/* 좌측 영역: 비디오 배경 + 텍스트, 뷰포트 전체 사용, 하단 정렬 */}
      <div className="relative h-full w-full min-h-0 min-w-0 overflow-hidden bg-gray-900">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden
        >
          <source src="/video/01.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" aria-hidden />
        <div className="relative z-10 flex flex-col justify-end h-full w-full pb-[100px] pl-12 pr-10">
          <div className="flex flex-col items-start text-left w-full max-w-2xl">
            <h1 className="text-5xl font-bold text-white leading-tight md:text-6xl [text-shadow:0_1px_3px_rgba(0,0,0,0.25)]">
              KAPP 역량 진단에
              <br />
              오신 것을 환영합니다.
            </h1>
            <p className="mt-8 text-xl text-white/90 leading-relaxed md:text-2xl md:mt-10 max-w-xl">
              AI 기반 맞춤형 역량 진단을 시작하여
              <br />
              나의 강점과 성장 포인트를 파악하세요.
            </p>
          </div>
        </div>
      </div>

      {/* 우측 영역: 기존 좌측 배경(gray-50) + CTA(텍스트 더 큼) */}
      <div className="flex items-center justify-center bg-gray-50">
        <HeroCtaLink />
      </div>
    </div>
  );
}
