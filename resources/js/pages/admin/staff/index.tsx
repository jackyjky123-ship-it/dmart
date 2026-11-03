import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { StatusBadge } from '@/components/status-badge';
import { useTranslation } from '@/hooks/use-translation';
import {
    Users,
    Plus,
    KeyRound,
    UserCheck,
    UserX,
    Shield,
    Terminal,
} from 'lucide-react';
import { toast } from 'sonner';

interface StaffMember {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
    created_at: string;
}

interface StaffProps {
    staff?: StaffMember[];
}

export default function AdminStaffIndex({
    staff: initialStaff = [],
}: StaffProps) {
    const { t } = useTranslation();
    const [staffList, setStaffList] = useState(initialStaff);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [pwdModalOpen, setPwdModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<StaffMember | null>(null);

    // New staff form
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('cashier');
    const [newPassword, setNewPassword] = useState('password');

    const handleCreateStaff = (e: React.FormEvent) => {
        e.preventDefault();
        const newStaff: StaffMember = {
            id: Date.now(),
            name,
            email,
            role,
            is_active: true,
            created_at: new Date().toISOString().split('T')[0],
        };
        setStaffList([...staffList, newStaff]);
        setCreateModalOpen(false);
        setName('');
        setEmail('');
        toast.success(
            t('Staff member ":name" created with role :role', {
                name,
                role: role.toUpperCase(),
            }),
        );
    };

    const toggleStatus = (user: StaffMember) => {
        if (user.id === 1) {
            toast.error(
                t('You cannot deactivate your own administrative account.'),
            );
            return;
        }

        setStaffList(
            staffList.map((u) =>
                u.id === user.id ? { ...u, is_active: !u.is_active } : u,
            ),
        );
        toast.info(
            t('Account status for :name changed to :status', {
                name: user.name,
                status: !user.is_active ? t('ACTIVE') : t('INACTIVE'),
            }),
        );
    };

    const handleResetPassword = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success(
            t('Password for :name reset successfully.', {
                name: selectedUser?.name || '',
            }),
        );
        setPwdModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <Head title={t('Staff Accounts — DMart Admin')} />

            <div className="flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                        {t('Staff & Team Access')}
                    </h1>
                    <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                        {t(
                            'Manage cashier accounts for the POS register and administrative store managers',
                        )}
                    </p>
                </div>

                <Button
                    onClick={() => setCreateModalOpen(true)}
                    size="sm"
                    className="gap-1.5 rounded-xl bg-purple-600 text-xs text-white shadow-sm hover:bg-purple-700"
                >
                    <Plus className="h-4 w-4" />
                    <span>{t('Create Staff Account')}</span>
                </Button>
            </div>

            {/* Staff Table */}
            <div className="overflow-hidden rounded-2xl border bg-card shadow-xs">
                <table className="w-full text-left text-xs">
                    <thead className="border-b bg-muted/40 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                        <tr>
                            <th className="p-3.5">{t('Staff Member')}</th>
                            <th className="p-3.5">{t('Assigned Role')}</th>
                            <th className="p-3.5">{t('Account Status')}</th>
                            <th className="p-3.5">{t('Created Date')}</th>
                            <th className="p-3.5 text-right">{t('Actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {staffList.map((user) => (
                            <tr
                                key={user.id}
                                className="transition-colors hover:bg-muted/30"
                            >
                                <td className="p-3.5">
                                    <div className="font-semibold text-foreground">
                                        {user.name}
                                    </div>
                                    <div className="font-mono text-[11px] text-muted-foreground">
                                        {user.email}
                                    </div>
                                </td>
                                <td className="p-3.5">
                                    <Badge
                                        variant="outline"
                                        className={`gap-1 py-0 text-[10px] font-bold uppercase ${
                                            user.role === 'admin'
                                                ? 'border-purple-300 bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                                                : 'border-blue-300 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                                        }`}
                                    >
                                        {user.role === 'admin' ? (
                                            <Shield className="h-3 w-3" />
                                        ) : (
                                            <Terminal className="h-3 w-3" />
                                        )}
                                        <span>{t(user.role)}</span>
                                    </Badge>
                                </td>
                                <td className="p-3.5">
                                    <StatusBadge
                                        status={
                                            user.is_active
                                                ? 'active'
                                                : 'inactive'
                                        }
                                    />
                                </td>
                                <td className="p-3.5 text-muted-foreground">
                                    {user.created_at}
                                </td>
                                <td className="space-x-1 p-3.5 text-right">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setPwdModalOpen(true);
                                        }}
                                        className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                                        title={t('Reset Password')}
                                    >
                                        <KeyRound className="mr-1 h-3.5 w-3.5" />
                                        <span>{t('Password')}</span>
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleStatus(user)}
                                        className={`h-7 px-2 text-xs ${
                                            user.is_active
                                                ? 'text-rose-600 hover:bg-rose-50 hover:text-rose-700'
                                                : 'text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700'
                                        }`}
                                    >
                                        {user.is_active
                                            ? t('Deactivate')
                                            : t('Activate')}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create Staff Modal */}
            <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
                <DialogContent className="max-w-md space-y-4 p-6">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-purple-600" />
                            <span>{t('Add New Staff Account')}</span>
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleCreateStaff} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="sName" className="text-xs">
                                {t('Full Name')}
                            </Label>
                            <Input
                                id="sName"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t('e.g. Sreymom Cashier')}
                                className="h-10 rounded-xl text-xs"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="sEmail" className="text-xs">
                                {t('Email Address')}
                            </Label>
                            <Input
                                id="sEmail"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t('e.g. sreymom@dmart.test')}
                                className="h-10 rounded-xl text-xs"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="sRole" className="text-xs">
                                {t('Role & Permissions')}
                            </Label>
                            <select
                                id="sRole"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="h-10 w-full rounded-xl border bg-background px-3 text-xs font-medium focus:ring-1 focus:ring-purple-500"
                            >
                                <option value="cashier">
                                    {t('Cashier (POS counter only)')}
                                </option>
                                <option value="admin">
                                    {t(
                                        'Admin (Full Back Office & Inventory Access)',
                                    )}
                                </option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="sPwd" className="text-xs">
                                {t('Default Password')}
                            </Label>
                            <Input
                                id="sPwd"
                                type="text"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="h-10 rounded-xl font-mono text-xs"
                            />
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setCreateModalOpen(false)}
                            >
                                {t('Cancel')}
                            </Button>
                            <Button
                                type="submit"
                                className="bg-purple-600 font-bold text-white hover:bg-purple-700"
                            >
                                {t('Create Account')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Password Reset Modal */}
            <Dialog open={pwdModalOpen} onOpenChange={setPwdModalOpen}>
                <DialogContent className="max-w-sm space-y-4 p-6">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <KeyRound className="h-5 w-5 text-purple-600" />
                            <span>{t('Reset Staff Password')}</span>
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div className="text-xs text-muted-foreground">
                            {t('Reset password for :name (:email).', {
                                name: selectedUser?.name || '',
                                email: selectedUser?.email || '',
                            })}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="rPwd" className="text-xs">
                                {t('New Temporary Password')}
                            </Label>
                            <Input
                                id="rPwd"
                                defaultValue="newpassword123"
                                className="h-10 rounded-xl font-mono text-xs"
                            />
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setPwdModalOpen(false)}
                            >
                                {t('Cancel')}
                            </Button>
                            <Button
                                type="submit"
                                className="bg-purple-600 font-bold text-white hover:bg-purple-700"
                            >
                                {t('Save Password')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
