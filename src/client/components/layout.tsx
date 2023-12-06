import Head from 'next/head';
import { ReactNode } from 'react';

export const Layout = ({ title, children }: { title: string; children: ReactNode }) => {
    return (
        <div className='px-4'>
            <Head>
                <title>{title}</title>
                <meta charSet='UTF-8' />
                <meta name='viewport' content='width=device-width, initial-scale=1.0' />
                <meta httpEquiv='X-UA-Compatible' content='ie=edge' />
            </Head>
            <div className='mx-auto max-w-screen-xl'>{children}</div>
        </div>
    );
};
