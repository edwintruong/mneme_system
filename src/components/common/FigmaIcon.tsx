import React from 'react';

/**
 * Every entry points at an SVG exported from the Figma file, committed under
 * `public/assets/icons/`. `w`/`h` are the export's intrinsic size, so a caller
 * that passes `size` scales the icon without distorting Figma's aspect ratio.
 *
 * Never substitute an icon-library glyph here: the shapes must stay the ones
 * the design ships.
 */
interface IconAsset {
  src: string;
  w: number;
  h: number;
  /** Figma draws this glyph mirrored from the exported vector. */
  flip?: boolean;
}

const FIGMA = '/assets/icons/figma';
const FIGMA_2159 = '/assets/icons/figma_2159';

export const FIGMA_ICONS: Record<string, IconAsset> = {
  // Navigation chrome
  back: { src: `${FIGMA}/create_notebook_back.svg`, w: 30, h: 30, flip: true },
  'chevron-right': { src: `${FIGMA}/create_notebook_chevron.svg`, w: 24, h: 24 },
  dropdown: { src: `${FIGMA}/add_link_dropdown_close.svg`, w: 24, h: 24 },
  'direction-down': { src: `${FIGMA}/notebook_detail_direction_down.svg`, w: 11.5001, h: 5.50003 },

  // Bottom tab bar
  home: { src: `${FIGMA}/home_nav_home.svg`, w: 24, h: 24 },
  'nav-home-active': { src: `${FIGMA}/notebook_nav_home.svg`, w: 24, h: 24 },
  notebook: { src: `${FIGMA}/home_nav_notebook.svg`, w: 24, h: 24 },
  'nav-notebook-active': { src: `${FIGMA}/notebook_nav_notebook.svg`, w: 24, h: 24 },
  activity: { src: `${FIGMA}/home_nav_activity.svg`, w: 24, h: 24 },
  profile: { src: `${FIGMA}/home_nav_profile.svg`, w: 24, h: 24 },
  'nav-bg': { src: `${FIGMA}/home_nav_bg.svg`, w: 390, h: 75 },

  // Actions
  plus: { src: `${FIGMA}/home_plus.svg`, w: 24, h: 24 },
  'plus-small': { src: `${FIGMA}/category_icon_5.svg`, w: 16, h: 16 },
  'add-circle': { src: `${FIGMA}/notebook_add_circle.svg`, w: 24, h: 24 },
  'plus-circle': { src: `${FIGMA}/notebook_add_circle.svg`, w: 24, h: 24 },
  search: { src: `${FIGMA}/category_icon_4.svg`, w: 16, h: 16 },
  filter: { src: `${FIGMA}/category_filter.svg`, w: 36, h: 36 },
  close: { src: `${FIGMA}/add_link_icon_1.svg`, w: 24, h: 24 },
  'close-small': { src: `${FIGMA}/category_icon_1.svg`, w: 16, h: 16 },
  'more-vertical': { src: `${FIGMA}/home_more_vertical.svg`, w: 2.5, h: 12.5 },
  'more-horizontal': { src: `${FIGMA}/link_detail_more.svg`, w: 24, h: 24 },

  // Link + notebook content
  link: { src: `${FIGMA}/add_link_link.svg`, w: 24, h: 24 },
  layers: { src: `${FIGMA}/link_detail_layers.svg`, w: 16.2497, h: 16.7294 },
  'open-book': { src: `${FIGMA}/notebook_detail_open_book.svg`, w: 24, h: 24 },
  ai: { src: `${FIGMA}/ai_suggestions_ai.svg`, w: 20, h: 20 },
  'ai-arrow': { src: `${FIGMA}/ai_suggestions_icon.svg`, w: 20, h: 20 },
  youtube: { src: `${FIGMA}/link_detail_youtube.svg`, w: 24, h: 24 },
  star: { src: `${FIGMA}/link_detail_star.svg`, w: 24, h: 24 },
  share: { src: `${FIGMA}/link_detail_share.svg`, w: 24, h: 24 },
  copy: { src: `${FIGMA}/link_detail_copy.svg`, w: 21.3333, h: 21.3333 },
  edit: { src: `${FIGMA}/notebook_detail_edit.svg`, w: 15.0004, h: 18.0002 },
  delete: { src: `${FIGMA}/delete.svg`, w: 13.334, h: 16.666 },
  tag: { src: `${FIGMA}/tag.svg`, w: 21.5, h: 21.5 },
  'folder-plus': { src: `${FIGMA}/move_folder.svg`, w: 21.5, h: 21.5 },
  'move-folder': { src: `${FIGMA}/move_folder.svg`, w: 21.5, h: 21.5 },
  radio: { src: `${FIGMA}/category_radio.svg`, w: 24, h: 24 },
  'radio-selected': { src: `${FIGMA}/select_sources_radio_1.svg`, w: 24, h: 24 },
  placeholder: { src: `${FIGMA}/notebook_detail_placeholder.svg`, w: 350, h: 280 },

  // Status bar
  'status-right': { src: `${FIGMA}/add_link_status_right.svg`, w: 66.6612, h: 11.336 },

  // Add-link toast, node 2159:13227
  'check-circle': { src: `${FIGMA_2159}/2159_13227_success.svg`, w: 24, h: 24 },
};

export interface FigmaIconProps {
  /** Registry key. Falls back to `asset` when omitted. */
  name?: string;
  /** Explicit path under `public/`, for one-off exports not in the registry. */
  asset?: string;
  /** Longest edge in px. The other edge follows Figma's aspect ratio. */
  size?: number | string;
  className?: string;
  /**
   * Recolors the glyph via a CSS mask, keeping the exported path exactly.
   * Leave unset to render Figma's own fill and stroke colors.
   */
  color?: string;
  alt?: string;
}

export const FigmaIcon: React.FC<FigmaIconProps> = ({
  name,
  asset,
  size,
  className = '',
  color,
  alt = '',
}) => {
  const entry = name ? FIGMA_ICONS[name] : undefined;
  const src = asset ?? entry?.src;

  if (!src) {
    if (import.meta.env.DEV) {
      console.warn(`[FigmaIcon] no exported asset for "${name}" — export it from Figma first`);
    }
    return null;
  }

  // Scale the longest edge to `size` and let the other edge follow, so a
  // non-square export such as more-vertical (2.5x12.5) keeps its proportions.
  let width: string | undefined;
  let height: string | undefined;

  if (size !== undefined) {
    const target = typeof size === 'number' ? size : parseFloat(size);
    if (entry && !Number.isNaN(target)) {
      const scale = target / Math.max(entry.w, entry.h);
      width = `${entry.w * scale}px`;
      height = `${entry.h * scale}px`;
    } else {
      const px = typeof size === 'number' ? `${size}px` : size;
      width = px;
      height = px;
    }
  } else if (entry) {
    width = `${entry.w}px`;
    height = `${entry.h}px`;
  }

  const transform = entry?.flip ? 'scaleX(-1)' : undefined;

  if (color) {
    return (
      <span
        role={alt ? 'img' : 'presentation'}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
        className={`inline-block shrink-0 ${className}`}
        style={{
          width,
          height,
          transform,
          backgroundColor: color,
          maskImage: `url("${src}")`,
          WebkitMaskImage: `url("${src}")`,
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskPosition: 'center',
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
        }}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      draggable={false}
      style={{ width, height, transform }}
      className={`inline-block shrink-0 ${className}`}
    />
  );
};
