import { Image, ProductImage, BackendProduct } from "@/lib";
import { FaSearch } from "react-icons/fa";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface LinkImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedImage: Image | null;
  productSearch: string;
  setProductSearch: (s: string) => void;
  filteredProductsToLink: BackendProduct[];
  links: ProductImage[];
  toggleLink: (productId: number, isLinked: boolean) => void;
}

export default function LinkImageModal({
  isOpen,
  onClose,
  selectedImage,
  productSearch,
  setProductSearch,
  filteredProductsToLink,
  links,
  toggleLink,
}: LinkImageModalProps) {
  if (!isOpen || !selectedImage) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Link Image: ${selectedImage.file_name}`}
    >
      <div className="space-y-4">
        <div className="relative">
          <FaSearch className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2" />
          <Input
            placeholder="Search products..."
            className="pl-9"
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
          />
        </div>
        <div className="max-h-[300px] space-y-2 overflow-y-auto rounded-md border p-2">
          {filteredProductsToLink.map((product) => {
            const isLinked = links.some(
              (l) =>
                l.product_id === product.product_id &&
                l.image_id === selectedImage.id,
            );
            return (
              <div
                key={product.product_id}
                className={`hover:bg-muted flex items-center justify-between rounded-md p-2 transition-colors ${
                  isLinked ? "bg-primary/5 border-primary/20 border" : ""
                }`}
              >
                <span className={isLinked ? "text-primary font-semibold" : ""}>
                  {product.title}
                </span>
                <Button
                  size="sm"
                  variant={isLinked ? "default" : "outline"}
                  onClick={() => toggleLink(product.product_id, isLinked)}
                >
                  {isLinked ? "Linked" : "Link"}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
