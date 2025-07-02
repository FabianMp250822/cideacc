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
    { icon: <Star className="h-8 w-8 text-accent" />, text: t('about.values.list.0') },
    { icon: <Handshake className="h-8 w-8 text-accent" />, text: t('about.values.list.1') },
    { icon: <ShieldCheck className="h-8 w-8 text-accent" />, text: t('about.values.list.2') },
    { icon: <Award className="h-8 w-8 text-accent" />, text: t('about.values.list.3') },
    { icon: <BookOpen className="h-8 w-8 text-accent" />, text: t('about.values.list.4') },
  ];

  return (
    <div className="container mx-auto px-4 py-16 md:px-6 md:py-24 lg:py-32 animate-fade-in">
      <header className="text-center space-y-4">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
          {t('about.title')}
        </h1>
        <p className="mx-auto max-w-3xl text-muted-foreground md:text-xl">
          {t('about.subtitle')}
        </p>
      </header>

      <div className="mt-20 grid gap-16 lg:grid-cols-2 lg:gap-24">
        <div className="space-y-6">
          <h2 className="font-headline text-3xl font-bold text-primary flex items-center gap-3"><Flag className="text-accent"/>{t('about.mission.title')}</h2>
          <p className="text-muted-foreground text-lg">{t('about.mission.text')}</p>
        </div>
        <div className="space-y-6">
          <h2 className="font-headline text-3xl font-bold text-primary flex items-center gap-3"><TrendingUp className="text-accent"/>{t('about.vision.title')}</h2>
          <p className="text-muted-foreground text-lg">{t('about.vision.text')}</p>
        </div>
      </div>

       <section className="mt-24 bg-secondary py-20 rounded-xl">
         <div className="container mx-auto">
            <div className="text-center">
              <h2 className="font-headline text-3xl font-bold text-primary flex items-center justify-center gap-3">
                <BookOpen className="text-accent" /> {t('about.history.title')}
              </h2>
              <p className="text-center max-w-3xl mx-auto text-muted-foreground mt-4 text-lg">{t('about.history.text')}</p>
            </div>
         </div>
      </section>

      <section className="mt-24 text-center">
        <h2 className="font-headline text-3xl font-bold text-primary flex items-center justify-center gap-3"><CheckCircle className="text-accent" />{t('about.values.title')}</h2>
        <div className="mt-12 grid grid-cols-2 gap-y-10 gap-x-8 md:grid-cols-3 lg:grid-cols-5">
            {values.map((value, index) => (
            <div key={index} className="flex flex-col items-center gap-4">
                {value.icon}
                <span className="font-semibold text-lg">{value.text}</span>
            </div>
            ))}
        </div>
      </section>
      
      <section className="mt-24">
        <h2 className="text-center font-headline text-3xl font-bold text-primary flex items-center justify-center gap-3"><Users className="text-accent" /> {t('about.team.title')}</h2>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {teamMembers.map((member) => (
            <Card key={member.name} className="text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <CardContent className="flex flex-col items-center p-8">
                <Avatar className="h-32 w-32 border-4 border-accent/20">
                  <AvatarImage src={member.image} alt={member.name} data-ai-hint={member.hint} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="mt-5 font-headline text-2xl font-bold">{member.name}</h3>
                <p className="text-accent-vibrant font-semibold">{t(`about.team.members.${member.role}`)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
