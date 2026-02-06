import { CartItem as CartItemType } from '../../types';
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import Image from 'next/image';

interface CartItemProps {
    item: CartItemType;
    currency: string;
    onUpdateQuantity: (id: number, delta: number) => void;
    onRemove: (id: number) => void;
}

export default function CartItem({ item, currency, onUpdateQuantity, onRemove }: CartItemProps) {
    return (
        <div className="flex items-center gap-4 p-3 bg-background rounded-xl border border-border group hover:border-primary/30 transition-colors">
            <div
                className="w-16 h-16 rounded-lg overflow-hidden relative shrink-0 border border-border bg-muted/20"
                style={{ backgroundColor: !item.image ? (item.color || '#e2e8f0') : undefined }}
            >
                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted font-bold text-lg opacity-20">
                        {item.name.charAt(0)}
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground truncate">{item.name}</h4>
                <div className="text-primary font-bold">
                    {currency}{(item.price * item.quantity).toFixed(2)}
                </div>
            </div>

            <div className="flex items-center gap-3 bg-card-bg border border-border rounded-lg p-1">
                <button
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted/20 text-muted hover:text-foreground transition-colors"
                >
                    <FaMinus size={10} />
                </button>
                <span className="font-medium w-4 text-center">{item.quantity}</span>
                <button
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted/20 text-muted hover:text-foreground transition-colors"
                >
                    <FaPlus size={10} />
                </button>
            </div>

            <button
                onClick={() => onRemove(item.id)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-muted/50 hover:text-red-500 hover:bg-red-500/10 transition-colors ml-1"
            >
                <FaTrash size={14} />
            </button>
        </div>
    );
}
