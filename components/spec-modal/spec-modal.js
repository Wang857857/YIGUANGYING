Component({
  data: {
    visible: false,
    currentDish: null,
    selectedSpec: '',
    selectedUnit: '',
    selectedPrice: 0,
    selectedWeight: 1, // 初始1斤
    drinkCount: 1,
    remark: ''
  },

  methods: {
    show(dish) {
      let defaultSpec = '';
      let defaultUnit = '';
      let defaultPrice = dish.price || 0;
      let defaultWeight = 1; // 打开弹窗默认1斤

      if (dish.specOptions?.length) {
        defaultUnit = dish.specOptions[0].name;
        defaultPrice = dish.specOptions[0].price;
      }
      if (dish.options?.length) {
        defaultSpec = dish.options[0];
      } else if (dish.specType === 'vegSelection') {
        defaultSpec = '空心菜';
      }
      // 杨梅酒默认1斤，总价=60 * 1 =60
      if (dish.isDrinkWeight) {
        defaultWeight = 1;
        defaultPrice = dish.price * defaultWeight;
      }

      this.setData({
        visible: true,
        currentDish: dish,
        selectedSpec: defaultSpec,
        selectedUnit: defaultUnit,
        selectedWeight: defaultWeight,
        selectedPrice: defaultPrice,
        drinkCount: 1,
        remark: ''
      });
    },

    selectSpec(e) {
      this.setData({ selectedSpec: e.currentTarget.dataset.spec });
    },

    selectUnit(e) {
      const price = Number(e.currentTarget.dataset.price);
      const count = this.data.drinkCount;
      this.setData({
        selectedUnit: e.currentTarget.dataset.unit,
        selectedPrice: price * count
      });
    },

    // 加减重量：±0.5斤，最低0.5斤
    changeWeight(e) {
      const { type } = e.currentTarget.dataset;
      let w = this.data.selectedWeight;
      const isYangmei = this.data.currentDish.name.includes('野生杨梅酒');
      if (!isYangmei) {
        wx.showToast({ title: "该菜品重量固定1斤", icon: "none" });
        return;
      }
      if (type === 'add') {
        w += 0.5;
      } else {
        w = Math.max(0.5, w - 0.5);
      }
      // 总价 = 斤数 * 60
      this.setData({
        selectedWeight: w,
        selectedPrice: this.data.currentDish.price * w
      });
    },

    changeDrinkCount(e) {
      const { type } = e.currentTarget.dataset;
      let count = this.data.drinkCount;
      count = type === 'add' ? count + 1 : Math.max(1, count - 1);

      const dish = this.data.currentDish;
      let basePrice = dish.price;
      if (dish.specOptions?.length) {
        const selected = dish.specOptions.find(i => i.name === this.data.selectedUnit);
        if (selected) basePrice = selected.price;
      }

      this.setData({
        drinkCount: count,
        selectedPrice: basePrice * count
      });
    },

    inputRemark(e) {
      this.setData({ remark: e.detail.value });
    },

    confirmSpec() {
      const { currentDish, selectedSpec, selectedUnit, selectedWeight, drinkCount, remark } = this.data;

      if (!selectedSpec && !selectedUnit && !currentDish.isDrinkWeight) {
        wx.showToast({ title: '请选择规格', icon: 'none' });
        return;
      }

      let finalSpec = "";

      // 野生杨梅酒：只输出（斤），删掉数字
      if (currentDish.isDrinkWeight) {
        finalSpec = "（斤）";
      } else if (currentDish.category === 'drink') {
        if (selectedUnit) {
          finalSpec += `(${selectedUnit})`;
        }
      } else {
        if (selectedSpec) {
          finalSpec += selectedSpec;
        }
        if (selectedUnit) {
          finalSpec += `(${selectedUnit})`;
        }
      }

      let finalUnitPrice;
      if (currentDish.isDrinkWeight) {
        finalUnitPrice = currentDish.price; // 一斤60
      } else {
        finalUnitPrice = currentDish.specOptions?.find(i => i.name === selectedUnit)?.price || currentDish.price;
      }
      
      const finalWeight = currentDish.isDrinkWeight ? selectedWeight : (currentDish.category === 'drink' ? drinkCount : 1);
      const finalPrice = finalUnitPrice * finalWeight;

      this.triggerEvent('confirm', {
        dish: currentDish,
        spec: finalSpec, // 固定输出 （斤） 不带数字
        weight: finalWeight,
        remark: remark,
        price: finalPrice,
        unitPrice: finalUnitPrice
      });

      this.setData({ visible: false });
    },

    hideModal() {
      this.setData({ visible: false });
    }
  }
})