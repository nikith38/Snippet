
import React from 'react';
// Import icons from react-icons
import { DiJavascript1, DiPython, DiRuby, DiJava, DiHtml5, DiCss3, DiReact, DiAngularSimple, DiGo, DiSwift, DiRust, DiDotnet } from 'react-icons/di';
import { SiTypescript, SiPhp, SiKotlin, SiDart, SiCplusplus, SiC, SiNodedotjs, SiVuedotjs } from 'react-icons/si';
import { VscCode } from 'react-icons/vsc';

type LanguageBadgeProps = {
  language: string;
};

const getLangColor = (lang: string): string => {
  const langLower = lang.toLowerCase();
  
  switch(langLower) {
    case 'javascript':
      return 'bg-lang-js text-gray-900';
    case 'typescript':
      return 'bg-lang-ts text-white';
    case 'python':
      return 'bg-lang-py text-white';
    case 'html':
      return 'bg-lang-html text-white';
    case 'css':
      return 'bg-lang-css text-white';
    case 'ruby':
      return 'bg-lang-ruby text-white';
    case 'go':
      return 'bg-lang-go text-white';
    case 'java':
      return 'bg-lang-java text-white';
    case 'c#':
      return 'bg-lang-csharp text-white';
    case 'php':
      return 'bg-lang-php text-white';
    case 'swift':
      return 'bg-lang-swift text-white';
    case 'rust':
      return 'bg-lang-rust text-white';
    default:
      return 'bg-gray-700 text-white';
  }
};

// Function to get the appropriate icon component based on language
const getLanguageIcon = (lang: string) => {
  const langLower = lang.toLowerCase();
  
  switch(langLower) {
    case 'javascript':
      return <DiJavascript1 className="w-7 h-7 text-yellow-400" />;
    case 'typescript':
      return <SiTypescript className="w-7 h-7 text-blue-600" />;
    case 'python':
      return <DiPython className="w-7 h-7 text-blue-500" />;
    case 'html':
    case 'html5':
      return <DiHtml5 className="w-7 h-7 text-orange-600" />;
    case 'css':
    case 'css3':
      return <DiCss3 className="w-7 h-7 text-blue-500" />;
    case 'ruby':
      return <DiRuby className="w-7 h-7 text-red-600" />;
    case 'go':
      return <DiGo className="w-7 h-7 text-blue-400" />;
    case 'java':
      return <DiJava className="w-7 h-7 text-red-500" />;
    case 'c#':
    case 'csharp':
      return <DiDotnet className="w-7 h-7 text-purple-600" />;
    case 'php':
      return <SiPhp className="w-7 h-7 text-indigo-600" />;
    case 'swift':
      return <DiSwift className="w-7 h-7 text-orange-500" />;
    case 'rust':
      return <DiRust className="w-7 h-7 text-orange-700" />;
    case 'c++':
    case 'cplusplus':
      return <SiCplusplus className="w-7 h-7 text-blue-700" />;
    case 'c':
      return <SiC className="w-7 h-7 text-blue-800" />;
    case 'kotlin':
      return <SiKotlin className="w-7 h-7 text-purple-500" />;
    case 'dart':
      return <SiDart className="w-7 h-7 text-blue-400" />;
    case 'react':
      return <DiReact className="w-7 h-7 text-blue-400" />;
    case 'vue':
    case 'vuejs':
      return <SiVuedotjs className="w-7 h-7 text-green-500" />;
    case 'angular':
    case 'angularjs':
      return <DiAngularSimple className="w-7 h-7 text-red-600" />;
    case 'node':
    case 'nodejs':
      return <SiNodedotjs className="w-7 h-7 text-green-600" />;
    default:
      return <VscCode className="w-7 h-7 text-gray-500" />;
  }
};

// Fallback function in case the icon is not available
const getLangIcon = (lang: string): string => {
  const langLower = lang.toLowerCase();
  
  switch(langLower) {
    case 'javascript':
      return 'JS';
    case 'typescript':
      return 'TS';
    case 'python':
      return 'PY';
    case 'html':
      return 'HTML';
    case 'css':
      return 'CSS';
    case 'ruby':
      return 'RB';
    case 'go':
      return 'GO';
    case 'java':
      return 'JAVA';
    case 'c#':
      return 'C#';
    case 'php':
      return 'PHP';
    case 'swift':
      return 'SWIFT';
    case 'rust':
      return 'RUST';
    default:
      return lang.substring(0, 2).toUpperCase();
  }
};

const LanguageBadge = ({ language }: LanguageBadgeProps) => {
  const colorClass = getLangColor(language);
  const languageIcon = getLanguageIcon(language);
  const fallbackText = getLangIcon(language);
  
  return (
    <span 
      className="language-badge transition-all duration-200 hover:scale-105 flex items-center justify-center w-10 h-10 rounded-sm shadow-sm bg-card border border-border"
      title={language}
    >
      {languageIcon || (
        <span className={`${colorClass} text-sm font-medium w-8 h-8 flex items-center justify-center`}>
          {fallbackText}
        </span>
      )}
    </span>
  );
};

export default LanguageBadge;
