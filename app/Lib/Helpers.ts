export function toArabicNumber(number: number | undefined): string {
    if (number === undefined) {
      return '';
    }
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return number.toString().split('').map(digit => arabicNumbers[parseInt(digit)]).join('');
  }
  
  export function toEnglishNumber(number: string | undefined | number): number {
    if (number === undefined) {
        return 0;
    }

    const arabicToEnglishMap: { [key: string]: string } = {
        '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4', '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
    };

    const englishNumberString = number.toString().split('').map(digit => {
        return arabicToEnglishMap[digit] || digit;
    }).join('');

    return parseInt(englishNumberString, 10);
}

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