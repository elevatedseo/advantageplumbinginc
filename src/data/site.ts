export const site = {
  name: 'Advantage Plumbing',
  tagline: 'Your In-Home Plumbing Specialist',
  phoneDisplay: '(402) 614-2673',
  phoneHref: 'tel:+14026142673',
  serviceArea: 'Omaha, Bellevue, Council Bluffs, IA and surrounding areas',
  hours: [
    ['Monday–Friday', '8:00 AM–4:30 PM'],
    ['Saturday–Sunday', 'Closed'],
  ],
};

// Each point is backed by published site copy (About page, homepage and the Angie's List award).
export const trustPoints = [
  { title: 'Family owned', text: 'A small, local team that treats your home like our own.' },
  { title: 'Master plumber led', text: 'Over 20 years in the trade, owner on the job.' },
  { title: 'Same-day service', text: 'Available throughout the entire Omaha region.' },
  { title: 'Clean as we go', text: 'We explain the work first and tidy up after.' },
];

export const brands = [
  'Enviro Water Products', 'State Water Heaters', 'Watts WaterPEX', 'GROHE', 'American Standard', 'Bradford White',
  'Navien', 'A. O. Smith', 'Kenmore', 'Rinnai', 'BrassCraft', 'Flexcon Industries',
];

export const navigation = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about-us/' },
  {
    label: 'Services',
    href: '/services/',
    children: [
      { label: 'Plumbing', href: '/plumbing/' },
      { label: 'Water Heaters', href: '/water-heaters/' },
      { label: 'Water Treatment Systems', href: '/water-treatment-systems/' },
    ],
  },
  { label: 'Schedule Service', href: '/contact-us/' },
];

export const services = [
  {
    title: 'Plumbing and Drains',
    href: '/plumbing/',
    summary: 'Our team of professionals are here to assist you from a leaking pipe to a kitchen sink clog we are your in-home plumbing specialists.',
    icon: 'pipe',
  },
  {
    title: 'Water Heaters',
    href: '/water-heaters/',
    summary: 'Trust Advantage Plumbing for water heater repair and replacement of gas, electric and tankless water heaters. Our experts will ensure you have hot water fast!',
    icon: 'heater',
  },
  {
    title: 'Water Treatment Systems',
    href: '/water-treatment-systems/',
    summary: 'Advantage Plumbing field engineers are experts at treating and operating most types of water filtration systems.',
    icon: 'drop',
  },
];

export const testimonials = [
  {
    quote: 'Mike from Advantage Plumbing was flexible, friendly and professional. He explained the repairs clearly so I knew what to expect, arrived on time and completed the repairs in an efficient manner. I will definitely use Advantage Plumbing again in the future!',
    author: 'Jandar',
  },
  {
    quote: 'A Plumber who came to the job and explained everything that needed to be done and why before jumping in to do it. Was very courteous and fixed my plumbing problem in an efficient manner. I would recommend Advantage Plumbing to anyone!',
    author: 'Scott',
  },
  {
    quote: 'Mike from Advantage Plumbing replaced our water heater and did several other repair jobs. He arrived when he had scheduled, did all of the work within the estimated amount, cleaned up after he was finished. The quality of work was excellent and I would highly recommend this company.',
    author: 'Jim L.',
  },
];
