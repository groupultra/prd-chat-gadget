import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PRD 问答',
  description: 'PRD 文档智能问答助手',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-gray-100">{children}</body>
    </html>
  )
}
