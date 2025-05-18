import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Blocks,
  ChevronsUpDown,
  FileClock,
  GraduationCap,
  Layout,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  MessagesSquare,
  Plus,
  Settings,
  UserCircle,
  UserCog,
  UserSearch,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const sidebarVariants = {
  open: {
    width: "15rem",
  },
  closed: {
    width: "3.05rem",
  },
};

const contentVariants = {
  open: { display: "block", opacity: 1 },
  closed: { display: "block", opacity: 1 },
};

const variants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      x: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    x: -20,
    opacity: 0,
    transition: {
      x: { stiffness: 100 },
    },
  },
};

const transitionProps = {
  type: "tween",
  ease: "easeOut",
  duration: 0.2,
  staggerChildren: 0.1,
};

const staggerVariants = {
  open: {
    transition: { staggerChildren: 0.03, delayChildren: 0.02 },
  },
};

export function SessionNavBar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation();
  return (
    <motion.div
      className={cn(
        "sidebar fixed left-0 z-40 h-full shrink-0 border-r border-border bg-sidebar text-sidebar-foreground"
      )}
      initial={isCollapsed ? "closed" : "open"}
      animate={isCollapsed ? "closed" : "open"}
      variants={sidebarVariants}
      transition={transitionProps}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <motion.div
        className={"relative z-40 flex text-muted-foreground h-full shrink-0 flex-col bg-sidebar transition-all"}
        variants={contentVariants}
      >
        <motion.ul variants={staggerVariants} className="flex h-full flex-col">
          <div className="flex grow flex-col items-center">
            <div className="flex h-[54px] w-full shrink-0 border-b border-border p-2">
              <div className="mt-[1.5px] flex w-full">
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger className="w-full" asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex w-fit items-center gap-2 px-2"
                    >
                      <Avatar className='rounded size-4'>
                        <AvatarFallback>O</AvatarFallback>
                      </Avatar>
                      <motion.li
                        variants={variants}
                        className="flex w-fit items-center gap-2"
                      >
                        {!isCollapsed && (
                          <>
                            <p className="text-sm font-medium">Organization</p>
                            <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
                          </>
                        )}
                      </motion.li>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem asChild className="flex items-center gap-2">
                      <Link to="/settings/members">
                        <UserCog className="h-4 w-4" /> Manage members
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="flex items-center gap-2">
                      <Link to="/settings/integrations">
                        <Blocks className="h-4 w-4" /> Integrations
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/select-org" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Create or join an organization
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="flex h-full w-full flex-col">
              <div className="flex grow flex-col gap-4">
                <ScrollArea className="h-16 grow p-2">
                  <div className={cn("flex w-full flex-col gap-1")}> 
                    <SidebarLink to="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />} label="Dashboard" isCollapsed={isCollapsed} active={location.pathname.includes("dashboard")} />
                    <SidebarLink to="/reports" icon={<FileClock className="h-4 w-4" />} label="Reports" isCollapsed={isCollapsed} active={location.pathname.includes("reports")} />
                    <SidebarLink to="/chat" icon={<MessagesSquare className="h-4 w-4" />} label="Chat" isCollapsed={isCollapsed} active={location.pathname.includes("chat")} badge="BETA" />
                    <Separator className="w-full" />
                    <SidebarLink to="/deals" icon={<Layout className="h-4 w-4" />} label="Deals" isCollapsed={isCollapsed} active={location.pathname.includes("deals")} />
                    <SidebarLink to="/accounts" icon={<UserCircle className="h-4 w-4" />} label="Accounts" isCollapsed={isCollapsed} active={location.pathname.includes("accounts")} />
                    <SidebarLink to="/competitors" icon={<UserSearch className="h-4 w-4" />} label="Competitors" isCollapsed={isCollapsed} active={location.pathname.includes("competitors")} />
                    <Separator className="w-full" />
                    <SidebarLink to="/library/knowledge" icon={<GraduationCap className="h-4 w-4" />} label="Knowledge Base" isCollapsed={isCollapsed} active={location.pathname.includes("library")} />
                    <SidebarLink to="/feedback" icon={<MessageSquareText className="h-4 w-4" />} label="Feedback" isCollapsed={isCollapsed} active={location.pathname.includes("feedback")} />
                    <SidebarLink to="/review" icon={<FileClock className="h-4 w-4" />} label="Document Review" isCollapsed={isCollapsed} active={location.pathname.includes("review")} />
                  </div>
                </ScrollArea>
              </div>
              <div className="flex flex-col p-2">
                <SidebarLink to="/settings/integrations" icon={<Settings className="h-4 w-4 shrink-0" />} label="Settings" isCollapsed={isCollapsed} active={location.pathname.includes("settings")} />
                <div>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger className="w-full">
                      <div className="flex h-8 w-full flex-row items-center gap-2 rounded-md px-2 py-1.5  transition hover:bg-muted hover:text-primary">
                        <Avatar className="size-4">
                          <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                        <motion.li
                          variants={variants}
                          className="flex w-full items-center gap-2"
                        >
                          {!isCollapsed && (
                            <>
                              <p className="text-sm font-medium">Account</p>
                              <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                            </>
                          )}
                        </motion.li>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent sideOffset={5}>
                      <div className="flex flex-row items-center gap-2 p-2">
                        <Avatar className="size-6">
                          <AvatarFallback>AL</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col text-left">
                          <span className="text-sm font-medium">Andrew Luo</span>
                          <span className="line-clamp-1 text-xs text-muted-foreground">andrew@usehindsight.com</span>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="flex items-center gap-2">
                        <Link to="/settings/profile">
                          <UserCircle className="h-4 w-4" /> Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <LogOut className="h-4 w-4" /> Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </motion.ul>
      </motion.div>
    </motion.div>
  );
}

function SidebarLink({ to, icon, label, isCollapsed, active, badge }: { to: string; icon: React.ReactNode; label: string; isCollapsed: boolean; active?: boolean; badge?: string }) {
  return (
    <Link
      to={to}
      className={cn(
        "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary",
        active && "bg-muted text-primary font-bold"
      )}
    >
      {icon}
      <motion.li variants={variants}>
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <p className="ml-2 text-sm font-medium">{label}</p>
            {badge && (
              <Badge className="flex h-fit w-fit items-center gap-1.5 rounded border-none bg-blue-50 px-1.5 text-blue-600 dark:bg-blue-700 dark:text-blue-300" variant="outline">
                {badge}
              </Badge>
            )}
          </div>
        )}
      </motion.li>
    </Link>
  );
} 