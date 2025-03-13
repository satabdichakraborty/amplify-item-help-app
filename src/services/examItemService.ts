import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { ExamItem, Response } from "../types";

const client = generateClient<Schema>();

export const examItemService = {
  // Get all exam items
  async getExamItems(): Promise<ExamItem[]> {
    try {
      const { data: examItems } = await client.models.ExamItem.list();
      
      // For each exam item, get its responses
      const itemsWithResponses = await Promise.all(
        examItems.map(async (item) => {
          const { data: responses } = await client.models.Response.list({
            filter: {
              examItemId: { eq: item.id }
            }
          });
          
          return {
            ...item,
            responses: responses || []
          } as ExamItem;
        })
      );
      
      return itemsWithResponses;
    } catch (error) {
      console.error("Error fetching exam items:", error);
      return [];
    }
  },
  
  // Get a single exam item by ID
  async getExamItem(id: string): Promise<ExamItem | null> {
    try {
      const { data: item } = await client.models.ExamItem.get({ id });
      
      if (!item) return null;
      
      // Get responses for this item
      const { data: responses } = await client.models.Response.list({
        filter: {
          examItemId: { eq: id }
        }
      });
      
      return {
        ...item,
        responses: responses || []
      } as ExamItem;
    } catch (error) {
      console.error(`Error fetching exam item with ID ${id}:`, error);
      return null;
    }
  },
  
  // Create a new exam item
  async createExamItem(item: Omit<ExamItem, "id">): Promise<ExamItem | null> {
    try {
      // Create the exam item
      const { data: newItem } = await client.models.ExamItem.create({
        questionId: item.questionId,
        stem: item.stem,
        lastSaved: new Date().toLocaleString()
      });
      
      if (!newItem) throw new Error("Failed to create exam item");
      
      // Create responses for this item
      const responses = await Promise.all(
        item.responses.map(async (response) => {
          const { data: newResponse } = await client.models.Response.create({
            text: response.text,
            rationale: response.rationale,
            isCorrect: response.isCorrect,
            examItemId: newItem.id
          });
          
          return newResponse;
        })
      );
      
      return {
        ...newItem,
        responses: responses.filter(Boolean) as Response[]
      } as ExamItem;
    } catch (error) {
      console.error("Error creating exam item:", error);
      return null;
    }
  },
  
  // Update an existing exam item
  async updateExamItem(id: string, item: Partial<ExamItem>): Promise<ExamItem | null> {
    try {
      // Update the exam item
      const { data: updatedItem } = await client.models.ExamItem.update({
        id,
        ...(item.questionId && { questionId: item.questionId }),
        ...(item.stem && { stem: item.stem }),
        lastSaved: new Date().toLocaleString()
      });
      
      if (!updatedItem) throw new Error("Failed to update exam item");
      
      // If responses are provided, update them
      if (item.responses) {
        // First, delete existing responses
        const { data: existingResponses } = await client.models.Response.list({
          filter: {
            examItemId: { eq: id }
          }
        });
        
        await Promise.all(
          existingResponses.map(async (response) => {
            await client.models.Response.delete({ id: response.id });
          })
        );
        
        // Then create new responses
        const responses = await Promise.all(
          item.responses.map(async (response) => {
            const { data: newResponse } = await client.models.Response.create({
              text: response.text,
              rationale: response.rationale,
              isCorrect: response.isCorrect,
              examItemId: id
            });
            
            return newResponse;
          })
        );
        
        return {
          ...updatedItem,
          responses: responses.filter(Boolean) as Response[]
        } as ExamItem;
      }
      
      // If no responses provided, get existing ones
      const { data: responses } = await client.models.Response.list({
        filter: {
          examItemId: { eq: id }
        }
      });
      
      return {
        ...updatedItem,
        responses: responses || []
      } as ExamItem;
    } catch (error) {
      console.error(`Error updating exam item with ID ${id}:`, error);
      return null;
    }
  },
  
  // Delete an exam item
  async deleteExamItem(id: string): Promise<boolean> {
    try {
      // First, delete all responses for this item
      const { data: responses } = await client.models.Response.list({
        filter: {
          examItemId: { eq: id }
        }
      });
      
      await Promise.all(
        responses.map(async (response) => {
          await client.models.Response.delete({ id: response.id });
        })
      );
      
      // Then delete the exam item
      await client.models.ExamItem.delete({ id });
      
      return true;
    } catch (error) {
      console.error(`Error deleting exam item with ID ${id}:`, error);
      return false;
    }
  }
}; 