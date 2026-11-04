export interface TestimonialItem {
  id: string;
  name: string;
  designation: string;
  quoteParagraphs: string[];
  image: string;
  brandHighlights?: string[];
}

export const testimonialsData: TestimonialItem[] = [
  {
    id: 'dr-shikha-santhosh',
    name: 'Dr Shikha Santhosh',
    designation: 'Dental Surgeon / Model / Artist',
    image: '/images/influencers/shikha-santhosh.jpg',
    quoteParagraphs: [
      'It has been an absolute pleasure working with Riyaz.',
      'I have had the opportunity to collaborate with him on multiple ad shoots and in every single project, he has stood out for his professionalism, clarity and dedication to the craft.',
      'He had also invited me to be a part of multiple events as a Jury member and on the Judging Panel and twice as the showstopper for Max Fashion Show.',
      'Beyond being a wonderful professional to work with, Riyaz is also a great friend — someone who is genuine, supportive and a joy to be around on and off set. He creates an environment where creativity thrives…',
      'I have truly enjoyed every collaboration so far and I am very much looking forward to all the exciting works we have discussed and are yet to do together.'
    ],
    brandHighlights: [
      'Max Fashion Showstopper (2x)',
      'Event Jury & Judging Panel',
      'Commercial Ad Shoots'
    ]
  }
];

