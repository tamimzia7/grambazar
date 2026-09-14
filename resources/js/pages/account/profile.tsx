import { Form, Head, usePage } from '@inertiajs/react';

import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Auth } from '@/types/auth';

type Props = {
    auth: Auth;
};

export default function AccountProfile() {
    const { auth } = usePage<Props>().props;

    return (
        <>
            <Head title="প্রোফাইল" />

            <div className="rounded-2xl border border-stone-100 bg-white p-5 sm:p-8">
                <h2 className="text-lg font-bold text-emerald-950">
                    প্রোফাইল তথ্য
                </h2>
                <p className="mt-1 text-sm text-stone-500">
                    আপনার নাম, মোবাইল নম্বর ও ইমেইল আপডেট করুন।
                </p>

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    className="mt-6 space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">নাম</Label>
                                <Input
                                    id="name"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.name}
                                    name="name"
                                    required
                                    autoComplete="name"
                                    placeholder="আপনার পুরো নাম"
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.name}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone">মোবাইল নম্বর</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.phone ?? ''}
                                    name="phone"
                                    placeholder="01XXXXXXXXX"
                                    inputMode="numeric"
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.phone}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">ইমেইল</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.email}
                                    name="email"
                                    required
                                    autoComplete="username"
                                    placeholder="email@example.com"
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.email}
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button
                                    disabled={processing}
                                    data-test="account-update-profile-button"
                                    className="bg-emerald-600 hover:bg-emerald-700"
                                >
                                    পরিবর্তন সংরক্ষণ করুন
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}
