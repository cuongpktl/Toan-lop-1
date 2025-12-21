
// Sử dụng WeakMap hoặc Cache đơn giản để tránh query DOM liên tục nếu không cần thiết
let cachedInputs: HTMLInputElement[] | null = null;
let lastUpdate = 0;

export const focusNextEmptyInput = (currentEl?: HTMLElement) => {
  const now = Date.now();
  // Chỉ cập nhật danh sách input sau mỗi 500ms hoặc khi không có cache
  if (!cachedInputs || now - lastUpdate > 500) {
    const allInputs = Array.from(
      document.querySelectorAll('input[type="number"]:not(:disabled), input[type="text"]:not(:disabled)')
    ) as HTMLInputElement[];
    
    cachedInputs = allInputs.filter(input => {
      return input.offsetWidth > 0 || input.offsetHeight > 0 || input.offsetParent !== null;
    });
    lastUpdate = now;
  }

  const visibleInputs = cachedInputs;
  if (!visibleInputs || visibleInputs.length === 0) return;

  // 1. Nếu không có ô hiện tại, tìm ô trống đầu tiên
  if (!currentEl) {
    const next = visibleInputs.find(i => !i.value && i.getAttribute('data-priority') === '1') || 
                 visibleInputs.find(i => !i.value && i.getAttribute('data-priority') === '2') ||
                 visibleInputs.find(i => !i.value);
    next?.focus();
    return;
  }

  // 2. Tìm trong khối hiện tại trước (Tối ưu nhất cho trải nghiệm người dùng)
  const currentBlock = currentEl.closest('[data-problem-block="true"]');
  if (currentBlock) {
    const blockInputs = Array.from(currentBlock.querySelectorAll('input:not(:disabled)')) as HTMLInputElement[];
    const nextInBlock = blockInputs.find(i => !i.value && i.getAttribute('data-priority') === '1') ||
                        blockInputs.find(i => !i.value && i.getAttribute('data-priority') === '2');
    
    if (nextInBlock) {
      nextInBlock.focus();
      return;
    }
  }

  // 3. Nếu khối hiện tại xong, tìm khối tiếp theo
  const allEmpty = visibleInputs.filter(i => !i.value);
  if (allEmpty.length > 0) {
    // Sắp xếp đơn giản để tìm ô tiếp theo gần nhất
    const currentIndex = visibleInputs.indexOf(currentEl as HTMLInputElement);
    const nextToFocus = allEmpty.find(i => visibleInputs.indexOf(i) > currentIndex) || allEmpty[0];

    if (nextToFocus) {
      nextToFocus.focus();
      // Chỉ scroll nếu ô đó nằm ngoài vùng nhìn thấy để tránh giật màn hình
      const rect = nextToFocus.getBoundingClientRect();
      if (rect.top < 0 || rect.bottom > window.innerHeight) {
        nextToFocus.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  } else {
    // Tự động focus nút Nộp Bài nếu tất cả đã đầy
    const submitBtn = document.querySelector('button.bg-blue-600') as HTMLButtonElement;
    submitBtn?.focus();
  }
};
