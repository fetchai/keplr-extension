import { useModal } from '@/components/modal-views/context';
import AuthorInformation from '@/components/author/author-information';
import { authorData } from '@/data/static/author';
import ProfileTab from '@/components/profile/profile-tab';
import { DotsIcon } from '@/components/icons/dots-icon';
// dummy data
import User1 from '@/assets/images/avatar/8.jpg';
import User2 from '@/assets/images/avatar/9.jpg';
import User3 from '@/assets/images/avatar/10.jpg';
import User4 from '@/assets/images/avatar/11.jpg';
import User5 from '@/assets/images/collection/collection-1.jpg';
import User6 from '@/assets/images/collection/collection-2.jpg';
import User7 from '@/assets/images/collection/collection-3.jpg';
import User8 from '@/assets/images/collection/collection-4.jpg';
import User9 from '@/assets/images/collection/collection-5.jpg';
import User10 from '@/assets/images/collection/collection-6.jpg';

const data = [
  { name: 'Amanda Jones', thumbnail: User1 },
  { name: 'Marcos Llanos', thumbnail: User2 },
  { name: 'Garry Heffernan', thumbnail: User3 },
  { name: 'Teresa J. Brown', thumbnail: User4 },
  { name: 'Williams Sarah', thumbnail: User5 },
  { name: 'Teresa W. Luter', thumbnail: User6 },
  { name: 'Dorothy Pacheco', thumbnail: User7 },
  { name: 'Christopher', thumbnail: User8 },
  { name: 'Ted Luster', thumbnail: User4 },
  { name: 'R. Foster', thumbnail: User9 },
  { name: 'Domingo', thumbnail: User3 },
  { name: 'Conway', thumbnail: User10 },
];

export default function RetroProfile() {
  const { openModal } = useModal();
  return (
    <div className="w-full pt-6">
      <div className="flex w-full flex-col items-center md:flex-row">
        <div className="text-center ltr:md:text-left rtl:md:text-right">
          <h2 className="text-xl font-medium tracking-tighter text-gray-900 dark:text-white xl:text-2xl">
            {authorData?.name}
          </h2>
          <div className="mt-1 text-sm font-medium tracking-tighter text-gray-600 dark:text-gray-400 xl:mt-3">
            @{authorData?.user_name}
          </div>
        </div>
        <div className="mt-5 flex md:mt-0 ltr:md:ml-auto rtl:md:mr-auto">
          <button
            onClick={() =>
              openModal('FOLLOWING_VIEW', {
                title: 'Following',
                count: '1,504',
                users: data,
              })
            }
          >
            <div className="inline-block text-sm font-medium tracking-tighter text-gray-900 ltr:pr-2 rtl:pl-2 dark:text-white">
              {authorData?.following}
            </div>
            <div className="inline-block text-sm tracking-tighter text-gray-600 dark:text-gray-400">
              Following
            </div>
          </button>
          <button
            className="ltr:pl-6 rtl:pr-6"
            onClick={() =>
              openModal('FOLLOWERS_VIEW', {
                title: 'Followers',
                count: '1,845',
                users: data,
              })
            }
          >
            <div className="inline-block text-sm font-medium tracking-tighter text-gray-900 ltr:pr-2 rtl:pl-2 dark:text-white">
              {authorData?.followers}
            </div>
            <div className="inline-block text-sm tracking-tighter text-gray-600 dark:text-gray-400">
              Followers
            </div>
          </button>
          <button
            className="cursor-pointer text-gray-500 transition hover:text-gray-900 ltr:pl-6 rtl:pr-6 dark:hover:text-white"
            onClick={() => openModal('PROFILE_INFO_VIEW')}
          >
            <DotsIcon className="relative h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="grow pt-6 pb-9 md:pb-0">
        <ProfileTab />
      </div>
      <AuthorInformation data={authorData} />
    </div>
  );
}
