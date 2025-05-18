
import React, { useState } from 'react';
import { ArrowRight, ArrowUp, Shield, List, Bug, Code, FileJson, Database, Terminal, Braces, Hash, Layers } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Import programming language icons
import { DiJavascript1, DiPython, DiRuby, DiJava, DiHtml5, DiCss3, DiReact, DiAngularSimple } from 'react-icons/di';
import { SiTypescript, SiPhp, SiC, SiNodedotjs, SiVuedotjs } from 'react-icons/si';

type TagPillProps = {
  name: string;
  type: 'auto' | 'user';
  isNew?: boolean;
  onClick?: () => void;
};

const getTagDescription = (name: string) => {
  const nameLower = name.toLowerCase();
  
  if (nameLower.includes('debug') || nameLower.includes('log')) {
    return "Contains debugging statements like console.log";
  }
  if (nameLower.includes('api') || nameLower.includes('fetch') || nameLower.includes('axios')) {
    return "Contains API or data fetching operations";
  }
  if (nameLower.includes('loop') || nameLower.includes('for') || nameLower.includes('while')) {
    return "Contains loop structures (for, while, forEach)";
  }
  if (nameLower.includes('error') || nameLower.includes('try') || nameLower.includes('catch')) {
    return "Contains error handling with try/catch";
  }
  if (nameLower.includes('array') || nameLower.includes('map') || nameLower.includes('filter')) {
    return "Contains array manipulation methods";
  }
  
  return null;
};

const getTagIcon = (name: string) => {
  const nameLower = name.toLowerCase();
  
  // Programming languages
  if (nameLower === 'javascript') {
    return <DiJavascript1 className="w-4 h-4 text-yellow-400" />;
  }
  if (nameLower === 'typescript') {
    return <SiTypescript className="w-4 h-4 text-blue-600" />;
  }
  if (nameLower === 'python') {
    return <DiPython className="w-4 h-4 text-blue-500" />;
  }
  if (nameLower === 'java') {
    return <DiJava className="w-4 h-4 text-red-500" />;
  }
  if (nameLower === 'html') {
    return <DiHtml5 className="w-4 h-4 text-orange-600" />;
  }
  if (nameLower === 'css') {
    return <DiCss3 className="w-4 h-4 text-blue-500" />;
  }
  if (nameLower === 'php') {
    return <SiPhp className="w-4 h-4 text-indigo-600" />;
  }
  if (nameLower === 'c') {
    return <SiC className="w-4 h-4 text-blue-800" />;
  }
  if (nameLower === 'react') {
    return <DiReact className="w-4 h-4 text-blue-400" />;
  }
  if (nameLower === 'node' || nameLower === 'nodejs') {
    return <SiNodedotjs className="w-4 h-4 text-green-600" />;
  }
  if (nameLower === 'vue' || nameLower === 'vuejs') {
    return <SiVuedotjs className="w-4 h-4 text-green-500" />;
  }
  if (nameLower === 'angular') {
    return <DiAngularSimple className="w-4 h-4 text-red-600" />;
  }
  
  // Programming concepts
  if (nameLower.includes('debug') || nameLower.includes('log')) {
    return <Bug className="w-3.5 h-3.5" />;
  }
  if (nameLower.includes('api') || nameLower.includes('fetch') || nameLower.includes('axios')) {
    return <ArrowRight className="w-3.5 h-3.5" />;
  }
  if (nameLower.includes('loop') || nameLower.includes('for') || nameLower.includes('while')) {
    return <ArrowUp className="w-3.5 h-3.5 animate-bounce" />; 
  }
  if (nameLower.includes('error') || nameLower.includes('try') || nameLower.includes('catch')) {
    return <Shield className="w-3.5 h-3.5" />;
  }
  if (nameLower.includes('array') || nameLower.includes('map') || nameLower.includes('filter')) {
    return <List className="w-3.5 h-3.5" />;
  }
  if (nameLower.includes('data') || nameLower.includes('struct')) {
    return <Database className="w-3.5 h-3.5" />;
  }
  if (nameLower.includes('json') || nameLower.includes('object')) {
    return <FileJson className="w-3.5 h-3.5" />;
  }
  if (nameLower.includes('function') || nameLower.includes('method')) {
    return <Code className="w-3.5 h-3.5" />;
  }
  if (nameLower.includes('terminal') || nameLower.includes('shell') || nameLower.includes('command')) {
    return <Terminal className="w-3.5 h-3.5" />;
  }
  if (nameLower.includes('conditional') || nameLower.includes('if') || nameLower.includes('switch')) {
    return <Braces className="w-3.5 h-3.5" />;
  }
  if (nameLower.includes('async') || nameLower.includes('promise') || nameLower.includes('await')) {
    return <Hash className="w-3.5 h-3.5" />;
  }
  if (nameLower.includes('component') || nameLower.includes('ui') || nameLower.includes('interface')) {
    return <Layers className="w-3.5 h-3.5" />;
  }
  
  return null;
};

const TagPill = ({ name, type, isNew = false, onClick }: TagPillProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const pillClass = type === 'auto' ? 'tag-pill-auto' : 'tag-pill-user';
  const icon = getTagIcon(name);
  const description = getTagDescription(name);
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span 
            className={`tag-pill ${pillClass} transition-all duration-200 hover:-translate-y-0.5
              ${isNew ? 'animate-tag-pulse' : ''}
              ${isHovering ? 'shadow-tag-glow' : ''}
              ${onClick ? 'cursor-pointer' : ''}`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={onClick}
          >
            {icon && 
              <span className={`transition-transform duration-300 inline-block ${isHovering && name.toLowerCase().includes('loop') ? 'rotate-180' : ''}`}>
                {icon}
              </span>
            }
            {name}
            {type === 'auto' && <span className="ml-1 opacity-50 text-[0.65rem]">•AI</span>}
          </span>
        </TooltipTrigger>
        {description && (
          <TooltipContent side="bottom" className="bg-snippet-bg border-snippet-border text-xs p-2">
            <p>{description}</p>
            {type === 'auto' && <p className="text-muted-foreground mt-1">Auto-detected by SnipStash</p>}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default TagPill;
