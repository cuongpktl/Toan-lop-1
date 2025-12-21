
export const focusNextEmptyInput = (currentEl?: HTMLElement) => {
  // 1. Lấy toàn bộ input đang hiển thị trên Tab hiện tại
  const allInputs = Array.from(
    document.querySelectorAll('input[type="number"]:not(:disabled), input[type="text"]:not(:disabled)')
  ) as HTMLInputElement[];

  const visibleInputs = allInputs.filter(input => {
    return input.offsetWidth > 0 || input.offsetHeight > 0 || input.offsetParent !== null;
  });

  if (visibleInputs.length === 0) return;

  // 2. Nếu không có ô hiện tại, focus vào ô trống đầu tiên theo logic P1 -> P2
  if (!currentEl) {
    const firstP1 = visibleInputs.find(i => !i.value && i.getAttribute('data-priority') === '1');
    const firstP2 = visibleInputs.find(i => !i.value && i.getAttribute('data-priority') === '2');
    (firstP1 || firstP2 || visibleInputs.find(i => !i.value))?.focus();
    return;
  }

  // 3. Tìm khối bài tập chứa ô hiện tại
  const currentBlock = currentEl.closest('[data-problem-block="true"]');
  
  if (currentBlock) {
    const blockInputs = Array.from(currentBlock.querySelectorAll('input[type="number"]:not(:disabled), input[type="text"]:not(:disabled)')) as HTMLInputElement[];
    
    // Tìm ô P1 trống trong khối này
    const emptyP1InBlock = blockInputs.find(i => !i.value && i.getAttribute('data-priority') === '1');
    if (emptyP1InBlock) {
      emptyP1InBlock.focus();
      return;
    }

    // Nếu P1 đã hết, tìm ô P2 trống trong khối này
    const emptyP2InBlock = blockInputs.find(i => !i.value && i.getAttribute('data-priority') === '2');
    if (emptyP2InBlock) {
      emptyP2InBlock.focus();
      return;
    }
  }

  // 4. Nếu khối hiện tại đã hoàn thành, tìm sang các khối tiếp theo
  // Tìm tất cả ô trống trên trang
  const allEmpty = visibleInputs.filter(i => !i.value);
  if (allEmpty.length > 0) {
    // Sắp xếp các ô trống còn lại: Ưu tiên theo thứ tự xuất hiện của Khối, trong khối ưu tiên P1 -> P2
    const nextToFocus = allEmpty.sort((a, b) => {
      const blockA = a.closest('[data-problem-block="true"]');
      const blockB = b.closest('[data-problem-block="true"]');
      
      if (blockA !== blockB) {
        return visibleInputs.indexOf(a) - visibleInputs.indexOf(b);
      }
      
      const prioA = parseInt(a.getAttribute('data-priority') || '2');
      const prioB = parseInt(b.getAttribute('data-priority') || '2');
      return prioA - prioB;
    })[0];

    if (nextToFocus) {
      nextToFocus.focus();
      nextToFocus.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  } else {
    // 5. Nếu tất cả đã đầy, focus vào nút "Nộp Bài"
    const submitBtn = document.querySelector('button.bg-blue-600') as HTMLButtonElement;
    submitBtn?.focus();
  }
};
