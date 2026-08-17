import DataBadge from "./DataBadge";

type BrandHeaderProps = {
    title?: string;
    subtitle?: string;
    dataState?: "LIVE" | "DEMO" | "NO_DATA";
};

export default function BrandHeader({
    title = "DEMO VONDERK",
    subtitle = "Operational Intelligence Dashboard",
    dataState = "DEMO",
}: BrandHeaderProps) {
    return (
        <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    {subtitle}
                </p>
                <DataBadge state={dataState} />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {title}
            </h1>

            <p className="mt-1 text-[10px] text-muted-foreground">
                Powered by Datalytix Quest
            </p>
        </div>
    );
}