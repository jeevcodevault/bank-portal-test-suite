
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { downloadDocument } from '@/lib/pdfGenerator';
import { DocumentRecord } from '@/lib/types';

interface DocumentDownloadProps {
  documents: DocumentRecord[];
}

const DocumentDownload: React.FC<DocumentDownloadProps> = ({ documents }) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (doc: DocumentRecord) => {
    try {
      setDownloadingId(doc.id);
      toast.info(`Downloading ${doc.type}...`);
      await downloadDocument(doc.type, doc.fileName);
      toast.success(`${doc.type} downloaded successfully`);
    } catch (error) {
      toast.error(`Failed to download ${doc.type}`);
      console.error("Download error:", error);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="pb-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium">Available Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Type</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map(doc => (
                <TableRow key={doc.id} data-testid={`document-row-${doc.id}`}>
                  <TableCell className="font-medium">{doc.type}</TableCell>
                  <TableCell>{doc.fileName}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(doc)}
                      disabled={downloadingId === doc.id}
                      className="flex items-center gap-2"
                      data-testid={`download-button-${doc.id}`}
                    >
                      <Download className="h-4 w-4" />
                      {downloadingId === doc.id ? "Downloading..." : "Download"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentDownload;
