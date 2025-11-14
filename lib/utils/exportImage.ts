import html2canvas from 'html2canvas';

/**
 * Get the React Flow viewport element for capturing
 * @returns The viewport element
 * @throws Error if viewport or container not found
 */
function getReactFlowViewport(): HTMLElement {
  const element = document.querySelector('.react-flow__viewport') as HTMLElement;

  if (!element) {
    throw new Error('React Flow viewport not found');
  }

  const container = element.closest('.react-flow') as HTMLElement;

  if (!container) {
    throw new Error('React Flow container not found');
  }

  return element;
}

/**
 * Capture the React Flow diagram as a canvas
 * @returns The captured canvas
 */
async function captureReactFlowCanvas(): Promise<HTMLCanvasElement> {
  const element = getReactFlowViewport();
  return await html2canvas(element);
}

/**
 * Export the React Flow diagram as a PNG image
 * @param filename - The filename for the downloaded image
 */
export async function exportDiagramAsImage(
  filename: string = 'process-diagram.png'
): Promise<void> {
  try {
    const canvas = await captureReactFlowCanvas();

    // Convert canvas to blob and download
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('Failed to create image blob');
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();

      // Cleanup
      URL.revokeObjectURL(url);
    }, 'image/png');
  } catch (error) {
    console.error('Failed to export image:', error);
    throw error;
  }
}

/**
 * Copy the diagram as an image to clipboard
 * Useful for quickly pasting into documents or emails
 */
export async function copyDiagramToClipboard(): Promise<void> {
  try {
    const canvas = await captureReactFlowCanvas();

    // Convert canvas to blob
    canvas.toBlob(async (blob) => {
      if (!blob) {
        throw new Error('Failed to create image blob');
      }

      // Use Clipboard API
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
      } else {
        throw new Error('Clipboard API not supported');
      }
    }, 'image/png');
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    throw error;
  }
}
