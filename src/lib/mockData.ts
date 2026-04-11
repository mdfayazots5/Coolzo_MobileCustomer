export const MOCK_USERS = [
  {
    id: 'u1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210',
    membershipStatus: 'residential' as const,
  },
  {
    id: 'u2',
    name: 'Corporate User',
    email: 'corp@coolzo.com',
    phone: '1234567890',
    membershipStatus: 'corporate' as const,
  },
];

export const ONBOARDING_STEPS = [
  {
    id: 1,
    title: 'Premium AC Service at your fingertips',
    description: 'Experience the highest quality AC maintenance and repair services with just a few taps.',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 2,
    title: 'Certified Technicians, Real-time Tracking',
    description: 'Our experts are certified and background-checked. Track your technician in real-time as they arrive.',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 3,
    title: 'AMC Value: Autopilot Protection',
    description: 'Protect your AC all year round with our Annual Maintenance Contracts. Plans for every need.',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800',
  },
];

export const SERVICE_CATEGORIES = [
  'All', 'Repair', 'Cleaning', 'Installation', 'Gas Refill', 'AMC'
];

export const SERVICES = [
  {
    id: 's1',
    category: 'Repair',
    name: 'AC Not Cooling',
    description: 'Comprehensive diagnosis and repair for cooling issues.',
    duration: '60-90 min',
    price: 499,
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=400',
    included: ['Gas check', 'Compressor check', 'Filter cleaning', 'Electrical check'],
    howItWorks: 'Technician arrives, diagnoses the fault, provides estimate for parts if needed, and repairs upon approval.',
  },
  {
    id: 's2',
    category: 'Cleaning',
    name: 'Deep Jet Cleaning',
    description: 'High-pressure water jet cleaning for indoor and outdoor units.',
    duration: '45-60 min',
    price: 599,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400',
    included: ['Indoor unit jet wash', 'Outdoor unit jet wash', 'Drain pipe cleaning', 'Filter disinfection'],
    howItWorks: 'Uses specialized high-pressure pumps to remove deep-seated dust and mold from cooling coils.',
  },
  {
    id: 's3',
    category: 'Installation',
    name: 'Split AC Installation',
    description: 'Professional installation of split AC units with vacuuming.',
    duration: '120-150 min',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=400',
    included: ['Indoor unit mounting', 'Outdoor unit mounting', 'Copper pipe connection', 'Gas leak test'],
    howItWorks: 'Precision mounting and connection followed by vacuuming to ensure maximum cooling efficiency.',
  },
  {
    id: 's4',
    category: 'Gas Refill',
    name: 'Full Gas Charging',
    description: 'Leak repair and complete refrigerant gas refill.',
    duration: '60-90 min',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1599939571322-792a326991f2?auto=format&fit=crop&q=80&w=400',
    included: ['Leak identification', 'Leak soldering', 'Vacuuming', 'Full gas refill'],
    howItWorks: 'We find the leak first, fix it permanently, and then refill the gas to manufacturer specifications.',
  },
  {
    id: 's5',
    category: 'Repair',
    name: 'Noise/Vibration Fix',
    description: 'Fixing rattling sounds or excessive vibrations.',
    duration: '30-45 min',
    price: 399,
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=400',
    included: ['Fan motor check', 'Cabinet tightening', 'Bush replacement', 'Leveling'],
    howItWorks: 'Identification of loose components or worn-out mechanical parts causing the noise.',
  },
  {
    id: 's6',
    category: 'Cleaning',
    name: 'Foam Cleaning',
    description: 'Chemical foam cleaning for intensive coil disinfection.',
    duration: '60 min',
    price: 799,
    image: 'https://images.unsplash.com/photo-1621905252507-b354bcadcabc?auto=format&fit=crop&q=80&w=400',
    included: ['Chemical foam application', 'Coil brushing', 'Antibacterial spray', 'Odor removal'],
    howItWorks: 'Non-corrosive foam penetrates deep into the fins to dissolve grease and kill bacteria.',
  }
];

