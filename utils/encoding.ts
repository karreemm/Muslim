  export const safeEncode = (obj: any): string => {
    try {
      const jsonString = JSON.stringify(obj);
      
      const encoded = new TextEncoder().encode(jsonString);
  
      const base64 = btoa(String.fromCharCode(...Array.from(encoded)));
  
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
      let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
      const pad = base64.length % 4;
      if (pad) {
        base64 += '='.repeat(4 - pad);
      }
  
      const binaryString = atob(base64);
  
      const decoded = new Uint8Array(Array.from(binaryString).map((char) => char.charCodeAt(0)));
  
      const jsonString = new TextDecoder().decode(decoded);
  
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error decoding data:', error);
      throw error;
    }
  };
  