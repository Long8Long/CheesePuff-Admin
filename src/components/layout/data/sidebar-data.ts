import {
  Monitor,
  HelpCircle,
  Bell,
  Palette,
  Settings,
  Wrench,
  UserCog,
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
      title: 'General',
      items: [
        {
          title: '猫咪管理',
          url: '/cats',
          icon: Cat,
        },
      ],
    },
    {
      title: 'Other',
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
