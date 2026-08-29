import React, { useEffect, useRef, useState } from 'react';
import { MnemeProvider, useMneme } from './state/mnemeContext';
import { BottomNavigation, TabType } from './components/navigation/BottomNavigation';
import { HomeScreen } from './screens/HomeScreen';
import { CategoryScreen } from './screens/CategoryScreen';
import { FolderDetailScreen } from './screens/FolderDetailScreen';
import { LinkDetailScreen } from './screens/LinkDetailScreen';
import { EditLinkScreen } from './screens/EditLinkScreen';
import { AddLinkScreen } from './screens/AddLinkScreen';
import { NotebookScreen } from './screens/NotebookScreen';
import { SelectSourcesScreen } from './screens/SelectSourcesScreen';
import { NotebookAnalysisScreen } from './screens/NotebookAnalysisScreen';
import { NotebookDetailScreen } from './screens/NotebookDetailScreen';
import { NotebookReadingScreen } from './screens/NotebookReadingScreen';
import { AiSuggestionsScreen } from './screens/AiSuggestionsScreen';
import { AiSuggestionDetailScreen } from './screens/AiSuggestionDetailScreen';
import { SearchScreen } from './screens/SearchScreen';
import { ActivityScreen } from './screens/ActivityScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { FigmaIcon } from './components/common/FigmaIcon';
import { AppErrorBoundary } from './components/common/AppErrorBoundary';
import { AddLinkParams, MnemeCategory, SavedLink, Notebook } from './types';
import { AiSuggestionId, getAiSuggestion } from './data/aiSuggestions';

type ScreenView =
  | { type: 'tabs' }
  | { type: 'category'; category: MnemeCategory }
  | { type: 'folder'; folderName: string }
  | { type: 'link_detail'; link: SavedLink }
  | { type: 'edit_link'; link: SavedLink }
  | { type: 'add_link'; initialFolder?: string; initialCategory?: string }
  | { type: 'select_sources'; fromFolder: boolean }
  | { type: 'notebook_synthesis'; sourceIds: number[] }
  | { type: 'notebook_detail'; notebook: Notebook }
  | { type: 'notebook_reading'; notebook: Notebook }
  | { type: 'ai_suggestions' }
  | { type: 'ai_suggestion_detail'; suggestionId: AiSuggestionId }
  | { type: 'search' };

/** Ho Chi Minh City clock (Asia/Ho_Chi_Minh, UTC+7) for the status bar. */
function formatStatusBarTime(): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hourCycle: 'h23',
    hour: 'numeric',
    minute: 'numeric',
  }).formatToParts(new Date());
  const hour = parts.find((p) => p.type === 'hour')?.value ?? '00';
  const minute = parts.find((p) => p.type === 'minute')?.value ?? '00';
  return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
}

