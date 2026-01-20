import React, { ReactNode } from 'react'
import { Button } from '../ui/button'
import { Github } from 'lucide-react'

interface IProps {
  leftNode?: ReactNode
}
export function Header(props: IProps) {
  return (
    <div className="fixed left-0 top-0 flex w-full items-center justify-between border bg-slate-50/80 px-4 py-4 backdrop-blur md:px-12">
      <a href="/" className="text-xs font-semibold text-slate-800 md:text-base">
        医生评价系统 Demo
      </a>
      <div className="flex items-center gap-3">
        {props.leftNode}
        <Button size="icon" asChild className="rounded-full" title="查看 GitHub 仓库">
          <a
            href="https://github.com/chengjunjian2020/react-web-starter"
            target="_blank"
            rel="noreferrer"
          >
            <Github className="h-5 w-5" />
          </a>
        </Button>
      </div>
    </div>
  )
}
