import Avatar from '@/components/ui/avatar';
import { useModal } from '@/components/modal-views/context';
import Button from '@/components/ui/button';
import Scrollbar from '@/components/ui/scrollbar';

export default function Followers({ ...props }) {
  const { data } = useModal();

  return (
    <div
      className="relative z-50 mx-auto h-[600px] w-[540px] max-w-full rounded-lg bg-white px-6 py-6 dark:bg-light-dark"
      {...props}
    >
      {data && (
        <h3 className="mb-5 text-lg font-medium ltr:text-left rtl:text-right">
          {data?.title} ({data?.count})
        </h3>
      )}
      <Scrollbar style={{ height: 'calc(100% - 60px)' }}>
        <div className="ltr:pr-2 rtl:pl-2">
          {data?.users.map((user: any, index: number) => (
            <div
              className="flex items-center border-b border-dashed border-gray-200 py-4 text-center dark:border-gray-700"
              key={user.name + index}
            >
              <Avatar
                className="!h-12 !w-12"
                image={user?.thumbnail}
                alt="Author"
              />
              <h2 className="text-md tracking-tighter text-gray-900 ltr:ml-4 rtl:mr-4 dark:text-white">
                {user?.name}
              </h2>
              <Button
                color="white"
                className="shadow-card ltr:ml-auto rtl:mr-auto dark:bg-light-dark md:h-10 md:px-5 xl:h-12 xl:px-7"
              >
                Follow
              </Button>
            </div>
          ))}
        </div>
      </Scrollbar>
    </div>
  );
}
