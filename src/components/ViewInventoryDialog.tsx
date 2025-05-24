
import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Tables } from "@/integrations/supabase/types";

interface ViewInventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: Tables<"inventory_assets"> | null;
}

const ViewInventoryDialog: React.FC<ViewInventoryDialogProps> = ({
  open,
  onOpenChange,
  asset,
}) => {
  if (!asset) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Asset Details</DialogTitle>
          <DialogDescription>View all details and photos of this asset.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div><span className="font-semibold">Asset Number:</span> {asset.asset_number}</div>
          <div><span className="font-semibold">Nama Asset 1:</span> {asset.nama_asset_1}</div>
          <div><span className="font-semibold">Nama Asset 2:</span> {asset.nama_asset_2 || <span className="text-gray-400">N/A</span>}</div>
          <div><span className="font-semibold">Alamat:</span> {asset.alamat || <span className="text-gray-400">N/A</span>}</div>
          <div><span className="font-semibold">Kota:</span> {asset.kota || <span className="text-gray-400">N/A</span>}</div>
          <div><span className="font-semibold">Keterangan Lokasi:</span> {asset.keterangan_lokasi || <span className="text-gray-400">N/A</span>}</div>
          <div><span className="font-semibold">Kondisi:</span> {asset.kondisi}</div>
          <div className="flex gap-4 mt-3">
            {["foto_tampak_depan", "foto_tampak_kiri", "foto_tampak_kanan"].map((field) => (
              asset[field as keyof typeof asset] ? (
                <div key={field} className="flex flex-col items-center">
                  <span className="text-xs mb-1">{field.replace("foto_tampak_", "Tampak ").replace(/^\w/, c=>c.toUpperCase())}</span>
                  <img
                    src={asset[field as keyof typeof asset] as string}
                    alt={field}
                    className="w-24 h-24 object-cover rounded shadow border"
                  />
                </div>
              ) : (
                <div key={field} className="flex flex-col items-center text-gray-400">
                  <span className="text-xs mb-1">{field.replace("foto_tampak_", "Tampak ").replace(/^\w/, c=>c.toUpperCase())}</span>
                  <div className="w-24 h-24 border rounded flex items-center justify-center bg-gray-50">
                    No Image
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewInventoryDialog;
