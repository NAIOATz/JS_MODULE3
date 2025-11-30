const TEXT = {
  notDeclared: 'Not Declared',
  conflict: 'You may have declared study plan already. Please check again.',
  genericError: 'There is a problem. Please try again later.',
};

 /**
  * รูปย่อ querySelector เพียงแค่ใช้ $()
  * @param selector ใส่ classname หรือ idname เพื่อหา element
  * @return มอบ element ที่ match ตัวแรก สามารถเข้าถึง node ตัวนั้นได้เลย 
  */
export function $(selector){
    return document.querySelector(selector);
}

/**
 * show dialog 
 * @param {string} message รับ message ที่ต้องการแสดง
 */
export function Dialog(message){
  const dialog = $('.ecors-dialog');
  const text = $('.ecors-dialog-message');
  // const btnok = $('ecors-button-dialog');
  text.textContent = message;
  dialog.setAttribute('open','');
  // btnok.addEventListener('click',() => {
  //   dialog.setAttribute('hidden', '');
  // })
}

/**
 * 
 * @param {string} message รับ message ที่ต้องการแสดง
 * @param {Function} confirm หาก comfirm แล้วต้องการให้ทำอะไรต่อ
 */
export function confirmDialog(message,confirm){
  const dialogConfirm = $('ecors-dialog');
  const text = $('ecors-dialog-message');
  const btnConfirm = $('ecors-button-keep');
  text.textContent = message;
  btnConfirm.onclick = confirm
  dialogConfirm.setAttribute('open','');
}