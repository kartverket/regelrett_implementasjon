import { toaster } from '@kvib/react';
import { axiosFetch } from '../api/Fetch';

const API_URL_BASE = import.meta.env.VITE_BACKEND_URL;

export async function handleExportCSV() {
  try {
    const response = await axiosFetch<Blob>({
      url: `${API_URL_BASE}/dump-csv`,
      method: 'GET',
      responseType: 'blob',
    });

    if (!response.data) {
      throw new Error('No data received for CSV');
    }

    const blob = new Blob([response.data], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'data.csv');

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading CSV:', error);
    const toastId = 'export-csv-error';
    if (!toaster.isVisible(toastId)) {
      toaster.create({
        id: toastId,
        title: 'Å nei!',
        description:
          'Det kan være du ikke har tilgang til denne funksjonaliteten:',
        type: 'error',
        duration: 5000,
      });
    }
  }
}
