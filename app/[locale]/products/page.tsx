
import ProductsBrowser from "@/components/product/ProductsBrowser";
import { getProductsAndCategories } from "@/actions/product";


export default async function ProductsPage() {
    const { products, categories } = await getProductsAndCategories();
    return <ProductsBrowser products={products} categories={categories} />;
}


