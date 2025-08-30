// db.js
import { ref, push, onValue } from "firebase/database";
import { db } from "./firebase";

// Simpan peserta baru
export const simpanPeserta = (data) => {
  const pesertaRef = ref(db, "peserta");
  return push(pesertaRef, data);
};

// Ambil data peserta realtime
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
