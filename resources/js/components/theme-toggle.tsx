import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
    className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const { t } = useTranslation();
    const isDark = resolvedAppearance === 'dark';

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => updateAppearance(isDark ? 'light' : 'dark')}
            className={cn('rounded-lg', className)}
            title={t('Toggle appearance')}
            aria-label={t('Toggle appearance')}
            aria-pressed={isDark}
        >
            {isDark ? (
                <Sun className="h-4 w-4 text-amber-400" />
            ) : (
                <Moon className="h-4 w-4" />
            )}
        </Button>
    );
}

export default ThemeToggle;
