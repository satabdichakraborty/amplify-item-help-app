import React, { useState, useEffect } from 'react';
import { examItemService } from '../services/examItemService';
import { ExamItem } from '../types';
import {
  Table,
  Box,
  Button,
  SpaceBetween,
  Header,
  Pagination,
  TextFilter,
  ConfirmationDialog,
  StatusIndicator
} from '@cloudscape-design/components';

interface ExamItemsListProps {
  onEditItem: (item: ExamItem) => void;
  onCreateItem: () => void;
}

const ExamItemsList: React.FC<ExamItemsListProps> = ({ onEditItem, onCreateItem }) => {
  const [items, setItems] = useState<ExamItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<ExamItem[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [filteringText, setFilteringText] = useState('');
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const pageSize = 10;
  const filteredItems = items.filter(item => 
    item.questionId.toLowerCase().includes(filteringText.toLowerCase()) ||
    item.stem.toLowerCase().includes(filteringText.toLowerCase())
  );
  const pagesCount = Math.ceil(filteredItems.length / pageSize);
  const displayItems = filteredItems.slice(
    (currentPageIndex - 1) * pageSize,
    currentPageIndex * pageSize
  );

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const examItems = await examItemService.getExamItems();
      setItems(examItems);
      setError(null);
    } catch (err) {
      setError('Failed to load exam items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        await examItemService.deleteExamItem(itemToDelete);
        loadItems(); // Reload the list
        setIsDeleteDialogVisible(false);
        setItemToDelete(null);
      } catch (err) {
        setError('Failed to delete item');
        console.error(err);
      }
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogVisible(false);
    setItemToDelete(null);
  };

  const handleDeleteItem = (id: string) => {
    setItemToDelete(id);
    setIsDeleteDialogVisible(true);
  };

  // Helper function to get correct answers as a string
  const getCorrectAnswers = (item: ExamItem): string => {
    return item.responses
      .map((response, index) => response.isCorrect ? (index + 1) : null)
      .filter(Boolean)
      .join(', ');
  };

  return (
    <div>
      <Table
        header={
          <Header
            variant="h2"
            actions={
              <SpaceBetween direction="horizontal" size="xs">
                <Button onClick={onCreateItem} variant="primary">Add Item</Button>
              </SpaceBetween>
            }
            counter={`(${items.length})`}
          >
            Exam Items
          </Header>
        }
        columnDefinitions={[
          {
            id: 'questionId',
            header: 'ID',
            cell: item => item.questionId,
            sortingField: 'questionId',
          },
          {
            id: 'stem',
            header: 'Question',
            cell: item => (
              <div style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.stem.length > 100 ? `${item.stem.substring(0, 100)}...` : item.stem}
              </div>
            ),
            sortingField: 'stem',
          },
          {
            id: 'responses',
            header: 'Responses',
            cell: item => item.responses.length,
          },
          {
            id: 'correctAnswers',
            header: 'Correct Answers',
            cell: item => getCorrectAnswers(item),
          },
          {
            id: 'lastSaved',
            header: 'Last Saved',
            cell: item => item.lastSaved || 'N/A',
            sortingField: 'lastSaved',
          },
          {
            id: 'actions',
            header: 'Actions',
            cell: item => (
              <SpaceBetween direction="horizontal" size="xs">
                <Button onClick={() => onEditItem(item)} iconName="edit">Edit</Button>
                <Button onClick={() => handleDeleteItem(item.id)} iconName="remove" variant="normal">Delete</Button>
              </SpaceBetween>
            ),
          },
        ]}
        items={displayItems}
        loading={loading}
        loadingText="Loading exam items"
        selectionType="multi"
        selectedItems={selectedItems}
        onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
        pagination={
          <Pagination
            currentPageIndex={currentPageIndex}
            pagesCount={pagesCount}
            onChange={({ detail }) => setCurrentPageIndex(detail.currentPageIndex)}
          />
        }
        filter={
          <TextFilter
            filteringText={filteringText}
            filteringPlaceholder="Find exam items"
            filteringAriaLabel="Filter exam items"
            onChange={({ detail }) => setFilteringText(detail.filteringText)}
          />
        }
        empty={
          <Box textAlign="center" color="inherit">
            <b>No exam items</b>
            <Box padding={{ bottom: "s" }} variant="p" color="inherit">
              No exam items to display.
            </Box>
            <Button onClick={onCreateItem}>Add Item</Button>
          </Box>
        }
      />

      <ConfirmationDialog
        visible={isDeleteDialogVisible}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        onDismiss={handleDeleteCancel}
        header="Delete exam item"
        confirmLabel="Delete"
        cancelLabel="Cancel"
      >
        Are you sure you want to delete this exam item? This action cannot be undone.
      </ConfirmationDialog>

      {error && (
        <Box color="text-status-error" padding="m">
          <StatusIndicator type="error">{error}</StatusIndicator>
        </Box>
      )}
    </div>
  );
};

export default ExamItemsList; 