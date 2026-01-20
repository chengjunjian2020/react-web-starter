import { Rocket, Globe2, Wrench, Zap } from 'lucide-react'
import { Button } from '../ui/button'

export const Hero = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-lime-300 to-lime-500">
      <section className="w-full py-32 md:py-48">
        <div className="container px-4 md:px-6">
          <div className="grid items-center gap-6">
            <div className="flex flex-col justify-center space-y-4 text-center">
              <div className="mb-24">
                <h1 className="mb-6 text-3xl font-bold tracking-tighter text-transparent text-white sm:text-5xl xl:text-6xl/none">
                  专业医生评价系统 Demo
                </h1>
                <Button className="font-semiboldn gap-3 py-6 text-lg" size={'lg'} asChild>
                  <a href="https://github.com/Quilljou/vite-react-ts-tailwind-starter">
                    <Zap />
                    查看脚手架源码
                  </a>
                </Button>
              </div>
              <div className="mx-auto w-full max-w-full space-y-4">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                  <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
                    <div className="rounded-full bg-black p-4 text-white">
                      <Rocket size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">现代技术栈</h2>
                    <p className="text-white">基于 React / Vite / Tailwind 打造的医生评价前端页面。</p>
                  </div>
                  <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
                    <div className="rounded-full bg-black p-4 text-white">
                      <Globe2 size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">高仿真实场景</h2>
                    <p className="text-white">包含医生列表、详情页、评价弹窗等完整就医评价流程。</p>
                  </div>
                  <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
                    <div className="rounded-full bg-black p-4 text-white">
                      <Wrench size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">工程化支持</h2>
                    <p className="text-white">内置 TypeScript、ESLint、Tailwind 等工程化配置，方便继续拓展。</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
