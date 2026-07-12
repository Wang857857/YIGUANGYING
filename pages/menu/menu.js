const app = getApp()

Page({
  data:{
    tableId:'',
    currentCategory: 'special',
    categories: [
      { id: 'special', name: '民宿特色菜', },
      { id: 'stirfry', name: '家常小炒', },
      { id: 'vegetable', name: '农家时令蔬菜', },
      { id: 'cold', name: '风味凉菜', },
      { id: 'soup', name: '汤羹系列', },
      { id: 'drink', name: '酒水饮料', }
    ],
    dishes: [],
    currentDishes: [],
    cart: {},
    totalQuantity: 0,
    totalPrice: 0,
    showSearch: false,
    searchKeyword: '',
    searchResult: [],
    highlightDishId: null,
    toView: ''
  },

  onLoad: function (options) {
    if (options.tableId) {
      wx.setStorageSync('tableId', options.tableId);
    }
    const tableId = wx.getStorageSync('tableId') || '';
    const dishes = this.getMenuData();
    this.setData({ tableId, dishes });
    this.filterDishesByCategory(this.data.currentCategory);
    this.loadCart();
  },

  getMenuData: function() {
    return[
      { id: 1, category: 'special', name: '富硒冷水鱼火锅', price: 68, hasSpec: true, specType: 'flavor', options: ['泡椒味', '酸菜味'],specOptions: [{ name: '斤', price: 68 }, { name: '份', price: 128 }] },
      { id: 2, category: 'special', name: '大脚菌土鸡汤', price: 68, hasSpec: true, specOptions: [{ name: '斤', price: 68 }, { name: '份', price: 128 }] },
      { id: 3, category: 'special', name: '黄荆老鸭汤', price: 68, hasSpec: true, specOptions: [{ name: '斤', price: 68 }, { name: '份', price: 128 }] },
      { id: 4, category: 'special', name: '腊猪油酸菜鱼', price:68 },
      { id: 5, category: 'special', name: '水煮麻辣鱼', price: 68 },
      { id: 6, category: 'special', name: '太安鱼', price: 68 },
      { id: 7, category: 'special', name: '四面山腊肉', price: 68 },
      { id: 8, category: 'special', name: '四面山腊猪蹄汤', price: 88 },

      { id: 9, category: 'stirfry', name: '粉巴回锅肉', price: 48, tags:['炒菜', '小炒'] },
      { id: 10, category: 'stirfry', name: '鱼香肉丝', price: 48, tags:['炒菜', '小炒'] },
      { id: 11, category: 'stirfry', name: '水煮肉片', price: 48, tags:['炒菜', '小炒'] },
      { id: 12, category: 'stirfry', name: '水煮牛肉', price: 68, tags:['炒菜', '小炒'] },
      { id: 13, category: 'stirfry', name: '泡椒牛肉丝', price: 68, tags:['炒菜', '小炒'] },
      { id: 14, category: 'stirfry', name: '牙签牛肉', price: 68, tags:['炒菜', '小炒'] },
      { id: 15, category: 'stirfry', name: '水煮兔', price: 68, tags:['炒菜', '小炒'] },
      { id: 16, category: 'stirfry', name: '双椒兔', price: 88, tags:['炒菜', '小炒'] },
      { id: 17, category: 'stirfry', name: '烧鸡公', price: 88, tags:['炒菜', '小炒'] },
      { id: 18, category: 'stirfry', name: '尖椒鸡', price: 88, tags:['炒菜', '小炒'] },
      { id: 19, category: 'stirfry', name: '辣子鸡', price: 88, tags:['炒菜', '小炒'] },
      { id: 20, category: 'stirfry', name: '姜爆鸭', price: 88, tags:['炒菜', '小炒'] },
      { id: 21, category: 'stirfry', name: '红烧鸭', price: 88, tags:['炒菜', '小炒'] },
      { id: 22, category: 'stirfry', name: '丝瓜烧青蛙', price: 88, tags:['炒菜', '小炒'] },

      { id: 23, category: 'vegetable', name: '时令蔬菜', price: 28, hasSpec: true, specType: 'flavor', options:['空心菜（夏季特供）','油麦菜','丝瓜（夏季特供）'] },
      { id: 24, category: 'vegetable', name: '西红柿炒鸡蛋', price: 28 },
      { id: 25, category: 'vegetable', name: '豇豆茄子', price: 28 },

      { id: 26, category: 'cold', name: '凉拌黄瓜', price: 18, tags:['凉菜'] },
      { id: 27, category: 'cold', name: '凉拌茄子', price: 18, tags:['凉菜'] },
      { id: 28, category: 'cold', name: '花生米', price: 18, tags:['凉菜'] },
      { id: 29, category: 'cold', name: '烧椒皮蛋', price: 28, tags:['凉菜'] },
      { id: 30, category: 'cold', name: '老板菜拌藠头', price: 28, tags:['凉菜'] },
      { id: 31, category: 'cold', name: '小河鱼', price: 48, hasSpec: true, specType: 'flavor', options: ['椒盐味', '尖椒味'], tags:['凉菜'] },
      { id: 32, category: 'cold', name: '香酥翠叶', price: 48, tags:['凉菜'] },

      { id: 33, category: 'soup', name: '小菜汤', price: 20 },
      { id: 34, category: 'soup', name: '嫩南瓜玉米四季豆汤', price: 28 },
      { id: 35, category: 'soup', name: '虾羹汤', price: 28 },
      { id: 36, category: 'soup', name: '酸菜粉丝汤', price: 28 },
      { id: 37, category: 'soup', name: '西红柿丸子汤', price: 48 },
      { id: 38, category: 'soup', name: '丝瓜肉片汤', price: 48 },
      { id: 39, category: 'soup', name: '大脚菌肉片汤', price: 88 },

      { id: 40, category: 'drink', name: '乐堡', price: 10, tags:['酒', '啤酒'], hasSpec: true, specOptions: [{ name: '瓶', price: 10 }, { name: '件', price: 120 }] },
      { id: 41, category: 'drink', name: '重庆白啤', price: 12, tags:['酒', '啤酒'], hasSpec: true, specOptions: [{ name: '瓶', price: 12 }, { name: '件', price: 120 }] },
      { id: 42, category: 'drink', name: '野生杨梅酒', price: 60, hasSpec: true, isDrinkWeight: true, tags:['酒', '白酒'] },
      { id: 43, category: 'drink', name: '王老吉', price: 10 },
      { id: 44, category: 'drink', name: '可乐', price: 5 },
      { id: 45, category: 'drink', name: '冰红茶', price: 5 },
      { id: 46, category: 'drink', name: '国宾', price: 10, tags:['酒', '啤酒'], hasSpec: true, specOptions: [{ name: '瓶', price: 10 }, { name: '件', price: 120 }] },
      { id: 47, category: 'drink', name: '大窑', price: 10 },
      { id: 48, category: 'drink', name: '雪碧', price: 10 },
      { id: 49, category: 'drink', name: '北冰洋', price: 10 },
      { id: 50, category: 'drink', name: '矿泉水', price: 3 },
    ]
  },

  showSearchInput() {
    this.setData({ showSearch: true, searchKeyword: '', searchResult: [] });
  },

  hideSearch() { 
    this.setData({ showSearch: false }); 
  },
 
  onSearchInput(e) {
    const keyword = e.detail.value.trim();
    this.setData({ searchKeyword: keyword });
    
    if(keyword) {
      const k = keyword.toLowerCase();
      const r = this.data.dishes.filter(i => {
        const matchName = i.name.toLowerCase().includes(k);
        const matchTag = i.tags && i.tags.some(tag => tag.toLowerCase().includes(k));
        return matchName || matchTag;
      });
      this.setData({ searchResult: r });
    } else {
      this.setData({ searchResult: [] });
    }
  },
  
  doSearch() {
    const k = this.data.searchKeyword.toLowerCase();
    if (!k) { wx.showToast({ title: '请输入关键词', icon: 'none' }); return; }
    const r = this.data.dishes.filter(i => {
      const matchName = i.name.toLowerCase().includes(k);
      const matchTag = i.tags && i.tags.some(tag => tag.toLowerCase().includes(k));
      return matchName || matchTag;
    });
    this.setData({ searchResult: r });
  },

  clearSearch() { 
    this.setData({ searchKeyword: '', searchResult: [] });
   },

  selectSearchItem(e) {
    const d = e.currentTarget.dataset.dish;
    this.hideSearch();
    this.setData({ currentCategory: d.category }, () => {
      this.filterDishesByCategory(d.category);
      setTimeout(() => {
        this.setData({ toView: `dish_${d.id}`, highlightDishId: d.id });
        setTimeout(() => this.setData({ highlightDishId: null }), 2000);
      }, 300);
    });
  },

  filterDishesByCategory(cid) {
    const list = this.data.dishes.filter(i => i.category === cid);
    this.setData({ currentDishes: list });
  },
  switchCategory(e) {
    const cid = e.currentTarget.dataset.id;
    this.setData({ currentCategory: cid });
    this.filterDishesByCategory(cid);
  },

  getItemQuantity(dish) {
    let qty = 0;
    for (let k in this.data.cart) {
      if (this.data.cart[k].id === dish.id) qty += this.data.cart[k].quantity;
    }
    return qty;
  },

  showSpecModal(e) {
    const dish = e.currentTarget.dataset.dish;
    const modal = this.selectComponent("#specModal");
  
    if (modal && modal.show) {
      modal.show(dish);
    } else {
      wx.showToast({
        title: "组件加载失败",
        icon: "none"
      });
    }
  },

  addToCart(e) {
    const dish = e.currentTarget.dataset.dish;
    this.addToCartWithSpec({
      detail: { dish, spec: '默认', weight:1, price: dish.price, unitPrice: dish.price }
    });
  },

  addToCartWithSpec(e) {
    const { dish, spec, weight = 1, price, unitPrice, remark } = e.detail;
    
    let cleanSpec = spec || "";
    cleanSpec = cleanSpec.replace(/默认/g, "").trim();

    // 修复：仅特色菜+规格带斤 才标记不计价，野生杨梅酒永远参与计价
    const isWeightDish = dish.category === 'special'
      && cleanSpec?.includes('斤')
      && dish.name !== '野生杨梅酒';

    const isYangmei = dish.name.includes("野生杨梅酒");
    const key = isYangmei ? `${dish.id}_yangmei` : `${dish.id}_${spec}`;
  
    let cart = { ...this.data.cart };
  
    if (cart[key]) {
      if (isYangmei) {
        cart[key].quantity += weight;
        cart[key].price = cart[key].originalPrice * cart[key].quantity;
      } else {
        cart[key].quantity += 1;
        cart[key].price = cart[key].originalPrice * cart[key].quantity;
      }
    } else {
      cart[key] = {
        ...dish,
        spec: cleanSpec, // 核心修改：存入清洗后无默认的规格
        displaySpec: cleanSpec,
        quantity: weight,
        originalPrice: unitPrice,
        unitPrice: unitPrice,
        price: price || unitPrice * weight,
        remark: remark || "",
        isWeightDish,
        isJinWeight: isWeightDish
      };
    }
    this.saveCart(cart, true);
  },

  decreaseQuantity(e) {
    const dish = e.currentTarget.dataset.dish;
    let cart = { ...this.data.cart };
    let target = null;
    for (let k in cart) { if (cart[k].id === dish.id) { target = k; break; } }
    if (!target) return;
    if (cart[target].quantity > 1) {
      cart[target].quantity -= 1;
      cart[target].price = cart[target].originalPrice * cart[target].quantity;
    } else delete cart[target];
    this.saveCart(cart);
  },

  saveCart(cart, showToast = false) {
    let qty = 0;
    let total = 0;
    const cartArr = Object.values(cart);
    cartArr.forEach(item => {
      // 角标数量逻辑：杨梅酒固定+1，其他正常加quantity
      if (item.name.includes('野生杨梅酒')) {
        qty += 1;
      } else {
        qty += Number(item.quantity);
      }
      // 统一 originalPrice 计算总价
      if (!item.isWeightDish) {
        total += Number(item.originalPrice) * Number(item.quantity);
      }
    })
    wx.setStorageSync('cart', cart);
    const cartModal = this.selectComponent('#cartModal');
    if (cartModal) cartModal.refresh();
    this.setData({
      cart,
      totalQuantity: qty,
      totalPrice: total.toFixed(2)
    });
    if (showToast) wx.showToast({ title: '已加购', icon: 'success', duration: 500 })
  },

  loadCart() {
    const cart = wx.getStorageSync('cart') || {};
    this.saveCart(cart, false);
  },

  goToCart() {
    const modal = this.selectComponent('#cartModal');
    if (modal) modal.show();
  },

  goToCheckout() {
    if (this.data.totalQuantity <= 0) {
      wx.showToast({ title: '购物车为空1', icon: 'none' });
      return;
    }
    const cartArr = Object.values(this.data.cart);
    wx.setStorageSync('tempCartData', cartArr);
    wx.redirectTo({
      url: "/subPackages/checkout/checkout"
    })
  }
});