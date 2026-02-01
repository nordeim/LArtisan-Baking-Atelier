// ============================================
// L'Artisan Baking Atelier - Google Analytics 4
// User behavior tracking and e-commerce analytics
// ============================================

// GA4 Measurement ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Type definitions for gtag
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'consent' | 'js',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}

// Check if GA is enabled
export const isGAEnabled = (): boolean => {
  return !!GA_MEASUREMENT_ID && typeof window !== 'undefined';
};

// Initialize GA4
export const initGA = (): void => {
  if (!isGAEnabled() || !GA_MEASUREMENT_ID) return;

  // Load gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function (...args) {
    window.dataLayer.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false, // We'll handle this manually for SPA navigation
    cookie_flags: 'SameSite=None;Secure',
    custom_map: {
      custom_parameter_1: 'user_id',
      custom_parameter_2: 'user_role',
    },
  });
};

// Page view tracking
export const pageview = (url: string, title?: string): void => {
  if (!isGAEnabled()) return;

  if (!GA_MEASUREMENT_ID) return;
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
    page_title: title,
    page_location: window.location.href,
  });
};

// Event tracking
export const event = (
  action: string,
  params?: Record<string, unknown>
): void => {
  if (!isGAEnabled()) return;

  window.gtag('event', action, params);
};

// E-commerce Events
export const ecommerce = {
  // View item (product detail page)
  viewItem: (product: {
    id: string;
    name: string;
    category?: string;
    price: number;
    currency?: string;
  }): void => {
    event('view_item', {
      currency: product.currency || 'SGD',
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
      }],
    });
  },

  // Add to cart
  addToCart: (product: {
    id: string;
    name: string;
    category?: string;
    price: number;
    quantity: number;
    currency?: string;
  }): void => {
    event('add_to_cart', {
      currency: product.currency || 'SGD',
      value: product.price * product.quantity,
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity: product.quantity,
      }],
    });
  },

  // Remove from cart
  removeFromCart: (product: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    currency?: string;
  }): void => {
    event('remove_from_cart', {
      currency: product.currency || 'SGD',
      value: product.price * product.quantity,
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: product.quantity,
      }],
    });
  },

  // Begin checkout
  beginCheckout: (cart: {
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
    }>;
    subtotal: number;
    gst: number;
    total: number;
    currency?: string;
  }): void => {
    event('begin_checkout', {
      currency: cart.currency || 'SGD',
      value: cart.total,
      items: cart.items.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      // Custom parameters for Singapore GST
      custom_parameter_1: cart.subtotal,
      custom_parameter_2: cart.gst,
    });
  },

  // Purchase
  purchase: (order: {
    transactionId: string;
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
    }>;
    subtotal: number;
    gst: number;
    total: number;
    currency?: string;
    paymentMethod?: string;
  }): void => {
    event('purchase', {
      transaction_id: order.transactionId,
      currency: order.currency || 'SGD',
      value: order.total,
      tax: order.gst,
      shipping: 0, // Digital products
      payment_type: order.paymentMethod,
      items: order.items.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    });
  },
};

// User properties
export const setUserProperties = (properties: {
  userId?: string;
  role?: 'customer' | 'admin';
  coursesEnrolled?: number;
  totalSpent?: number;
}): void => {
  if (!isGAEnabled() || !GA_MEASUREMENT_ID) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    user_id: properties.userId,
    user_properties: {
      role: properties.role,
      courses_enrolled: properties.coursesEnrolled,
      total_spent: properties.totalSpent,
    },
  });
};

// Custom events for learning platform
export const learning = {
  // Course started
  courseStarted: (courseId: string, courseName: string): void => {
    event('course_started', {
      course_id: courseId,
      course_name: courseName,
    });
  },

  // Lesson completed
  lessonCompleted: (lessonId: string, lessonName: string, courseId: string): void => {
    event('lesson_completed', {
      lesson_id: lessonId,
      lesson_name: lessonName,
      course_id: courseId,
    });
  },

  // Course completed
  courseCompleted: (courseId: string, courseName: string): void => {
    event('course_completed', {
      course_id: courseId,
      course_name: courseName,
    });
  },

  // Video progress
  videoProgress: (lessonId: string, progressPercent: number): void => {
    // Track at 25%, 50%, 75%, 100%
    const milestones = [25, 50, 75, 100];
    if (milestones.includes(progressPercent)) {
      event('video_progress', {
        lesson_id: lessonId,
        progress_percent: progressPercent,
      });
    }
  },
};

// Consent management
export const consent = {
  // Update consent status
  update: (consent: {
    analytics_storage?: 'granted' | 'denied';
    ad_storage?: 'granted' | 'denied';
    functionality_storage?: 'granted' | 'denied';
    personalization_storage?: 'granted' | 'denied';
    security_storage?: 'granted' | 'denied';
  }): void => {
    if (!isGAEnabled()) return;

    window.gtag('consent', 'update', consent);
  },

  // Default consent (denied until user accepts)
  default: (): void => {
    if (!isGAEnabled()) return;

    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      functionality_storage: 'denied',
      personalization_storage: 'denied',
      security_storage: 'granted', // Always granted for security
    });
  },
};

// Exception tracking
export const exception = (description: string, fatal = false): void => {
  event('exception', {
    description,
    fatal,
  });
};

// Timing tracking
export const timing = (
  category: string,
  variable: string,
  value: number,
  label?: string
): void => {
  event('timing_complete', {
    event_category: category,
    name: variable,
    value,
    event_label: label,
  });
};
