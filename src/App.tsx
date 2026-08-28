import React, { useEffect, useRef, useState } from 'react';
import { MnemeProvider } from './state/mnemeContext';
import { BottomNavigation, TabType } from './components/navigation/BottomNavigation';
import { HomeScreen } from './screens/HomeScreen';
import { CategoryScreen } from './screens/CategoryScreen';
import { FolderDetailScreen } from './screens/FolderDetailScreen';
import { LinkDetailScreen } from './screens/LinkDetailScreen';
import { EditLinkScreen } from './screens/EditLinkScreen';
import { AddLinkScreen } from './screens/AddLinkScreen';
import { LinkAnalysisScreen } from './screens/LinkAnalysisScreen';
import { NotebookScreen } from './screens/NotebookScreen';
import { CreateNotebookScreen } from './screens/CreateNotebookScreen';
import { SelectSourcesScreen } from './screens/SelectSourcesScreen';
import { NotebookAnalysisScreen } from './screens/NotebookAnalysisScreen';
import { NotebookDetailScreen } from './screens/NotebookDetailScreen';
import { AiSuggestionsScreen } from './screens/AiSuggestionsScreen';
import { SearchScreen } from './screens/SearchScreen';
import { ActivityScreen } from './screens/ActivityScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { FigmaIcon } from './components/common/FigmaIcon';
import { MnemeCategory, SavedLink, Notebook } from './types';

type ScreenView =
  | { type: 'tabs' }
  | { type: 'category'; category: MnemeCategory }
  | { type: 'folder'; folderName: string }
  | { type: 'link_detail'; link: SavedLink }
  | { type: 'edit_link'; link: SavedLink }
  | { type: 'add_link'; initialFolder?: string }
  | { type: 'link_analysis'; url: string; folder: string; category: string }
  | { type: 'create_notebook' }
  | { type: 'select_sources'; fromFolder: boolean }
  | { type: 'notebook_analysis'; sourceIds: number[] }
  | { type: 'notebook_detail'; notebook: Notebook }
  | { type: 'ai_suggestions'; notebook: Notebook }
  | { type: 'search' };

