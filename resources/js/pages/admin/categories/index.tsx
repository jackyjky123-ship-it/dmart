import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Tags, Trash2, Edit } from 'lucide-react';
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
}

export default function AdminCategoriesIndex({ categories: initialCategories = [] }: CategoriesProps) {
    const [categories, setCategories] = useState(initialCategories);
    const [modalOpen, setModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const newCat = {
            id: Date.now(),
            name,
            slug,
            description,
            product_count: 0,
        };
        setCategories([...categories, newCat]);
        setModalOpen(false);
        setName('');
        setDescription('');
        toast.success(`Category "${name}" added successfully.`);
    };

    const handleDelete = (cat: Category) => {
        if (cat.product_count > 0) {
            toast.error(`Cannot delete category "${cat.name}" because it contains ${cat.product_count} products. Reassign products first.`);
            return;
        }
        setCategories(categories.filter((c) => c.id !== cat.id));
        toast.info(`Category "${cat.name}" deleted.`);
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

                <Button onClick={() => setModalOpen(true)} size="sm" className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl gap-1.5 shadow-sm text-xs">
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
                        {categories.map((cat) => (
                            <tr key={cat.id} className="hover:bg-muted/30 transition-colors">
                                <td className="p-3.5 font-bold text-foreground">
                                    <div className="flex items-center gap-2">
                                        <Tags className="w-4 h-4 text-purple-600" />
                                        <span>{cat.name}</span>
                                    </div>
                                </td>
                                <td className="p-3.5 font-mono text-muted-foreground">
                                    {cat.slug}
                                </td>
                                <td className="p-3.5 text-muted-foreground max-w-xs truncate">
                                    {cat.description}
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
                                        onClick={() => handleDelete(cat)}
                                        className="h-7 px-2 text-xs text-rose-600 hover:text-rose-700"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Category Modal */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="max-w-md p-6 space-y-4">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Tags className="w-5 h-5 text-purple-600" />
                            <span>Create New Category</span>
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="catName" className="text-xs">Category Name</Label>
                            <Input
                                id="catName"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Organic Dairy"
                                className="h-10 text-xs rounded-xl"
                            />
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
                        </div>

                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold">
                                Create Category
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