function useStatusBarClock(): string {
  const [time, setTime] = useState(formatStatusBarTime);

  useEffect(() => {
    const tick = () => setTime((prev) => {
      const next = formatStatusBarTime();
      return prev === next ? prev : next;
    });
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return time;
}

const MnemeApp: React.FC = () => {
  const { addLink, categories, notebooks } = useMneme();
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [viewStack, setViewStack] = useState<ScreenView[]>([{ type: 'tabs' }]);
  const [successCategory, setSuccessCategory] = useState<string | null>(null);
  const [ignoredSuggestionIds, setIgnoredSuggestionIds] = useState<AiSuggestionId[]>([]);
  const statusBarTime = useStatusBarClock();

  const currentView = viewStack[viewStack.length - 1];
  const mainRef = useRef<HTMLElement>(null);

  // Each pushed/popped screen, and each bottom-nav tab switch, is a fresh view on a
  // phone, not a continuation of whatever scroll offset the previous one was left at.
  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [currentView, currentTab]);

  const usesWhiteCanvas =
    currentView.type === 'notebook_detail' ||
    currentView.type === 'notebook_reading' ||
    currentView.type === 'select_sources' ||
    currentView.type === 'notebook_synthesis';
  const usesDarkCanvas = currentView.type === 'ai_suggestion_detail';

  const pushView = (view: ScreenView) => {
    setViewStack((prev) => [...prev, view]);
  };

  const popView = () => {
    if (viewStack.length > 1) {
      setViewStack((prev) => prev.slice(0, -1));
    }
  };

  const resetToTabs = (tab?: TabType) => {
    if (tab) setCurrentTab(tab);
    setViewStack([{ type: 'tabs' }]);
  };

  const saveResolvedCategoryLink = async (params: AddLinkParams) => {
    const result = await addLink(params);
    setSuccessCategory(result.value.category);
    resetToTabs('home');
  };

  const openSuccessCategory = () => {
    if (!successCategory) return;
    const category = categories.find((item) => item.name === successCategory);
    setSuccessCategory(null);
    if (category) pushView({ type: 'category', category });
  };

  const renderActiveScreen = () => {
    switch (currentView.type) {
      case 'category':
        return (
          <CategoryScreen
            category={currentView.category}
            onBack={popView}
            onSelectFolder={(folderName) => pushView({ type: 'folder', folderName })}
            onSelectLink={(link) => pushView({ type: 'link_detail', link })}
            onAddLink={(category) => pushView({ type: 'add_link', initialCategory: category.name })}
          />
        );

      case 'folder':
        return (
          <FolderDetailScreen
            folderName={currentView.folderName}
            onBack={popView}
            onSelectLink={(link) => pushView({ type: 'link_detail', link })}
            onAddNewLink={(folderName) => pushView({ type: 'add_link', initialFolder: folderName })}
          />
        );

      case 'link_detail':
        return (
          <LinkDetailScreen
            link={currentView.link}
            onBack={popView}
            onEdit={(link) => pushView({ type: 'edit_link', link })}
          />
        );

      case 'edit_link':
        return (
          <EditLinkScreen
            link={currentView.link}
            onBack={popView}
            onSaved={() => {
              popView();
            }}
          />
        );

      case 'add_link':
        return (
          <AddLinkScreen
            initialFolder={currentView.initialFolder}
            initialCategory={currentView.initialCategory}
            onBack={popView}
            onSaveToCategory={saveResolvedCategoryLink}
          />
        );

      case 'select_sources':
        return (
          <SelectSourcesScreen
            fromFolder={currentView.fromFolder}
            onBack={popView}
            onSynthesize={(sourceIds) => pushView({ type: 'notebook_synthesis', sourceIds })}
          />
        );

      case 'notebook_synthesis':
        return (
          <NotebookAnalysisScreen
            sourceIds={currentView.sourceIds}
            onCancel={popView}
            onFinished={() => {
              // Showcase-only deterministic transition: the selected-source
              // frame resolves to the canonical Research notebook locally.
              // No Gemini endpoint is called on this route.
              const researchNotebook = notebooks.find((notebook) => notebook.id === 1);
              if (researchNotebook) {
                setViewStack((prev) => [...prev.slice(0, -1), { type: 'notebook_detail', notebook: researchNotebook }]);
              }
            }}
          />
        );

      case 'notebook_detail':
        return (
          <NotebookDetailScreen
            key={currentView.notebook.id}
            notebook={currentView.notebook}
            onBack={popView}
            onOpenReading={(nb) => pushView({ type: 'notebook_reading', notebook: nb })}
          />
        );

      case 'notebook_reading':
        return (
          <NotebookReadingScreen
            notebook={currentView.notebook}
            onBack={popView}
          />
        );

      case 'ai_suggestions':
        return (
          <AiSuggestionsScreen
            ignoredIds={ignoredSuggestionIds}
            onBack={popView}
            onReview={(suggestionId) => pushView({ type: 'ai_suggestion_detail', suggestionId })}
          />
        );

      case 'ai_suggestion_detail': {
        const suggestion = getAiSuggestion(currentView.suggestionId);
        if (!suggestion) return null;
        return (
          <AiSuggestionDetailScreen
            suggestion={suggestion}
            onBack={popView}
            onChooseNotebook={() => resetToTabs('notebook')}
            onIgnore={() => {
              setIgnoredSuggestionIds((current) => current.includes(suggestion.id) ? current : [...current, suggestion.id]);
              popView();
            }}
          />
        );
      }

      case 'search':
        return (
          <SearchScreen
            onBack={popView}
            onSelectLink={(link) => pushView({ type: 'link_detail', link })}
          />
        );

      case 'tabs':
      default:
        switch (currentTab) {
          case 'home':
            return (
              <HomeScreen
                onOpenSearch={() => pushView({ type: 'search' })}
                onSelectCategory={(cat) => pushView({ type: 'category', category: cat })}
                onSelectLink={(link) => pushView({ type: 'link_detail', link })}
                successCategoryName={successCategory ?? undefined}
                onOpenSuccessCategory={openSuccessCategory}
              />
            );
          case 'notebook':
            return (
              <NotebookScreen
                onSelectNotebook={(nb) => pushView({ type: 'notebook_detail', notebook: nb })}
                onCreateNotebook={() => pushView({ type: 'select_sources', fromFolder: false })}
                onOpenSearch={() => pushView({ type: 'search' })}
                onOpenSuggestions={() => pushView({ type: 'ai_suggestions' })}
              />
            );
          case 'activity':
            return <ActivityScreen />;
          case 'profile':
            return <ProfileScreen />;
        }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1b1533] p-0 sm:p-6">
      {/* Figma frame 2159:12771 is 390x856. */}
      {/*
        The Figma frame carries px-20, which is why the status bar is 350 wide and
        starts at x=20 while Content is a full 390 and overflows that padding.
      */}
      {/*
        transform-gpu makes this frame the containing block for any `fixed`
        descendant (full-screen modals, sticky action bars) so they size and
        clip to the 390x856 mockup instead of the real browser viewport,
        which on desktop is centered around this frame, not flush with it.
      */}
      <div className={`relative flex h-screen w-full transform-gpu flex-col items-center overflow-hidden px-[20px] sm:h-[856px] sm:w-[390px] sm:rounded-[40px] sm:shadow-[0_30px_70px_-20px_rgba(0,0,0,0.55)] ${usesDarkCanvas ? 'bg-[#2e1442]' : usesWhiteCanvas ? 'bg-white' : 'bg-[#f8f6fd]'}`}>
        {/* iOS UI/Status Bar. Same layout on every screen: live Ho Chi Minh City clock, left. */}
        <div className={`relative h-[44px] shrink-0 overflow-hidden select-none ${usesWhiteCanvas || usesDarkCanvas ? 'w-[390px]' : 'w-full'} ${usesDarkCanvas ? 'bg-[#2e1442]' : ''}`}>
          <p
            className={`absolute top-[13px] left-[24px] h-[20px] w-[54px] text-center font-['Inter',sans-serif] text-[15px] leading-[20px] font-semibold tracking-[-0.5px] ${usesDarkCanvas ? 'text-white' : 'text-[#161718]'}`}
          >
            {statusBarTime}
          </p>
          <div className="absolute top-[17.33px] right-[18.67px] flex">
            <FigmaIcon name="status-right" color={usesDarkCanvas ? '#ffffff' : undefined} />
          </div>
        </div>

        {/*
          no-scrollbar: a desktop scrollbar would narrow the 390 column and shift the layout.
          The bottom nav is absolutely positioned over this scroll area (115px tall), so on
          the tab screens content needs matching bottom padding or the last rows scroll in
          permanently hidden behind it instead of clearing it like a real phone app.
        */}
        <main
          ref={mainRef}
          className={`no-scrollbar relative flex w-[390px] flex-1 touch-pan-y flex-col items-center overflow-x-hidden overflow-y-auto overscroll-y-contain ${currentView.type === 'tabs' ? 'pb-[115px]' : ''}`}
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {renderActiveScreen()}
        </main>

        {currentView.type === 'tabs' && (
          <BottomNavigation
            currentTab={currentTab}
            onTabChange={(t) => setCurrentTab(t)}
            onAddClick={() => pushView({ type: 'add_link' })}
          />
        )}

        {/*
          iOS Home Indicator: 144x5 at #3c3c432e, measured at x123..266 y831..835
          of the 844-tall frames. It draws over the navigation bar, so it must
          come after it.
        */}
        <div className={`pointer-events-none absolute bottom-[8px] left-1/2 z-50 h-[5px] w-[144px] -translate-x-1/2 rounded-full ${usesWhiteCanvas || usesDarkCanvas ? 'bg-black' : 'bg-[#3c3c432e]'}`} />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppErrorBoundary>
      <MnemeProvider>
        <MnemeApp />
      </MnemeProvider>
    </AppErrorBoundary>
  );
}