export const AMC_PLANS = [
  {
    id: 'amc1',
    name: 'Basic',
    price: 1999,
    period: 'Yearly',
    features: ['2 Wet Services', 'Unlimited Breakdown Calls', '10% Off on Spare Parts', 'Standard Response Time'],
    recommended: false,
  },
  {
    id: 'amc2',
    name: 'Standard',
    price: 3499,
    period: 'Yearly',
    features: ['4 Wet Services', 'Unlimited Breakdown Calls', '20% Off on Spare Parts', 'Priority Response Time', 'Gas Top-up Included'],
    recommended: true,
  },
  {
    id: 'amc3',
    name: 'Premium',
    price: 5999,
    period: 'Yearly',
    features: ['6 Wet Services', 'Unlimited Breakdown Calls', 'Free Spare Parts (up to ₹2k)', '4-Hour Response Time', 'Full Gas Refill Included', 'PCB Repair Covered'],
    recommended: false,
  },
  {
    id: 'amc4',
    name: 'Enterprise',
    price: 'Custom',
    period: 'Yearly',
    features: ['Dedicated Account Manager', 'Custom Service Schedule', 'Bulk Unit Discount', '2-Hour Response Time', 'Comprehensive Coverage'],
    recommended: false,
  }
];

export const REVIEWS = [
  {
    id: 'r1',
    userName: 'Amit Sharma',
    rating: 5,
    date: '2 days ago',
    comment: 'The technician was very professional. He used a jet pump for cleaning and my AC is like new now!',
    serviceType: 'Cleaning'
  },
  {
    id: 'r2',
    userName: 'Priya Patel',
    rating: 4,
    date: '1 week ago',
    comment: 'Good service. They arrived on time and fixed the cooling issue quickly. A bit expensive but worth it.',
    serviceType: 'Repair'
  },
  {
    id: 'r3',
    userName: 'Rahul Verma',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Best AC service in the city. The real-time tracking is a game changer. I knew exactly when he was arriving.',
    serviceType: 'Installation'
  },
  {
    id: 'r4',
    userName: 'Sneha Gupta',
    rating: 5,
    date: '1 month ago',
    comment: 'Highly recommend the AMC plans. Very peaceful to have regular maintenance scheduled automatically.',
    serviceType: 'AMC'
  }
];

