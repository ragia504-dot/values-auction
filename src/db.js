import { ref, set, onValue, update, remove, push } from "firebase/database";
import { db } from "./firebase";

// Simpan peserta baru (id auto dari Firebase)
export const simpanPeserta = (data) => {
  const pesertaRef = push(ref(db, "peserta")); // bikin id unik otomatis
  const id = pesertaRef.key;
  set(pesertaRef, { ...data, id }); // simpan dengan id
  return id; // balikin id ke frontend
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
