'use client';

import Link from 'next/link';
import { LogOut, SunMoon } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuItem } from '@/components/ui/dropdown-menu';

export const UserAvatar = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[220px]">
        <DropdownMenuLabel>User Email</DropdownMenuLabel>
        <Link href="/settings/appearance">
          <DropdownMenuItem className="cursor-pointer">
            <SunMoon size={18} /> <span>Appearance</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem className="cursor-pointer text-destructive">
          <LogOut size={18} /> <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
