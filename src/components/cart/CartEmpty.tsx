import { FaShoppingCart } from "react-icons/fa";

export default function CartEmpty() {
  return (
    <div className="text-muted-foreground bg-card text-card-foreground border-border flex h-full flex-col items-center justify-center rounded-2xl border p-8 text-center">
      <div className="bg-muted/10 mb-6 flex h-24 w-24 items-center justify-center rounded-full">
        <FaShoppingCart size={40} className="text-muted-foreground/50" />
      </div>
      <h3 className="text-foreground mb-2 text-xl font-medium">
        Cart is Empty
      </h3>
      <p className="text-muted-foreground max-w-[200px]">
        Select items from the menu to start a new order.
      </p>
    </div>
  );
}
