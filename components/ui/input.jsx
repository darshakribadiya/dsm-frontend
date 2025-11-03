import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { Label } from "./label";

function Input({
  className,
  type,
  label,
  error,
  icon,
  onIconClick,
  iconAtRight = false,
  ...props
}) {
  return (
    <div>
      {label && (
        <Label className="pb-2" htmlFor={label}>
          {label}
        </Label>
      )}

      <div className="relative">
        <input
          type={type}
          data-slot="input"
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            iconAtRight && icon && "pr-8",
            !iconAtRight && icon && "pl-8",
            className
          )}
          {...props}
        />

        {icon && (
          <IconButton
            icon={icon}
            onIconClick={onIconClick}
            iconAtRight={iconAtRight}
          />
        )}
      </div>

      {error && <p className="text-red-700 text-sm mt-1">{error.message}</p>}
    </div>
  );
}

function IconButton({ icon, onIconClick, iconAtRight, ariaLabel }) {
  return (
    <button
      type="button"
      onClick={onIconClick}
      className={cn(
        "absolute inset-y-0 flex items-center text-2xl",
        iconAtRight ? "right-2" : "left-2"
      )}
    >
      <Icon icon={icon} className="text-xl opacity-70" />
    </button>
  );
}

export { Input };
