import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    return (
        <>
            <Head title="রেজিস্ট্রেশন" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">নাম</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="আপনার পুরো নাম"
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone">মোবাইল নম্বর</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    required
                                    tabIndex={2}
                                    autoComplete="tel"
                                    name="phone"
                                    placeholder="01XXXXXXXXX"
                                    inputMode="numeric"
                                />
                                <InputError message={errors.phone} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">ইমেইল</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={3}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">পাসওয়ার্ড</Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="পাসওয়ার্ড দিন"
                                    passwordrules={passwordRules}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    পাসওয়ার্ড নিশ্চিত করুন
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={5}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="আবার পাসওয়ার্ড দিন"
                                    passwordrules={passwordRules}
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={6}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                অ্যাকাউন্ট খুলুন
                            </Button>
                        </div>

                        <div className="text-muted-foreground text-center text-sm">
                            ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
                            <TextLink href={login()} tabIndex={7}>
                                লগইন করুন
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'নতুন অ্যাকাউন্ট খুলুন',
    description: 'নিচে আপনার তথ্য দিয়ে অ্যাকাউন্ট তৈরি করুন',
};
