import { Image, BackendProduct, parseImageStyle } from "@/lib";
import { FaTrash, FaLink, FaCrop } from "react-icons/fa";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { convertFileSrc } from "@/lib/api/invoke";

interface ImageGridProps {
  images: Image[];
  getProductUsage: (imageId: number) => BackendProduct[];
  openLinkModal: (img: Image) => void;
  openPositionModal: (img: Image) => void;
  handleDelete: (img: Image) => void;
}

export default function ImageGrid({
  images,
  getProductUsage,
  openLinkModal,
  openPositionModal,
  handleDelete,
}: ImageGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {images.map((img) => {
        const usedBy = getProductUsage(img.id);
        const src = convertFileSrc(img.file_path);

        return (
          <Card key={img.id} className="group relative overflow-hidden">
            <div className="bg-muted relative flex aspect-square items-center justify-center overflow-hidden">
              <img
                src={src}
                alt={img.file_name}
                style={parseImageStyle(img.image_object_position)}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => openLinkModal(img)}
                  title="Link to Products"
                >
                  <FaLink />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => openPositionModal(img)}
                  title="Adjust Position"
                >
                  <FaCrop />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(img)}
                  title="Delete"
                >
                  <FaTrash />
                </Button>
              </div>
            </div>
            <div className="p-3 text-sm">
              <div className="truncate font-medium" title={img.file_name}>
                {img.file_name}
              </div>
              <div className="text-muted-foreground mt-1 text-xs">
                {usedBy.length === 0
                  ? "Unused"
                  : `Used by ${usedBy.length} products`}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
