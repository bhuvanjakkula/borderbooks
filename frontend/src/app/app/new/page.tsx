"use client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { FileText, CheckCircle2, FileSearch } from "lucide-react";

type ExtractionStatus = 'idle' | 'extracting' | 'validating' | 'done';

type ExtractedData = {
  supplier: { value: string, confidence: number };
  poNumber: { value: string, confidence: number };
  invoiceNumber: { value: string, confidence: number };
  amount: { value: string, confidence: number };
  tax: { value: string, confidence: number };
  date: { value: string, confidence: number };
};

const MOCK_EXTRACTION: ExtractedData = {
  supplier: { value: 'Acme Corp', confidence: 99 },
  poNumber: { value: 'PO-4421', confidence: 85 },
  invoiceNumber: { value: 'AC-2026-99', confidence: 92 },
  amount: { value: '145250', confidence: 99 },
  tax: { value: '225', confidence: 95 },
  date: { value: '2026-09-15', confidence: 98 },
};

export default function DocumentIntelligencePage() {
  const router = useRouter();
  const [status, setStatus] = useState<ExtractionStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const [extracted, setExtracted] = useState<ExtractedData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateExtraction = () => {
    setStatus('extracting');
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setStatus('validating');
          setExtracted(MOCK_EXTRACTION);
          return 100;
        }
        return p + 20;
      });
    }, 500);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setFileName(file.name);
      simulateExtraction();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      simulateExtraction();
    }
  };

  if (status === 'validating' && extracted) {
    return (
      <main className="page">
        <div className="page-head">
          <div>
            <p className="eyebrow">01 / VALIDATION</p>
            <h1>Review Extracted Data</h1>
            <p className="subtle">Please verify the AI-extracted fields from <strong>{fileName}</strong> before ingestion.</p>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '400px', background: 'rgba(0,0,0,0.02)', borderStyle: 'dashed' }}>
            <FileSearch size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
            <p className="subtle">PDF Preview Viewer (Simulated)</p>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Extracted Fields</h3>
            <form onSubmit={(e) => { e.preventDefault(); setStatus('done'); }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {Object.entries(extracted).map(([key, data]) => (
                  <label key={key} style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
                    <span style={{ textTransform: 'capitalize', fontSize: '0.85rem', fontWeight: 600, color: '#666', marginBottom: '0.25rem' }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                    <input type="text" defaultValue={data.value} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                    <span style={{ position: 'absolute', right: '10px', top: '26px', fontSize: '0.7rem', fontWeight: 600, padding: '2px 6px', borderRadius: '10px', background: data.confidence >= 95 ? '#dcfce7' : '#fef9c3', color: data.confidence >= 95 ? '#166534' : '#854d0e' }}>
                      {data.confidence}%
                    </span>
                  </label>
                ))}
              </div>
              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                <button type="submit" className="button" style={{ flex: 1 }}>Confirm & Ingest</button>
                <button type="button" className="button secondary" onClick={() => setStatus('idle')} style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </main>
    );
  }

  if (status === 'done') {
    return (
      <main className="page narrow">
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <CheckCircle2 size={64} style={{ color: '#10b981', margin: '0 auto 1rem auto' }} />
          <h2>Invoice Successfully Ingested</h2>
          <p className="subtle" style={{ margin: '1rem 0 2rem 0' }}>The semantic matching engine will now process this document.</p>
          <button className="button" onClick={() => router.push('/app/dashboard')}>Go to Dashboard</button>
        </div>
      </main>
    );
  }

  return (
    <main className="page narrow">
      <div className="page-head">
        <div>
          <p className="eyebrow">01 / IMPORT HUB</p>
          <h1>Document Intelligence Center</h1>
          <p className="subtle">Upload PDF invoices or receipts. Our OCR engine extracts and validates the data automatically.</p>
        </div>
      </div>
      
      <div 
        className="card"
        style={{ padding: '4rem 2rem', textAlign: 'center', cursor: 'pointer', borderStyle: 'dashed', borderWidth: '2px', borderColor: status === 'idle' ? '#ccc' : '#10b981', transition: 'all 0.2s', marginTop: '2rem' }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept="application/pdf"
          onChange={handleFileSelect}
        />
        
        {status === 'idle' ? (
          <>
            <FileText size={48} style={{ margin: '0 auto 1rem auto', color: '#10b981' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 600 }}>Drag & Drop PDF Invoice</h3>
            <p className="subtle">or click to browse local files</p>
          </>
        ) : (
          <div style={{ width: '100%', maxWidth: '300px', margin: '0 auto' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>
              {progress < 40 ? 'Extracting text...' : progress < 80 ? 'Identifying PO/Supplier...' : 'Parsing Line Items...'}
            </h3>
            <div style={{ width: '100%', height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: '#10b981', transition: 'width 0.3s ease' }}></div>
            </div>
            <p className="subtle" style={{ marginTop: '1rem' }}>{fileName}</p>
          </div>
        )}
      </div>
    </main>
  );
}
