sap.ui.define([
  "bs/ui5/projeto/controller/BaseController",
  "sap/ui/core/Fragment",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/model/Sorter",
  "sap/m/MessageToast",
  "sap/m/MessageBox"
], function (BaseController, Fragment, Filter, FilterOperator, Sorter, MessageToast, MessageBox) {
  "use strict";

  return BaseController.extend("bs.ui5.projeto.controller.Main", {

    onInit: function () {
      var oView = this.getView();
      oView.setBusyIndicatorDelay(0);
      oView.setBusy(true);

      var oModel = oView.getModel();
      if (oModel && oModel.attachRequestCompleted) {
        oModel.attachRequestCompleted(function () {
          oView.setBusy(false);
        });
      } else {
        setTimeout(function () { oView.setBusy(false); }, 0);
      }
    },

    onOpenAbout: function () {
      var that = this;
      if (!this._oAbout) {
        Fragment.load({
          id: this.getView().getId(),
          name: "bs.ui5.projeto.view.fragment.AboutDialog",
          controller: this
        }).then(function (oDialog) {
          that._oAbout = oDialog;
          that.getView().addDependent(that._oAbout);
          that._oAbout.open();
        }).catch(function (err) {
          MessageBox.error("Falha a carregar o diálogo 'Sobre'.\n\n" + err);
        });
      } else {
        this._oAbout.open();
      }
    },

    onCloseAbout: function () {
      if (this._oAbout) {
        this._oAbout.close();
      }
    },

    _applyFilterToAllResourceLists: function (sQuery) {
      var oDiscList = this.byId("disciplinesList");
      var aItems = oDiscList.getItems();
      var aFilters = [];
      if (sQuery) {
        aFilters.push(new Filter({
          path: "titulo",
          operator: FilterOperator.Contains,
          value1: sQuery,
          caseSensitive: false
        }));
      }
      aItems.forEach(function (oCustomItem) {
        var oPanel = oCustomItem.getContent()[0];
        var oInnerList = oPanel.getContent()[0];
        var oBinding = oInnerList.getBinding("items");
        if (oBinding) {
          oBinding.filter(aFilters, "Application");
        }
      });
    },

    onSearch: function (oEvent) {
      var sQuery = oEvent.getSource().getValue();
      this._applyFilterToAllResourceLists(sQuery);
    },

    onItemPress: function (oEvent) {
      var sPath = oEvent.getSource().getBindingContext().getPath();
      var m = sPath.match(/\/Disciplinas\/(\d+)\/recursos\/(\d+)/);
      if (m) {
        this.getRouter().navTo("detail", { discIndex: m[1], resIndex: m[2] });
      }
    },

    onSortChange: function (oEvent) {
      var sKey = oEvent.getSource().getSelectedKey();
      if (sKey === "discAsc" || sKey === "discDesc") {
        this._sortDisciplines(sKey === "discDesc");
      } else {
        this._sortAllResourceListsByType(sKey === "typeDesc");
      }
    },

    _sortDisciplines: function (bDescending) {
      var oDiscList = this.byId("disciplinesList");
      var oBinding = oDiscList.getBinding("items");
      if (oBinding) {
        oBinding.sort([ new Sorter("nome", bDescending) ]);
      }
    },

    _sortAllResourceListsByType: function (bDescending) {
      var oDiscList = this.byId("disciplinesList");
      oDiscList.getItems().forEach(function (oCustomItem) {
        var oPanel = oCustomItem.getContent()[0];
        var oInnerList = oPanel.getContent()[0];
        var oBinding = oInnerList.getBinding("items");
        if (oBinding) {
          oBinding.sort([ new Sorter("tipo", bDescending) ]);
        }
      });
    },

  });
});