export const ARTICLES = [
  {
    id: 'a1',
    category: 'Maintenance',
    title: '5 Signs Your AC Needs Immediate Service',
    excerpt: 'Don\'t wait for a total breakdown. Learn the early warning signs of AC failure.',
    date: 'Oct 12, 2023',
    readTime: '4 min',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=400',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  },
  {
    id: 'a2',
    category: 'Tips',
    title: 'How to Reduce Your AC Electricity Bill',
    excerpt: 'Simple habits and settings that can save you up to 30% on your monthly bills.',
    date: 'Oct 15, 2023',
    readTime: '6 min',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=400',
    content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  },
  {
    id: 'a3',
    category: 'Guides',
    title: 'Split vs Window AC: Which is Right for You?',
    excerpt: 'A comprehensive comparison to help you make the best choice for your home.',
    date: 'Oct 20, 2023',
    readTime: '8 min',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400',
    content: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.'
  }
];

export const FAQ_ITEMS = [
  {
    question: 'How often should I service my AC?',
    answer: 'We recommend a deep cleaning every 3-4 months for optimal performance and air quality, especially in high-pollution areas.'
  },
  {
    question: 'What is covered under AMC?',
    answer: 'Our standard AMC covers 4 wet services, unlimited breakdown calls, and discounts on spare parts. Premium plans also include gas top-ups.'
  },
  {
    question: 'Are your technicians certified?',
    answer: 'Yes, all Coolzo technicians undergo rigorous training and background checks before they are sent to your home.'
  }
];

export interface Technician {
  id: string;
  name: string;
  photo: string;
  rating: number;
  reviewCount: number;
  experience: string;
  jobsCompleted: number;
  certifications: string[];
  phone: string;
}

export const TECHNICIANS: Technician[] = [
  {
    id: 'tech-1',
    name: 'Rahul Sharma',
    photo: 'https://i.pravatar.cc/150?u=tech1',
    rating: 4.9,
    reviewCount: 128,
    experience: '8 Years',
    jobsCompleted: 1450,
    certifications: ['Master Technician', 'Safety Certified', 'Daikin Specialist'],
    phone: '+91 98765 43210'
  },
  {
    id: 'tech-2',
    name: 'Amit Patel',
    photo: 'https://i.pravatar.cc/150?u=tech2',
    rating: 4.7,
    reviewCount: 85,
    experience: '5 Years',
    jobsCompleted: 920,
    certifications: ['Certified Electrician', 'Gas Refill Expert'],
    phone: '+91 98765 43211'
  }
];

export interface Equipment {
  id: string;
  brand: string;
  model: string;
  type: string;
  capacity: string;
  location: string;
  installYear: number;
  lastServiceDate: string;
  serialNumber: string;
}

export const USER_EQUIPMENT: Equipment[] = [
  {
    id: 'eq-1',
    brand: 'Daikin',
    model: 'FTKF Series',
    type: 'Split AC',
    capacity: '1.5T',
    location: 'Living Room',
    installYear: 2022,
    lastServiceDate: '2023-12-15',
    serialNumber: 'DKN-77882211'
  },
  {
    id: 'eq-2',
    brand: 'Samsung',
    model: 'WindFree',
    type: 'Split AC',
    capacity: '1T',
    location: 'Master Bedroom',
    installYear: 2023,
    lastServiceDate: '2024-01-20',
    serialNumber: 'SAM-99003344'
  }
];

export interface Job {
  id: string;
  srNumber: string;
  serviceType: string;
  status: 'Booked' | 'Assigned' | 'En Route' | 'Arrived' | 'In Progress' | 'Completed' | 'Cancelled';
  date: string;
  timeSlot: string;
  technicianId?: string;
  equipmentId?: string;
  address: string;
  price: number;
  isEmergency: boolean;
  hasEstimate: boolean;
  estimateApproved?: boolean;
}

export const JOBS: Job[] = [
  {
    id: 'job-1',
    srNumber: 'CZ-8821',
    serviceType: 'Deep Jet Cleaning',
    status: 'En Route',
    date: '2026-04-10',
    timeSlot: 'Morning (8 AM - 12 PM)',
    technicianId: 'tech-1',
    equipmentId: 'eq-1',
    address: 'Flat 402, Sea View Apartments, Mumbai',
    price: 1299,
    isEmergency: false,
    hasEstimate: false
  },
  {
    id: 'job-2',
    srNumber: 'CZ-7712',
    serviceType: 'Split AC Repair',
    status: 'Completed',
    date: '2023-06-12',
    timeSlot: 'Afternoon (12 PM - 4 PM)',
    technicianId: 'tech-2',
    equipmentId: 'eq-2',
    address: 'Flat 402, Sea View Apartments, Mumbai',
    price: 850,
    isEmergency: false,
    hasEstimate: true,
    estimateApproved: true
  }
];

export interface AMCContract {
  id: string;
  planName: string;
  tier: 'Basic' | 'Standard' | 'Premium';
  startDate: string;
  endDate: string;
  totalVisits: number;
  visitsUsed: number;
  nextVisitDate?: string;
  equipmentIds: string[];
}

export const USER_AMC: AMCContract = {
  id: 'amc-101',
  planName: 'Residential Protection',
  tier: 'Standard',
  startDate: '2025-12-01',
  endDate: '2026-11-30',
  totalVisits: 4,
  visitsUsed: 1,
  nextVisitDate: '2026-05-15',
  equipmentIds: ['eq-1', 'eq-2']
};

export interface Invoice {
  id: string;
  invoiceNumber: string;
  srNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  items: { name: string; qty: number; price: number }[];
}

export const INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV/2026/04/001',
    srNumber: 'SR-8821',
    date: '2026-04-05',
    dueDate: '2026-04-12',
    amount: 1250,
    status: 'Unpaid',
    items: [
      { name: 'Deep Jet Cleaning (Split AC)', qty: 1, price: 850 },
      { name: 'Visit Charges', qty: 1, price: 250 },
      { name: 'GST (18%)', qty: 1, price: 150 },
    ]
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV/2026/03/089',
    srNumber: 'SR-7712',
    date: '2026-03-15',
    dueDate: '2026-03-22',
    amount: 2450,
    status: 'Paid',
    items: [
      { name: 'Gas Leakage Repair', qty: 1, price: 1200 },
      { name: 'Gas Refilling (R32)', qty: 1, price: 800 },
      { name: 'Visit Charges', qty: 1, price: 250 },
      { name: 'GST (18%)', qty: 1, price: 200 },
    ]
  },
  {
    id: 'inv-3',
    invoiceNumber: 'INV/2026/02/045',
    srNumber: 'SR-6601',
    date: '2026-02-10',
    dueDate: '2026-02-17',
    amount: 450,
    status: 'Overdue',
    items: [
      { name: 'Capacitor Replacement', qty: 1, price: 380 },
      { name: 'GST (18%)', qty: 1, price: 70 },
    ]
  }
];

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High';
  createdAt: string;
  srNumber?: string;
  messages: {
    id: string;
    sender: 'Customer' | 'Agent';
    text: string;
    timestamp: string;
    attachments?: string[];
  }[];
}

