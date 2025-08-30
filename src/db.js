import { ref, set, onValue, update, remove } from "firebase/database";
import { db } from "./firebase";

// Simpan peserta baru (id manual)
export const simpanPeserta = (data) => {
  const pesertaRef = ref(db, `peserta/${data.id}`);
  return set(pesertaRef, data);
};

// Ambil semua peserta realtime
export const ambilPeserta = (callback) => {
  const pesertaRef = ref(db, "peserta");
  onValue(pesertaRef, (snapshot) => {
    const data = snapshot.val();
    const list = data
      ? Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }))
      : [];
    callback(list);
  });
};

// Update peserta
export const updatePeserta = (id, data) => {
  const pesertaRef = ref(db, `peserta/${id}`);
  return update(pesertaRef, data);
};

// Hapus peserta
export const hapusPeserta = (id) => {
  const pesertaRef = ref(db, `peserta/${id}`);
  return remove(pesertaRef);
};
