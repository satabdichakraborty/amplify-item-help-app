import React, { useState, useEffect } from 'react';
import { examItemService } from '../services/examItemService';
import { ExamItem } from '../types';
import './ExamItemsList.css';

interface ExamItemsListProps {
  onEditItem: (item: ExamItem) => void;
  onCreateItem: () => void;
}

const ExamItemsList: React.FC<ExamItemsListProps> = ({ onEditItem, onCreateItem }) => {
  const [items, setItems] = useState<ExamItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleDeleteItem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await examItemService.deleteExamItem(id);
        loadItems(); // Reload the list
      } catch (err) {
        setError('Failed to delete item');
        console.error(err);
      }
    }
  };

  // Helper function to get correct answers as a string
  const getCorrectAnswers = (item: ExamItem): string => {
    return item.responses
      .map((response, index) => response.isCorrect ? (index + 1) : null)
      .filter(Boolean)
      .join(', ');
  };

  if (loading) {
    return <div className="loading">Loading exam items...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="exam-items-list">
      <div className="list-header">
        <h1>Exam Items ({items.length})</h1>
        <button className="create-button" onClick={onCreateItem}>
          Add Item
        </button>
      </div>

      {items.length === 0 ? (
        <div className="no-items">No exam items found. Click "Add Item" to create one.</div>
      ) : (
        <table className="items-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Question</th>
              <th>Responses</th>
              <th>Correct Answers</th>
              <th>Last Saved</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.questionId}</td>
                <td className="question-cell">
                  {item.stem.length > 100 ? `${item.stem.substring(0, 100)}...` : item.stem}
                </td>
                <td>{item.responses.length}</td>
                <td>{getCorrectAnswers(item)}</td>
                <td>{item.lastSaved || 'N/A'}</td>
                <td className="actions-cell">
                  <button className="edit-button" onClick={() => onEditItem(item)}>
                    Edit
                  </button>
                  <button className="delete-button" onClick={() => handleDeleteItem(item.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExamItemsList; 