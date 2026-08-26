import React from 'react';
import { 
  Plus, Search, SlidersHorizontal, MoreVertical, MoreHorizontal, ArrowLeft,
  Link, X, ChevronDown, ChevronRight, PlusCircle, Star, Share2, Copy,
  Layers, Youtube, Clock, BookOpen, Sparkles, Edit3, Check, FolderPlus,
  Trash2, Tag as TagIcon, CheckCircle2, Loader2, Video, Globe, Bookmark
} from 'lucide-react';

export interface FigmaIconProps {
  name?: string;
  asset?: string;
  size?: number | string;
  className?: string;
  color?: string;
}

export const FigmaIcon: React.FC<FigmaIconProps> = ({
  name,
  asset,
  size = 24,
  className = '',
  color,
}) => {
  const pixelSize = typeof size === 'number' ? `${size}px` : size;
  const numSize = typeof size === 'number' ? size : parseInt(size, 10) || 24;

  // If exact asset path is specified and available
  if (asset) {
    return (
      <img
        src={asset}
        alt=""
        style={{ width: pixelSize, height: pixelSize }}
        className={`inline-block object-contain ${className}`}
      />
    );
  }

  // Fallback to high-fidelity Lucide iconography matching Figma tokens
  switch (name) {
    case 'plus':
      return <Plus size={numSize} color={color} className={className} />;
    case 'plus-small':
      return <Plus size={numSize || 18} color={color} className={className} />;
    case 'search':
      return <Search size={numSize} color={color} className={className} />;
    case 'filter':
      return <SlidersHorizontal size={numSize} color={color} className={className} />;
    case 'more-vertical':
      return <MoreVertical size={numSize} color={color} className={className} />;
    case 'more-horizontal':
      return <MoreHorizontal size={numSize} color={color} className={className} />;
    case 'back':
      return <ArrowLeft size={numSize} color={color} className={className} />;
    case 'link':
      return <Link size={numSize} color={color} className={className} />;
    case 'close':
      return <X size={numSize} color={color} className={className} />;
    case 'dropdown':
      return <ChevronDown size={numSize} color={color} className={className} />;
    case 'chevron-right':
      return <ChevronRight size={numSize} color={color} className={className} />;
    case 'add-circle':
    case 'plus-circle':
      return <PlusCircle size={numSize} color={color} className={className} />;
    case 'star':
      return <Star size={numSize} color={color} className={className} fill={color ? color : 'none'} />;
    case 'share':
      return <Share2 size={numSize} color={color} className={className} />;
    case 'copy':
      return <Copy size={numSize} color={color} className={className} />;
    case 'layers':
      return <Layers size={numSize} color={color} className={className} />;
    case 'youtube':
      return <Youtube size={numSize} color={color} className={className} />;
    case 'clock':
      return <Clock size={numSize} color={color} className={className} />;
    case 'open-book':
      return <BookOpen size={numSize} color={color} className={className} />;
    case 'ai':
      return <Sparkles size={numSize} color={color} className={className} />;
    case 'edit':
      return <Edit3 size={numSize} color={color} className={className} />;
    case 'folder-plus':
    case 'move-folder':
      return <FolderPlus size={numSize} color={color} className={className} />;
    case 'delete':
      return <Trash2 size={numSize} color={color} className={className} />;
    case 'tag':
      return <TagIcon size={numSize} color={color} className={className} />;
    case 'check':
      return <Check size={numSize} color={color} className={className} />;
    case 'check-circle':
      return <CheckCircle2 size={numSize} color={color} className={className} />;
    case 'loader':
      return <Loader2 size={numSize} color={color} className={`animate-spin ${className}`} />;
    case 'video':
      return <Video size={numSize} color={color} className={className} />;
    case 'globe':
      return <Globe size={numSize} color={color} className={className} />;
    case 'bookmark':
      return <Bookmark size={numSize} color={color} className={className} />;
    default:
      return <Sparkles size={numSize} color={color} className={className} />;
  }
};
