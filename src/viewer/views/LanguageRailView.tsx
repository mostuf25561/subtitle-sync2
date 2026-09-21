import type { LanguageViewProps } from "../contracts";

/**
 * Alternative language view — "Language Rail" of quick-select chips.
 * Pure: renders injected LanguageOption[], marks selectedCode, emits onSelect.
 */
export function LanguageRailView({
  languages,
  selectedCode = null,
  disabled = false,
  onSelect,
  label,
}: LanguageViewProps & { label?: string }) {
  return (
    <div data-testid="language-rail" className="flex flex-wrap items-center gap-2">
      {label && (
        <span className="mr-1 text-[11px] uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
      )}
      {languages.map((lang) => {
        const isSelected = lang.code === selectedCode;
        const isDisabled = disabled || lang.enabled === false;
        return (
          <button
            key={lang.code}
            type="button"
            role="option"
            aria-selected={isSelected}
            disabled={isDisabled}
            data-lang={lang.code}
            onClick={() => onSelect(lang.code)}
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
              isSelected
                ? "border-accent bg-accent/20 text-accent-foreground"
                : "border-border bg-card/50 text-foreground/80 hover:border-accent/50"
            }`}
          >
            <span>{lang.name}</span>
            {lang.nativeName && lang.nativeName !== lang.name && (
              <span
                dir={lang.direction ?? "auto"}
                className="ms-2 text-xs text-muted-foreground"
              >
                {lang.nativeName}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
