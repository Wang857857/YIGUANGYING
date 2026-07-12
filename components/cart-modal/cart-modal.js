Component({
  options: {
    styleIsolation: 'isolated'
  },

  data: {
    show: false,
    list: [],
    total: 0,
    totalQuantity: 0
  },

  methods: {
    // 新增：阻止滚动触摸事件穿透底层页面，解决滑动卡顿冲突
    stopPropagation() {
      return false;
    },

    attached() {
      this.refresh();
    },

    show() {
      this.setData({ show: true });
      this.refresh();
    },

    close() {
      this.setData({ show: false });
    },

    refresh() {
      try {
        const cart = wx.getStorageSync('cart') || {};
        let list = [];
        let total = 0;
        let totalQuantity = 0;
    
        for (let key in cart) {
          const item = cart[key];
          const up = Number(item.unitPrice || 0);
          const num = Number(item.quantity || 1);
          let subTotal;
          // 称重菜isJinWeight=true：购物车展示0元
          if (item.isJinWeight === true) {
            subTotal = 0;
          } else {
            subTotal = Math.round(up * num);
          }
    
          list.push({
            key,
            ...item,
            subTotal
          });
    
          // 称重菜品不计入底部合计总价
          if (!item.isJinWeight) {
            total += up * num;
          }
    
          if (item.name.includes('野生杨梅酒')) {
            totalQuantity += 1;
          } else {
            totalQuantity += num;
          }
        }
    
        this.setData({
          list,
          total: total.toFixed(2),
          totalQuantity
        });
      } catch (e) {
        console.error('刷新购物车错误', e);
      }
    },

    increase(e) {
      const key = e.currentTarget.dataset.key;
      const item = this.data.list.find(i => i.key === key);

      if (item && item.isJinWeight) {
        wx.showToast({
          title: "暂不支持添加，请到后厨称重",
          icon: "none"
        });
        return;
      }

      const cart = wx.getStorageSync('cart') || {};
      if (!cart[key]) return;

      const step = item.name.includes("野生杨梅酒") ? 0.5 : 1;
      cart[key].quantity += step;
      cart[key].price = cart[key].originalPrice * cart[key].quantity;

      wx.setStorageSync('cart', cart);
      this.refresh();
      this.notifyParentRefresh();
    },

    decrease(e) {
      const key = e.currentTarget.dataset.key;
      const cart = wx.getStorageSync('cart') || {};
      if (!cart[key]) return;

      const item = cart[key];
      const isYangmei = item.name.includes("野生杨梅酒");
      const step = isYangmei ? 0.5 : 1;

      cart[key].quantity -= step;
      
      if (cart[key].quantity <= 0) {
        delete cart[key];
      } else {
        cart[key].price = cart[key].originalPrice * cart[key].quantity;
      }

      wx.setStorageSync('cart', cart);
      this.refresh();
      this.notifyParentRefresh();
    },

    clearCart() {
      wx.setStorageSync('cart', {});
      this.refresh();
      this.notifyParentRefresh();
    },

    notifyParentRefresh() {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      if (currentPage && currentPage.loadCart) {
        currentPage.loadCart();
      }
    },

    goCheck() {
      this.close();
      const cartArr = Object.values(wx.getStorageSync('cart') || {});
      wx.setStorageSync('tempCartData', cartArr);
      wx.redirectTo({ url: '/subPackages/checkout/checkout' });
    }
  }
})