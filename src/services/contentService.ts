import { API_CONFIG } from '../config/apiConfig';
import { apiClient } from './apiClient';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  category: string;
}

export interface LegalContent {
  title: string;
  content: string;
  lastUpdated: string;
}

const mapCMSBlockToLegalContent = (block: any): LegalContent => ({
  title: block.title || block.blockKey || 'Content',
  content: block.content || block.summary || '',
  lastUpdated: block.lastUpdated || block.dateCreated || new Date().toISOString(),
});

export class ContentService {
  private static BLOGS_COLLECTION = 'blogs';
  private static LEGAL_COLLECTION = 'legal';

  static async getBlogs(): Promise<Blog[]> {
    if (API_CONFIG.IS_MOCK) {
      try {
        const querySnapshot = await getDocs(query(collection(db, this.BLOGS_COLLECTION), orderBy('date', 'desc')));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Blog));
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, this.BLOGS_COLLECTION);
        return [];
      }
    }
    return [];
  }

  static async getBlogById(id: string): Promise<Blog | null> {
    if (API_CONFIG.IS_MOCK) {
      try {
        const docSnap = await getDoc(doc(db, this.BLOGS_COLLECTION, id));
        return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Blog) : null;
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `${this.BLOGS_COLLECTION}/${id}`);
        return null;
      }
    }
    return null;
  }

  static async getLegalContent(type: string): Promise<LegalContent | null> {
    if (API_CONFIG.IS_MOCK) {
      try {
        const docSnap = await getDoc(doc(db, this.LEGAL_COLLECTION, type));
        return docSnap.exists() ? (docSnap.data() as LegalContent) : null;
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `${this.LEGAL_COLLECTION}/${type}`);
        return null;
      }
    }
    const block = await apiClient.get<any>(`/cms/public/service-content/${encodeURIComponent(type)}`);
    return mapCMSBlockToLegalContent(block);
  }

  static async getAboutContent(): Promise<any> {
    if (API_CONFIG.IS_MOCK) {
      return {
        vision: "To be the most trusted home service partner in India.",
        mission: "Delivering premium quality services with transparency and reliability.",
        stats: [
          { label: 'Happy Customers', value: '50,000+' },
          { label: 'Expert Technicians', value: '500+' },
          { label: 'Cities Covered', value: '12' }
        ]
      };
    }
    return apiClient.get<any>('/cms/public/home');
  }

  static async submitAppFeedback(userId: string, feedback: any): Promise<void> {
    if (!API_CONFIG.IS_MOCK) {
      throw new Error('Customer app feedback API is not defined in the current API contract.');
    }
    console.log('Submitting app feedback:', feedback);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  static async getChangelog(): Promise<any[]> {
    if (!API_CONFIG.IS_MOCK) {
      return [];
    }
    return [
      { version: '2.4.0', date: '2024-04-01', changes: ['Added AMC Visit Details', 'Improved Job Tracker', 'Bug fixes'] },
      { version: '2.3.5', date: '2024-03-15', changes: ['New Referral System', 'UI enhancements'] }
    ];
  }

  static async getFAQ(): Promise<any[]> {
    if (!API_CONFIG.IS_MOCK) {
      return apiClient.get<any[]>('/cms/public/faqs');
    }
    return [
      { question: 'How do I book a service?', answer: 'You can book a service from the home dashboard or catalog.' },
      { question: 'What is AMC?', answer: 'AMC stands for Annual Maintenance Contract, which covers regular checkups.' }
    ];
  }
}
