import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Tags, Trash2, Edit, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/use-translation';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    product_count: number;
}

interface CategoriesProps {
    categories?: Category[];
    errors?: Record<string, string>;
}

export default function AdminCategoriesIndex({ categories = [], errors = {} }: CategoriesProps) {
    const { t } = useTranslation();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const openCreateModal = () => {
        setEditingCategory(null);
        setName('');
        setSlug('');
        setDescription('');
        setModalOpen(true);
    };

    const openEditModal = (cat: Category) => {
        setEditingCategory(cat);
        setName(cat.name);
        setSlug(cat.slug);
        setDescription(cat.description || '');
        setModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        if (editingCategory) {
            router.patch(`/admin/categories/${editingCategory.id}`, {
                name,
                slug,
                description,
            }, {
                onSuccess: () => {
                    setModalOpen(false);
                    toast.success(t('Category ":name" updated.', { name }));
                },
                onError: (err) => {
                    const firstError = Object.values(err)[0];
                    toast.error(firstError || t('Failed to update category.'));
                },
                onFinish: () => setSubmitting(false),
            });
        } else {
            router.post('/admin/categories', {
                name,
                slug,
                description,
            }, {
                onSuccess: () => {
                    setModalOpen(false);
                    setName('');
                    setSlug('');
                    setDescription('');
                    toast.success(t('Category ":name" created.', { name }));
                },
                onError: (err) => {
                    const firstError = Object.values(err)[0];
                    toast.error(firstError || t('Failed to create category.'));
                },
                onFinish: () => setSubmitting(false),
            });
        }
    };

    const handleDelete = (cat: Category) => {
        if (cat.product_count > 0) {
            toast.error(t('Cannot delete category ":name" because it contains :count product(s). Reassign or delete products first.', { name: cat.name, count: cat.product_count }));
            return;
        }

        if (confirm(t('Are you sure you want to delete category ":name"?', { name: cat.name }))) {
            router.delete(`/admin/categories/${cat.id}`, {
                onSuccess: () => toast.success(t('Category ":name" deleted.', { name: cat.name })),
                onError: (err) => {
                    const firstError = Object.values(err)[0];
                    toast.error(firstError || t('Failed to delete category.'));
                },
            });
        }
    };

    return (
        <div className="space-y-6">
            <Head title={t('Categories Management — DMart Admin')} />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                        {t('Product Categories')}
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                        {t('Organize grocery departments across the storefront and POS terminal')}
                    </p>
                </div>

                <Button onClick={openCreateModal} size="sm" className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl gap-1.5 shadow-sm text-xs">
                    <Plus className="w-4 h-4" />
                    <span>{t('Add Category')}</span>
                </Button>
            </div>

            {/* Categories Table */}
            <div className="border rounded-2xl bg-card overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                    <thead className="bg-muted/40 border-b text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                        <tr>
                            <th className="p-3.5">{t('Category Name')}</th>
                            <th className="p-3.5">{t('Slug')}</th>
                            <th className="p-3.5">{t('Description')}</th>
                            <th className="p-3.5">{t('Products')}</th>
                            <th className="p-3.5 text-right">{t('Actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                    {t('No categories yet. Click "Add Category" above to create your first category.')}
                                </td>
                            </tr>
                        ) : (
                            categories.map((cat) => (
                                <tr key={cat.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="p-3.5 font-bold text-foreground">
                                        <div className="flex items-center gap-2">
                                            <Tags className="w-4 h-4 text-purple-600 shrink-0" />
                                            <span>{cat.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-3.5 font-mono text-muted-foreground">
                                        {cat.slug}
                                    </td>
                                    <td className="p-3.5 text-muted-foreground max-w-xs truncate">
                                        {cat.description || '—'}
                                    </td>
                                    <td className="p-3.5">
                                        <Badge variant="outline" className="text-[10px] py-0 font-semibold">
                                            {t(':count items', { count: cat.product_count })}
                                        </Badge>
                                    </td>
                                    <td className="p-3.5 text-right space-x-1">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openEditModal(cat)}
                                            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                                            title={t('Edit Category')}
                                        >
                                            <Edit className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(cat)}
                                            className="h-7 px-2 text-xs text-rose-600 hover:text-rose-700"
                                            title={t('Delete Category')}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Category Create/Edit Modal */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="max-w-md p-6 space-y-4">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Tags className="w-5 h-5 text-purple-600" />
                            <span>{editingCategory ? t('Edit Category') : t('Create New Category')}</span>
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="catName" className="text-xs">{t('Category Name')}</Label>
                            <Input
                                id="catName"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t('e.g. Fresh Produce')}
                                className="h-10 text-xs rounded-xl"
                            />
                            {errors.name && <p className="text-xs text-rose-600">{errors.name}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="catSlug" className="text-xs">{t('Slug (Optional, auto-generated)')}</Label>
                            <Input
                                id="catSlug"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder={t('e.g. fresh-produce')}
                                className="h-10 text-xs rounded-xl font-mono"
                            />
                            {errors.slug && <p className="text-xs text-rose-600">{errors.slug}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="catDesc" className="text-xs">{t('Description')}</Label>
                            <Input
                                id="catDesc"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder={t('Brief summary of department items...')}
                                className="h-10 text-xs rounded-xl"
                            />
                            {errors.description && <p className="text-xs text-rose-600">{errors.description}</p>}
                        </div>

                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setModalOpen(false)} disabled={submitting}>
                                {t('Cancel')}
                            </Button>
                            <Button type="submit" disabled={submitting} className="bg-purple-600 hover:bg-purple-700 text-white font-bold">
                                {submitting ? t('Saving...') : editingCategory ? t('Save Changes') : t('Create Category')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
