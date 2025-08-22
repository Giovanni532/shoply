"use server";

import Hero from "@/components/hero";
import FeaturesSection from "@/components/home/features";
import CtaBanner from "@/components/home/cta-banner";
import { getHomeProducts } from "@/actions/product";
import ProductCard from "@/components/product/card-product";


export default async function Home() {
    const products = await getHomeProducts();
    return (
        <>
            <Hero />
            <FeaturesSection />
            <div className="flex flex-col items-center justify-center py-10 z-10">
                <h2 className="text-2xl font-bold text-center py-10">Nos produits</h2>
                <div className="flex flex-wrap gap-8 justify-center items-center">
                    {products.map(p => (
                        <ProductCard key={p.id} {...p} />
                    ))}
                </div>
            </div>
            <CtaBanner />

        </>
    );
}


