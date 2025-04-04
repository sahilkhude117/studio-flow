
import React from 'react';
import { GitBranch, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type EmptyStateProps = {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
};

export const EmptyState = ({ title, description, buttonText, buttonLink }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-studio-50 p-4 rounded-full mb-4">
        <GitBranch className="h-8 w-8 text-studio-600" />
      </div>
      <h2 className="text-xl font-medium mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      <Button asChild>
        <Link href={buttonLink} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          {buttonText}
        </Link>
      </Button>
    </div>
  );
};
