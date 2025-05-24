import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { KONDISI_OPTIONS } from "./InventoryTable";

interface InventoryFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  mode: "add" | "edit";
  defaultValues?: any;
}

const fotoBuckets = {
  foto_tampak_depan: "asset-foto-depan",
  foto_tampak_kiri: "asset-foto-kiri",
  foto_tampak_kanan: "asset-foto-kanan"
};

export function InventoryForm({ open, setOpen, mode, defaultValues }: InventoryFormProps) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: defaultValues || {
      asset_number: "",
      nama_asset_1: "",
      nama_asset_2: "",
      alamat: "",
      kota: "",
      keterangan_lokasi: "",
      kondisi: KONDISI_OPTIONS[0],
      foto_tampak_depan: null,
      foto_tampak_kiri: null,
      foto_tampak_kanan: null,
    },
  });
  const [previews, setPreviews] = useState<{ [key: string]: string | null }>({});
  const [newImages, setNewImages] = useState<{ [key: string]: boolean }>({});
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (defaultValues) {
      reset({ ...defaultValues });
      // Set previews for existing images
      setPreviews({
        foto_tampak_depan: typeof defaultValues?.foto_tampak_depan === "string" ? defaultValues.foto_tampak_depan : null,
        foto_tampak_kiri: typeof defaultValues?.foto_tampak_kiri === "string" ? defaultValues.foto_tampak_kiri : null,
        foto_tampak_kanan: typeof defaultValues?.foto_tampak_kanan === "string" ? defaultValues.foto_tampak_kanan : null,
      });
      // Reset new images tracking
      setNewImages({});
    }
  }, [defaultValues, open, reset]);

  async function uploadPhoto(field: string, file: File): Promise<string | null> {
    const bucket = fotoBuckets[field as keyof typeof fotoBuckets];
    if (!bucket) return null;
    const extension = file.name.split('.').pop() || 'jpg';
    const filePath = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${extension}`;
    let { error } = await supabase.storage.from(bucket).upload(filePath, file, { upsert: true });
    if (error) {
      alert(`Upload failed: ${error.message}`);
      return null;
    }
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  }

  const onSubmit = async (form: any) => {
    const photoFields = ["foto_tampak_depan", "foto_tampak_kiri", "foto_tampak_kanan"];
    const uploadedUrls: Record<string, string | null> = {};

    for (const field of photoFields) {
      // Check if a new image was uploaded for this field
      if (newImages[field] && form[field] && form[field][0] instanceof File) {
        const file = form[field][0];
        const url = await uploadPhoto(field, file);
        uploadedUrls[field] = url ?? null;
      } else if (mode === "edit" && defaultValues && typeof defaultValues[field] === "string") {
        // Keep the existing image URL if no new image was uploaded
        uploadedUrls[field] = defaultValues[field];
      } else {
        uploadedUrls[field] = null;
      }
    }

    const { asset_number, nama_asset_1, nama_asset_2, alamat, kota, keterangan_lokasi, kondisi } = form;
    const record = {
      asset_number,
      nama_asset_1,
      nama_asset_2,
      alamat,
      kota,
      keterangan_lokasi,
      kondisi,
      ...uploadedUrls
    };

    try {
      if (mode === "add") {
        await supabase.from("inventory_assets").insert([record]);
      } else if (mode === "edit" && defaultValues) {
        await supabase.from("inventory_assets").update(record).eq("id", defaultValues.id);
      }
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["inventory_assets"] });
    } catch (err: any) {
      alert("Something went wrong: " + err.message);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl p-6 space-y-4 border-4 border-[#FFD600] relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-[#EA384C]"
          onClick={() => setOpen(false)}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-2">{mode === "add" ? "Add New Asset" : "Edit Asset"}</h2>
        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          {/* Form Fields */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block font-semibold text-xs text-[#162447]">Asset Number*</label>
              <input className="border rounded w-full p-2 mb-1" {...register("asset_number", { required: true })} />
              {errors.asset_number && <span className="text-xs text-red-500">Required</span>}
            </div>
            <div className="flex-1">
              <label className="block font-semibold text-xs text-[#162447]">Nama Asset 1*</label>
              <input className="border rounded w-full p-2 mb-1" {...register("nama_asset_1", { required: true })} />
              {errors.nama_asset_1 && <span className="text-xs text-red-500">Required</span>}
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block font-semibold text-xs text-[#162447]">Nama Asset 2</label>
              <input className="border rounded w-full p-2 mb-1" {...register("nama_asset_2")} />
            </div>
            <div className="flex-1">
              <label className="block font-semibold text-xs text-[#162447]">Alamat</label>
              <input className="border rounded w-full p-2 mb-1" {...register("alamat")} />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block font-semibold text-xs text-[#162447]">Kota</label>
              <input className="border rounded w-full p-2 mb-1" {...register("kota")} />
            </div>
            <div className="flex-1">
              <label className="block font-semibold text-xs text-[#162447]">Keterangan Lokasi</label>
              <input className="border rounded w-full p-2 mb-1" {...register("keterangan_lokasi")} />
            </div>
          </div>
          {/* Images */}
          <div className="flex gap-3">
            {["foto_tampak_depan", "foto_tampak_kiri", "foto_tampak_kanan"].map((field) => (
              <div className="flex-1" key={field}>
                <label className="block font-semibold text-xs text-[#162447]">
                  {field === "foto_tampak_depan" && "Foto Tampak Depan"}
                  {field === "foto_tampak_kiri" && "Foto Tampak Kiri"}
                  {field === "foto_tampak_kanan" && "Foto Tampak Kanan"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="block w-full mt-1"
                  onChange={e => {
                    if (!e.target.files?.[0]) return;
                    const url = URL.createObjectURL(e.target.files[0]);
                    setPreviews(p => ({ ...p, [field]: url }));
                    setNewImages(prev => ({ ...prev, [field]: true }));
                    setValue(field, e.target.files, { shouldDirty: true });
                  }}
                />
                {previews[field] &&
                  <div className="mt-1">
                    <img src={previews[field] as string} alt="Preview" className="w-16 h-16 object-cover rounded border" />
                    {mode === "edit" && !newImages[field] && (
                      <p className="text-xs text-gray-500 mt-1">Current image (will be kept if no new image is uploaded)</p>
                    )}
                    {newImages[field] && (
                      <p className="text-xs text-green-600 mt-1">New image selected</p>
                    )}
                  </div>
                }
              </div>
            ))}
          </div>
          <div>
            <label className="block font-semibold text-xs text-[#162447]">Kondisi*</label>
            <select className="border rounded w-full p-2" {...register("kondisi", { required: true })}>
              {KONDISI_OPTIONS.map(opt =>
                <option value={opt} key={opt}>{opt}</option>
              )}
            </select>
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="default"
              type="submit"
              disabled={isSubmitting}
              className="bg-[#1A2238] text-white hover:bg-[#162447]"
            >
              {mode === "add" ? "Add" : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
