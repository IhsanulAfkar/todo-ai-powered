'use client';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';

import { ChevronsUpDown, Moon, Plus, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
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

const LandingThemeSwitcher: NextPage = () => {
  const { theme, setTheme } = useTheme();
  console.log;
  const [activeThemes, setactiveThemes] = useState(
    themes.find((t) => t.name === theme),
  );
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    setTheme(activeThemes?.name ?? 'light');
  }, [activeThemes]);
  if (!isMounted || !activeThemes) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
          <activeThemes.logo className="size-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        align="start"
        side={'bottom'}
        sideOffset={4}
      >
        <DropdownMenuLabel className="text-muted-foreground text-xs">
          Themes
        </DropdownMenuLabel>
        {themes.map((theme, index) => (
          <DropdownMenuItem
            key={theme.name}
            onClick={() => setactiveThemes(theme)}
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

export default LandingThemeSwitcher;
