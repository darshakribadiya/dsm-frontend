"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // ShadCN helper for class merging
import Link from "next/link";
import { usePathname } from "next/navigation";
import InviteUserDialog from "./invite-user-dialog";
import InvitationsSheet from "./invitations-sheet";

const tabs = [
  { label: "All", value: "all", href: "/dashboard/users" },
  { label: "Admin", value: "admin", href: "/dashboard/users/admin" },
  { label: "Faculty", value: "faculty", href: "/dashboard/users/faculty" },
  {
    label: "Rector",
    value: "hostel_staff",
    href: "/dashboard/users/hostel-staff",
  },
  { label: "General", value: "general", href: "/dashboard/users/general" },
  { label: "Student", value: "student", href: "/dashboard/users/student" },
  { label: "Parent", value: "parent", href: "/dashboard/users/parent" },
];

export default function NavTabs() {
  const pathname = usePathname();

  return (
    <div className="w-full border-b bg-background flex justify-between">
      <div className="flex w-full overflow-x-auto">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href ||
            (tab.value === "all" && pathname === "/users");

          return (
            <Link
              key={tab.value}
              href={tab.href}
              className={cn(
                "text-center px-4 py-3 text-sm font-semibold flex items-center justify-center gap-1",
                isActive
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
      <div className="flex gap-2">
        <InvitationsSheet />
        <InviteUserDialog />
      </div>
    </div>
  );
}
