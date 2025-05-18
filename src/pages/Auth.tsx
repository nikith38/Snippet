import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { Code, Github, Mail, Lock, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  
  const toggleMode = () => {
    setIsLogin(!isLogin);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isLogin) {
        // Handle login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
        
        toast({
          title: "Logged in successfully",
          description: "Welcome back to SnipStash!",
        });
        
        navigate('/dashboard');
      } else {
        // Handle signup
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username,
            }
          }
        });
        
        if (error) throw error;
        
        toast({
          title: "Account created successfully",
          description: "Welcome to SnipStash! Please check your email for verification.",
        });
        
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error?.message || "Please check your credentials and try again",
        variant: "destructive",
      });
      console.error("Auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24 bg-background">
        <div className="mx-auto w-full max-w-sm">
          <div className="flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-2">
              <Code className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold font-jetbrains">SnipStash</h1>
            </Link>
          </div>
          
          <h2 className="mt-6 text-2xl font-bold text-center font-jetbrains">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </h2>
          
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
            <span>{isLogin ? 'New to SnipStash?' : 'Already have an account?'}</span>
            <button 
              onClick={toggleMode}
              className="text-primary hover:underline font-medium"
            >
              {isLogin ? 'Create an account' : 'Sign in'}
            </button>
          </div>
          
          <div className="mt-8">
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-snippet-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <Label htmlFor="username" className="font-jetbrains">Username</Label>
                  <div className="mt-1 relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="username"
                      type="text"
                      autoComplete="username"
                      required={!isLogin}
                      className="pl-10 bg-snippet-code border-snippet-border"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}
              
              <div>
                <Label htmlFor="email" className="font-jetbrains">Email address</Label>
                <div className="mt-1 relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="pl-10 bg-snippet-code border-snippet-border"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="font-jetbrains">Password</Label>
                  {isLogin && (
                    <a href="#" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </a>
                  )}
                </div>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    required
                    className="pl-10 bg-snippet-code border-snippet-border"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Switch id="remember-me" />
                    <Label htmlFor="remember-me" className="ml-2 text-sm text-muted-foreground">
                      Remember me
                    </Label>
                  </div>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                      ></circle>
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </span>
                ) : (
                  <span>{isLogin ? 'Sign in' : 'Create account'}</span>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Right side - Background */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary opacity-90"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="relative flex flex-col justify-center items-center h-full p-12 text-white">
          <div className="mb-6">
            <Code className="h-16 w-16" />
          </div>
          <h2 className="text-3xl font-bold mb-6 font-jetbrains text-center">
            Collect code that matters.<br />Find it when you need it.
          </h2>
          <p className="text-lg text-white/80 text-center max-w-md">
            SnipStash helps you organize and find your most useful code snippets with smart auto-categorization.
          </p>
          
          <div className="grid grid-cols-2 gap-6 mt-12 max-w-lg w-full">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold mb-1">Auto-tagging</div>
              <p className="text-white/70">Automatic detection of code patterns</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold mb-1">Syntax Highlight</div>
              <p className="text-white/70">Beautiful code highlighting for readability</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold mb-1">Smart Search</div>
              <p className="text-white/70">Find your snippets instantly</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold mb-1">Organization</div>
              <p className="text-white/70">Keep your code library neat and tidy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
