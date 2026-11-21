import { Testimonial } from '@/types';

// Per PRD 4.8: If genuine testimonials are unavailable, hide the section instead of publishing fake reviews.
// This list is structured and ready for genuine client testimonials when supplied.
export const testimonialsData: Testimonial[] = [
  // When genuine testimonials are obtained, add them here with verified client name and company.
  // Example format:
  // {
  //   id: 'test-01',
  //   client_name: 'Verified Client',
  //   company: 'Company Name',
  //   role: 'Founder & CEO',
  //   testimonial: 'SilverLine delivered our MVP in 6 weeks with unmatched engineering quality.',
  //   published: true,
  //   display_order: 1
  // }
];
