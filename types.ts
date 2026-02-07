
export type Status = 'Live' | 'In Progress' | 'Pending' | 'Review' | 'Archive';
export type Priority = 'High' | 'Medium' | 'Low' | 'Urgent';

export interface WorkflowRequest {
  id: string;
  name: string;
  status: Status;
  priority: Priority;
  date: string;
  description: string;
  client: string;
  assignedAdmin?: string;
  webhookUrl?: string;
}

export interface Conversation {
  id: string;
  user: string;
  lastMessage: string;
  time: string;
  platform: 'Instagram' | 'Messenger' | 'WhatsApp';
  avatar: string;
}

export interface SchoolLead {
  id: string;
  parentName: string;
  studentGrade: string;
  inquiryType: 'Tuition' | 'Tour' | 'Curriculum';
  timestamp: string;
  score: number;
}

export interface PaymentRecord {
  id: string;
  studentName: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Overdue' | 'Reminder Sent';
  strikeCount: number;
}

// Updated KnowledgeBase interface type property to include 'Chatbot' and 'Comments'
export interface KnowledgeBase {
  id: string;
  name: string;
  type: 'Admissions' | 'Curriculum' | 'Policies' | 'Chatbot' | 'Comments';
  status: 'Active' | 'Draft';
  wordCount: number;
  workflowCount: number;
}

// Added Addon interface
export interface Addon {
  id: string;
  name: string;
  price: number;
  description: string;
  icon: string;
  selected: boolean;
}
