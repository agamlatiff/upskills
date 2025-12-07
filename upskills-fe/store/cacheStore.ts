import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Course, CoursesByCategory, Pricing, Testimonial } from '../types/api';

// Cache TTL in milliseconds (5 minutes)
const CACHE_TTL = 5 * 60 * 1000;

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

interface CacheState {
  courses: CacheItem<CoursesByCategory[]> | null;
  courseDetails: Record<string, CacheItem<Course>>;
  pricingPlans: CacheItem<Pricing[]> | null;
  testimonials: CacheItem<Testimonial[]> | null;

  // Actions
  setCourses: (data: CoursesByCategory[]) => void;
  getCourses: () => CoursesByCategory[] | null;
  setCourseDetail: (slug: string, data: Course) => void;
  getCourseDetail: (slug: string) => Course | null;
  setPricingPlans: (data: Pricing[]) => void;
  getPricingPlans: () => Pricing[] | null;
  setTestimonials: (data: Testimonial[]) => void;
  getTestimonials: () => Testimonial[] | null;
  clearCache: () => void;
  invalidateCourses: () => void;
  invalidatePricing: () => void;
  invalidateTestimonials: () => void;
}

const isExpired = (timestamp: number): boolean => {
  return Date.now() - timestamp > CACHE_TTL;
};

const useCacheStore = create<CacheState>()(
  persist(
    (set, get) => ({
      courses: null,
      courseDetails: {},
      pricingPlans: null,
      testimonials: null,

      setCourses: (data: CoursesByCategory[]) => {
        set({
          courses: {
            data,
            timestamp: Date.now(),
          },
        });
      },

      getCourses: () => {
        const cached = get().courses;
        if (cached && !isExpired(cached.timestamp)) {
          return cached.data;
        }
        return null;
      },

      setCourseDetail: (slug: string, data: Course) => {
        set((state) => ({
          courseDetails: {
            ...state.courseDetails,
            [slug]: {
              data,
              timestamp: Date.now(),
            },
          },
        }));
      },

      getCourseDetail: (slug: string) => {
        const cached = get().courseDetails[slug];
        if (cached && !isExpired(cached.timestamp)) {
          return cached.data;
        }
        return null;
      },

      setPricingPlans: (data: Pricing[]) => {
        set({
          pricingPlans: {
            data,
            timestamp: Date.now(),
          },
        });
      },

      getPricingPlans: () => {
        const cached = get().pricingPlans;
        if (cached && !isExpired(cached.timestamp)) {
          return cached.data;
        }
        return null;
      },

      setTestimonials: (data: Testimonial[]) => {
        set({
          testimonials: {
            data,
            timestamp: Date.now(),
          },
        });
      },

      getTestimonials: () => {
        const cached = get().testimonials;
        if (cached && !isExpired(cached.timestamp)) {
          return cached.data;
        }
        return null;
      },

      clearCache: () => {
        set({
          courses: null,
          courseDetails: {},
          pricingPlans: null,
          testimonials: null,
        });
      },

      invalidateCourses: () => {
        set({ courses: null, courseDetails: {} });
      },

      invalidatePricing: () => {
        set({ pricingPlans: null });
      },

      invalidateTestimonials: () => {
        set({ testimonials: null });
      },
    }),
    {
      name: 'upskills-cache',
      partialize: (state) => ({
        courses: state.courses,
        courseDetails: state.courseDetails,
        pricingPlans: state.pricingPlans,
        testimonials: state.testimonials,
      }),
    }
  )
);

export default useCacheStore;
