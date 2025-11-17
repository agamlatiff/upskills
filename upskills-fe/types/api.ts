// API Response Types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  photo?: string;
  occupation?: string;
  email_verified_at?: string;
  has_active_subscription?: boolean;
  roles?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

// Course Types
export interface CourseCategory {
  id: number;
  name: string;
}

export interface CourseBenefit {
  id: number;
  name: string;
  benefit?: string; // Legacy field for backward compatibility
}

export interface SectionContent {
  id: number;
  name: string;
  content: string;
  course_section_id: number;
}

export interface CourseSection {
  id: number;
  name: string;
  position: number;
  section_contents: SectionContent[];
}

export interface CourseMentor {
  id: number;
  mentor?: {
    id: number;
    name: string;
    photo?: string;
    occupation?: string;
  };
}

export interface Course {
  id: number;
  slug: string;
  name: string;
  thumbnail?: string;
  about?: string;
  is_populer: boolean;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  is_free?: boolean;
  content_count?: number;
  testimonial_count?: number;
  category?: CourseCategory;
  benefits?: CourseBenefit[];
  course_sections?: CourseSection[];
  course_mentors?: CourseMentor[];
  created_at?: string;
  updated_at?: string;
}

export interface CoursesByCategory {
  category: string;
  courses: Course[];
}

// Pricing Types
export interface Pricing {
  id: number;
  name: string;
  duration: number;
  price: number;
  is_subscribed?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Transaction Types
export interface Transaction {
  id: number;
  booking_trx_id: string;
  user_id: number;
  pricing_id: number;
  grand_total_amount: number;
  sub_total_amount: number;
  total_tax_amount: number;
  is_paid: boolean;
  payment_type?: string;
  proof?: string;
  started_at: string;
  ended_at: string;
  is_active: boolean;
  pricing?: Pricing;
  student?: {
    id: number;
    name: string;
    email: string;
  };
  created_at?: string;
  updated_at?: string;
}

// Checkout Types
export interface CheckoutData {
  pricing: Pricing;
  user: {
    id: number;
    name: string;
    email: string;
  } | null;
  sub_total_amount: number;
  total_tax_amount: number;
  grand_total_amount: number;
  started_at: string;
  ended_at: string;
}

// Learning Types
export interface LearningData {
  course: Course;
  current_section: {
    id: number;
    name: string;
    position: number;
  } | null;
  current_content: {
    id: number;
    name: string;
    content: string;
  } | null;
  next_content: {
    id: number;
    name: string;
  } | null;
  is_finished: boolean;
}

// Testimonial Types
export interface Testimonial {
  id: number;
  quote: string;
  outcome?: string;
  is_verified: boolean;
  user?: {
    id: number;
    name: string;
    photo?: string;
    occupation?: string;
  };
  course?: {
    id: number;
    name: string;
    slug: string;
  };
  created_at: string;
  updated_at: string;
}

// Error Types
export interface ValidationError {
  message: string;
  errors: {
    [key: string]: string[];
  };
}

export interface ApiError {
  message: string;
  error?: string;
  errors?: {
    [key: string]: string[];
  };
}

