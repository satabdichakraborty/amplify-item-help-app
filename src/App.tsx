import { useState } from "react";
import { ExamItem } from "./types";
import ExamItemsList from "./components/ExamItemsList";
import ItemEditor from "./components/ItemEditor";
import { examItemService } from "./services/examItemService";
import { AppLayout, Container, Header, ContentLayout } from "@cloudscape-design/components";
import "./App.css";

function App() {
  const [currentView, setCurrentView] = useState<"list" | "editor">("list");
  const [currentItem, setCurrentItem] = useState<ExamItem | undefined>(undefined);

  const handleEditItem = (item: ExamItem) => {
    setCurrentItem(item);
    setCurrentView("editor");
  };

  const handleCreateItem = () => {
    setCurrentItem(undefined);
    setCurrentView("editor");
  };

  const handleSaveItem = async (item: ExamItem) => {
    try {
      if (item.id && currentItem) {
        // Update existing item
        await examItemService.updateExamItem(item.id, item);
      } else {
        // Create new item
        await examItemService.createExamItem(item);
      }
      setCurrentView("list");
    } catch (error) {
      console.error("Error saving item:", error);
      alert("Failed to save item. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setCurrentView("list");
  };

  return (
    <AppLayout
      content={
        <ContentLayout
          header={
            <Header variant="h1">
              Cert Item Helper
            </Header>
          }
        >
          <Container>
            {currentView === "list" ? (
              <ExamItemsList
                onEditItem={handleEditItem}
                onCreateItem={handleCreateItem}
              />
            ) : (
              <ItemEditor
                initialData={currentItem}
                onCancel={handleCancelEdit}
                onSave={handleSaveItem}
              />
            )}
          </Container>
        </ContentLayout>
      }
      navigationHide
      toolsHide
    />
  );
}

export default App;
