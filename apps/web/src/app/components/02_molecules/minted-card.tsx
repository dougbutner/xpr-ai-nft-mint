"use client";
import {IAsset} from "atomicassets/build/API/Explorer/Objects";
import classNames from "classnames";
import {useEffect, useState} from "react";
import {ApiClass} from "@proton/api";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {BaseImage} from "../01_atoms/base-image/base-image";

type MintedCardProps = React.HTMLAttributes<HTMLDivElement> & {asset: IAsset};

/**
 * MintedCard component displays an NFT asset with its owner information
 * @component
 * @param {MintedCardProps} props - Component props
 * @param {string} [props.className] - Optional CSS class names to apply to the component
 * @param {IAsset} props.asset - The NFT asset data to display
 * @returns {JSX.Element} A card displaying the NFT image and owner information
 */
export const MintedCard: React.FunctionComponent<MintedCardProps> = ({
  className,
  asset,
}) => {
  const rootClasses = classNames({
    "w-full grid grid-cols-1 gap-2 p-[1px]": true,
    [`${className}`]: className,
  });

  const [owner, setOwner] = useState<{avatar: string; name: string}>();

  useEffect(() => {
    if (!asset || !asset.owner) return;
    const apiEp = process.env.NEXT_PUBLIC_API_MODE! == 'testnet' ? "proton-test" : "proton"
    new ApiClass(apiEp).getProtonAvatar(asset.owner).then(res => {
      if (res) {
        setOwner(res);
      }
    });
  }, [asset]);
  if (!asset.template) return;
  return (
    <div className={`${rootClasses} `}>
      <div className="grid grid-cols-[min-content,1fr] gap-2 items-center w-full">
        {owner && (
          <Avatar>
            <AvatarImage
              src={`data:image/jpeg;base64, ${owner.avatar}`}
            ></AvatarImage>
            <AvatarFallback className="bg-slate-400">
              {owner.name[0]}
            </AvatarFallback>
          </Avatar>
        )}
        {!owner && (
          <Avatar>
            <AvatarFallback className="bg-slate-400"></AvatarFallback>
          </Avatar>
        )}
        <p className="text-gray-500">
          Minted by <span className="font-bold text-black">{asset.owner}</span>
        </p>
      </div>
      <BaseImage
        alt={asset.template.immutable_data.description}
        src={`${process.env.NEXT_PUBLIC_IPFS_ENDPOINT}/${asset.template.immutable_data.image}`}
      ></BaseImage>
    </div>
  );
};
