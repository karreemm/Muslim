export function toArabicNumber(number: number | undefined): string {
    if (number === undefined) {
      return '';
    }
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return number.toString().split('').map(digit => arabicNumbers[parseInt(digit)]).join('');
  }
  
 export const toEnglishNumber = (str: string) => {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return str.replace(/[۰-۹]/g, (d) => persianNumbers.indexOf(d).toString()).replace(/[٠-٩]/g, (d) => arabicNumbers.indexOf(d).toString());
  };

  export function showPopover(id: string): void {
    const popover = document.getElementById(id);
    if (popover) {
      popover.classList.remove('invisible', 'opacity-0');
      popover.classList.add('visible', 'opacity-100');
    }
  }
  
  export function hidePopover(id: string): void {
    const popover = document.getElementById(id);
    if (popover) {
      popover.classList.remove('visible', 'opacity-100');
      popover.classList.add('invisible', 'opacity-0');
    }
  }