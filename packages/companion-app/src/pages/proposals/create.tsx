import type { NextPageWithLayout } from '@/types';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import routes from '@/config/routes';
import Button from '@/components/ui/button';
import Image from '@/components/ui/image';
import { ExportIcon } from '@/components/icons/export-icon';
import { Close as CloseIcon } from '@/components/icons/close';
import Input from '@/components/ui/forms/input';
import Textarea from '@/components/ui/forms/textarea';
import Listbox, { ListboxOption } from '@/components/ui/list-box';
// static data
import votePool from '@/assets/images/vote-pool.svg';
import RootLayout from '@/layouts/_root-layout';

const actionOptions = [
  {
    name: 'Custom Contact',
    value: 'custom_contact',
  },
  {
    name: 'CRIPTIC Token',
    value: 'criptic_token',
  },
  {
    name: 'Reserve',
    value: 'reserve',
  },
];

const reserveOptions = [
  {
    name: 'Renounce Ownership',
    value: 'renounceOwnership',
  },
  {
    name: 'Set Rate Mantissa',
    value: 'setRateMantissa',
  },
  {
    name: 'Transfer Ownership',
    value: 'transferOwnership',
  },
  {
    name: 'Withdraw Reverse',
    value: 'withdrawReverse',
  },
];

const cripticTokenOptions = [
  {
    name: 'Approve',
    value: 'approve',
  },
  {
    name: 'Delegated',
    value: 'delegated',
  },
  {
    name: 'Mint',
    value: 'mint',
  },
  {
    name: 'Set Minter',
    value: 'setMinter',
  },
  {
    name: 'Transfer',
    value: 'transfer',
  },
  {
    name: 'Transfer From',
    value: 'transferFrom',
  },
];

function CripticTokenAction({
  selectedOption,
  onChange,
}: {
  selectedOption: ListboxOption;
  onChange: React.Dispatch<React.SetStateAction<ListboxOption>>;
}) {
  return (
    <>
      <Listbox
        className="w-full sm:w-80"
        options={cripticTokenOptions}
        selectedOption={selectedOption}
        onChange={onChange}
      />
      {selectedOption.value === 'approve' && (
        <>
          <Input
            label="Spender address"
            useUppercaseLabel={false}
            placeholder="Enter spender address"
            className="mt-4 ltr:xs:ml-6 rtl:xs:mr-6 ltr:sm:ml-12 rtl:sm:mr-12"
          />
          <Input
            label="Raw amount unit256"
            useUppercaseLabel={false}
            placeholder="Enter rawAmount in unit256"
            className="mt-4 ltr:xs:ml-6 rtl:xs:mr-6 ltr:sm:ml-12 rtl:sm:mr-12"
          />
        </>
      )}
      {selectedOption.value === 'delegated' && (
        <Input
          label="Delegated address"
          useUppercaseLabel={false}
          placeholder="Enter delegated address"
          className="mt-4 ltr:xs:ml-6 rtl:xs:mr-6 ltr:sm:ml-12 rtl:sm:mr-12"
        />
      )}
      {selectedOption.value === 'mint' && (
        <>
          <Input
            label="Dst address"
            useUppercaseLabel={false}
            placeholder="Enter dst address"
            className="mt-4 ltr:xs:ml-6 rtl:xs:mr-6 ltr:sm:ml-12 rtl:sm:mr-12"
          />
          <Input
            label="Raw amount unit256"
            useUppercaseLabel={false}
            placeholder="Enter rawAmount in unit256"
            className="mt-4 ltr:xs:ml-6 rtl:xs:mr-6 ltr:sm:ml-12 rtl:sm:mr-12"
          />
        </>
      )}
      {selectedOption.value === 'setMinter' && (
        <Input
          label="Minter address"
          useUppercaseLabel={false}
          placeholder="Enter minter address"
          className="mt-4 ltr:xs:ml-6 rtl:xs:mr-6 ltr:sm:ml-12 rtl:sm:mr-12"
        />
      )}
      {selectedOption.value === 'transfer' && (
        <>
          <Input
            label="Dst address"
            useUppercaseLabel={false}
            placeholder="Enter dst address"
            className="mt-4 ltr:xs:ml-6 rtl:xs:mr-6 ltr:sm:ml-12 rtl:sm:mr-12"
          />
          <Input
            label="Raw amount unit256"
            useUppercaseLabel={false}
            placeholder="Enter rawAmount in unit256"
            className="mt-4 ltr:xs:ml-6 rtl:xs:mr-6 ltr:sm:ml-12 rtl:sm:mr-12"
          />
        </>
      )}
      {selectedOption.value === 'transferFrom' && (
        <>
          <Input
            label="Src address"
            useUppercaseLabel={false}
            placeholder="Enter src address"
            className="mt-4 ltr:xs:ml-6 rtl:xs:mr-6 ltr:sm:ml-12 rtl:sm:mr-12"
          />
          <Input
            label="Dst address"
            useUppercaseLabel={false}
            placeholder="Enter dst address"
            className="mt-4 ltr:xs:ml-6 rtl:xs:mr-6 ltr:sm:ml-12 rtl:sm:mr-12"
          />
          <Input
            label="Raw amount unit256"
            useUppercaseLabel={false}
            placeholder="Enter rawAmount in unit256"
            className="mt-4 ltr:xs:ml-6 rtl:xs:mr-6 ltr:sm:ml-12 rtl:sm:mr-12"
          />
        </>
      )}
    </>
  );
}

