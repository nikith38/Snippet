import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Code, Plus, LogOut, User, FolderPlus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { toast } from '@/hooks/use-toast';

type HeaderProps = {
  onCreateSnippet?: () => void;
  onCreateFolder?: () => void;
};

const Header = ({ 
  onCreateSnippet, 
  onCreateFolder
}: HeaderProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out"
      });
      navigate('/auth');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive"
      });
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-snippet-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-0 pt-0">
      <div className="container flex h-14 items-center">
        <Link to="/dashboard" className="flex items-center gap-2 mr-6">
          <Code className="h-6 w-6 text-primary" />
          <span className="hidden font-bold sm:inline-block font-jetbrains">SnipStash</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-4 lg:space-x-6 mr-6">
          <Link to="/dashboard" className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/dashboard' ? 'text-primary' : ''}`}>
            Dashboard
          </Link>
          <Link to="/snippets" className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/snippets' ? 'text-primary' : ''}`}>
            Snippets
          </Link>
          <Link to="/folders" className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/folders' ? 'text-primary' : ''}`}>
            Folders
          </Link>
        </nav>

        <div className="flex-1 flex items-center justify-end space-x-4">
          {/* Create Folder Button - Always visible */}
          <Button onClick={onCreateFolder || (() => {})} variant="outline" size="sm">
            <FolderPlus className="h-4 w-4 mr-2" />
            <span>New Folder</span>
          </Button>

          {/* Create Snippet Button */}
          {onCreateSnippet && (
            <Button onClick={onCreateSnippet} variant="default" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              <span>Create</span>
            </Button>
          )}

          {/* User Menu */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden md:block text-sm">
                {user.username || user.email}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  navigate('/dashboard');
                  // Use a small delay to ensure navigation completes before setting the tab
                  setTimeout(() => {
                    // Use custom event to communicate with Dashboard component
                    window.dispatchEvent(new CustomEvent('setActiveTab', { detail: { tab: 'profile' } }));
                  }, 100);
                }}
                title="My Profile"
                className="mr-1"
              >
                <User className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title="Log Out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button asChild size="sm">
              <Link to="/auth">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
