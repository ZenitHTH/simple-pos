import { Product } from '../types';
import Image from 'next/image';

interface ProductCardProps {
    product: Product;
    onAdd: (product: Product) => void;
    currency: string;
}

export default function ProductCard({ product, onAdd, currency }: ProductCardProps) {
    return (
        <div
            onClick={() => onAdd(product)}
            className="group bg-card-bg border border-border rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:-translate-y-1 active:scale-95"
        >
            <div
                className="aspect-[3/2] w-full relative bg-muted/20"
                style={{ backgroundColor: !product.image ? (product.color || '#e2e8f0') : undefined }}
            >
                {product.image ? (
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted font-bold text-2xl opacity-20">
                        {product.name.charAt(0)}
                    </div>
                )}

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 hover:bg-transparent" />
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-foreground text-[1.25em] leading-tight line-clamp-2">{product.name}</h3>
                </div>

                <div className="flex justify-between items-center mt-2">
                    <span className="text-muted text-[1em] px-2 py-0.5 rounded-full bg-secondary/10 border border-border">
                        {product.category}
                    </span>
                    <span className="font-bold text-primary text-[1.5em]">
                        {currency}{product.price.toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
}