const MnemeApp: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [viewStack, setViewStack] = useState<ScreenView[]>([{ type: 'tabs' }]);
  const [showToast, setShowToast] = useState(false);

  const currentView = viewStack[viewStack.length - 1];
  const mainRef = useRef<HTMLElement>(null);

  // Each pushed/popped screen, and each bottom-nav tab switch, is a fresh view on a
  // phone, not a continuation of whatever scroll offset the previous one was left at.
  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [currentView, currentTab]);

  const usesReversedStatusBar = currentView.type === 'link_detail';
  const usesWhiteCanvas = currentView.type === 'notebook_detail' || currentView.type === 'select_sources';
  const usesPurpleStatusBar = currentView.type === 'create_notebook';

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

  const renderActiveScreen = () => {
    switch (currentView.type) {
      case 'category':
        return (
          <CategoryScreen
            category={currentView.category}
            onBack={popView}
            onSelectFolder={(folderName) => pushView({ type: 'folder', folderName })}
            onSelectLink={(link) => pushView({ type: 'link_detail', link })}
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
            onBack={popView}
            onStartAnalysis={(params) =>
              pushView({
                type: 'link_analysis',
                url: params.url,
                folder: params.folder,
                category: params.category,
              })
            }
          />
        );

      case 'link_analysis':
        return (
          <LinkAnalysisScreen
            url={currentView.url}
            folder={currentView.folder}
            category={currentView.category}
            onFinished={(createdLink) => {
              setShowToast(true);
              resetToTabs('home');
              pushView({ type: 'link_detail', link: createdLink });
            }}
            onCancel={popView}
          />
        );

      case 'create_notebook':
        return (
          <CreateNotebookScreen
            onBack={popView}
            onSelectFlow={(fromFolder) => pushView({ type: 'select_sources', fromFolder })}
          />
        );

      case 'select_sources':
        return (
          <SelectSourcesScreen
            fromFolder={currentView.fromFolder}
            onBack={popView}
            onSynthesize={(sourceIds) => pushView({ type: 'notebook_analysis', sourceIds })}
          />
        );

      case 'notebook_analysis':
        return (
          <NotebookAnalysisScreen
            sourceIds={currentView.sourceIds}
            onFinished={(createdNotebook) => {
              resetToTabs('notebook');
              pushView({ type: 'notebook_detail', notebook: createdNotebook });
            }}
            onCancel={popView}
          />
        );

      case 'notebook_detail':
        return (
          <NotebookDetailScreen
            notebook={currentView.notebook}
            onBack={popView}
            onOpenSuggestions={(nb) => pushView({ type: 'ai_suggestions', notebook: nb })}
          />
        );

      case 'ai_suggestions':
        return (
          <AiSuggestionsScreen
            notebook={currentView.notebook}
            onBack={popView}
          />
        );

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
                showSuccessToast={showToast}
                onDismissToast={() => setShowToast(false)}
              />
            );
          case 'notebook':
            return (
              <NotebookScreen
                onSelectNotebook={(nb) => pushView({ type: 'notebook_detail', notebook: nb })}
                onCreateNotebook={() => pushView({ type: 'create_notebook' })}
                onOpenSearch={() => pushView({ type: 'search' })}
              />
            );
          case 'activity':
            return (
              <ActivityScreen
                onSelectLink={(link) => pushView({ type: 'link_detail', link })}
                onViewSuggestions={(nb) => pushView({ type: 'ai_suggestions', notebook: nb })}
              />
            );
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
      <div className={`relative flex h-screen w-full flex-col items-center overflow-hidden px-[20px] sm:h-[856px] sm:w-[390px] sm:rounded-[40px] sm:shadow-[0_30px_70px_-20px_rgba(0,0,0,0.55)] ${usesWhiteCanvas ? 'bg-white' : usesPurpleStatusBar ? 'bg-[#7758e2]' : 'bg-[#f8f6fd]'}`}>
        {/* iOS UI/Status Bar. Link detail's node reverses the two sides. */}
        <div className={`relative h-[44px] shrink-0 overflow-hidden select-none ${usesWhiteCanvas || usesPurpleStatusBar ? 'w-[390px]' : 'w-full'}`}>
          <p
            className={`absolute h-[20px] w-[54px] text-center font-['Inter',sans-serif] text-[15px] leading-[20px] font-semibold tracking-[-0.5px] ${
              usesReversedStatusBar ? 'top-[17px] right-0 text-[#0e0727]' : `top-[13px] left-[24px] ${usesPurpleStatusBar ? 'text-[#fefefe]' : 'text-[#161718]'}`
            }`}
          >
            9:41
          </p>
          {/* flex, so the 11.336-tall vector is not pushed down by a text baseline */}
          {usesReversedStatusBar ? (
            <div className="absolute top-[20.83px] left-0 flex h-[11.34px] items-center gap-[5px]">
              <FigmaIcon name="detail-mobile-signal" />
              <FigmaIcon name="detail-wifi" />
              <FigmaIcon name="detail-battery" />
            </div>
          ) : (
            <div className="absolute top-[17.33px] right-[18.67px] flex">
              <FigmaIcon name={usesPurpleStatusBar ? 'create-notebook-status' : 'status-right'} color={usesPurpleStatusBar ? '#fefefe' : undefined} />
            </div>
          )}
        </div>

        {/*
          no-scrollbar: a desktop scrollbar would narrow the 390 column and shift the layout.
          The bottom nav is absolutely positioned over this scroll area (115px tall), so on
          the tab screens content needs matching bottom padding or the last rows scroll in
          permanently hidden behind it instead of clearing it like a real phone app.
        */}
        <main
          ref={mainRef}
          className={`no-scrollbar relative flex w-[390px] flex-1 flex-col items-center overflow-x-hidden overflow-y-auto ${currentView.type === 'tabs' ? 'pb-[115px]' : ''}`}
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
        <div className={`pointer-events-none absolute bottom-[8px] left-1/2 z-50 h-[5px] w-[144px] -translate-x-1/2 rounded-full ${usesWhiteCanvas || usesPurpleStatusBar ? 'bg-black' : 'bg-[#3c3c432e]'}`} />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <MnemeProvider>
      <MnemeApp />
    </MnemeProvider>
  );
}
