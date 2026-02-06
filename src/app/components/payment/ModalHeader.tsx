import { memo } from 'react';
import { FaMoneyBillWave, FaTimes } from 'react-icons/fa';

interface ModalHeaderProps {
    onClose: () => void;
}

const ModalHeader = memo(({ onClose }: ModalHeaderProps) => (
    <div className="p-4 lg:p-5 border-b border-border flex justify-between items-center bg-card-bg/50">
        <h2 className="text-2xl font-bold flex items-center gap-2">
            <FaMoneyBillWave className="text-green-500" aria-hidden="true" />
            Cash Payment
        </h2>
        <button
            onClick={onClose}
            className="p-2 hover:bg-muted/20 rounded-full transition-colors text-muted hover:text-foreground"
            aria-label="Close modal"
        >
            <FaTimes />
        </button>
    </div>
));

ModalHeader.displayName = 'ModalHeader';

export default ModalHeader;
