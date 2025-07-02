'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalization } from '@/hooks/use-localization';
import { CheckCircle, Flag, Users, TrendingUp, BookOpen, ShieldCheck, Award, Handshake, Star } from 'lucide-react';
import Image from 'next/image';

const teamMembers = [
  { name: 'Maria Paula Aroca', role: 'mpa', image: 'https://placehold.co/400x400.png', hint: 'woman professional' },
  { name: 'Kanery Camargo', role: 'kc', image: 'https://placehold.co/400x400.png', hint: 'woman developer' },
  { name: 'Nicoll Fontalvo', role: 'nf', image: 'https://placehold.co/400x400.png', hint: 'woman engineer' },
];

export default function AboutPage() {
  const { t } = useLocalization();

  const values = [
    { icon: <Star className="h-6 w-6 text-accent" />, text: t('about.values.list.0') },
    { icon: <Handshake className="h-6 w-6 text-accent" />, text: t('about.values.list.1') },
    { icon: <ShieldCheck className="h-6 w-6 text-accent" />, text: t('about.values.list.2') },
    { icon: <Award className="h-6 w-6 text-accent" />, text: t('about.values.list.3') },
    { icon: <BookOpen className="h-6 w-6 text-accent" />, text: t('about.values.list.4') },
  ];

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-16 lg:py-20">
      <header className="text-center space-y-4">
        <h1 className="font-headline text-4xl font-bold tracking-tighter text-primary sm:text-5xl md:text-6xl">
          {t('about.title')}
        </h1>
        <p className="mx-auto max-w-3xl text-muted-foreground md:text-xl">
          {t('about.subtitle')}
        </p>
      </header>

      <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-6">
          <h2 className="font-headline text-3xl font-bold text-primary flex items-center gap-3"><Flag />{t('about.mission.title')}</h2>
          <p className="text-muted-foreground">{t('about.mission.text')}</p>
        </div>
        <div className="space-y-6">
          <h2 className="font-headline text-3xl font-bold text-primary flex items-center gap-3"><TrendingUp />{t('about.vision.title')}</h2>
          <p className="text-muted-foreground">{t('about.vision.text')}</p>
        </div>
      </div>

       <section className="mt-16">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl text-center text-primary flex items-center justify-center gap-3">
              <BookOpen /> {t('about.history.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center max-w-3xl mx-auto text-muted-foreground">{t('about.history.text')}</p>
          </CardContent>
        </Card>
      </section>

      <section className="mt-16 text-center">
        <h2 className="font-headline text-3xl font-bold text-primary flex items-center justify-center gap-3"><CheckCircle />{t('about.values.title')}</h2>
        <div className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
            {values.map((value, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
                {value.icon}
                <span className="font-medium">{value.text}</span>
            </div>
            ))}
        </div>
      </section>
      
      <section className="mt-20">
        <h2 className="text-center font-headline text-3xl font-bold text-primary flex items-center justify-center gap-3"><Users /> {t('about.team.title')}</h2>
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          {teamMembers.map((member) => (
            <Card key={member.name} className="text-center transition-shadow duration-300 hover:shadow-xl">
              <CardContent className="flex flex-col items-center p-6">
                <Avatar className="h-32 w-32 border-4 border-primary/20">
                  <AvatarImage src={member.image} alt={member.name} data-ai-hint={member.hint} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="mt-4 font-headline text-xl font-bold">{member.name}</h3>
                <p className="text-accent">{t(`about.team.members.${member.role}`)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
