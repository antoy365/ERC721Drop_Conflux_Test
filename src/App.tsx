import { BigNumber, utils, ethers } from "ethers";
import { useState, useEffect } from "react";
import { PoweredBy } from "./components/PoweredBy";
import { useToast } from "./components/ui/use-toast";
import { NFTCardItem } from "./components/NFTCardItem";
import { contractConst, primaryColorConst, themeConst } from "./consts/parameters";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const urlParams = new URL(window.location.toString()).searchParams;
const contractAddress = urlParams.get("contract") || contractConst || "";
const primaryColor = urlParams.get("primaryColor") || primaryColorConst || undefined;

const PUBLIC_RPC = "https://evmtestnet.confluxrpc.com";

// Перенаправляем IPFS на ваш выделенный шлюз Pinata
const resolveIpfsUrl = (url: string) => {
  if (!url) return "";

  let cleanedUrl = url.trim().replace(/^["']|["']$/g, "");

  if (cleanedUrl.startsWith("http://") || cleanedUrl.startsWith("https://")) {
    return cleanedUrl;
  }

  if (cleanedUrl.startsWith("ipfs://ipfs/")) {
    return cleanedUrl.replace("ipfs://ipfs/", "https://ivory-near-zebra-332.mypinata.cloud/ipfs/");
  }

  if (cleanedUrl.startsWith("ipfs://")) {
    return cleanedUrl.replace("ipfs://", "https://ivory-near-zebra-332.mypinata.cloud/ipfs/");
  }

  if (cleanedUrl.startsWith("Qm") || cleanedUrl.startsWith("bafy")) {
    return `https://ivory-near-zebra-332.mypinata.cloud/ipfs/${cleanedUrl}`;
  }

  return cleanedUrl;
};

const contractABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function maxSupply() view returns (uint256)",
  "function mintPrice() view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function mint(uint256 quantity) public payable"
];

interface NFTCard {
  id: number;
  name: string;
  price: BigNumber;
  image: string;
  isSold: boolean;
}

export default function App() {
  const { toast } = useToast();
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [loadingCards, setLoadingCards] = useState(false);
  const [actionId, setActionId] = useState<number | null>(null);

  const [contractName, setContractName] = useState("");
  const [numberClaimed, setNumberClaimed] = useState("0");
  const [numberTotal, setNumberTotal] = useState("0");
  const [mintPrice, setMintPrice] = useState<BigNumber>(BigNumber.from(0));
  const [nftStorefront, setNftStorefront] = useState<NFTCard[]>([]);

  let theme = (urlParams.get("theme") || themeConst || "light") as "light" | "dark" | "system";
  if (theme === "system") {
    theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  useEffect(() => {
    window.document.documentElement.classList.add(theme);
    checkIfWalletConnected();
  }, [theme]);

  useEffect(() => {
    if (contractAddress) {
      loadContractAndStorefront();
    }
  }, [contractAddress, userAddress]);

  const loadContractAndStorefront = async () => {
    if (!contractAddress) return;
    try {
      setLoadingCards(true);
      const provider = new ethers.providers.JsonRpcProvider(PUBLIC_RPC);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);

      // 1. Считываем параметры контракта
      const [name, totalSupplyBN, maxSupplyBN, priceBN] = await Promise.all([
        contract.name().catch(() => "NFT Collection"),
        contract.totalSupply().catch(() => BigNumber.from(0)),
        contract.maxSupply().catch(() => BigNumber.from(117)),
        contract.mintPrice().catch(() => utils.parseEther("0.25"))
      ]);

      const totalMinted = totalSupplyBN.toNumber();
      const maxSupply = maxSupplyBN.toNumber();

      setContractName(name);
      setNumberClaimed(totalMinted.toString());
      setNumberTotal(maxSupply.toString());
      setMintPrice(priceBN);

      // 2. Инициализируем витрину
      const initialCards: NFTCard[] = Array.from({ length: maxSupply }, (_, id) => ({
        id,
        name: `NFT #${id}`,
        price: priceBN,
        image: "",
        isSold: id < totalMinted
      }));

      setNftStorefront(initialCards);
      setLoadingCards(false);

      // 3. Загрузка JSON пачками по 5 штук (для предотвращения блокировок CDN)
      const BATCH_SIZE = 5;
      const DELAY_MS = 200;

      for (let i = 0; i < maxSupply; i += BATCH_SIZE) {
        const batchIds = Array.from(
          { length: Math.min(BATCH_SIZE, maxSupply - i) },
          (_, index) => i + index
        );

        const batchResults = await Promise.all(
          batchIds.map(async (id) => {
            let imageUrl = "";
            let nftName = `NFT #${id}`;

            try {
              // Получаем URI от контракта
              let rawTokenURI = await contract.tokenURI(id).catch(() => "");
              
              // Если контракт ничего не вернул, формируем ссылку на Pinata
              if (!rawTokenURI) {
                rawTokenURI = `ipfs://bafybeigyzcgmodgobxjmogzziavkouynfvdk7u5wcqcxwt43bq6r25wvmm/${id}.json`;
              }

              const httpURI = resolveIpfsUrl(rawTokenURI);

              if (httpURI) {
                const res = await fetch(httpURI);
                if (res.ok) {
                  const metadata = await res.json();
                  // Преобразуем IPFS ссылку на изображение внутри metadata
                  const rawImage = metadata.image || metadata.image_url || "";
                  imageUrl = resolveIpfsUrl(rawImage);

                  if (metadata.name) nftName = metadata.name;
                }
              }
            } catch (err) {
              console.warn(`Error loading metadata #${id}:`, err);
            }

            return { id, imageUrl, nftName };
          })
        );

        // Обновляем витрину
        setNftStorefront((prevCards) =>
          prevCards.map((card) => {
            const found = batchResults.find((res) => res.id === card.id);
            return found && found.imageUrl
              ? { ...card, image: found.imageUrl, name: found.nftName }
              : card;
          })
        );

        if (i + BATCH_SIZE < maxSupply) {
          await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
        }
      }
    } catch (error) {
      console.error("Error in reading the contract:", error);
      setLoadingCards(false);
    }
  };

  const checkIfWalletConnected = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.listAccounts();
      if (accounts.length > 0) {
        setUserAddress(accounts[0]);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      toast({ title: "Error", description: "MetaMask not installed.", variant: "destructive" });
      return;
    }
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setUserAddress(accounts[0]);
      toast({ title: "Successfully", description: "The wallet is connected!" });
    } catch (err) {
      console.error("Connection error:", err);
    }
  };

  const buyNFTCard = async (id: number, price: BigNumber) => {
    if (!userAddress || !window.ethereum) {
      await connectWallet();
      return;
    }
    try {
      setActionId(id);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.mint(1, { value: price });

      toast({
        title: "Transaction sent",
        description: `Mint NFT #${id}. Wait for confirmation online...`,
      });

      await tx.wait();
      toast({ title: "Successful purchase! 🎉", description: `NFT #${id} successfully mined!` });

      loadContractAndStorefront();
    } catch (error: any) {
      console.error("Error when purchasing:", error);
      const reason = error?.reason || "The transaction was rejected by the wallet.";
      toast({ title: "Purchase error", description: reason, variant: "destructive" });
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-background text-foreground">
      <div className="w-full max-w-6xl flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">{contractName || "NFT Collection"}</h1>
          <p className="text-xs text-muted-foreground">Chain: Conflux eSpace Testnet</p>
        </div>
        <button
          onClick={userAddress ? undefined : connectWallet}
          className="px-5 py-2.5 border rounded-xl font-semibold bg-primary text-primary-foreground shadow-sm text-sm hover:opacity-90 transition-all"
          style={{ backgroundColor: primaryColor || "#3B82F6" }}
        >
          {userAddress
            ? `👛 ${userAddress.substring(0, 6)}...${userAddress.substring(userAddress.length - 4)}`
            : "Connect Wallet"
          }
        </button>
      </div>

      <div className="w-full max-w-6xl">
        {loadingCards ? (
          <div className="text-center py-20 animate-pulse text-sm text-muted-foreground">
            Loading a smart contract...
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-muted/30 px-4 py-3 rounded-xl text-xs">
              <span className="text-muted-foreground">Smart contract statistics:</span>
              <span className="font-semibold">
                Minused: {numberClaimed} из {numberTotal} | Price: {utils.formatEther(mintPrice)} CFX
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {nftStorefront.map((card) => (
                <NFTCardItem
                  key={card.id}
                  id={card.id}
                  name={card.name}
                  price={card.price}
                  image={card.image}
                  isSold={card.isSold}
                  actionId={actionId}
                  primaryColor={primaryColor}
                  onBuy={buyNFTCard}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 w-full max-w-6xl border-t pt-4">
        <PoweredBy />
      </div>
    </div>
  );
}