import {
  LayoutDashboard,
  Package,
  Boxes,
  Tag,
  ShoppingCart,
  Users,
  Settings,
  User,
  CreditCard,
  Palette,
  Bell,
  Monitor,
  HelpCircle,
} from 'lucide-react';
import { SidebarData } from '../types';

export const sidebarData: SidebarData = {
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Products',
          url: '/product',
          icon: Package,
        },
        {
          title: 'Category',
          url: '/category',
          icon: Boxes,
        },
        {
          title: 'Brand',
          url: '/brand',
          icon: Tag,
        },
        {
          title: 'Order History',
          url: '/history',
          icon: ShoppingCart,
        },
        {
          title: 'Users',
          url: '/users',
          icon: Users,
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: Settings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: User,
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: CreditCard,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: Palette,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: Bell,
            },
            {
              title: 'Display',
              url: '/settings/display',
              icon: Monitor,
            },
          ],
        },
        {
          title: 'Help Center',
          url: '/help-center',
          icon: HelpCircle,
        },
      ],
    },
  ],
};

export default sidebarData;
