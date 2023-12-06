import Image from 'next/image';
import { Button } from './button';
import Link from 'next/link';

export const Header = ({ showOnlyLogo = false }: { showOnlyLogo?: boolean }) => {
    return (
        <header className='flex justify-between mt-8'>
            <Link href='/'>
                <Image src='/logo.svg' alt='Logo' width={200} height={100} />
            </Link>
            {!showOnlyLogo && (
                <>
                    <Link href='/try'>
                        <Button label='Try it' variant='primary' />
                    </Link>
                </>
            )}
        </header>
    );
};
