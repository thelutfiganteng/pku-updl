
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";

interface InventoryReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assets: Tables<"inventory_assets">[];
}

function convertToCSV(assets: Tables<"inventory_assets">[]) {
  const header = [
    "Asset Number",
    "Nama Asset 1",
    "Nama Asset 2",
    "Alamat",
    "Kota",
    "Keterangan Lokasi",
    "Kondisi"
  ];
  const rows = assets.map(a => [
    a.asset_number,
    a.nama_asset_1,
    a.nama_asset_2 || "",
    a.alamat || "",
    a.kota || "",
    a.keterangan_lokasi || "",
    a.kondisi,
  ]);
  return [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
}

const InventoryReportDialog: React.FC<InventoryReportDialogProps> = ({
  open, onOpenChange, assets
}) => {
  const handleDownloadCSV = () => {
    const csv = convertToCSV(assets);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory_report.csv";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 250);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Inventory Report</DialogTitle>
          <DialogDescription>
            View summary of current inventory. You can also download this as CSV.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end mb-2">
          <Button onClick={handleDownloadCSV}>Download CSV</Button>
        </div>
        <div className="overflow-x-auto max-h-[50vh]">
          <table className="min-w-full border text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">No</th>
                <th className="p-2 border">Asset Number</th>
                <th className="p-2 border">Nama Asset 1</th>
                <th className="p-2 border">Nama Asset 2</th>
                <th className="p-2 border">Alamat</th>
                <th className="p-2 border">Kota</th>
                <th className="p-2 border">Keterangan Lokasi</th>
                <th className="p-2 border">Kondisi</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((a, idx) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{idx + 1}</td>
                  <td className="p-2 border">{a.asset_number}</td>
                  <td className="p-2 border">{a.nama_asset_1}</td>
                  <td className="p-2 border">{a.nama_asset_2}</td>
                  <td className="p-2 border">{a.alamat}</td>
                  <td className="p-2 border">{a.kota}</td>
                  <td className="p-2 border">{a.keterangan_lokasi}</td>
                  <td className="p-2 border">{a.kondisi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryReportDialog;
