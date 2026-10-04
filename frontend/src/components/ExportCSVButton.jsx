import { Download } from "lucide-react";

export default function ExportCSVButton({ rows = [], filename = "prediction-history.csv" }) {
  const exportCSV = () => {
    if (!rows.length) return alert("There is no data to export.");
    const headers = Object.keys(rows[0]);
    const esc = v => `"${String(v ?? "").replaceAll('"', '""')}"`;
    const csv = [headers.join(","), ...rows.map(r => headers.map(h => esc(r[h])).join(","))].join("\n");
    const url = URL.createObjectURL(new Blob([csv], {type:"text/csv;charset=utf-8;"}));
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };
  return <button className="btn-secondary" onClick={exportCSV}><Download size={17}/> Export CSV</button>;
}
