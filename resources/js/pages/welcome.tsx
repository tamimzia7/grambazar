import CategorySection from '@/components/home/category-section';
import FarmerDirect from '@/components/home/farmer-direct';
import FarmerStory from '@/components/home/farmer-story';
import Footer from '@/components/home/footer';
import Hero from '@/components/home/hero';
import Navbar from '@/components/home/navbar';
import ProductSection from '@/components/home/product-section';
import SeasonalSection from '@/components/home/seasonal-section';
import SpiceSection from '@/components/home/spice-section';
import VillageStory from '@/components/home/village-story';
import type { HomeProps } from '@/types/home';

export default function Welcome(props: HomeProps) {
    return (
        <div className="min-h-screen bg-white font-sans text-stone-800 antialiased">
            <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-lg focus:bg-emerald-700 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
            >
                মূল অংশে যান
            </a>

            <div className="flex min-h-screen flex-col">
                <Navbar categories={props.categories} />

                <main id="main" className="flex-1">
                    <Hero
                        featuredProduct={props.featuredProduct}
                        stats={props.stats}
                    />
                    <CategorySection categories={props.categories} />
                    <ProductSection
                        id="popular-products"
                        eyebrow="জনপ্রিয়"
                        title="গ্রাহকদের সেরা পছন্দের পণ্য"
                        description="সবাই যা কিনে বারবার ফিরে আসে — আমাদের বাছাই করা জনপ্রিয় পণ্যের তালিকা।"
                        products={props.popularProducts}
                    />
                    <FarmerDirect />
                    <SeasonalSection products={props.seasonalProducts} />
                    <SpiceSection products={props.spiceProducts} />
                    <VillageStory />
                    <FarmerStory />
                </main>

                <Footer />
            </div>
        </div>
    );
}
