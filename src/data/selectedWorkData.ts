// Source: client document "RFR By Riyas — Timeline".
// Images are Google Drive thumbnails of the original files (verified public, HTTP 200 image/jpeg).
// Only the TIC Launch Event is attributed to Trivandrum Influencer Circle; all other entries
// are Riyas's individual professional portfolio.

export interface SelectedWork {
  id: string;
  year: number;
  title: string;
  category: 'Fashion & Retail' | 'Automotive' | 'Events' | 'Hospitality & Lifestyle' | 'Advertising' | 'Music & Entertainment';
  driveFileId: string;
  isTIC?: boolean;
}

export const driveThumb = (id: string, w = 1000) => `https://drive.google.com/thumbnail?id=${id}&sz=w${w}`;
export const driveView = (id: string) => `https://drive.google.com/file/d/${id}/view`;

export const selectedWork: SelectedWork[] = [
  { id: 'tic-launch', year: 2026, title: 'Trivandrum Influencer Circle Launch Event', category: 'Events', driveFileId: '13KL_xZOjSNeBFJDSfbLic-0wMlBT9lDf', isTIC: true },
  { id: 'citroen', year: 2026, title: 'Citroën Ad Campaign', category: 'Automotive', driveFileId: '17xhWbUtxJePM8igOO7VADLDfiqcG6S04' },
  { id: 'jeep', year: 2026, title: 'Jeep Ad Campaign', category: 'Automotive', driveFileId: '1Dy1LKriiRMpgoQde6LlMlN0crd2dfh21' },
  { id: 'skoda-ad', year: 2026, title: 'Škoda Ad Campaign', category: 'Automotive', driveFileId: '1ljkeLX6dlLT_jUgpKiNrDcnq34WC_wvX' },
  { id: 'fans-of-skoda', year: 2026, title: 'Fans of Škoda — Škoda Event', category: 'Events', driveFileId: '13o-0qqwpA1ERsc7AnB67udNe5jQNAI4R' },
  { id: 'rb', year: 2026, title: 'R&B Ad Campaign', category: 'Advertising', driveFileId: '15a_Xh_NZDPL60y73uq_752cJsAyN4S-a' },
  { id: 'pothys', year: 2025, title: 'Pothys Swarnamahal — Vishu Influencer Campaign', category: 'Fashion & Retail', driveFileId: '1pCPpzIG-bo2Z7wiq1rYvQ3Mm1xWQ6tOO' },
  { id: 'rewind', year: 2025, title: 'Rewind with Riyas — Celebrity Interview Podcast', category: 'Music & Entertainment', driveFileId: '1BwkKNnLO0pV78_R2Cz-wjgL8pBP1eV7E' },
  { id: 'dandya', year: 2025, title: 'Dandya Night', category: 'Events', driveFileId: '1dy6TIwofRd4bWLMrdHeiykYkqTVbFIFw' },
  { id: 'healing-swan', year: 2025, title: 'Healing Swan — Wellness Center Ad', category: 'Advertising', driveFileId: '1OlgBH9hHzF1GtYfPOlPvwaJaA_xtUmgc' },
  { id: 'nissan-2025', year: 2025, title: 'Influencer Campaign — Nissan', category: 'Automotive', driveFileId: '1gb6THCIg1MQ75dKOEKd7d52cea7Uh5L_' },
  { id: 'max-2025', year: 2025, title: 'Influencer Campaign — Max', category: 'Fashion & Retail', driveFileId: '1vLeEHWch-OxIwEdpMVSQCm4PL-h6cwbI' },
  { id: 'aaravam', year: 2024, title: 'Aaravam — Times of India Event', category: 'Events', driveFileId: '1rmoPoNcownVaPXRYmkaSa3M-n7u6yqhc' },
  { id: 'ather', year: 2024, title: 'Ather Scooter — Influencer Campaign', category: 'Automotive', driveFileId: '1agM4IPcwpZHfsXjbA-o8SfP4kkpPW1t_' },
  { id: 'nissan-2024', year: 2024, title: 'Nissan Influencer Campaigns', category: 'Automotive', driveFileId: '1VwTvpaUWW_I9WpXsRP-CPdGz9AHAqRCV' },
  { id: 'buildhub', year: 2024, title: 'Build Hub Ad', category: 'Advertising', driveFileId: '1GEWSZYSU8qQKNW05-dSMkmuUBd2AbOhV' },
  { id: 'scoria', year: 2024, title: 'Scoria Lights Ad', category: 'Advertising', driveFileId: '1u1CYzKO07CXsMZqmVPcfM_IN7LyJuD9K' },
  { id: 'max-onam-2022', year: 2022, title: 'Max Onam Collection Launch', category: 'Fashion & Retail', driveFileId: '1LYuokKdcbWKHTX5_fThVLGgKZ4JiM_xq' },
  { id: 'max-xmas-uds', year: 2021, title: 'MAX Xmas Collection Launch Event at UDS', category: 'Hospitality & Lifestyle', driveFileId: '1zhhm9Oj2Uz2Znskemv_8JL_OA9hWm4rT' },
  { id: 'max-onam-2021', year: 2021, title: 'Max Influencer Campaign — Onam', category: 'Fashion & Retail', driveFileId: '13oW-kpjZX61Nwlljk3rtDIhyIxGgwtQX' },
];
