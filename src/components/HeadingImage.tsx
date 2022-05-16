import React from "react";

interface HeadingImageProps {
  src: string;
  isLoading: boolean;
}

export const HeadingImage: React.FC<HeadingImageProps> = ({ src, isLoading }) => {
  if (isLoading) {
    // Показываем красивый серый пульсирующий блок загрузки (скелетон)
    return (
      <div className="w-full h-48 rounded-xl bg-muted animate-pulse flex items-center justify-center text-muted-foreground text-sm">
        Loading header...
      </div>
    );
  }

  // Если ссылка на картинку пустая, возвращаем заглушку или ничего
  if (!src) {
    return (
      <div className="w-full h-48 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-inner">
        NFT Collection
      </div>
    );
  }

  return (
    <img
      src={src}
      alt="Collection Header"
      className="w-full h-48 object-cover rounded-xl shadow-md"
    />
  );
};
