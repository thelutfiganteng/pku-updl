
import { supabase } from "@/integrations/supabase/client";

export async function fetchAssets(
  search = "",
  filterKondisi = "",
  filterNama = "",
  filterKota = ""
) {
  let query = supabase.from("inventory_assets").select("*").order("created_at", { ascending: false });
  if (search) query = query.ilike("asset_number", `%${search}%`);
  if (filterKondisi) query = query.eq("kondisi", filterKondisi);
  if (filterNama) query = query.ilike("nama_asset_1", `%${filterNama}%`);
  if (filterKota) query = query.ilike("kota", `%${filterKota}%`);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function addAsset(record: any) {
  const { error } = await supabase.from("inventory_assets").insert([record]);
  if (error) throw error;
}

export async function updateAsset(id: string, record: any) {
  const { error } = await supabase.from("inventory_assets").update(record).eq("id", id);
  if (error) throw error;
}

export async function deleteAsset(id: string) {
  const { error } = await supabase.from("inventory_assets").delete().eq("id", id);
  if (error) throw error;
}
