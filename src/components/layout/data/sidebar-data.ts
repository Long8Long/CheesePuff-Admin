import {
  // Monitor,
  // HelpCircle,
  // Bell,
  // Palette,
  Settings,
  // Wrench,
  // UserCog,
  Cat,
  Command,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Shadcn Admin',
      logo: Command,
      plan: 'Vite + ShadcnUI',
    },
  ],
  navGroups: [
    {
      title: '猫舍管理',
      items: [
        {
          title: '猫咪管理',
          url: '/cats',
          icon: Cat,
        },
      ],
    },
    {
      title: '设置',
      items: [
        {
          title: '设置',
          icon: Settings,
          url: '/settings'
        },
      ],
    },
  ],
}
