import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Search, Filter, Image } from "lucide-react";
import { InventoryForm } from "@/components/InventoryForm";
import { ImagePreview } from "@/components/ImagePreview";
import ViewInventoryDialog from "./ViewInventoryDialog";
import InventoryReportDialog from "./InventoryReportDialog";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/table";

export const KONDISI_OPTIONS = [
  "Terpasang",
  "Tidak digunakan",
  "Rusak"
];

export function InventoryTable() {
  const [editing, setEditing] = useState<{ open: boolean; asset: any | null }>({ open: false, asset: null });
  const [preview, setPreview] = useState<{ open: boolean; url: string }>({ open: false, url: "" });
  const [search, setSearch] = useState("");
  const [filterKondisi, setFilterKondisi] = useState("");
  const [filterNama, setFilterNama] = useState("");
  const [filterKota, setFilterKota] = useState("");
  // View dialog
  const [viewing, setViewing] = useState<{ open: boolean; asset: any | null }>({ open: false, asset: null });
  // Report dialog
  const [reportOpen, setReportOpen] = useState(false);

  const queryClient = useQueryClient();

  // Fetch inventory asset data
  const { data: assets, isLoading, error } = useQuery({
    queryKey: ['inventory_assets', search, filterKondisi, filterNama, filterKota],
    queryFn: async () => {
      let query = supabase.from("inventory_assets").select("*").order("created_at", { ascending: false });
      if (search) query = query.ilike("asset_number", `%${search}%`);
      if (filterKondisi) query = query.eq("kondisi", filterKondisi);
      if (filterNama) query = query.ilike("nama_asset_1", `%${filterNama}%`);
      if (filterKota) query = query.ilike("kota", `%${filterKota}%`);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  // Delete asset handler
  async function handleDelete(id: string) {
    if (!window.confirm("Delete this asset?")) return;
    const { error } = await supabase.from("inventory_assets").delete().eq("id", id);
    if (!error) {
      queryClient.invalidateQueries({ queryKey: ["inventory_assets"] });
    }
  }

  return (
    <>
      {/* Search/Filter Bar */}
      <div className="bg-white rounded-lg shadow flex flex-wrap gap-3 p-4 mb-4 items-end">
        <div>
          <label className="block text-xs text-gray-700 font-semibold mb-1">Search Asset Number</label>
          <div className="relative">
            <input
              className="border rounded px-3 py-2 w-48"
              placeholder="Asset Number"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Search className="absolute right-2 top-2 text-gray-400" size={18} />
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-700 font-semibold mb-1">Nama Asset</label>
          <input
            className="border rounded px-3 py-2 w-40"
            placeholder="Nama Asset 1"
            value={filterNama}
            onChange={e => setFilterNama(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-700 font-semibold mb-1">Kota</label>
          <input
            className="border rounded px-3 py-2 w-32"
            placeholder="Kota"
            value={filterKota}
            onChange={e => setFilterKota(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-700 font-semibold mb-1">Kondisi</label>
          <select className="border rounded px-3 py-2 w-40" value={filterKondisi} onChange={e => setFilterKondisi(e.target.value)}>
            <option value="">All</option>
            {KONDISI_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <Button variant="secondary" className="ml-2" onClick={() => {
          setSearch(""); setFilterNama(""); setFilterKota(""); setFilterKondisi("");
        }}>
          <Filter className="mr-1" /> Reset
        </Button>
        <Button variant="default" className="ml-auto" onClick={() => setReportOpen(true)}>
          Inventory Report
        </Button>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Asset Number</TableHead>
              <TableHead>Nama Asset 1</TableHead>
              <TableHead>Nama Asset 2</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead>Kota</TableHead>
              <TableHead>Keterangan Lokasi</TableHead>
              <TableHead>Tampak Depan</TableHead>
              <TableHead>Tampak Kiri</TableHead>
              <TableHead>Tampak Kanan</TableHead>
              <TableHead>Kondisi</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={12} className="text-center">Loading...</TableCell>
              </TableRow>
            )}
            {assets && assets.length === 0 && (
              <TableRow>
                <TableCell colSpan={12} className="text-center">No assets found.</TableCell>
              </TableRow>
            )}
            {assets && assets.map((asset: any, idx: number) => (
              <TableRow key={asset.id}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{asset.asset_number}</TableCell>
                <TableCell>{asset.nama_asset_1}</TableCell>
                <TableCell>{asset.nama_asset_2}</TableCell>
                <TableCell>{asset.alamat}</TableCell>
                <TableCell>{asset.kota}</TableCell>
                <TableCell>{asset.keterangan_lokasi}</TableCell>
                {/* Image Thumbnails */}
                {["foto_tampak_depan", "foto_tampak_kiri", "foto_tampak_kanan"].map((field) => (
                  <TableCell key={field}>
                    {asset[field] ?
                      <button onClick={() => setPreview({ open: true, url: asset[field] })}>
                        <img
                          src={asset[field]}
                          alt="Preview"
                          className="w-12 h-12 object-cover rounded border hover:shadow-lg transition"
                          style={{ background: "#f3f3f3" }}
                        />
                      </button>
                      :
                      <span className="text-gray-400 flex items-center"><Image className="mr-1" size={16}/>N/A</span>
                    }
                  </TableCell>
                ))}
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      asset.kondisi === "Terpasang"
                        ? "bg-[#FFD600]/60 text-[#1A2238]"
                        : asset.kondisi === "Rusak"
                        ? "bg-[#EA384C]/70 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {asset.kondisi}
                  </span>
                </TableCell>
                {/* Actions */}
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => setViewing({ open: true, asset })}>
                    View
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setEditing({ open: true, asset })}><Edit size={16} /></Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(asset.id)}><Trash2 size={16} color="#ea384c" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Modal */}
      <InventoryForm
        open={editing.open}
        setOpen={open => setEditing({ open, asset: open ? editing.asset : null })}
        mode="edit"
        defaultValues={editing.asset}
      />

      {/* View Modal */}
      <ViewInventoryDialog
        open={viewing.open}
        onOpenChange={open => setViewing({ open, asset: open ? viewing.asset : null })}
        asset={viewing.asset}
      />

      {/* Inventory Report Modal */}
      <InventoryReportDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        assets={assets || []}
      />

      {/* Image Preview */}
      <ImagePreview open={preview.open} url={preview.url} onClose={() => setPreview({ open: false, url: "" })} />
    </>
  );
}
