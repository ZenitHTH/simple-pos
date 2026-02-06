import { FaShoppingCart } from 'react-icons/fa';

export default function CartEmpty() {
    return (
        <div className="h-full flex flex-col items-center justify-center text-muted p-8 text-center bg-card-bg rounded-2xl border border-border">
            <div className="w-24 h-24 bg-muted/10 rounded-full flex items-center justify-center mb-6">
                <FaShoppingCart size={40} className="text-muted/50" />
            </div>
            <h3 className="text-xl font-medium mb-2 text-foreground">Cart is Empty</h3>
            <p className="max-w-[200px]">Select items from the menu to start a new order.</p>
        </div>
    );
}
