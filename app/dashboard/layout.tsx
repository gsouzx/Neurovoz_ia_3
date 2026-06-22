'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain,
  LayoutDashboard,
  MessageCircle,
  Calendar,
  TrendingUp,
  Users,
  AlertTriangle,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { getGreeting } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: '#3AB7D6' },
  { href: '/dashboard/chat', icon: MessageCircle, label: 'Chat NeuroVoZ', color: '#8B6FE8', badge: 'IA' },
  { href: '/dashboard/rotina', icon: Calendar, label: 'Rotina', color: '#4ADE80' },
  { href: '/dashboard/evolucao', icon: TrendingUp, label: 'Evolução', color: '#FB923C' },
  { href: '/dashboard/social', icon: Users, label: 'Módulo Social', color: '#F472B6' },
  { href: '/dashboard/sos', icon: AlertTriangle, label: 'SOS Sensorial', color: '#F87171', emergency: true },
  { href: '/dashboard/tutor', icon: BookOpen, label: 'Modo Tutor', color: '#FBBF24' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { child, guardian, logout } = useAppStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #3AB7D6, #84D7C8)' }}
          >
            <Brain size={22} color="white" strokeWidth={1.8} />
          </div>
          <div>
            <div className="font-display font-black text-white text-base leading-none">NeuroVoZ</div>
            <div className="text-neurovoz-blue-light/60 text-xs font-semibold">I.A</div>
          </div>
        </div>
      </div>

      {/* Child Profile */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(58,183,214,0.1)' }}>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: 'rgba(58,183,214,0.15)', border: '2px solid rgba(58,183,214,0.3)' }}
          >
            {child?.avatarEmoji || '🌟'}
          </div>
          <div className="min-w-0">
            <div className="text-white font-semibold text-sm truncate">{child?.name || 'Perfil'}</div>
            <div className="text-neurovoz-blue-light/50 text-xs">Nível {child?.supportLevel || 2} de suporte</div>
          </div>
          <ChevronRight size={14} className="text-white/30 flex-shrink-0" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto no-scrollbar">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`sidebar-item ${isActive ? 'active' : ''} ${
                item.emergency ? 'border border-red-500/20 bg-red-500/5' : ''
              }`}
            >
              <item.icon
                size={18}
                style={{ color: isActive ? item.color : undefined }}
                strokeWidth={1.8}
              />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span
                  className="px-1.5 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: `${item.color}20`, color: item.color }}
                >
                  {item.badge}
                </span>
              )}
              {item.emergency && (
                <span className="px-1.5 py-0.5 rounded-full text-xs font-bold bg-red-500/20 text-red-400">
                  SOS
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-4 border-t border-white/10 space-y-1">
        <Link href="/dashboard/configuracoes" className="sidebar-item">
          <Settings size={18} strokeWidth={1.8} />
          <span>Configurações</span>
        </Link>
        <button onClick={handleLogout} className="sidebar-item w-full text-left text-red-400/70 hover:text-red-400">
          <LogOut size={18} strokeWidth={1.8} />
          <span>Sair</span>
        </button>
        <div className="px-4 pt-3">
          <div className="text-white/30 text-xs">
            {guardian?.name || 'Responsável'} • NeuroVoZ I.A
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-neurovoz-gray flex">
      {/* Desktop Sidebar */}
      <aside className="sidebar hidden lg:flex flex-col w-64">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-64 z-50 lg:hidden flex flex-col"
              style={{ background: 'linear-gradient(180deg, #1A2332 0%, #243040 100%)' }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white"
              >
                <X size={20} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0">
        {/* Top Bar */}
        <header
          className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b"
          style={{
            background: 'rgba(245,247,248,0.95)',
            backdropFilter: 'blur(12px)',
            borderColor: 'rgba(58,183,214,0.1)',
          }}
        >
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-white/80 transition-colors"
            >
              <Menu size={20} className="text-neurovoz-dark" />
            </button>
            <div>
              <div className="font-display font-bold text-neurovoz-dark text-base">
                {getGreeting()}, {guardian?.name?.split(' ')[0] || 'bem-vindo'}! 👋
              </div>
              <div className="text-neurovoz-dark/40 text-xs">
                Acompanhando {child?.name || 'a criança'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* SOS Quick Button */}
            <Link
              href="/dashboard/sos"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #F87171, #FB923C)', boxShadow: '0 4px 12px rgba(248,113,113,0.3)' }}
            >
              <AlertTriangle size={12} />
              SOS
            </Link>

            {/* Notification */}
            <button className="relative p-2 rounded-xl hover:bg-white/80 transition-colors">
              <Bell size={20} className="text-neurovoz-dark/60" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-neurovoz-turquoise" />
            </button>

            {/* Avatar */}
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-lg cursor-pointer hover:scale-105 transition-transform"
              style={{ background: 'linear-gradient(135deg, rgba(58,183,214,0.15), rgba(132,215,200,0.15))', border: '2px solid rgba(58,183,214,0.3)' }}
            >
              {child?.avatarEmoji || '🌟'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
