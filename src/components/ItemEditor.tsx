import React, { useState, useEffect } from 'react';
import { ExamItem, Response } from '../types';
import './ItemEditor.css';

interface ItemEditorProps {
  initialData?: ExamItem;
  onCancel: () => void;
  onSave: (item: ExamItem) => void;
}

const ItemEditor: React.FC<ItemEditorProps> = ({
  initialData,
  onCancel,
  onSave,
}) => {
  const isEditMode = !!initialData;

  // Initialize with default values or existing data
  const [item, setItem] = useState<ExamItem>(
    initialData || {
      id: `item-${Date.now()}`,
      questionId: '',
      stem: '',
      responses: [
        { id: `resp-1-${Date.now()}`, text: '', rationale: '', isCorrect: false },
        { id: `resp-2-${Date.now()}`, text: '', rationale: '', isCorrect: false },
        { id: `resp-3-${Date.now()}`, text: '', rationale: '', isCorrect: false },
        { id: `resp-4-${Date.now()}`, text: '', rationale: '', isCorrect: false },
      ],
      lastSaved: new Date().toLocaleString(),
    }
  );

  // Update stem
  const handleStemChange = (value: string) => {
    setItem(prev => ({
      ...prev,
      stem: value
    }));
  };

  // Update response text
  const handleResponseTextChange = (index: number, value: string) => {
    const updatedResponses = [...item.responses];
    updatedResponses[index] = {
      ...updatedResponses[index],
      text: value
    };
    setItem(prev => ({
      ...prev,
      responses: updatedResponses
    }));
  };

  // Update response rationale
  const handleRationaleChange = (index: number, value: string) => {
    const updatedResponses = [...item.responses];
    updatedResponses[index] = {
      ...updatedResponses[index],
      rationale: value
    };
    setItem(prev => ({
      ...prev,
      responses: updatedResponses
    }));
  };

  // Toggle correct answer
  const handleCorrectToggle = (index: number, checked: boolean) => {
    const updatedResponses = [...item.responses];
    updatedResponses[index] = {
      ...updatedResponses[index],
      isCorrect: checked
    };
    setItem(prev => ({
      ...prev,
      responses: updatedResponses
    }));
  };

  // Save the item
  const handleSave = () => {
    const updatedItem = {
      ...item,
      lastSaved: new Date().toLocaleString()
    };
    onSave(updatedItem);
  };

  return (
    <div className="item-editor">
      {/* Item Content Section */}
      <div className="item-content">
        <h2>Item Content</h2>
        <div className="info-label">
          <span>Stem</span>
          <span className="info-icon">Info</span>
        </div>
        <p className="description">The question or scenario presented to the candidate.</p>
        <textarea
          value={item.stem}
          onChange={(e) => handleStemChange(e.target.value)}
          placeholder="Enter the item stem"
          rows={4}
          className="stem-input"
        />
      </div>

      {/* Responses Section */}
      <div className="responses-section">
        <div className="responses-header">
          <h2>Responses</h2>
          <span className="info-icon">Info</span>
        </div>
        <p className="description">Responses for this exam should contain an advanced solution or list of actions.</p>

        {item.responses.map((response, index) => (
          <div key={response.id} className="response-item">
            <h3>Response {index + 1}</h3>
            
            <div className="response-content">
              <div className="response-left">
                <div className="field-group">
                  <label>Text</label>
                  <textarea
                    value={response.text}
                    onChange={(e) => handleResponseTextChange(index, e.target.value)}
                    placeholder={`Enter response ${index + 1}`}
                    className="response-input"
                  />
                </div>
                
                <div className="field-group">
                  <label>Correct</label>
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={response.isCorrect}
                      onChange={(e) => handleCorrectToggle(index, e.target.checked)}
                      id={`toggle-${response.id}`}
                    />
                    <label htmlFor={`toggle-${response.id}`} className="toggle-label"></label>
                  </div>
                </div>
              </div>
              
              <div className="response-right">
                <div className="field-group">
                  <label>Rationale</label>
                  <textarea
                    value={response.rationale}
                    onChange={(e) => handleRationaleChange(index, e.target.value)}
                    placeholder="Rationale"
                    className="rationale-input"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="editor-footer">
        <div className="last-saved">
          Last saved: {item.lastSaved || 'Not saved yet'}
        </div>
        <div className="action-buttons">
          <button className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
          <button className="save-button" onClick={handleSave}>
            Run item rules
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemEditor; 