export const SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 't-1',
    ticketNumber: 'TCK-1029',
    subject: 'Technician was late by 2 hours',
    category: 'Technician Concern',
    status: 'In Progress',
    priority: 'Medium',
    createdAt: '2026-04-08T10:30:00Z',
    srNumber: 'SR-8821',
    messages: [
      {
        id: 'm-1',
        sender: 'Customer',
        text: 'The technician was supposed to arrive at 10 AM but reached at 12 PM. This caused a lot of inconvenience.',
        timestamp: '2026-04-08T10:30:00Z'
      },
      {
        id: 'm-2',
        sender: 'Agent',
        text: 'We sincerely apologize for the delay. We are checking with the technician team and will get back to you shortly.',
        timestamp: '2026-04-08T14:20:00Z'
      }
    ]
  },
  {
    id: 't-2',
    ticketNumber: 'TCK-0988',
    subject: 'Invoice query for gas refilling',
    category: 'Invoice Query',
    status: 'Resolved',
    priority: 'Low',
    createdAt: '2026-03-20T15:45:00Z',
    srNumber: 'SR-7712',
    messages: [
      {
        id: 'm-3',
        sender: 'Customer',
        text: 'I was charged for 1kg gas but I think it was less.',
        timestamp: '2026-03-20T15:45:00Z'
      },
      {
        id: 'm-4',
        sender: 'Agent',
        text: 'Hello, our technician used a digital scale. We have attached the photo of the scale reading for your reference.',
        timestamp: '2026-03-21T09:10:00Z'
      }
    ]
  }
];

export interface UserAddress {
  id: string;
  label: 'Home' | 'Office' | 'Other';
  addressLine1: string;
  addressLine2?: string;
  city: string;
  pinCode: string;
  isDefault: boolean;
  zone: string;
}

export const USER_ADDRESSES: UserAddress[] = [
  {
    id: 'addr-1',
    label: 'Home',
    addressLine1: 'Flat 402, Skyview Apartments',
    addressLine2: 'Sector 45',
    city: 'Gurugram',
    pinCode: '122003',
    isDefault: true,
    zone: 'Zone A'
  },
  {
    id: 'addr-2',
    label: 'Office',
    addressLine1: 'Coolzo Tech Park, Tower B',
    addressLine2: 'Cyber City',
    city: 'Gurugram',
    pinCode: '122002',
    isDefault: false,
    zone: 'Zone B'
  }
];

export interface PromotionalOffer {
  id: string;
  title: string;
  description: string;
  discount: string;
  code: string;
  expiryDate: string;
  type: 'Service' | 'AMC' | 'General';
}

export const PROMOTIONAL_OFFERS: PromotionalOffer[] = [
  {
    id: 'off-1',
    title: 'Summer Ready Sale',
    description: 'Get flat 20% off on all deep jet cleaning services.',
    discount: '20% OFF',
    code: 'SUMMER20',
    expiryDate: '2026-05-31',
    type: 'Service'
  },
  {
    id: 'off-2',
    title: 'AMC Upgrade Bonus',
    description: 'Upgrade to Premium AMC and get 2 extra visits free.',
    discount: '2 EXTRA VISITS',
    code: 'AMCPLUS',
    expiryDate: '2026-04-30',
    type: 'AMC'
  }
];

export interface AppNotification {
  id: string;
  type: 'Job' | 'Payment' | 'Support' | 'Offer';
  title: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  route: string;
}

export const APP_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n-1',
    type: 'Job',
    title: 'Technician Assigned',
    body: 'Rahul Sharma has been assigned to your booking SR-8821.',
    timestamp: '2026-04-10T09:00:00Z',
    isRead: false,
    route: '/app/job-tracker/SR-8821'
  },
  {
    id: 'n-2',
    type: 'Payment',
    title: 'Invoice Generated',
    body: 'Invoice INV/2026/04/001 is ready for payment.',
    timestamp: '2026-04-09T15:30:00Z',
    isRead: true,
    route: '/app/invoice/inv-1'
  },
  {
    id: 'n-3',
    type: 'Support',
    title: 'New Reply',
    body: 'Support agent has replied to your ticket TCK-1029.',
    timestamp: '2026-04-09T11:20:00Z',
    isRead: false,
    route: '/app/support/t-1'
  }
];

export interface Referral {
  id: string;
  name: string;
  status: 'Invited' | 'Booked' | 'Rewarded';
  reward: number;
}

export const USER_REFERRALS: Referral[] = [
  { id: 'ref-1', name: 'Amit Kumar', status: 'Rewarded', reward: 250 },
  { id: 'ref-2', name: 'Sneha Singh', status: 'Booked', reward: 0 },
  { id: 'ref-3', name: 'Vikram Rao', status: 'Invited', reward: 0 }
];
