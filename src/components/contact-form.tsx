'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useLocalization } from '@/hooks/use-localization';
import { useState } from 'react';
import { sendContactMessage } from '@/lib/actions';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';

export function ContactForm() {
  const { toast } = useToast();
  const { t } = useLocalization();
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email.' }),
    message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
    privacy: z.boolean().refine(val => val === true, { message: 'You must accept the privacy policy.' }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
      privacy: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // Here you would typically send the form data to your backend
      await sendContactMessage(values);
      toast({
        title: t('contact.form.success_title'),
        description: t('contact.form.success_description'),
      });
      form.reset();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('contact.form.error_title'),
        description: t('contact.form.error_description'),
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
     <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">{t('contact.form.message')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contact.form.name')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('contact.form.name')} {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contact.form.email')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('contact.form.email')} {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contact.form.message')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('contact.form.message')}
                      className="min-h-[120px]"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="privacy"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        {t('contact.form.privacy')}
                      </FormLabel>
                       <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            <Button type="submit" className="w-full bg-accent-vibrant hover:bg-accent-vibrant/90 text-white" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? t('common.loading') : t('common.submit')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