function ActionFields() {
  let [actionType, setActionType] = useState(actionOptions[0]);
  let [reserveAction, setReserveAction] = useState(reserveOptions[0]);
  let [cripticTokenAction, setCripticTokenAction] = useState(
    cripticTokenOptions[0]
  );
  return (
    <div className="">
      <div className="group mb-4 rounded-md bg-gray-100/90 p-5 pt-3 dark:bg-dark/60 xs:p-6 xs:pb-8">
        <div className="-mr-2 mb-3 flex items-center justify-between">
          <h3 className="text-base font-medium dark:text-gray-100">
            Action #1
          </h3>
          <Button
            type="button"
            size="mini"
            shape="circle"
            variant="transparent"
            className="opacity-0 group-hover:opacity-100 dark:text-gray-300"
          >
            <CloseIcon className="h-auto w-[11px] xs:w-3" />
          </Button>
        </div>
        <>
          <Listbox
            className="w-full sm:w-80"
            options={actionOptions}
            selectedOption={actionType}
            onChange={setActionType}
          />
          {actionType.value === 'custom_contact' && (
            <Input
              className="mt-4 ltr:xs:ml-6 rtl:xs:mr-6 ltr:sm:ml-12 rtl:sm:mr-12"
              useUppercaseLabel={false}
              placeholder="Enter contact address 0x1f9840a85..."
            />
          )}
          {actionType.value === 'criptic_token' && (
            <div className="rtl:xs:mlr6 rtl:sm:mlr12 mt-4 ltr:xs:ml-6 ltr:sm:ml-12">
              <CripticTokenAction
                selectedOption={cripticTokenAction}
                onChange={setCripticTokenAction}
              />
            </div>
          )}
          {actionType.value === 'reserve' && (
            <div className="mt-4 ltr:xs:ml-6 rtl:xs:mr-6 ltr:sm:ml-12 rtl:sm:mr-12">
              <Listbox
                className="w-full sm:w-80"
                options={reserveOptions}
                selectedOption={reserveAction}
                onChange={setReserveAction}
              />
            </div>
          )}
        </>
      </div>
      <Button variant="ghost" className="mt-2 xs:mt-3">
        Add another action
      </Button>
    </div>
  );
}

const CreateProposalPage: NextPageWithLayout = () => {
  const router = useRouter();
  function goToAllProposalPage() {
    setTimeout(() => {
      router.push(routes.proposals);
    }, 800);
  }
  return (
    <>
      <NextSeo
        title="Create Proposal"
        description="Criptic - React Next Web3 NFT Crypto Dashboard Template"
      />
      <section className="mx-auto w-full max-w-[1160px] text-sm">
        <header className="mb-10 flex flex-col gap-4 rounded-lg bg-white p-5 py-6 shadow-card dark:bg-light-dark xs:p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4 xs:gap-3 xl:gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-dark">
              <Image alt="Vote Pool" src={votePool} width={32} height={32} />
            </div>
            <div>
              <h2 className="mb-2 text-base font-medium uppercase dark:text-gray-100 xl:text-lg">
                You have 100 votes
              </h2>
              <p className="leading-[1.8] text-gray-600 dark:text-gray-400">
                In order to submit a proposal you must have at least 10,000
                CRIPTIC tokens <br className="hidden xl:inline-block" />{' '}
                delegated to you{' '}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://medium.com/pooltogether/governance-101-fca9ab8b8ba2"
                  className="inline-flex items-center gap-2 text-gray-900 underline transition-opacity duration-200 hover:no-underline hover:opacity-90 dark:text-gray-100"
                >
                  Learn more <ExportIcon className="h-auto w-3" />
                </a>
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <Button
              shape="rounded"
              fullWidth={true}
              className="uppercase"
              onClick={() => goToAllProposalPage()}
            >
              All Proposal
            </Button>
          </div>
        </header>

        <h2 className="mb-5 text-lg font-medium dark:text-gray-100 sm:mb-6 lg:mb-7 xl:text-xl">
          Create a new proposal
        </h2>
        <div className="mb-6 rounded-lg bg-white p-5 shadow-card transition-shadow duration-200 hover:shadow-large dark:bg-light-dark xs:p-6 xs:pb-8">
          <h3 className="mb-2 text-base font-medium dark:text-gray-100 xl:text-lg">
            Actions
          </h3>
          <p className="mb-5 leading-[1.8] dark:text-gray-300">
            Enter the on-chain actions this proposal should take. Actions are
            executed in the order laid out here (ie. Action #1 fires, then
            Action #2, etc.)
          </p>
          <ActionFields />
        </div>
        <div className="mb-6 rounded-lg bg-white p-5 shadow-card transition-shadow duration-200 hover:shadow-large dark:bg-light-dark xs:p-6 xs:pb-8">
          <h3 className="mb-2 text-base font-medium dark:text-gray-100 xl:text-lg">
            Title
          </h3>
          <p className="mb-5 leading-[1.8] dark:text-gray-300">
            Your title introduces your proposal to the voters. Make sure it is
            clear and to the point.
          </p>
          <Input placeholder="Enter title of your proposal" />
        </div>
        <div className="mb-6 rounded-lg bg-white p-5 shadow-card transition-shadow duration-200 hover:shadow-large dark:bg-light-dark xs:p-6 xs:pb-8">
          <h3 className="mb-2 text-base font-medium dark:text-gray-100 xl:text-lg">
            Description
          </h3>
          <p className="mb-5 leading-[1.8] dark:text-gray-300">
            Your description should present in full detail what the actions of
            the proposal will do. This is where voters will educate themselves
            on what they are voting on.
          </p>
          <Textarea
            placeholder="Add the proposal details here"
            inputClassName="md:h-32 xl:h-36"
          />
        </div>
        <div className="mt-6">
          <Button
            size="large"
            shape="rounded"
            fullWidth={true}
            className="xs:w-64 md:w-72"
          >
            Create Proposal
          </Button>
        </div>
      </section>
    </>
  );
};

CreateProposalPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default CreateProposalPage;
