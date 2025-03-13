import React, { useState } from 'react';
import { ExamItem, Response } from '../types';
import {
  Container,
  Header,
  SpaceBetween,
  Box,
  Textarea,
  Toggle,
  Button,
  FormField,
  ColumnLayout,
  StatusIndicator
} from '@cloudscape-design/components';

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
    <Container>
      <SpaceBetween size="l">
        {/* Item Content Section */}
        <Box padding="m" variant="awsui-key-label">
          <Header variant="h2">Item Content</Header>
          <SpaceBetween size="m">
            <FormField
              label="Stem"
              description="The question or scenario presented to the candidate."
              i18nStrings={{ info: 'Info' }}
            >
              <Textarea
                value={item.stem}
                onChange={({ detail }) => handleStemChange(detail.value)}
                placeholder="Enter the item stem"
                rows={4}
              />
            </FormField>
          </SpaceBetween>
        </Box>

        {/* Responses Section */}
        <Box padding="m" variant="awsui-key-label">
          <Header variant="h2">Responses</Header>
          <Box variant="p" padding={{ bottom: 'm' }}>
            Responses for this exam should contain an advanced solution or list of actions.
          </Box>

          {item.responses.map((response, index) => (
            <Box
              key={response.id}
              padding="l"
              variant="container"
              marginBottom="m"
            >
              <SpaceBetween size="m">
                <Header variant="h3">Response {index + 1}</Header>
                
                <ColumnLayout columns={2} variant="text-grid">
                  <SpaceBetween size="s">
                    <FormField label="Text">
                      <Textarea
                        value={response.text}
                        onChange={({ detail }) => handleResponseTextChange(index, detail.value)}
                        placeholder={`Enter response ${index + 1}`}
                      />
                    </FormField>
                    
                    <FormField label="Correct">
                      <Toggle
                        checked={response.isCorrect}
                        onChange={({ detail }) => handleCorrectToggle(index, detail.checked)}
                      />
                    </FormField>
                  </SpaceBetween>
                  
                  <FormField label="Rationale">
                    <Textarea
                      value={response.rationale}
                      onChange={({ detail }) => handleRationaleChange(index, detail.value)}
                      placeholder="Rationale"
                    />
                  </FormField>
                </ColumnLayout>
              </SpaceBetween>
            </Box>
          ))}
        </Box>

        {/* Footer */}
        <Box
          padding="m"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box variant="small">
            <StatusIndicator type="info">
              Last saved: {item.lastSaved || 'Not saved yet'}
            </StatusIndicator>
          </Box>
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Run item rules
            </Button>
          </SpaceBetween>
        </Box>
      </SpaceBetween>
    </Container>
  );
};

export default ItemEditor; 