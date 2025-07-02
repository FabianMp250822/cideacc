'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useLocalization } from '@/hooks/use-localization';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { t } = useLocalization();

  return (
    <div className="container mx-auto px-4 py-16 md:px-6 md:py-24 lg:py-32 animate-fade-in">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
            <div className="space-y-2">
                <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                    {t('admin.dashboard.title')}
                </h1>
                <p className="text-muted-foreground md:text-xl">
                    {t('admin.dashboard.subtitle')} {user?.email}
                </p>
            </div>
        </header>

        <div className="grid gap-8">
            <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="font-headline text-2xl">{t('admin.manage_posts.title')}</CardTitle>
                        <CardDescription>{t('admin.manage_posts.description')}</CardDescription>
                    </div>
                    <Button asChild>
                        <Link href="/admin/create-post">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            {t('admin.manage_posts.new_post')}
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg p-16 text-center border-dashed">
                        <p className="text-muted-foreground">{t('admin.manage_posts.no_posts')}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
