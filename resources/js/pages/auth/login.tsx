import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    portal?: string;
};

export default function Login({ status, canResetPassword, portal }: Props) {
    const title = portal === 'admin'
        ? 'Admin Sign In'
        : portal === 'cashier'
        ? 'Cashier Sign In'
        : 'Log in to DMart';

    return (
        <>
            <Head title={title} />

            <div className="mb-4 text-center">
                <h1 className="text-xl font-bold tracking-tight text-foreground">{title}</h1>
                <p className="text-sm text-muted-foreground">
                    {portal === 'admin'
                        ? 'Administrative credentials required'
                        : portal === 'cashier'
                        ? 'Staff cashier credentials required'
                        : 'Enter your email and password below'}
                </p>
            </div>

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        {portal && <input type="hidden" name="portal" value={portal} />}

                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    {canResetPassword && !portal && (
                                        <TextLink
                                            href={request()}
                                            className="ml-auto text-sm"
                                            tabIndex={5}
                                        >
                                            Forgot your password?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label htmlFor="remember">Remember me</Label>
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                variant={portal === 'admin' ? 'default' : portal === 'cashier' ? 'default' : 'emerald'}
                                className="mt-2 w-full font-bold shadow-md"
                                tabIndex={4}
                                loading={processing}
                                loadingText="Signing in..."
                                data-test="login-button"
                            >
                                Log in
                            </Button>
                        </div>

                        {!portal && (
                            <div className="text-center text-sm text-muted-foreground">
                                Don't have an account?{' '}
                                <TextLink href={register()} tabIndex={5}>
                                    Sign up
                                </TextLink>
                            </div>
                        )}
                    </>
                )}
            </Form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </>
    );
}
