Page({
  data: {
    cartList: [],
    totalAmount: 0,
    orderRemark: '',
    showSuccessModal: false
  },
  onLoad() {
    const cartList = wx.getStorageSync('tempCartData') || [];
    let total = 0;
    const fixCart = cartList.map(item => {
      const rowSubtotal = Number(item.originalPrice) * Number(item.quantity);
      if (!item.isWeightDish) {
        total += rowSubtotal;
      }
      const displayPrice = item.isWeightDish ? 0 : item.originalPrice;
      const weightTip = item.isJinWeight ? "（实际价格以称重为准，结账时请记得核算！）" : "";
      // 称重菜品价格置空，普通菜品正常显示¥金额
      const showPriceText = item.isJinWeight ? "" : `¥${rowSubtotal}`;
      return {
        uniqueId: `${item.id}_${item.spec}`,
        foodName: item.name,
        selectedSpec: { name: item.spec },
        unitPrice: item.originalPrice,
        displayPrice: displayPrice,
        num: item.quantity,
        weight: item.weight,
        isWeightDish: item.isWeightDish,
        isJinWeight: item.isJinWeight,
        remark: item.remark || '',
        weightTip,
        showPriceText
      }
    });

    this.setData({
      cartList: fixCart,
      totalAmount: total.toFixed(2)
    });
    wx.removeStorageSync('tempCartData');
  },
  goBackMenu() {
    wx.switchTab({ url: '/pages/menu/menu' });
  },
  inputRemark(e) {
    this.setData({ orderRemark: e.detail.value });
  },
  submitOrder() {
    wx.removeStorageSync('cart');
    this.setData({ showSuccessModal: true });
  },
  closeModal() {
    this.setData({ showSuccessModal: false });
    wx.switchTab({ url: '/pages/menu/menu' });
  }
})