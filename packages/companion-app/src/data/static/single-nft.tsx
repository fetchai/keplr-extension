import SingleNft from '@/assets/images/single-nft.jpg';

import Bitcoin from '@/assets/images/currency/bitcoin.svg';
import Ethereum from '@/assets/images/currency/ethereum.svg';
import Avatar1 from '@/assets/images/avatar/1.png';
import Avatar2 from '@/assets/images/avatar/2.png';
import Avatar3 from '@/assets/images/avatar/3.png';
import Avatar4 from '@/assets/images/avatar/4.png';
import Avatar5 from '@/assets/images/avatar/5.png';
import Avatar6 from '@/assets/images/avatar/6.png';

export const nftData = {
  isAuction: true,
  name: 'Flow Punk Gallery #303',
  image: SingleNft,
  minted_date: 'Jan 26, 2022',
  minted_slug: 'https://etherscan.io/',
  price: 0.2,
  description:
    'Fisherian Runaways, Child of #48 Bat Veil & #42 Screw Nose. This mushroom is the result of the cross-breeding of two original one of a kind generative mushrooms donated back to the Fisherian Runaways project their generous owner.',
  creator: { id: 1, logo: Avatar1, name: '@Cameronwilliamson', slug: '#' },
  collection: { id: 1, logo: Avatar3, name: 'Criptic', slug: '#' },
  owner: { id: 1, logo: Avatar4, name: '@williamson', slug: '#' },
  block_chains: [
    { id: 1, logo: Bitcoin, name: 'Ethereum', slug: '#' },
    { id: 2, logo: Ethereum, name: 'Bitcoin', slug: '#' },
  ],
  bids: [
    {
      id: 1,
      label: 'Bid Placed',
      name: 'ronson',
      authorSlug: '#',
      created_at: '2022-01-22T17:26:22.000000Z',
      avatar: Avatar1,
      amount: 0.02,
      transactionUrl: '#',
    },
    {
      id: 2,
      label: 'Bid Placed',
      name: 'Cameron',
      authorSlug: '#',
      created_at: '2022-02-22T17:26:22.000000Z',
      avatar: Avatar2,
      amount: 0.05,
      transactionUrl: '#',
    },
    {
      id: 3,
      label: 'Bid Placed',
      name: 'Williamson',
      authorSlug: '#',
      created_at: '2022-03-22T17:26:22.000000Z',
      avatar: Avatar3,
      amount: 0.07,
      transactionUrl: '#',
    },
    {
      id: 4,
      label: 'Bid Placed',
      name: 'ronson',
      authorSlug: '#',
      created_at: '2022-01-22T17:26:22.000000Z',
      avatar: Avatar4,
      amount: 0.78,
      transactionUrl: '#',
    },
    {
      id: 5,
      label: 'Bid Placed',
      name: 'Cameron',
      authorSlug: '#',
      created_at: '2022-02-22T17:26:22.000000Z',
      avatar: Avatar5,
      amount: 0.98,
      transactionUrl: '#',
    },
    {
      id: 6,
      label: 'Bid Placed',
      name: 'Williamson',
      authorSlug: '#',
      created_at: '2022-03-22T17:26:22.000000Z',
      avatar: Avatar6,
      amount: 1.01,
      transactionUrl: '#',
    },
  ],
  history: [
    {
      id: 1,
      label: 'Minted',
      name: 'Williamson',
      authorSlug: '#',
      created_at: '2022-03-22T17:26:22.000000Z',
      avatar: Avatar3,
      amount: null,
      transactionUrl: '#',
    },
    {
      id: 2,
      label: 'Listed',
      name: 'Cameron',
      authorSlug: '#',
      created_at: '2022-02-22T17:26:22.000000Z',
      avatar: Avatar2,
      amount: null,
      transactionUrl: '#',
    },
    {
      id: 3,
      label: 'Bid Placed',
      name: 'ronson',
      authorSlug: '#',
      created_at: '2022-01-22T17:26:22.000000Z',
      avatar: Avatar1,
      amount: 1.01,
      transactionUrl: '#',
    },
  ],
};
