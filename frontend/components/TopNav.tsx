import Link from "next/link";

const links = [
    { href: "/", label: "Home" },
    { href: "/sales", label: "Ventas" },
    { href: "/inventory", label: "Inventario" },
    { href: "/finance", label: "CxC" },
    { href: "/insights", label: "Insights" },
];

export default function TopNav() {
    return (
        <nav className="mb-4 flex items-center gap-1 rounded-xl border border-border bg-card p-1.5 shadow-sm">
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                    {link.label}
                </Link>
            ))}
        </nav>
    );
}