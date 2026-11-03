import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
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

export default function AdminStaffIndex({ staff: initialStaff = [] }: StaffProps) {
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
        toast.success(t('Staff member ":name" created with role :role', { name, role: role.toUpperCase() }));
    };

    const toggleStatus = (user: StaffMember) => {
        if (user.id === 1) {
            toast.error(t('You cannot deactivate your own administrative account.'));
            return;
        }

        setStaffList(
            staffList.map((u) => (u.id === user.id ? { ...u, is_active: !u.is_active } : u))
        );
        toast.info(t('Account status for :name changed to :status', { name: user.name, status: !user.is_active ? t('ACTIVE') : t('INACTIVE') }));
    };

    const handleResetPassword = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success(t('Password for :name reset successfully.', { name: selectedUser?.name || '' }));
        setPwdModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <Head title={t('Staff Accounts — DMart Admin')} />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                        {t('Staff & Team Access')}
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                        {t('Manage cashier accounts for the POS register and administrative store managers')}
                    </p>
                </div>

                <Button
                    onClick={() => setCreateModalOpen(true)}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl gap-1.5 shadow-sm text-xs"
                >
                    <Plus className="w-4 h-4" />
                    <span>{t('Create Staff Account')}</span>
                </Button>
            </div>

            {/* Staff Table */}
            <div className="border rounded-2xl bg-card overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                    <thead className="bg-muted/40 border-b text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
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
                            <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                                <td className="p-3.5">
                                    <div className="font-semibold text-foreground">{user.name}</div>
                                    <div className="text-[11px] font-mono text-muted-foreground">{user.email}</div>
                                </td>
                                <td className="p-3.5">
                                    <Badge
                                        variant="outline"
                                        className={`text-[10px] uppercase font-bold gap-1 py-0 ${
                                            user.role === 'admin'
                                                ? 'bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-950 dark:text-purple-300'
                                                : 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950 dark:text-blue-300'
                                        }`}
                                    >
                                        {user.role === 'admin' ? (
                                            <Shield className="w-3 h-3" />
                                        ) : (
                                            <Terminal className="w-3 h-3" />
                                        )}
                                        <span>{t(user.role)}</span>
                                    </Badge>
                                </td>
                                <td className="p-3.5">
                                    <StatusBadge status={user.is_active ? 'active' : 'inactive'} />
                                </td>
                                <td className="p-3.5 text-muted-foreground">
                                    {user.created_at}
                                </td>
                                <td className="p-3.5 text-right space-x-1">
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
                                        <KeyRound className="w-3.5 h-3.5 mr-1" />
                                        <span>{t('Password')}</span>
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleStatus(user)}
                                        className={`h-7 px-2 text-xs ${
                                            user.is_active
                                                ? 'text-rose-600 hover:text-rose-700 hover:bg-rose-50'
                                                : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'
                                        }`}
                                    >
                                        {user.is_active ? t('Deactivate') : t('Activate')}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create Staff Modal */}
            <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
                <DialogContent className="max-w-md p-6 space-y-4">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-purple-600" />
                            <span>{t('Add New Staff Account')}</span>
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleCreateStaff} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="sName" className="text-xs">{t('Full Name')}</Label>
                            <Input
                                id="sName"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t('e.g. Sreymom Cashier')}
                                className="h-10 text-xs rounded-xl"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="sEmail" className="text-xs">{t('Email Address')}</Label>
                            <Input
                                id="sEmail"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t('e.g. sreymom@dmart.test')}
                                className="h-10 text-xs rounded-xl"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="sRole" className="text-xs">{t('Role & Permissions')}</Label>
                            <select
                                id="sRole"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full h-10 px-3 bg-background border rounded-xl text-xs font-medium focus:ring-1 focus:ring-purple-500"
                            >
                                <option value="cashier">{t('Cashier (POS counter only)')}</option>
                                <option value="admin">{t('Admin (Full Back Office & Inventory Access)')}</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="sPwd" className="text-xs">{t('Default Password')}</Label>
                            <Input
                                id="sPwd"
                                type="text"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="h-10 text-xs rounded-xl font-mono"
                            />
                        </div>

                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>
                                {t('Cancel')}
                            </Button>
                            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold">
                                {t('Create Account')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Password Reset Modal */}
            <Dialog open={pwdModalOpen} onOpenChange={setPwdModalOpen}>
                <DialogContent className="max-w-sm p-6 space-y-4">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <KeyRound className="w-5 h-5 text-purple-600" />
                            <span>{t('Reset Staff Password')}</span>
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div className="text-xs text-muted-foreground">
                            {t('Reset password for :name (:email).', { name: selectedUser?.name || '', email: selectedUser?.email || '' })}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="rPwd" className="text-xs">{t('New Temporary Password')}</Label>
                            <Input
                                id="rPwd"
                                defaultValue="newpassword123"
                                className="h-10 text-xs rounded-xl font-mono"
                            />
                        </div>

                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setPwdModalOpen(false)}>
                                {t('Cancel')}
                            </Button>
                            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold">
                                {t('Save Password')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
