import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Tags, Trash2, Edit, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

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
                    toast.success(`Category "${name}" updated.`);
                },
                onError: (err) => {
                    const firstError = Object.values(err)[0];
                    toast.error(firstError || 'Failed to update category.');
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
                    toast.success(`Category "${name}" created.`);
                },
                onError: (err) => {
                    const firstError = Object.values(err)[0];
                    toast.error(firstError || 'Failed to create category.');
                },
                onFinish: () => setSubmitting(false),
            });
        }
    };

    const handleDelete = (cat: Category) => {
        if (cat.product_count > 0) {
            toast.error(`Cannot delete category "${cat.name}" because it contains ${cat.product_count} product(s). Reassign or delete products first.`);
            return;
        }

        if (confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
            router.delete(`/admin/categories/${cat.id}`, {
                onSuccess: () => toast.success(`Category "${cat.name}" deleted.`),
                onError: (err) => {
                    const firstError = Object.values(err)[0];
                    toast.error(firstError || 'Failed to delete category.');
                },
            });
        }
    };

    return (
        <div className="space-y-6">
            <Head title="Categories Management — DMart Admin" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                        Product Categories
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                        Organize grocery departments across the storefront and POS terminal
                    </p>
                </div>

                <Button onClick={openCreateModal} size="sm" className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl gap-1.5 shadow-sm text-xs">
                    <Plus className="w-4 h-4" />
                    <span>Add Category</span>
                </Button>
            </div>

            {/* Categories Table */}
            <div className="border rounded-2xl bg-card overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                    <thead className="bg-muted/40 border-b text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                        <tr>
                            <th className="p-3.5">Category Name</th>
                            <th className="p-3.5">Slug</th>
                            <th className="p-3.5">Description</th>
                            <th className="p-3.5">Products</th>
                            <th className="p-3.5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                    No categories yet. Click "Add Category" above to create your first category.
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
                                            {cat.product_count} items
                                        </Badge>
                                    </td>
                                    <td className="p-3.5 text-right space-x-1">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openEditModal(cat)}
                                            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                                            title="Edit Category"
                                        >
                                            <Edit className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(cat)}
                                            className="h-7 px-2 text-xs text-rose-600 hover:text-rose-700"
                                            title="Delete Category"
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
                            <span>{editingCategory ? 'Edit Category' : 'Create New Category'}</span>
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="catName" className="text-xs">Category Name</Label>
                            <Input
                                id="catName"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Fresh Produce"
                                className="h-10 text-xs rounded-xl"
                            />
                            {errors.name && <p className="text-xs text-rose-600">{errors.name}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="catSlug" className="text-xs">Slug (Optional, auto-generated)</Label>
                            <Input
                                id="catSlug"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder="e.g. fresh-produce"
                                className="h-10 text-xs rounded-xl font-mono"
                            />
                            {errors.slug && <p className="text-xs text-rose-600">{errors.slug}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="catDesc" className="text-xs">Description</Label>
                            <Input
                                id="catDesc"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Brief summary of department items..."
                                className="h-10 text-xs rounded-xl"
                            />
                            {errors.description && <p className="text-xs text-rose-600">{errors.description}</p>}
                        </div>

                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setModalOpen(false)} disabled={submitting}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitting} className="bg-purple-600 hover:bg-purple-700 text-white font-bold">
                                {submitting ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Category'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
