export async function handleFile(file: File): Promise<any> {
  const text = await file.text();
  const rows = text.split('\n').map(row => row.split(','));
  const headers = rows[0];
  return rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, i) => obj[header.trim()] = row[i]);
    return obj;
  });
}