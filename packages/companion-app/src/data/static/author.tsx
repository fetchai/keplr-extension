import CoverImage from '@/assets/images/profile-cover.jpg';
import AuthorImage from '@/assets/images/author.jpg';
import { Instagram } from '@/components/icons/brands/instagram';
import { Twitter } from '@/components/icons/brands/twitter';
import { Facebook } from '@/components/icons/brands/facebook';
import User1 from '@/assets/images/avatar/4.png';
import User2 from '@/assets/images/avatar/2.png';
import User3 from '@/assets/images/avatar/3.png';
import User4 from '@/assets/images/avatar/1.png';
import User5 from '@/assets/images/avatar/6.png';

export const authorData = {
  id: 157896,
  name: 'Spy Thirtythree',
  user_name: 'Cameronwilliamson',
  wallet_key:
    '0x9Af568442868356c7aE834A47614600002545476555555555772d9F5B87e9b',
  created_at: 'November 2021',
  cover_image: {
    id: 1,
    thumbnail: CoverImage,
    original: CoverImage,
  },
  avatar: {
    id: 1,
    thumbnail: AuthorImage,
    original: AuthorImage,
  },
  bio: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis.',
  following: '1,504',
  followers: '1,845',
  followed_by: [
    {
      id: 1,
      name: 'Thirtythree',
      slug: 'thirtythree',
      avatar: {
        id: 1,
        thumbnail: User1,
        original: User1,
      },
    },
    {
      id: 2,
      name: 'Thirtythree',
      slug: 'thirtythree',
      avatar: {
        id: 1,
        thumbnail: User2,
        original: User2,
      },
    },
    {
      id: 3,
      name: 'Thirtythree',
      slug: 'thirtythree',
      avatar: {
        id: 1,
        thumbnail: User3,
        original: User3,
      },
    },
    {
      id: 4,
      name: 'Thirtythree',
      slug: 'thirtythree',
      avatar: {
        id: 1,
        thumbnail: User4,
        original: User4,
      },
    },
    {
      id: 5,
      name: 'Thirtythree',
      slug: 'thirtythree',
      avatar: {
        id: 1,
        thumbnail: User5,
        original: User5,
      },
    },
  ],
  socials: [
    {
      id: 1,
      title: '@dontbesovasya',
      link: 'https://dontbesovasya.io',
      icon: <Twitter className="w-4" />,
    },
    {
      id: 2,
      title: '@dontbesovasya',
      link: 'https://dontbesovasya.io',
      icon: <Facebook className="w-4" />,
    },
    {
      id: 3,
      title: '@dontbesovasya',
      link: 'https://dontbesovasya.io',
      icon: <Instagram className="w-4" />,
    },
  ],
  links: [
    {
      id: 1,
      title: '@dontbesovasya',
      link: 'https://dontbesovasya.io',
    },
    {
      id: 2,
      title: '@dontbesovasya',
      link: 'https://dontbesovasya.io',
    },
  ],
};
