import React, { useState } from 'react';
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
    <div className="flex min-h-screen items-center justify-center bg-[#1B1533] p-0 sm:p-6">
      {/* Figma frames in section 2159:12770 are 390 wide; keep the app at that width. */}
      <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[#F8F6FD] sm:h-[844px] sm:w-[390px] sm:rounded-[40px] sm:shadow-[0_30px_70px_-20px_rgba(0,0,0,0.55)]">
        {/* iOS status bar, 44 tall in the Figma frames. */}
        <div className="flex h-11 shrink-0 select-none items-center justify-between px-[26px] pt-2 text-[#0E0727]">
          <span className="text-[15px] font-semibold tracking-tight">9:41</span>
          <FigmaIcon name="status-right" size={67} />
        </div>

        <main className="relative flex-1 overflow-y-auto overflow-x-hidden">
          {renderActiveScreen()}
        </main>

        {currentView.type === 'tabs' && (
          <BottomNavigation
            currentTab={currentTab}
            onTabChange={(t) => setCurrentTab(t)}
            onAddClick={() => pushView({ type: 'add_link' })}
          />
        )}
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
