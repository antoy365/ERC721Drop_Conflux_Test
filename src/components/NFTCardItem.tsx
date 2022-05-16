import React, { useState } from "react";
import { utils, BigNumber } from "ethers";

interface NFTCardProps {
  id: number;
  name: string;
  price: BigNumber;
  image: string; // Ссылка на картинку, полученная из метаданных контракта (например, ipfs://bafybei.../0.jpg)
  isSold: boolean;
  actionId: number | null;
  primaryColor: string | undefined;
  onBuy: (id: number, price: BigNumber) => void;
}

// Список надежных публичных шлюзов для конвертации ipfs://
const PUBLIC_GATEWAYS = [
  "https://ipfs.thirdwebcdn.com/ipfs/",
  "https://cloudflare-ipfs.com",
  "https://ipfs.io"
];

export const NFTCardItem: React.FC<NFTCardProps> = ({
  id,
  name,
  price,
  image,
  isSold,
  actionId,
  primaryColor,
  onBuy,
}) => {
  const [gatewayIdx, setGatewayIdx] = useState(0);

  const getImageUrl = () => {
    // 1. Если с контракта ничего не пришло, возвращаем заглушку
    if (!image) return "https://placehold.co";

    // 2. Если контракт уже вернул готовую HTTP-ссылку (веб-адрес)
    if (image.startsWith("http")) {
      return image;
    }

    // 3. Если контракт вернул ссылку в децентрализованном формате ipfs://...
    if (image.startsWith("ipfs://")) {
      const ipfsPath = image.replace("ipfs://", ""); // Отрезаем префикс ipfs://
      const currentGateway = PUBLIC_GATEWAYS[gatewayIdx] || PUBLIC_GATEWAYS[0];
      return `${currentGateway}${ipfsPath}`;
    }

    // 4. Если контракт вернул чистый CID папки или хэш (на всякий случай)
    const currentGateway = PUBLIC_GATEWAYS[gatewayIdx] || PUBLIC_GATEWAYS[0];
    return `${currentGateway}${image}`;
  };

  const handleImageError = () => {
    // Если один шлюз перегружен или выдал ошибку, переключаемся на следующий
    if (gatewayIdx < PUBLIC_GATEWAYS.length - 1) {
      setGatewayIdx((prev) => prev + 1);
    }
  };

  return (
    <div
      className={`border rounded-2xl bg-card overflow-hidden shadow-sm flex flex-col transition-all duration-300 ${
        isSold ? "opacity-60 grayscale-[30%]" : "hover:shadow-md hover:-translate-y-1"
      }`}
    >
      {/* Изображение карточки */}
      <div className="relative aspect-square bg-muted flex items-center justify-center overflow-hidden">
        <img
          src={getImageUrl()}
          alt={name}
          loading="lazy"
          onError={handleImageError}
          className="w-full h-full object-cover transition-opacity duration-300"
        />

        <div className="absolute top-3 left-3 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
          ID #{id}
        </div>

        {isSold && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md shadow-md">
              Sold
            </span>
          </div>
        )}
      </div>

      {/* Информация и цена */}
      <div className="p-4 flex flex-col flex-1 justify-between space-y-4">
        <div>
          <h3 className="font-bold text-base truncate">{name}</h3>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-muted-foreground">Price:</span>
            <span className="text-sm font-extrabold text-blue-500 dark:text-blue-400">
              {utils.formatEther(price)} CFX
            </span>
          </div>
        </div>

        {/* Кнопка покупки */}
        <button
          disabled={isSold || actionId !== null}
          onClick={() => onBuy(id, price)}
          className="w-full py-2 rounded-xl text-white font-semibold text-xs tracking-wide transition-all disabled:opacity-50 disabled:pointer-events-none"
          style={{ backgroundColor: isSold ? "#6B7280" : (primaryColor || "#3B82F6") }}
        >
          {actionId === id
            ? "Purchase..."
            : isSold
              ? "Already sold out"
              : "Buy NFT"
          }
        </button>
      </div>
    </div>
  );
};
