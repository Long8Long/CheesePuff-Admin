import {
  Settings,
  Cat,
  Command,
  BarChart3,
  Package,
  Heart,
  DollarSign,
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
      title: '数据统计',
      items: [
        {
          title: '数据统计',
          url: '/statistics',
          icon: BarChart3,
        },
      ],
    },
    {
      title: '猫舍管理',
      items: [
        {
          title: '猫咪管理',
          url: '/cats',
          icon: Cat,
        },
        {
          title: '库存管理',
          url: '/inventory',
          icon: Package,
        },
        {
          title: '育种管理',
          url: '/breeding',
          icon: Heart,
        },
      ],
    },
    {
      title: '财务',
      items: [
        {
          title: '财务统计',
          url: '/financial',
          icon: DollarSign,
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
