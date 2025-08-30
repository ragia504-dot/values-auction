import React, { useState } from "react";

function App() {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedValue, setSelectedValue] = useState("Keluarga");
  const [point, setPoint] = useState(0);

  const values = ["Keluarga", "Kesehatan", "Uang", "Kebebasan", "Karier", "Petualangan", "Kreativitas"];

  // Tambah pemain baru
  const addPlayer = () => {
    if (!name || !age) return;
    const newPlayer = {
      id: Date.now(),
      name,
      age,
      coins: 100,
      allocations: values.reduce((acc, v) => ({ ...acc, [v]: 0 }), {}),
    };
    setPlayers([...players, newPlayer]);
    setName("");
    setAge("");
  };

  // Alokasi poin
  const allocatePoints = () => {
    if (!selectedPlayer || point <= 0) return;
    setPlayers(players.map(p => {
      if (p.id === selectedPlayer) {
        if (p.coins >= point) {
          return {
            ...p,
            coins: p.coins - point,
            allocations: {
              ...p.allocations,
              [selectedValue]: p.allocations[selectedValue] + point
            }
          };
        }
      }
      return p;
    }));
    setPoint(0);
  };

  return (
    <div className="p-6">
      <h1>🎯 Life & Career Game</h1>

      {/* Tambah Pemain */}
      <div>
        <h2>Tambah Pemain</h2>
        <input 
          placeholder="Nama" 
          value={name} 
          onChange={e => setName(e.target.value)} 
        />
        <input 
          placeholder="Umur" 
          value={age} 
          onChange={e => setAge(e.target.value)} 
        />
        <button onClick={addPlayer}>+ Tambah Pemain</button>
        <p>Setiap peserta otomatis dapat 100 poin.</p>
      </div>

      {/* Alokasikan poin */}
      <div style={{ marginTop: 20 }}>
        <h2>Alokasikan Poin</h2>
        <select 
          value={selectedPlayer || ""} 
          onChange={e => setSelectedPlayer(Number(e.target.value))}
        >
          <option value="">Pilih Peserta</option>
          {players.map(p => (
            <option key={p.id} value={p.id}>
              {p.name} (Sisa: {p.coins})
            </option>
          ))}
        </select>

        <select 
          value={selectedValue} 
          onChange={e => setSelectedValue(e.target.value)}
        >
          {values.map(v => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>

        <input 
          type="number" 
          placeholder="Poin" 
          value={point} 
          onChange={e => setPoint(Number(e.target.value))}
        />
        <button onClick={allocatePoints}>Alokasikan</button>
      </div>

      {/* Dashboard */}
      <div style={{ marginTop: 20 }}>
        <h2>Dashboard Alokasi</h2>
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Umur</th>
              <th>Sisa Poin</th>
              {values.map(v => (
                <th key={v}>{v}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {players.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.age}</td>
                <td>{p.coins}</td>
                {values.map(v => (
                  <td key={v}>{p.allocations[v]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
