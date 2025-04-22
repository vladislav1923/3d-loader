'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        router.push('/browser');
    }, [router]);
    
    return (
        <div>Main page</div>
    );
}