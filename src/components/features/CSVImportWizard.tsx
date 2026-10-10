'use client';

import { useState, useRef } from 'react';
import Papa from 'papaparse';
import { Upload, FileText, CheckCircle2, AlertTriangle, Download } from 'lucide-react';
import { importWaterPointsCSVAction } from '@/actions/waterpoints';

export function CSVImportWizard() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'parsing' | 'preview' | 'importing' | 'done'>('idle');
  const [resultMessage, setResultMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setStatus('parsing');

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setHeaders(results.meta.fields || []);
        setPreview(results.data.slice(0, 5)); // Show first 5 rows for preview
        setStatus('preview');
      },
      error: () => {
        setStatus('idle');
        alert('Failed to parse CSV file.');
      }
    });
  };

  const handleImport = async () => {
    if (!file) return;
    setStatus('importing');

    // Re-parse the whole file for import
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const res = await importWaterPointsCSVAction(results.data);
        setResultMessage(res.message);
        setStatus('done');
      }
    });
  };

  const downloadTemplate = () => {
    const csvContent = "name,type,ownerType,latitude,longitude,wardId\nNapetet Borehole,BOREHOLE,COUNTY,3.1450,35.5920,ward-kanamkemer";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'water_points_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-card border-2 border-border rounded-xl space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">Bulk Import via CSV</h3>
        <button onClick={downloadTemplate} className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
          <Download className="h-4 w-4" /> Download Template
        </button>
      </div>

      {status === 'idle' && (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors bg-muted/20"
        >
          <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="font-semibold text-foreground">Click to upload CSV file</p>
          <p className="text-sm text-muted-foreground mt-1">Required columns: name, type, ownerType, latitude, longitude, wardId</p>
          <input 
            ref={fileInputRef}
            type="file" 
            accept=".csv" 
            className="hidden" 
            onChange={handleFileChange} 
          />
        </div>
      )}

      {status === 'parsing' && (
        <div className="text-center py-8 text-muted-foreground">Parsing file...</div>
      )}

      {status === 'preview' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-success font-semibold">
            <FileText className="h-5 w-5" /> {file?.name} ({preview.length} rows preview)
          </div>
          
          <div className="overflow-x-auto border border-border rounded-lg">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  {headers.map(h => <th key={h} className="px-4 py-2">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {preview.map((row, i) => (
                  <tr key={i} className="hover:bg-muted/20">
                    {headers.map(h => <td key={h} className="px-4 py-2 truncate max-w-[150px]">{String(row[h])}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-3">
            <button onClick={() => { setStatus('idle'); setFile(null); }} className="px-4 py-2 border border-border rounded-md font-medium hover:bg-muted transition-colors">
              Cancel
            </button>
            <button onClick={handleImport} className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors">
              Confirm & Import All
            </button>
          </div>
        </div>
      )}

      {status === 'importing' && (
        <div className="text-center py-8 text-primary font-semibold">Importing data into DynamoDB...</div>
      )}

      {status === 'done' && (
        <div className="flex items-start gap-3 p-4 bg-success/10 border border-success/20 rounded-lg">
          <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
          <div>
            <p className="font-bold text-foreground">Import Complete</p>
            <p className="text-sm text-muted-foreground">{resultMessage}</p>
            <button onClick={() => { setStatus('idle'); setFile(null); }} className="mt-3 text-sm font-semibold text-primary hover:underline">
              Import Another File
            </button>
          </div>
        </div>
      )}
    </div>
  );
}