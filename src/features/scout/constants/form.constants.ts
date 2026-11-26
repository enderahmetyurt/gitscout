/**
 * Açılır seçimlerin tetikleyicisi (ülke, doğum tarihi, favori takım): girdi kutusuyla aynı yükseklik,
 * çerçeve, zemin ve sola dayalı yazı. Formda yan yana duran kutu ve seçimler aynı aileden görünsün.
 */
export const FIELD_TRIGGER_CLASS =
  "flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 text-left text-sm font-normal whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none hover:bg-muted/50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30 dark:hover:bg-input/50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
