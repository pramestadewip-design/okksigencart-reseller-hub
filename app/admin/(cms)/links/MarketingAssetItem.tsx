"use client";

import { useState } from "react";
import type { MarketingAsset } from "@prisma/client";
import { MARKETING_TYPE_LABEL } from "./marketingTypes";
import { MarketingAssetForm } from "./MarketingAssetForm";
import { updateMarketingAsset, deleteMarketingAsset } from "./actions";

export function MarketingAssetItem({ asset, isOwner }: { asset: MarketingAsset; isOwner: boolean }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <MarketingAssetForm
        asset={asset}
        onSubmit={updateMarketingAsset.bind(null, asset.id)}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div className="flex items-center justify-between rounded-md border border-line p-3">
      <div>
        <span className="mr-2 rounded-full bg-paper px-2 py-0.5 text-[10px] font-semibold uppercase text-ink-faint">
          {MARKETING_TYPE_LABEL[asset.type]}
        </span>
        <span className="font-semibold text-ink">{asset.title}</span>
      </div>
      <div className="flex flex-shrink-0 gap-3">
        <button type="button" onClick={() => setEditing(true)} className="text-xs font-semibold text-ink-soft hover:text-ink">
          Edit
        </button>
        {isOwner && (
          <form action={deleteMarketingAsset.bind(null, asset.id)}>
            <button type="submit" className="text-xs font-semibold text-maroon">
              Hapus
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
