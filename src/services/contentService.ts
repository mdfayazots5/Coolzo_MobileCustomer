import { API_CONFIG } from '../config/apiConfig';
import { apiClient } from './apiClient';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';

const CMS_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const CMS_CACHE_PREFIX = '@ce_cms_cache_';

interface CmsBlockResponse {
  cmsBlockId: number;
  blockKey: string;
  title: string;
  summary: string;
  content: string;
  previewImageUrl: string;
  isActive: boolean;
  isPublished: boolean;
  sortOrder: number;
  versionNumber: number;
  dateCreated: string;
  lastUpdated?: string | null;
}

interface BlogContentResponse {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  category: string;
}

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

interface AboutContent {
  vision: string;
  mission: string;
  stats: { label: string; value: string }[];
}

interface CachedCmsPayload<T> {
  savedAt: number;
  value: T;
}

function mapBlog(blog: BlogContentResponse): Blog {
  return {
    id: blog.id,
    title: blog.title,
    excerpt: blog.excerpt,
    content: blog.content,
    author: blog.author,
    date: new Date(blog.date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    image: blog.image,
    category: blog.category,
  };
}

function mapLegal(block: CmsBlockResponse): LegalContent {
  return {
    title: block.title,
    content: block.content,
    lastUpdated: block.lastUpdated ?? block.dateCreated,
  };
}

function mapAbout(block: CmsBlockResponse): AboutContent {
  return {
    vision: block.summary || block.title,
    mission: block.content,
    stats: [
      { label: 'Version', value: `V${block.versionNumber}` },
      { label: 'Sort Order', value: String(block.sortOrder) },
    ],
  };
}

function readCachedCms<T>(key: string): T | null {
  const raw = localStorage.getItem(`${CMS_CACHE_PREFIX}${key}`);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as CachedCmsPayload<T>;

    if (Date.now() - parsed.savedAt > CMS_CACHE_TTL_MS) {
      localStorage.removeItem(`${CMS_CACHE_PREFIX}${key}`);
      return null;
    }

    return parsed.value;
  } catch {
    localStorage.removeItem(`${CMS_CACHE_PREFIX}${key}`);
    return null;
  }
}

function writeCachedCms<T>(key: string, value: T) {
  localStorage.setItem(`${CMS_CACHE_PREFIX}${key}`, JSON.stringify({
    savedAt: Date.now(),
    value,
  } satisfies CachedCmsPayload<T>));
}

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function parseChangelog(block: CmsBlockResponse): { version: string; date: string; changes: string[] }[] {
  const rawContent = block.content?.trim() || '';

  if (rawContent.startsWith('[')) {
    try {
      return JSON.parse(rawContent) as { version: string; date: string; changes: string[] }[];
    } catch {
      // Fall through to text parsing.
    }
  }

  const items = rawContent
    .split(/\r?\n|<\/li>/i)
    .map((item) => stripHtml(item))
    .filter(Boolean);

  return [{
    version: block.title || 'Current',
    date: block.lastUpdated ?? block.dateCreated,
    changes: items,
  }];
}

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

    const response = await apiClient.get<BlogContentResponse[]>('/cms/blog-posts?status=published&page=1&pageSize=10', undefined, true);
    return response.map(mapBlog);
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

    const response = await apiClient.get<BlogContentResponse>(`/cms/blog-posts/${id}`, undefined, true);
    return mapBlog(response);
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

    const key = type === 'privacy' ? 'privacy-policy' : 'legal-terms';
    const cached = readCachedCms<LegalContent>(key);

    if (cached) {
      return cached;
    }

    const response = await apiClient.get<CmsBlockResponse>(`/cms/blocks/${key}`, undefined, true);
    const mapped = mapLegal(response);
    writeCachedCms(key, mapped);
    return mapped;
  }

  static async getAboutContent(): Promise<AboutContent> {
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

    const cached = readCachedCms<AboutContent>('about-us');

    if (cached) {
      return cached;
    }

    const response = await apiClient.get<CmsBlockResponse>('/cms/blocks/about-us', undefined, true);
    const mapped = mapAbout(response);
    writeCachedCms('about-us', mapped);
    return mapped;
  }

  static async submitAppFeedback(userId: string, feedback: any): Promise<void> {
    if (API_CONFIG.IS_MOCK) {
      console.log('Mock: Submitting app feedback:', feedback);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return;
    }
    await apiClient.post('/feedback/app', {
      feedbackType: 'AppRating',
      message: feedback.comment || `App rating submitted by ${userId}`,
      rating: feedback.rating ?? null,
      appVersion: feedback.appVersion ?? 'web',
      deviceInfo: feedback.platform ?? navigator.userAgent,
    });
  }

  static async getChangelog(): Promise<any[]> {
    if (API_CONFIG.IS_MOCK) {
      return [
        { version: '2.4.0', date: '2024-04-01', changes: ['Added AMC Visit Details', 'Improved Job Tracker', 'Bug fixes'] },
        { version: '2.3.5', date: '2024-03-15', changes: ['New Referral System', 'UI enhancements'] }
      ];
    }

    const cached = readCachedCms<any[]>('app-changelog');

    if (cached) {
      return cached;
    }

    const response = await apiClient.get<CmsBlockResponse>('/cms/blocks/app-changelog', undefined, true);
    const mapped = parseChangelog(response);
    writeCachedCms('app-changelog', mapped);
    return mapped;
  }

  static async getFAQ(): Promise<any[]> {
    if (API_CONFIG.IS_MOCK) {
      return [
        { question: 'How do I book a service?', answer: 'You can book a service from the home dashboard or catalog.' },
        { question: 'What is AMC?', answer: 'AMC stands for Annual Maintenance Contract, which covers regular checkups.' }
      ];
    }
    return apiClient.get<any[]>('/content/faq');
  }
}
