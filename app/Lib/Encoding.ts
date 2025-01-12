export const safeEncode = (obj: any): string => {
    try {
      const jsonString = JSON.stringify(obj);
      
      // Encode JSON string into a Uint8Array (handles non-Latin characters)
      const encoded = new TextEncoder().encode(jsonString);
  
      // Convert Uint8Array to base64
      const base64 = btoa(String.fromCharCode(...Array.from(encoded)));
  
      // Make base64 URL safe
      return base64
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    } catch (error) {
      console.error('Error encoding data:', error);
      throw error;
    }
  };
  
  export const safeDecode = (str: string): any => {
    try {
      // Restore base64 padding
      let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
      const pad = base64.length % 4;
      if (pad) {
        base64 += '='.repeat(4 - pad);
      }
  
      // Decode base64 to a binary string
      const binaryString = atob(base64);
  
      // Convert binary string to a Uint8Array
      const decoded = new Uint8Array(Array.from(binaryString).map((char) => char.charCodeAt(0)));
  
      // Decode Uint8Array back to a JSON string
      const jsonString = new TextDecoder().decode(decoded);
  
      // Parse JSON string back to an object
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error decoding data:', error);
      throw error;
    }
  };
  