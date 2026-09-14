import { Form, Head } from '@inertiajs/react';

import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type Props = {
    passwordRules: string;
};

export default function AccountPassword({ passwordRules }: Props) {
    return (
        <>
            <Head title="পাসওয়ার্ড পরিবর্তন" />

            <div className="rounded-2xl border border-stone-100 bg-white p-5 sm:p-8">
                <h2 className="text-lg font-bold text-emerald-950">
                    পাসওয়ার্ড পরিবর্তন
                </h2>
                <p className="mt-1 text-sm text-stone-500">
                    আপনার অ্যাকাউন্ট সুরক্ষিত রাখতে একটি শক্তিশালী পাসওয়ার্ড ব্যবহার করুন।
                </p>

                <Form
                    {...SecurityController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    className="mt-6 max-w-lg space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="current_password">
                                    বর্তমান পাসওয়ার্ড
                                </Label>
                                <PasswordInput
                                    id="current_password"
                                    name="current_password"
                                    className="mt-1 block w-full"
                                    autoComplete="current-password"
                                    placeholder="বর্তমান পাসওয়ার্ড দিন"
                                />
                                <InputError message={errors.current_password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">নতুন পাসওয়ার্ড</Label>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    className="mt-1 block w-full"
                                    autoComplete="new-password"
                                    placeholder="নতুন পাসওয়ার্ড দিন"
                                    passwordrules={passwordRules}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    নতুন পাসওয়ার্ড নিশ্চিত করুন
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    className="mt-1 block w-full"
                                    autoComplete="new-password"
                                    placeholder="আবার নতুন পাসওয়ার্ড দিন"
                                    passwordrules={passwordRules}
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                disabled={processing}
                                data-test="account-update-password-button"
                                className="bg-emerald-600 hover:bg-emerald-700"
                            >
                                পাসওয়ার্ড পরিবর্তন করুন
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}
