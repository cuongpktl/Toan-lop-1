
export const focusNextEmptyInput = (currentEl?: HTMLElement) => {
  // Tìm tất cả các input hợp lệ
  const allInputs = Array.from(
    document.querySelectorAll('input[type="number"]:not(:disabled), input[type="text"]:not(:disabled)')
  ) as HTMLInputElement[];

  if (allInputs.length === 0) return;

  // 1. Tìm tất cả ô trống
  const emptyInputs = allInputs.filter(input => !input.value);

  if (emptyInputs.length === 0) {
    // Nếu tất cả đã điền, focus vào nút "Nộp Bài"
    const submitBtn = document.querySelector('button.bg-blue-600') as HTMLButtonElement;
    submitBtn?.focus();
    return;
  }

  // 2. Logic ưu tiên: Tìm ô có data-priority thấp nhất (1 là cao nhất)
  // Sắp xếp các ô trống theo thứ tự: Priority -> Thứ tự xuất hiện trong DOM
  const sortedEmpty = [...emptyInputs].sort((a, b) => {
    const prioA = parseInt(a.getAttribute('data-priority') || '99');
    const prioB = parseInt(b.getAttribute('data-priority') || '99');
    
    if (prioA !== prioB) return prioA - prioB;
    
    // Nếu cùng priority, giữ nguyên thứ tự DOM (so sánh vị trí trong mảng allInputs ban đầu)
    return allInputs.indexOf(a) - allInputs.indexOf(b);
  });

  // 3. Chọn ô tiếp theo:
  // Nếu đang ở một ô, ưu tiên tìm ô "tiếp theo" trong danh sách đã sắp xếp
  let nextToFocus: HTMLInputElement | null = null;
  if (currentEl) {
    const currentIndex = sortedEmpty.indexOf(currentEl as HTMLInputElement);
    // Nếu còn ô phía sau trong danh sách đã sort, nhảy tới đó
    if (currentIndex !== -1 && currentIndex < sortedEmpty.length - 1) {
      nextToFocus = sortedEmpty[currentIndex + 1];
    } else {
      // Nếu là ô cuối của danh sách sort, quay lại ô đầu tiên (nếu còn trống)
      nextToFocus = sortedEmpty[0];
    }
  } else {
    nextToFocus = sortedEmpty[0];
  }

  if (nextToFocus) {
    nextToFocus.focus();
    // Hiệu ứng cuộn mượt đến ô được chọn nếu nó nằm ngoài màn hình
    nextToFocus.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};
