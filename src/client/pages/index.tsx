import React from 'react';
import { Layout } from '../components/layout';
import { Header } from '../components/header';
import { Hero } from '../components/hero';

export default function Home() {
    return (
        <Layout title='Home'>
            <Header />
            <div className='container'>
                <Hero />
            </div>
        </Layout>
    );
}
