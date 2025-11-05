/**
 * Converts an array of objects to CSV format
 * @param data Array of objects to convert
 * @param headers Custom headers (optional)
 * @param fieldTransformers Custom transformers for specific fields (optional)
 * @returns string in CSV format
 */
export function convertToCSV<T extends Record<string, any>>(
  data: T[],
  headers?: { key: keyof T | string; label: string }[],
  fieldTransformers?: { [key in keyof T]?: (value: any, row: T) => string }
): string {
  if (!data || data.length === 0) return '';

  // If headers are not provided, use the keys from the first object
  const actualHeaders = headers || Object.keys(data[0]).map(key => ({ 
    key, 
    label: String(key).replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }));

  // Create header row
  const headerRow = actualHeaders.map(header => header.label);

  // Create data rows
  const dataRows = data.map(row => {
    return actualHeaders.map(header => {
      const key = header.key as string;
      let value = (row as any)[key];
      
      // Apply custom transformer if exists
      if (fieldTransformers && fieldTransformers[key as keyof T]) {
        value = fieldTransformers[key as keyof T]!(value, row);
      }
      
      return `"${String(value || '').replace(/"/g, '""')}"`;
    });
  });

  // Combine headers and data
  return [headerRow, ...dataRows]
    .map(row => row.join(','))
    .join('\n');
}

/**
 * Downloads CSV using File System Access API (with native dialog)
 * @param csvContent CSV content as string
 * @param filename File name
 */
export async function downloadCSVWithDialog(csvContent: string, filename: string): Promise<void> {
  try {
    // Check if browser supports File System Access API
    if ('showSaveFilePicker' in window) {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      
      // Use API to show save file dialog
      const fileHandle = await (window as any).showSaveFilePicker({
        suggestedName: filename,
        types: [
          {
            description: 'CSV Files',
            accept: { 'text/csv': ['.csv'] },
          },
        ],
      });

      // Write file
      const writable = await fileHandle.createWritable();
      await writable.write(blob);
      await writable.close();
    } else {
      // Fallback for browsers that do not support the API
      downloadCSVDirect(csvContent, filename);
    }
  } catch (error: any) {
    // User canceled the dialog - do nothing
    if (error.name !== 'AbortError') {
      console.error('Error saving file:', error);
      // Fallback to direct download if error
      downloadCSVDirect(csvContent, filename);
    }
  }
}

/**
 * Direct CSV download (fallback)
 * @param csvContent CSV content as string
 * @param filename File name
 */
export function downloadCSVDirect(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Helper function to download any data as CSV
 * @param data Array of data
 * @param filename File name
 * @param headers Custom headers (optional)
 * @param fieldTransformers Field transformers (optional)
 */
export async function exportDataAsCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  headers?: { key: keyof T | string; label: string }[],
  fieldTransformers?: { [key in keyof T]?: (value: any, row: T) => string },
  directDownload: boolean = true
): Promise<void> {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const csvContent = convertToCSV(data, headers, fieldTransformers);
  if (directDownload) {
    downloadCSVDirect(csvContent, filename);
  } else {
    await downloadCSVWithDialog(csvContent, filename);
  }
}