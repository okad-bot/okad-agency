// Educational reels by Olga, shown on /blog and the homepage.
// Add one object per reel. `cover` is a 9:16 image in /public (e.g. /images/reels/hooks.jpg),
// `url` is the Instagram / TikTok / YouTube Shorts link. Leave the array empty to show "coming soon".
export type Reel = { title: string; url: string; cover: string; topic?: string };

export const reels: Reel[] = [
  // { title: 'Why 3 hooks beat 1', url: 'https://www.instagram.com/reel/...', cover: '/images/reels/hooks.jpg', topic: 'creative-testing' },
];

// Topics shown on the "coming soon" placeholders until real reels are added.
export const upcoming = ['What makes a hook stop the scroll', 'How many ad variations to test', 'How to brief creators'];
