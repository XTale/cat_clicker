window.onload = function () {
  var model = {
    cats: [{
      name: 'cat1',
      num: 0,
      url: 'images/1.jpg'
    }, {
      name: 'cat2',
      num: 0,
      url: 'images/2.jpg'
    }, {
      name: 'cat3',
      num: 0,
      url: 'images/3.jpg'
    }, {
      name: 'cat4',
      num: 0,
      url: 'images/4.jpg'
    }, {
      name: 'cat5',
      num: 0,
      url: 'images/5.jpg'
    }],
    // 控制管理员区域是否显示的属性
    showAdminArea: false,
    currentCat: null,
    isSaveInit: false // 如果是点击保存按钮之后重新进行页面渲染，则不再进行事件绑定
  };

  var octopus = {
    init: function () {
      model.currentCat = this.getCats()[0];
      views.list.init();
      views.cats.init();
    },

    getCats: function () {
      return model.cats;
    },

    getShowAdminArea: function () {
      return model.showAdminArea;
    },

    setShowAdminArea: function (val) {
      model.showAdminArea = val;
    },

    getCurrentCat: function () {
      return model.currentCat;
    },

    setCurrentCat: function (index) {
      model.currentCat = model.cats[index];
    },

    getIsSaveInit: function () {
      return model.isSaveInit;
    },

    // 保存猫的信息
    setCats: function (name, num, url) {
      model.cats.push({
        name,
        num,
        url
      });
      model.isSaveInit = true;
      model.currentCat = this.getCats()[this.getCats().length - 1];
      views.list.init();
      views.cats.init();
    }
  };

  var views = {
    list: {
      init: function () {
        this.list = document.querySelector('.list');
        // 每一次初始化之前都进行一次清空操作
        this.list.innerHTML = '';
        this.createElements(octopus.getCats().length);
        // 这里每次初始化都要重新创建一次li元素
        // 所以需要重新进行事件绑定
        this.bindClickToList();
      },
      createElements: function (num) {
        for (var i = 0; i < num; i++) {
          var item = document.createElement('li');
          item.textContent = octopus.getCats()[i].name;
          this.list.appendChild(item);
        }
      },

      bindClickToList: function () {
        var item = document.getElementsByTagName('li');
        var itemArray = Array.prototype.slice.call(item);
        for (var i = 0; i < itemArray.length; i++) {
          itemArray[i].addEventListener('click', (function (index) {
            return function (event) {
              var el = event.target;
              if (el.textContent === octopus.getCats()[index].name) {
                octopus.setCurrentCat(index);
              }
              views.cats.render();
            }
          })(i));
        }
      }
    },

    cats: {
      init: function () {
        this.initDom();
        this.render();
        if (!octopus.getIsSaveInit()) {
          this.bindClickToCat();
          this.bindClickToButtons();
        }
      },

      initDom: function () {
        this.controlArea = document.querySelector('.control-area');
        this.admin = document.querySelector('.admin');
        this.hideButton = document.querySelector('.hide');
        this.saveButton = document.querySelector('.save');
        this.cat = document.querySelector('.cat-name');
        this.num = document.querySelector('.cat-num');
        this.url = document.querySelector('.cat-url');
        this.name = document.querySelector('.name');
        this.clickCount = document.querySelector('.click-count');
        this.showArea = document.querySelector('.show-area');
      },

      render: function () {
        this.removeCat();
        this.toggleAdminArea();
        this.createCat();
      },

      createCat: function () {
        var catInfo = octopus.getCurrentCat();
        this.name.textContent = catInfo.name;
        this.clickCount.textContent = catInfo.num + '次';
        this.showArea.src = catInfo.url;
        this.showArea.alt = catInfo.name;
        this.showArea.title= catInfo.name;
      },

      removeCat: function () {
        this.name.textContent = '';
        this.clickCount.textContent = '';
        this.showArea.src = '';
        this.showArea.alt = '';
        this.showArea.title = '';
      },

      toggleAdminArea: function () {
        if (!octopus.getShowAdminArea()) {
          this.controlArea.style.display = 'none';
        } else {
          this.controlArea.style.display = 'block';
        }
      },

      bindClickToButtons: function () {
        this.admin.addEventListener('click', (function (obj) {
          return function () {
            octopus.setShowAdminArea(true);
            obj.toggleAdminArea();
          };
        })(this));

        this.hideButton.addEventListener('click', (function (obj) {
          return function () {
            obj.cat.value = '';
            obj.num.value = '';
            obj.url.value = '';
            octopus.setShowAdminArea(false);
            obj.toggleAdminArea();
          };
        })(this));

        this.saveButton.addEventListener('click', (function (obj) {
          return function () {
            octopus.setCats(obj.cat.value, obj.num.value, obj.url.value);
            octopus.setShowAdminArea(false);
            obj.toggleAdminArea();
          }
        })(this));
      },

      bindClickToCat: function () {
        this.showArea.addEventListener('click', (function (obj) {
          return function () {
            octopus.getCurrentCat().num++;
            obj.render();
          }
        })(this));
      }
    }
  }

  octopus.init();
}