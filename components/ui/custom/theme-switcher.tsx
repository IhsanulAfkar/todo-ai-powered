'use client';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';

import { ChevronsUpDown, Moon, Plus, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '../sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '../dropdown-menu';
const themes = [
  {
    name: 'light',
    logo: Sun,
  },
  {
    name: 'dark',
    logo: Moon,
  },
];

const ThemeSwitcher: NextPage = () => {
  const { isMobile } = useSidebar();
  const { theme, setTheme } = useTheme();
  console.log;
  const [activetheme, setActivetheme] = useState(
    themes.find((t) => t.name === theme),
  );
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    setTheme(activetheme?.name ?? 'light');
  }, [activetheme]);
  if (!isMounted || !activetheme) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <activetheme.logo className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Themes</span>
            <span className="truncate text-xs">{activetheme.name}</span>
          </div>
          <ChevronsUpDown className="ml-auto" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        align="start"
        side={isMobile ? 'bottom' : 'right'}
        sideOffset={4}
      >
        <DropdownMenuLabel className="text-muted-foreground text-xs">
          Themes
        </DropdownMenuLabel>
        {themes.map((theme, index) => (
          <DropdownMenuItem
            key={theme.name}
            onClick={() => setActivetheme(theme)}
            className="gap-2 p-2"
          >
            <div className="flex size-6 items-center justify-center rounded-sm border">
              <theme.logo className="size-4 shrink-0" />
            </div>
            {theme.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
