"use client";
import { IAsset } from "atomicassets/build/API/Explorer/Objects";
import classNames from "classnames";
import { MintedCard } from "../02_molecules/minted-card";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMint } from "../05_providers/mint-provider";
import { GenerationLoader } from "../02_molecules/generation-loader/generation-loader";
import { fetchAssets } from "@/services/atomicassets";

type MintedListProps = React.HTMLAttributes<HTMLDivElement> & {
  assets: IAsset[];
};

export const MintedList: React.FunctionComponent<MintedListProps> = ({
  assets,
  className,
}) => {
  const rootClasses = classNames({
    [`${className}`]: className,
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const { setMinted, minted } = useMint();
  const hasMore = useRef<boolean>(true);
  const isLoading = useRef<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const currentPage = useRef<number>(1);

  const loadMore = useCallback(async () => {
    if (isLoading.current || !hasMore.current) return;

    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const clientHeight = window.innerHeight;

    if (scrollTop + clientHeight >= scrollHeight - 100) {
      setLoading(true);
      isLoading.current = true;

      const nextPage = currentPage.current + 1;
      const loadedAssets = await fetchAssets(nextPage);

      if (loadedAssets.length > 0) {
        const mutated = [...(minted || []), ...loadedAssets]
        setMinted(mutated);
        currentPage.current = nextPage;
      } else {
        hasMore.current = false;
      }

      setLoading(false);
      isLoading.current = false;
    }
  }, [setMinted,minted]);

  useEffect(() => {
    setMinted(assets);
  }, [assets, setMinted]);

  useEffect(() => {
    const handleScroll = () => {
      loadMore();
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loadMore]);

  return (
    <div ref={scrollRef} className={`${rootClasses}`}>
      {!minted && (
        <div className="flex justify-center items-center pt-20">
          <GenerationLoader />
        </div>
      )}
      {minted && (
        <ul className="grid max-w-[640px] container gap-4 p-2">
          {minted.map((asset, index) => (
            <li key={index}>
              <MintedCard asset={asset} />
            </li>
          ))}
        </ul>
      )}
      {loading && (
        <div className="flex container justify-center items-center max-w-[640px]">
          <GenerationLoader />
        </div>
      )}
    </div>
  );
};
